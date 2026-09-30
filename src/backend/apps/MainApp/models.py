from datetime import timedelta
import hashlib
import re

from django.db import models
from django.core.cache import cache
from django.contrib.sites.models import Site
from django.conf import settings
from django.utils import timezone
from django.utils.translation import gettext_lazy as _
from encrypted_model_fields.fields import EncryptedCharField


def normalize_phone(phone_str: str) -> str:
    """Приводит номер телефона к единому стандарту (7XXXXXXXXXX)."""
    if not phone_str or phone_str == "-":
        return ""
    digits = re.sub(r"\D", "", phone_str)
    if len(digits) == 11 and digits.startswith("8"):
        digits = "7" + digits[1:]
    return digits


class Client(models.Model):
    client_id = models.AutoField(primary_key=True, verbose_name=_("Client ID"))

    # Фамилия, имя, отчество
    last_name = EncryptedCharField(
        max_length=100, null=False, default="-", verbose_name=_("Last name")
    )
    first_name = EncryptedCharField(
        max_length=100, null=False, default="-", verbose_name=_("First name")
    )
    middle_name = EncryptedCharField(
        max_length=100, null=True, blank=True, verbose_name=_("Middle name")
    )

    # Телефон
    phone_number = EncryptedCharField(
        max_length=18,
        null=False,
        default="-",
        verbose_name=_("Phone number"),
    )

    # телефон шифруется разными хешами, так что этот хеш нужен, чтобы отличать одинаковых клиентов
    phone_number_hash = models.CharField(
        max_length=64,
        unique=True,
        null=True,
        blank=True,
        verbose_name=_("Phone number hash"),
    )

    # Согласие с политикой конфиденциальности
    privacy_policy_agree = models.BooleanField(
        default=False,
        verbose_name=_("The client agrees with the privacy policy"),
    )

    # * Система блокировки пользователя, если спамит форму
    available_attempts = models.PositiveIntegerField(
        default=3, verbose_name=_("Available attempts")
    )  # * Количество попыток отправки формы

    blocked_until = models.DateTimeField(
        null=True, blank=True, verbose_name=_("Blocked until")
    )  # * Время блокировки

    def is_blocked(self):
        if self.blocked_until and timezone.now() < self.blocked_until:
            return True
        return False

    def reduce_available_attempts(self):
        self.available_attempts -= 1

        if self.available_attempts > 0:
            self.save(update_fields=["available_attempts"])
            return

        self.block_this_client()

    def block_this_client(self):
        self.available_attempts = 0
        self.blocked_until = timezone.now() + timedelta(hours=1)
        self.save(update_fields=["blocked_until", "available_attempts"])

    def unblock_and_reset_available_attempts(self):
        self.available_attempts = 3
        self.blocked_until = None
        self.save(update_fields=["available_attempts", "blocked_until"])

    def save(self, *args, **kwargs):
        # * Единая нормализация и хэширование номера телефона
        clean_phone = normalize_phone(self.phone_number or "")
        if clean_phone:
            self.phone_number_hash = hashlib.sha256(
                clean_phone.encode("utf-8")
            ).hexdigest()
        else:
            self.phone_number_hash = None

        # * Защита от ValueError при вызове save(update_fields=[...])
        update_fields = kwargs.get("update_fields")
        if update_fields is not None:
            kwargs["update_fields"] = set(update_fields) | {"phone_number_hash"}

        super().save(*args, **kwargs)

    class Meta:
        db_table = "clients"
        verbose_name = _("Client")
        verbose_name_plural = _("Clients")


class Request(models.Model):
    request_id = models.AutoField(primary_key=True, verbose_name=_("Request ID"))

    # ID клиента
    client = models.ForeignKey(
        Client,
        on_delete=models.CASCADE,
        related_name="requests",
        verbose_name=_("Client"),
    )

    # Номер обращения клиента (1, 2, 3, ..., N)
    request_number = models.PositiveIntegerField(
        default=1, verbose_name=_("Request number for this client")
    )

    # Дата и время данного обращения
    request_datetime = models.DateTimeField(
        # auto_now_add=True,
        default=timezone.now,
        verbose_name=_("Date and time of registration for this request"),
    )

    def save(self, *args, **kwargs):
        # Автоматический подсчет порядкового номера заявки для конкретного клиента
        if not self.pk:
            last_request = (
                Request.objects.filter(client=self.client)
                .order_by("-request_number")
                .first()
            )
            if last_request:
                self.request_number = last_request.request_number + 1
            else:
                self.request_number = 1

        super().save(*args, **kwargs)

    class Meta:
        db_table = "requests"
        unique_together = ("client", "request_number")
        verbose_name = _("Request")
        verbose_name_plural = _("Requests")


class SiteConfig(models.Model):
    domain = models.CharField(
        "Site domain", max_length=255, default="polimerbeton-vrn.ru"
    )
    price = models.DecimalField(
        "Price (rubles)", max_digits=10, decimal_places=2, default=279.00
    )

    class Meta:
        verbose_name = _("Site Config")
        verbose_name_plural = _("Site Config")

    def save(self, *args, **kwargs):
        self.pk = 1
        super().save(*args, **kwargs)

        try:
            site = Site.objects.get(id=getattr(settings, "SITE_ID", 1))

            if site.domain != self.domain:
                site.domain = self.domain
                site.name = self.domain
                site.save()

        except Site.DoesNotExist:
            Site.objects.create(
                id=getattr(settings, "SITE_ID", 1), domain=self.domain, name=self.domain
            )

        cache.delete("site_config")

    @classmethod
    def get_solo(cls):
        config = cache.get("site_config")

        if not config:
            config, _ = cls.objects.get_or_create(pk=1)
            cache.set("site_config", config, 60 * 60 * 24)

        return config

    def __str__(self):
        return "Site Config"
