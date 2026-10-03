from django.utils import timezone
from .models import SiteConfig


def site_config(request):
    try:
        return {"site_config": SiteConfig.get_solo()}
    except Exception:
        return {"site_config": SiteConfig(domain="polimerbeton-vrn.ru", price=279)}


def current_year(request):
    return {"current_year": timezone.now().year}
