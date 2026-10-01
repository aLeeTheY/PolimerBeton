from django.views.generic.base import TemplateView, RedirectView
from django.urls import path

from . import views

urlpatterns = [
    # ? --- BASIC PAGES
    # ? ---------------
    path("", views.my_index, name="index"),
    path("privacy/", views.my_privacy, name="privacy"),
    # ? --- SERVICE PAGES
    # ? -----------------
    path("success/", views.my_success, name="success"),
    path("fail/", views.my_fail, name="fail"),
    path("updated/", views.my_updated, name="updated"),
    path("limit-exceeded/", views.my_limit_exceeded, name="limit-exceeded"),
    # ? --- FAVICON
    # ? -----------
    path(
        "favicon.ico",
        RedirectView.as_view(
            url="/static/MainApp/meta/favicon/favicon.ico",
            permanent=True,
        ),
        name="favicon",
    ),
    # ? --- META FILES
    # ? --------------
    path(
        "robots.txt",
        TemplateView.as_view(
            template_name="meta/robots.txt", content_type="text/plain"
        ),
        name="robots",
    ),
    path(
        "humans.txt",
        TemplateView.as_view(
            template_name="meta/humans.txt", content_type="text/plain"
        ),
        name="humans",
    ),
    path(
        "site.webmanifest",
        TemplateView.as_view(
            template_name="meta/site.webmanifest",
            content_type="application/manifest+json",
        ),
        name="webmanifest",
    ),
    # path(
    #     "sitemap.xml",
    #     TemplateView.as_view(
    #         template_name="meta/sitemap.xml",
    #         content_type="application/xml",
    #     ),
    #     name="sitemap",
    # ),
    # ! --- DEBUG | FOR MANUAL TEST | PAGE 500
    # ! --------------------------------------
    # path("force-500/", views.trigger_error, name="force-500"),
]
