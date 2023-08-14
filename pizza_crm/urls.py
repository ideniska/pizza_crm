from django.contrib import admin
from django.urls import path
from api.views import *

urlpatterns = [
    path("admin/", admin.site.urls),
    path("get_orders/", get_orders),
]
