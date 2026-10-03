import hashlib
from typing import Optional

from django.db.models import Q
from django.contrib import admin
from django.contrib.sites.models import Site
from django.contrib.admin.models import LogEntry
from django.utils.translation import gettext_lazy as _

from .models import Client, Request, SiteConfig, normalize_phone


# ? --- УТИЛИТЫ
# ? -----------
def format_phone_display(raw_phone: str) -> str:
    """Приводит телефон к виду +7 (XXX) XXX-XX-XX для отображения в админке."""
    digits = normalize_phone(raw_phone)
    if len(digits) == 11 and digits.startswith("7"):
        return f"+7 ({digits[1:4]}) {digits[4:7]}-{digits[7:9]}-{digits[9:11]}"
    return raw_phone


def is_sha256_hash(value: str) -> bool:
    """Проверяет, является ли строка SHA-256 хэшем (64 hex-символа, регистр не важен)."""
    value = value.lower()
    return len(value) == 64 and all(c in "0123456789abcdef" for c in value)


def hash_phone_digits(raw_value: str) -> Optional[str]:
    """Приводит номер к стандарту 7XXXXXXXXXX и возвращает SHA-256 хэш."""
    clean_digits = normalize_phone(raw_value)
    if not clean_digits:
        return None
    return hashlib.sha256(clean_digits.encode("utf-8")).hexdigest()


# ? --- MIXIN ДЛЯ ПОИСКА ПО ID / ХЭШУ ТЕЛЕФОНА
# ? ------------------------------------------
class PhoneHashSearchMixin:
    """
    Миксин для get_search_results: ищет по ID и по хэшу телефона.
    Полностью переопределяет стандартный поиск по search_fields.

    Наследник должен определить:
      - self.id_field_name  — имя поля ID ('client_id' или 'request_id')
      - self.hash_lookup    — lookup до поля хэша
                              ('phone_number_hash' для Client,
                               'client__phone_number_hash' для Request)

    ВАЖНО: миксин должен идти ПЕРВЫМ в MRO, иначе его get_search_results
    перекроется методом admin.ModelAdmin.
    """

    id_field_name: Optional[str] = None
    hash_lookup: Optional[str] = None

    def get_search_results(self, request, queryset, search_term):
        search_term = str(search_term).strip()
        if not search_term:
            return queryset, False

        # 1. Готовый SHA-256 хэш — ищем по нему напрямую
        if is_sha256_hash(search_term):
            return queryset.filter(**{self.hash_lookup: search_term.lower()}), False

        filters = Q()

        # 2. Если введены только цифры — может быть ID
        if search_term.isdigit():
            filters |= Q(**{self.id_field_name: search_term})

        # 3. Хэш от очищенного телефона
        phone_hash = hash_phone_digits(search_term)
        if phone_hash:
            filters |= Q(**{self.hash_lookup: phone_hash})

        if filters:
            return queryset.filter(filters), False

        return queryset.none(), False


# ? --- LOG ENTRY
# ? -------------
@admin.register(LogEntry)
class LogEntryAdmin(admin.ModelAdmin):
    list_display = (
        "action_time",
        "user",
        "content_type",
        "object_id",
        "object_repr",
        "action_flag",
        "change_message",
    )
    list_display_links = None
    list_filter = ("action_time", "user", "content_type", "action_flag")
    search_fields = ("object_repr", "change_message")
    ordering = ("-action_time",)


# ? --- REQUEST INLINE
# ? ------------------
class RequestInline(admin.TabularInline):
    model = Request
    extra = 0
    readonly_fields = ("request_id", "request_number", "request_datetime")
    can_delete = False
    ordering = ("-request_datetime",)

    def has_add_permission(self, request, obj=None):
        return False


# ? --- CLIENT
# ? ----------
@admin.register(Client)
class ClientAdmin(PhoneHashSearchMixin, admin.ModelAdmin):
    id_field_name = "client_id"
    hash_lookup = "phone_number_hash"

    list_display = (
        "client_id",
        "last_name",
        "first_name",
        "middle_name",
        "get_phone_display",
        "phone_number_hash",
        "privacy_policy_agree",
        "available_attempts",
        "blocked_until",
        "is_unblocked_admin",
    )
    search_fields = (
        "client_id",
        "phone_number_hash",
    )
    list_filter = ("privacy_policy_agree",)
    ordering = ("-client_id",)
    readonly_fields = ("client_id", "is_unblocked_admin")

    inlines = [RequestInline]

    def get_readonly_fields(self, request, obj=None):
        if obj:  # Если редактируется существующий объект
            return self.readonly_fields + (
                "phone_number",
                "phone_number_hash",
                "available_attempts",
                "blocked_until",
            )
        return self.readonly_fields

    def is_unblocked_admin(self, obj):
        return not obj.is_blocked()

    is_unblocked_admin.boolean = True
    is_unblocked_admin.short_description = _("Active")

    def get_phone_display(self, obj):
        return format_phone_display(obj.phone_number)

    get_phone_display.short_description = _("Phone number")


# ? --- REQUEST
# ? -----------
@admin.register(Request)
class RequestAdmin(PhoneHashSearchMixin, admin.ModelAdmin):
    id_field_name = "request_id"
    hash_lookup = "client__phone_number_hash"

    list_display = (
        "request_id",
        "get_client_phone",
        "get_client_name",
        "request_number",
        "request_datetime",
    )
    search_fields = (
        "request_id",
        "client__phone_number_hash",
    )
    list_filter = ("request_datetime",)
    ordering = ("-request_datetime",)
    readonly_fields = ["request_id"]

    def get_client_phone(self, obj):
        return format_phone_display(obj.client.phone_number)

    get_client_phone.short_description = _("Client phone number")

    def get_client_name(self, obj):
        parts = [
            obj.client.last_name,
            obj.client.first_name,
            obj.client.middle_name,
        ]
        # Отсекаем заглушки «-» и пустые значения (None, "")
        cleaned = [p for p in parts if p and p != "-"]
        return " ".join(cleaned) if cleaned else "—"

    get_client_name.short_description = _("Client name")


# ? --- SITE CONFIG
# ? ---------------
@admin.register(SiteConfig)
class SiteConfigAdmin(admin.ModelAdmin):
    fields = ("domain", "price")

    def has_add_permission(self, request):
        if self.model.objects.exists():
            return False
        return super().has_add_permission(request)

    def has_delete_permission(self, request, obj=None):
        return False


# * --- УБИРАЕМ РЕГИСТРАЦИЮ
admin.site.unregister(Site)
