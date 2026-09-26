from django.contrib import admin
from django.urls import include, path
from django.contrib.sitemaps.views import sitemap

from apps.MainApp.sitemaps import StaticViewSitemap
from apps.MainApp.views import my_404, my_500

sitemaps = {
    "static": StaticViewSitemap,
}

urlpatterns = [
    path("admin/", admin.site.urls),
    # ? --- Подключаем маршруты из приложения MainApp
    # ? ---------------------------------------------
    path("", include("apps.MainApp.urls")),
    # ? --- Sitemap от MainApp
    # ? ----------------------
    path("sitemap.xml", sitemap, {"sitemaps": sitemaps}, name="sitemap"),
]

# * переопределяем page 404 & 500
handler404 = my_404
handler500 = my_500
