from django.db import models


class Orders(models.Model):
    yookassa_id = models.CharField(max_length=100)
    chat_id = models.CharField(
        max_length=100
    )  # TODO Рефакторинг: переписать services и dbmanager под работу через client foreign key откуда мы достанем Client.chat_id, а не Orders.chat_id и убрать отсюда chat_id
    order_status = models.CharField(max_length=100)
    created_at = models.DateTimeField(auto_now_add=True)
    payment_status = models.CharField(max_length=100)
    cooking_number = models.CharField(max_length=100, null=True, blank=True)
    order_content = models.CharField(max_length=500, null=True, blank=True)
    total_price = models.CharField(max_length=100, null=True, blank=True)
    fiscal_check_sent = models.BooleanField(default=False)
    is_cancelled = models.BooleanField(default=False)
    first_name = models.CharField(max_length=100, null=True, blank=True)
    second_name = models.CharField(max_length=100, null=True, blank=True)
    email = models.EmailField(null=True, blank=True)
    phone = models.CharField(max_length=100, null=True, blank=True)
    comment = models.CharField(max_length=1000, null=True, blank=True)
    refund_reason = models.CharField(max_length=1000, null=True, blank=True)
