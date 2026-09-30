import hashlib
import logging

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
from .models import Client, Request, SiteConfig, normalize_phone

logger = logging.getLogger(__name__)


def generate_token():
    """Генерация случайного токена для формы."""
    return get_random_string(64)


def send_notification_email(
    subject: str, html_message: str, plain_message: str
) -> None:
    """Отправка уведомлений администратору через SMTP или Mailjet API."""
    use_smtp = getattr(settings, "USE_DJANGO_SMTP_SERVER", False)
    use_mailjet = getattr(settings, "USE_MAILJET_HTTP_SERVER", False)

    if not use_smtp and not use_mailjet:
        raise RuntimeError(
            'Ни один почтовый сервис не включен! Проверьте USE_DJANGO_SMTP_SERVER и USE_MAILJET_HTTP_SERVER в настройках ".env".'
        )

    success_count = 0
    errors = []

    if use_smtp:
        try:
            from_email = f"PolimerBeton Bot <{settings.SENDER_EMAIL}>"
            email = EmailMultiAlternatives(
                subject, plain_message, from_email, [settings.RECIPIENT_EMAIL]
            )
            email.attach_alternative(html_message, "text/html")

            sent_count = email.send(fail_silently=False)

            if sent_count > 0:
                success_count += 1
            else:
                err_msg = "SMTP сервер вернул 0 доставленных сообщений."
                logger.error(err_msg)
                errors.append(err_msg)

        except Exception as e:
            err_msg = f"Сбой отправки через SMTP: {e}"
            logger.exception(err_msg)
            errors.append(err_msg)

    if use_mailjet:
        try:
            mailjet = MailjetClient(
                auth=(settings.MAILJET_APIKEY_PUBLIC, settings.MAILJET_APIKEY_PRIVATE),
                version="v3.1",
                timeout=30,
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
                raise Exception(
                    f"Mailjet API Error {result.status_code}: {result.text}"
                )

            success_count += 1

        except Exception as e:
            err_msg = f"Сбой отправки через Mailjet: {e}"
            logger.exception(err_msg)
            errors.append(err_msg)

    if success_count == 0:
        raise RuntimeError(
            f"Не удалось доставить письмо ни через один сервис. Лог ошибок: {'; '.join(errors)}"
        )


def my_index(request):
    if request.method == "POST":
        # * 1. Проверка Anti-Bot Токена
        token = request.POST.get("form_token")
        session_token = request.session.get("form_token")

        if not token or token != session_token:
            logger.warning(
                f"Несовпадение токена формы. IP: {request.META.get('REMOTE_ADDR')}"
            )
            # Возвращаем на главную, а не на FAIL при повторном клике
            return redirect("index")

        form = FeedbackForm(request.POST)
        if form.is_valid():
            client_name = form.cleaned_data["client_name"].strip()
            client_phone = form.cleaned_data["client_phone"].strip()
            privacy_policy_agree = form.cleaned_data["privacy_policy"]

            # * 2. Нормализация номера и генерация хэша
            clean_phone = normalize_phone(client_phone)
            client_phone_hash = hashlib.sha256(clean_phone.encode("utf-8")).hexdigest()

            try:
                with transaction.atomic():
                    # * 3. Поиск / создание клиента
                    client, created = Client.objects.get_or_create(
                        phone_number_hash=client_phone_hash,
                        defaults={
                            "first_name": client_name,
                            "last_name": "-",
                            "middle_name": "-",
                            "phone_number": client_phone,
                            "privacy_policy_agree": privacy_policy_agree,
                        },
                    )

                    now = timezone.now()

                    # * 4. ПРОВЕРКА БЛОКИРОВКИ И ЛИМИТОВ
                    # Шаг А: Если время прошло — снимаем блокировку
                    if client.blocked_until and now >= client.blocked_until:
                        client.unblock_and_reset_available_attempts()

                    # Шаг Б: Если прямо сейчас клиент заблокирован по времени
                    if client.is_blocked():
                        request.session["client_id"] = client.client_id
                        return redirect("limit-exceeded")

                    # Шаг В: Если блокировки по времени нет, но попытки уже 0 — блокируем
                    if client.available_attempts <= 0:
                        client.block_this_client()
                        request.session["client_id"] = client.client_id
                        return redirect("limit-exceeded")

                    # * 5. Обновление данных существующего клиента
                    if not created:
                        client.first_name = client_name
                        client.phone_number = client_phone
                        client.privacy_policy_agree = privacy_policy_agree
                        client.save()

                    # Списываем попытку (здесь попыток точно > 0)
                    client.reduce_available_attempts()

                    # * 6. Создание заявки
                    request_instance = Request.objects.create(client=client)

                    # * 7. Генерация и отправка Email
                    formatted_datetime = format_datetime(
                        timezone.localtime(request_instance.request_datetime),
                        "d MMMM yyyy HH:mm:ss",
                        locale="ru_RU",
                    )
                    subject = (
                        f"Заявка на звонок от {'нового' if created else 'существующего'} клиента. "
                        f"ID клиента: №{client.client_id}"
                    )

                    html_message = render_to_string(
                        "email/message_template.html",
                        {
                            "site_config": SiteConfig.get_solo(),
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

            # * 8. Успех: генерируем новый токен
            request.session["form_token"] = generate_token()

            if created:
                # Чистим client_id, если он остался от предыдущей сессии
                request.session.pop("client_id", None)
                return redirect("success")
            else:
                request.session["client_id"] = client.client_id
                return redirect("updated")

        form_token = generate_token()
        request.session["form_token"] = form_token
    else:
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


def my_updated(request):
    client_id = request.session.get("client_id")
    attempts = None

    if client_id:
        try:
            attempts = Client.objects.get(pk=client_id).available_attempts
        except Client.DoesNotExist:
            pass

    return render(request, "MainApp/updated.html", {"available_attempts": attempts})


def my_limit_exceeded(request):
    client_id = request.session.get("client_id")
    unblock_time = None

    if client_id:
        try:
            client = Client.objects.get(pk=client_id)
            if client.blocked_until:
                unblock_time = timezone.localtime(client.blocked_until)
        except Client.DoesNotExist:
            pass

    return render(
        request, "MainApp/limit-exceeded.html", {"unblock_time": unblock_time}
    )


def my_404(request, exception=None):
    return render(request, "MainApp/404.html", status=404)


def my_500(request):
    context = {}
    try:
        context["site_config"] = SiteConfig.get_solo()
    except Exception:
        context["site_config"] = {"domain": "polimerbeton-vrn.ru"}

    return render(request, "MainApp/500.html", status=500)
