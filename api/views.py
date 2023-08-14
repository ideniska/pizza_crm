from django.shortcuts import render
from rest_framework.decorators import api_view
from django.http import JsonResponse
from rest_framework.response import Response


@api_view(["GET"])
def get_orders(request):
    orders = [
        {
            "order_id": 111,
            "order_date": "14 августа 2023 10:11",
            "order_content": ["Пепперони", "Маргирита"],
            "order_status": "ready",
            "payment_status": "paid",
            "total_price": 290,
            "client": {
                "first_name": "Джейсон",
                "second_name": "Стетхем",
                "chat_id": 123345678,
                "email": "aaaa@bbbb.com",
                "phone": 89638807777,
            },
            "order_comment": "",
        },
        {
            "order_id": 112,
            "order_date": "14 августа 2023 12:11",
            "order_content": ["Деревенская", "Маргирита"],
            "order_status": "dispensed",
            "payment_status": "paid",
            "total_price": 310,
            "client": {
                "first_name": "Силвестр",
                "second_name": "Сталлоне",
                "chat_id": 142245678,
                "email": "oooo@bbbb.com",
                "phone": 89638807234,
            },
            "order_comment": "",
        },
        {
            "order_id": 110,
            "order_date": "12 августа 2023 14:11",
            "order_content": ["Сырная"],
            "order_status": "accepted",
            "payment_status": "paid",
            "total_price": 100,
            "client": {
                "first_name": "Чак",
                "second_name": "Норрис",
                "chat_id": 162645678,
                "email": "eeeee@bbbb.com",
                "phone": 89638807111,
            },
            "order_comment": "",
        },
    ]
    response = Response(orders)
    response["Access-Control-Allow-Origin"] = "*"  # Allow requests from any origin
    return response
