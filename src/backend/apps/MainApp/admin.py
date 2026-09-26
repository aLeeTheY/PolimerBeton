import hashlib
import re

from django.db.models import Q
from django.contrib import admin
from django.contrib.sites.models import Site
from django.contrib.admin.models import LogEntry
from django.utils.translation import gettext_lazy as _

from .models import Client, Request, SiteConfig


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
    list_filter = ("action_time", "user", "content_type", "action_flag")
    search_fields = ("object_repr", "change_message")
    ordering = ("-action_time",)  # Сортировать по времени действия в убывающем порядке

    def get_action_flag_display(self, obj):
        return obj.get_action_flag_display()

    get_action_flag_display.short_description = _("Action Type")


class RequestInline(admin.TabularInline):
    model = Request
    extra = 0  # Убирает пустые строки для создания новых запросов
    readonly_fields = ("request_id", "request_number", "request_datetime")
    can_delete = False  # Убирает возможность удаления запросов через инлайн
    ordering = (
        "-request_datetime",
    )  # Сортировка по дате и времени, начиная с последнего

    def has_add_permission(self, request, obj=None):
        return False


@admin.register(Client)
class ClientAdmin(admin.ModelAdmin):
    list_display = (
        "client_id",
        "last_name",
        "first_name",
        "middle_name",
        "phone_number",
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

    inlines = [RequestInline]  # Добавляем инлайн для запросов

    def get_readonly_fields(self, request, obj=None):
        if obj:  # Если редактируется существующий объект
            return self.readonly_fields + (
                "phone_number",
                "phone_number_hash",
                "available_attempts",
                "blocked_until",
            )
        return self.readonly_fields

    def get_search_results(self, request, queryset, search_term):
        search_term = str(search_term).strip()
        if not search_term:
            return queryset, False

        # 1. Если передан готовый SHA-256 хэш (64 hex-символа)
        if self.is_hash(search_term):
            return queryset.filter(phone_number_hash=search_term), False

        filters = Q()

        # 2. Если введены цифры, это может быть client_id
        if search_term.isdigit():
            filters |= Q(client_id=search_term)

        # 3. Очищаем ввод от любых символов кроме цифр и считаем хэш для поиска по телефону
        clean_digits = re.sub(r"\D", "", search_term)
        if clean_digits:
            search_term_hash = hashlib.sha256(clean_digits.encode()).hexdigest()
            filters |= Q(phone_number_hash=search_term_hash)

        if filters:
            queryset = queryset.filter(filters)
        else:
            queryset = queryset.none()

        return queryset, False

    # Определяем, является ли значение хэшем
    def is_hash(self, value):
        return len(value) == 64 and all(c in "0123456789abcdef" for c in value)

    def is_unblocked_admin(self, obj):
        return not obj.is_blocked()

    is_unblocked_admin.boolean = True  # Отображение статуса как галочки
    is_unblocked_admin.short_description = _("Active")  # Название колонки


@admin.register(Request)
class RequestAdmin(admin.ModelAdmin):
    list_display = (
        "request_id",
        "get_client_phone",
        "get_client_name",
        "request_number",
        "request_datetime",
    )
    search_fields = (
        "request_id",
        "client_id__phone_number_hash",  # Исправленный поиск по полю хэша
    )
    list_filter = ("request_datetime",)
    ordering = ("-request_datetime",)
    readonly_fields = ["request_id"]

    def get_client_phone(self, obj):
        return obj.client_id.phone_number

    get_client_phone.short_description = _("Client phone number")  # Заголовок колонки

    def get_client_name(self, obj):
        return f"{obj.client_id.first_name}"

    get_client_name.short_description = _("Client name")  # Заголовок колонки

    def get_search_results(self, request, queryset, search_term):
        search_term = str(search_term).strip()
        if not search_term:
            return queryset, False

        # 1. Если передан готовый SHA-256 хэш
        if self.is_hash(search_term):
            return queryset.filter(client_id__phone_number_hash=search_term), False

        filters = Q()

        # 2. Проверка на request_id
        if search_term.isdigit():
            filters |= Q(request_id=search_term)

        # 3. Поиск по хэшу очищенного телефона клиента (единый lookup client_id__phone_number_hash)
        clean_digits = re.sub(r"\D", "", search_term)
        if clean_digits:
            search_term_hash = hashlib.sha256(clean_digits.encode()).hexdigest()
            filters |= Q(client_id__phone_number_hash=search_term_hash)

        if filters:
            queryset = queryset.filter(filters)
        else:
            queryset = queryset.none()

        return queryset, False

    # Определяем, является ли значение хэшем
    def is_hash(self, value):
        return len(value) == 64 and all(c in "0123456789abcdef" for c in value)


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
