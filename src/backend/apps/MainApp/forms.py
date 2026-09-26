from django import forms
from django.core.validators import RegexValidator

# Регулярные выражения
NAME_REGEX = r"^[A-Za-zА-Яа-яЁё\s-]+$"
PHONE_REGEX = r"^\+7 \(\d{3}\) \d{3}-\d{2}-\d{2}$"

# Валидаторы для проверки на стороне сервера (Django)
name_validator = RegexValidator(
    regex=NAME_REGEX,
    message="Для указания имени разрешено использовать только буквенные символы.",
    code="invalid",
)

phone_validator = RegexValidator(
    regex=PHONE_REGEX,
    message="Указывать номер телефона необходимо в формате +7 (XXX) XXX-XX-XX.",
    code="invalid",
)


class FeedbackForm(forms.Form):
    client_name = forms.CharField(
        max_length=100,
        label="Имя",
        validators=[name_validator],
        widget=forms.TextInput(
            attrs={
                "id": "client_name",
                "placeholder": "Имя",
                "aria-label": "Имя",
                "autocomplete": "name",
                "pattern": NAME_REGEX,
            }
        ),
        error_messages={
            "required": "Пожалуйста, укажите ваше имя.",
            "max_length": "Имя не должно превышать 100 символов.",
        },
    )

    client_phone = forms.CharField(
        max_length=18,
        label="+7 (___) ___-__-__",
        validators=[phone_validator],
        widget=forms.TextInput(
            attrs={
                "id": "client_phone",
                "placeholder": "+7 (___) ___-__-__",
                "aria-label": "Номер телефона",
                "autocomplete": "tel",
                "pattern": PHONE_REGEX,
            }
        ),
        error_messages={
            "required": "Пожалуйста, укажите ваш номер телефона.",
            "max_length": "Длина номера телефона не должна превышать 18 символов.",
        },
    )

    privacy_policy = forms.BooleanField(
        label="",
        required=True,
        widget=forms.CheckboxInput(
            attrs={
                "id": "privacy_policy",
                "aria-label": "Согласие с политикой конфиденциальности",
            }
        ),
        error_messages={
            "required": "Пожалуйста, подтвердите согласие с политикой конфиденциальности.",
        },
    )
