from django.contrib import admin
from django.urls import path
from api.views import *

urlpatterns = [
    path("admin/", admin.site.urls),
    path("get_orders/", get_orders),
    path("add_fake/", add_fake_data),
    path("update_order_comment/", update_order_comment),
    path("start_refund/", start_refund),
    path("filter", filter),
]
