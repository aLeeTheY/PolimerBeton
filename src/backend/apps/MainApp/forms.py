import re
from django import forms
from django.core.exceptions import ValidationError
from django.core.validators import RegexValidator

NAME_REGEX = r"^[A-Za-zА-Яа-яЁё\s-]+$"

name_validator = RegexValidator(
    regex=NAME_REGEX,
    message="Для указания имени разрешено использовать только буквенные символы.",
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
        widget=forms.TextInput(
            attrs={
                "id": "client_phone",
                "placeholder": "+7 (___) ___-__-__",
                "aria-label": "Номер телефона",
                "autocomplete": "tel",
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

    def clean_client_phone(self):
        """Очищает номер от маски/символов, допускает +7, 7, 8 и приводить к единому формату 7XXXXXXXXXX."""
        raw_phone = self.cleaned_data.get("client_phone", "")

        # Оставляем только цифры
        digits = re.sub(r"\D", "", raw_phone)

        # 11 цифр, начинается с 8 или 7 (8920... -> 7920...)
        if len(digits) == 11 and digits[0] in ("7", "8"):
            return "7" + digits[1:]

        # 10 цифр, если ввели без кода страны (9201234567 -> 79201234567)
        if len(digits) == 10 and digits.startswith("9"):
            return "7" + digits

        raise ValidationError(
            "Укажите корректный номер телефона в формате +7 (XXX) XXX-XX-XX или 8XXXXXXXXXX.",
            code="invalid_phone",
        )
