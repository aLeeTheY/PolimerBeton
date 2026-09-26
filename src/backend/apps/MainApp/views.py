import hashlib
import logging
import re

from django.conf import settings
from django.utils import timezone
from django.db import transaction
from django.utils.html import strip_tags
from django.shortcuts import render, redirect
from django.utils.crypto import get_random_string
from django.template.loader import render_to_string
from django.core.mail import EmailMultiAlternatives

from babel.dates import format_datetime
from mailjet_rest import Client as MailjetClient

from .forms import FeedbackForm
from .models import Client, Request

logger = logging.getLogger(__name__)


def generate_token():
    """Генерация случайного токена для формы."""
    return get_random_string(64)


def normalize_phone(phone_str: str) -> str:
    """
    Приводит номер телефона к единому цифровому стандарту перед хэшированием.
    Пример: '+7 (920) 226-16-66' -> '79202261666', '89202261666' -> '79202261666'
    """
    digits = re.sub(r"\D", "", phone_str)
    if len(digits) == 11 and digits.startswith("8"):
        digits = "7" + digits[1:]
    return digits


def send_notification_email(
    subject: str, html_message: str, plain_message: str
) -> None:
    """Отправка уведомлений администратору через SMTP или Mailjet API."""
    if getattr(settings, "USE_DJANGO_SMTP_SERVER", False):
        from_email = f"PolimerBeton Bot <{settings.SENDER_EMAIL}>"
        email = EmailMultiAlternatives(
            subject, plain_message, from_email, [settings.RECIPIENT_EMAIL]
        )
        email.attach_alternative(html_message, "text/html")
        email.send(fail_silently=False)

    if getattr(settings, "USE_MAILJET_HTTP_SERVER", False):
        mailjet = MailjetClient(
            auth=(settings.MAILJET_APIKEY_PUBLIC, settings.MAILJET_APIKEY_PRIVATE),
            version="v3.1",
        )
        data = {
            "Messages": [
                {
                    "From": {
                        "Email": settings.SENDER_EMAIL,
                        "Name": "Polimerbeton Bot",
                    },
                    "To": [{"Email": settings.RECIPIENT_EMAIL}],
                    "Subject": subject,
                    "TextPart": plain_message,
                    "HTMLPart": html_message,
                }
            ]
        }
        result = mailjet.send.create(data=data)
        if result.status_code not in (200, 201):
            raise RuntimeError(
                f"Mailjet API Error ({result.status_code}): {result.json}"
            )


def my_index(request):
    if request.method == "POST":
        # * 1. Проверка Anti-Bot / Custom CSRF Токена
        token = request.POST.get("form_token")
        session_token = request.session.get("form_token")

        if not token or token != session_token:
            logger.warning(
                f"Несовпадение токена формы. IP: {request.META.get('REMOTE_ADDR')}"
            )
            return redirect("fail")

        form = FeedbackForm(request.POST)
        if form.is_valid():
            client_name = form.cleaned_data["client_name"].strip()
            client_phone = form.cleaned_data["client_phone"].strip()
            privacy_policy_agree = form.cleaned_data["privacy_policy"]

            # * 2. Нормализация номера и генерация хэша
            clean_phone = normalize_phone(client_phone)
            client_phone_hash = hashlib.sha256(clean_phone.encode("utf-8")).hexdigest()

            try:
                # * 3. Атомарная операция с БД (если упадет заявка — клиент не зависнет в полу-состоянии)
                with transaction.atomic():
                    client, created = Client.objects.get_or_create(
                        phone_number_hash=client_phone_hash,
                        defaults={
                            "first_name": client_name,
                            "last_name": "нет фамилии",
                            "middle_name": "нет отчества",
                            "phone_number": client_phone,
                            "privacy_policy_agree": privacy_policy_agree,
                        },
                    )

                    # * 4. Проверка блокировки по времени
                    if client.is_blocked():
                        if timezone.now() >= client.blocked_until:
                            client.unblock_and_reset_available_attempts()
                        else:
                            unblock_time = format_datetime(
                                client.blocked_until,
                                "d MMMM yyyy HH:mm:ss",
                                locale="ru",
                            )
                            logger.info(
                                f"Блокировка: клиент ID {client.client_id} заблокирован до {unblock_time}"
                            )
                            return redirect("fail")

                    # * 5. Обновление данных существующего клиента
                    if not created:
                        client.first_name = client_name
                        client.phone_number = client_phone
                        client.privacy_policy_agree = privacy_policy_agree
                        client.save()

                    client.reduce_available_attempts()

                    # * 6. Создание заявки
                    request_instance = Request.objects.create(client=client)

                # * 7. Генерация и отправка Email
                formatted_datetime = format_datetime(
                    request_instance.request_datetime,
                    "d MMMM yyyy HH:mm:ss",
                    locale="ru",
                )
                subject = (
                    f"Заявка на звонок от {'нового' if created else 'существующего'} клиента. "
                    f"ID клиента: №{client.client_id}"
                )

                html_message = render_to_string(
                    "email/message_template.html",
                    {
                        "client_id": client.client_id,
                        "client_name": client_name,
                        "client_phone": client_phone,
                        "request_number": request_instance.request_number,
                        "request_datetime": formatted_datetime,
                    },
                )
                plain_message = strip_tags(html_message)

                send_notification_email(subject, html_message, plain_message)

            except Exception as e:
                logger.exception(f"Ошибка при обработке формы или отправке письма: {e}")
                return redirect("fail")

            # * 8. Успех: сбрасываем токен и отправляем на страницу успеха
            request.session.pop("form_token", None)
            return redirect("success")

        # * Если форма невалидна — генерируем новый токен
        form_token = generate_token()
        request.session["form_token"] = form_token
    else:
        # * GET-запрос: генерируем токен только если его еще нет (защита от сброса при открытии 2-й вкладки)
        form_token = request.session.get("form_token")
        if not form_token:
            form_token = generate_token()
            request.session["form_token"] = form_token

        form = FeedbackForm()

    context = {
        "form": form,
        "form_token": form_token,
    }
    return render(request, "MainApp/index.html", context)


def my_privacy(request):
    return render(request, "MainApp/privacy.html")


def my_success(request):
    return render(request, "MainApp/success.html")


def my_fail(request):
    return render(request, "MainApp/fail.html")


def my_404(request, exception=None):
    return render(request, "MainApp/404.html", status=404)


def my_500(request):
    context = {}
    try:
        from .models import SiteConfig

        context["site_config"] = SiteConfig.get_solo()
    except Exception:
        # * Если база упала, фолбэчимся на дефолтный домен
        context["site_config"] = {"domain": "polimerbeton-vrn.ru"}

    return render(request, "MainApp/500.html", status=500)


# ! --- DEBUG | FOR MANUAL TEST | PAGE 500
# ! --------------------------------------
# def trigger_error(request):
#     raise Exception("Тестовое падение сервера для проверки 500!")
