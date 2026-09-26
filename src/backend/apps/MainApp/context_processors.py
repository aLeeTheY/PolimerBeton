from django.utils import timezone
from .models import SiteConfig


def site_config(request):
    return {"site_config": SiteConfig.get_solo()}


def current_year(request):
    return {"current_year": timezone.now().year}
