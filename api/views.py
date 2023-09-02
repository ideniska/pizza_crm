from django.shortcuts import render
from rest_framework.decorators import api_view
from django.http import JsonResponse
from rest_framework.response import Response
from .fake_db import add_fake_orders
from .models import Orders
from django.core.paginator import Paginator
from rest_framework.response import Response
from datetime import datetime, timedelta
from django.db.models import Q
from django.http import (
    JsonResponse,
)


@api_view(["GET"])
def add_fake_data(request):
    add_fake_orders()
    return Response("Added")


@api_view(["GET"])
def get_orders(request):
    page = int(request.GET.get("page"))
    per_page = 2
    offset = (page - 1) * per_page
    cooking_id = request.GET["cooking_id"]
    cooking_status = request.GET["cooking_status"]
    second_name = request.GET["second_name"]
    chat_id = request.GET["chat_id"]
    email = request.GET["email"]
    phone = request.GET["phone"]
    start_date_str = request.GET["start_date"]
    end_date_str = request.GET["end_date"]
    orders = MOCK_ORDERS

    orders_response = []
    for o in orders:
        if o["payment_status"] == "paid":
            order_date_str = o["order_date"]
            order_date = datetime.strptime(order_date_str, "%Y-%m-%d").date()
            start_date = datetime.strptime(start_date_str, "%Y-%m-%d").date()
            end_date = datetime.strptime(end_date_str, "%Y-%m-%d").date()
            if start_date <= order_date <= end_date:
                orders_response.append(o)

    print(f"Before filter {orders_response=}")
    print(f"{cooking_id=}")
    for o in orders_response:
        if cooking_id != "None":
            orders_response = [
                o for o in orders_response if o["cooking_id"] == cooking_id
            ]

    for o in orders_response:
        if cooking_status != "None":
            orders_response = [
                o for o in orders_response if o["cooking_status"] == cooking_status
            ]

    for o in orders_response:
        if chat_id != "None":
            orders_response = [
                o for o in orders_response if o["client"]["chat_id"] == chat_id
            ]

    for o in orders_response:
        if email != "None":
            orders_response = [
                o for o in orders_response if o["client"]["email"] == email
            ]

    for o in orders_response:
        if phone != "None":
            orders_response = [
                o for o in orders_response if o["client"]["phone"] == phone
            ]

    for o in orders_response:
        if second_name != "None":
            orders_response = [
                o for o in orders_response if o["client"]["second_name"] == second_name
            ]

    print(f"{orders_response=}")
    total_items = len(orders_response)
    total_pages = (total_items + per_page - 1) // per_page
    paginated_data = orders_response[offset : offset + per_page]
    print(f"{paginated_data=} {total_pages=}")
    response = {
        "count": total_pages,
        "orders": paginated_data,
    }
    return JsonResponse(response, safe=False)


MOCK_ORDERS = [
    {
        "order_id": "1254",
        "cooking_id": "111",
        "order_date": "2023-07-11",
        "order_content": ["Пепперони", "Маргирита"],
        "cooking_status": "ready",
        "payment_status": "paid",
        "total_price": 290,
        "client": {
            "first_name": "Джейсон",
            "second_name": "Стетхем",
            "chat_id": "123345678",
            "email": "aaaa@bbbb.com",
            "phone": "89638807777",
        },
        "order_comment": "",
    },
    {
        "order_id": "1255",
        "cooking_id": "112",
        "order_date": "2023-08-22",
        "order_content": ["Деревенская", "Маргирита"],
        "cooking_status": "dispensed",
        "payment_status": "paid",
        "total_price": 310,
        "client": {
            "first_name": "Силвестр",
            "second_name": "Сталлоне",
            "chat_id": "142245678",
            "email": "oooo@bbbb.com",
            "phone": "89638807234",
        },
        "order_comment": "",
    },
    {
        "order_id": "1256",
        "cooking_id": "113",
        "order_date": "2023-08-23",
        "order_content": ["Сырная"],
        "cooking_status": "init",
        "payment_status": "paid",
        "total_price": 100,
        "client": {
            "first_name": "Чак",
            "second_name": "Норрис",
            "chat_id": "162645678",
            "email": "eeeee@bbbb.com",
            "phone": "89638807111",
        },
        "order_comment": "Блогер",
    },
    {
        "order_id": "1257",
        "cooking_id": "114",
        "order_date": "2023-08-24",
        "order_content": ["Сырная"],
        "cooking_status": "dispensed",
        "payment_status": "paid",
        "total_price": 100,
        "client": {
            "first_name": "Чак",
            "second_name": "Норрис",
            "chat_id": "162645678",
            "email": "eeeee@bbbb.com",
            "phone": "89638807111",
        },
        "order_comment": "Блогер",
    },
    {
        "order_id": "1258",
        "cooking_id": "115",
        "order_date": "2023-08-27",
        "order_content": ["Грибная"],
        "cooking_status": "cooking",
        "payment_status": "pad",
        "total_price": 110,
        "client": {
            "first_name": "Дольф",
            "second_name": "Лунгрен",
            "chat_id": "182135678",
            "email": "xxxxxx@bbbb.com",
            "phone": "8963107000",
        },
        "order_comment": "Не обслуживать!",
    },
    {
        "order_id": "1259",
        "cooking_id": "116",
        "order_date": "2023-08-28",
        "order_content": ["Грибная"],
        "cooking_status": "accepted",
        "payment_status": "paid",
        "total_price": 110,
        "client": {
            "first_name": "Магнус",
            "second_name": "Карллсон",
            "chat_id": "182135678",
            "email": "xxxxxx@bbbb.com",
            "phone": "8963107000",
        },
        "order_comment": "Не обслуживать!",
    },
    {
        "order_id": "1260",
        "cooking_id": "117",
        "order_date": "2023-08-29",
        "order_content": ["Грибная"],
        "cooking_status": "init",
        "payment_status": "init",
        "total_price": 10,
        "client": {
            "first_name": "Петя",
            "second_name": "Иванов",
            "chat_id": "182135678",
            "email": "xxxxxx@bbbb.com",
            "phone": "8963107000",
        },
        "order_comment": "Не обслуживать!",
    },
    {
        "order_id": "1261",
        "cooking_id": "118",
        "order_date": "2023-08-30",
        "order_content": ["Грибная"],
        "cooking_status": "init",
        "payment_status": "paid",
        "total_price": 110,
        "client": {
            "first_name": "Магнус",
            "second_name": "Карллсон",
            "chat_id": "182135678",
            "email": "xxxxxx@bbbb.com",
            "phone": 8963107000,
        },
        "order_comment": "Не обслуживать!",
    },
    {
        "order_id": "1262",
        "cooking_id": "119",
        "order_date": "2023-08-31",
        "order_content": ["Грибная"],
        "cooking_status": "init",
        "payment_status": "paid",
        "total_price": 110,
        "client": {
            "first_name": "Магнус",
            "second_name": "Карллсон",
            "chat_id": "182135678",
            "email": "xxxxxx@bbbb.com",
            "phone": 8963107000,
        },
        "order_comment": "Не обслуживать!",
    },
    {
        "order_id": "1263",
        "cooking_id": "120",
        "order_date": "2023-09-01",
        "order_content": ["Грибная"],
        "cooking_status": "init",
        "payment_status": "paid",
        "total_price": 110,
        "client": {
            "first_name": "Магнус",
            "second_name": "Пук",
            "chat_id": "182135678",
            "email": "xxxxxx@bbbb.com",
            "phone": 8963107000,
        },
        "order_comment": "Не обслуживать!",
    },
    {
        "order_id": "1264",
        "cooking_id": "105",
        "order_date": "2023-09-02",
        "order_content": ["Грибная"],
        "cooking_status": "dispensed",
        "payment_status": "paid",
        "total_price": 110,
        "client": {
            "first_name": "Вова",
            "second_name": "Петеров",
            "chat_id": "182135678",
            "email": "xxxxxx@bbbb.com",
            "phone": 8963107000,
        },
        "order_comment": "Нааааа!",
    },
    {
        "order_id": "1265",
        "cooking_id": "105",
        "order_date": "2023-09-02",
        "order_content": ["Грибная"],
        "cooking_status": "dispensed",
        "payment_status": "paid",
        "total_price": 110,
        "client": {
            "first_name": "Выф",
            "second_name": "Выф",
            "chat_id": "182135678",
            "email": "xxxxxx@bbbb.com",
            "phone": 8963107000,
        },
        "order_comment": "Нааааа!",
    },
    {
        "order_id": "1266",
        "cooking_id": "105",
        "order_date": "2023-09-02",
        "order_content": ["Грибная"],
        "cooking_status": "dispensed",
        "payment_status": "paid",
        "total_price": 110,
        "client": {
            "first_name": "Саллли",
            "second_name": "Гоп",
            "chat_id": "182135678",
            "email": "xxxxxx@bbbb.com",
            "phone": 8963107000,
        },
        "order_comment": "Нааааа!",
    },
    {
        "order_id": "1267",
        "cooking_id": "105",
        "order_date": "2023-09-02",
        "order_content": ["Грибная"],
        "cooking_status": "init",
        "payment_status": "paid",
        "total_price": 110,
        "client": {
            "first_name": "Игор",
            "second_name": "Марков",
            "chat_id": "182135678",
            "email": "xxxxxx@bbbb.com",
            "phone": 8963107000,
        },
        "order_comment": "Нааааа!",
    },
]


@api_view(["PUT"])
def update_order_comment(request):
    order_id = request.data.get("order_id")
    new_comment = request.data.get("comment")
    print(order_id, new_comment)
    return JsonResponse({order_id: new_comment})


@api_view(["POST"])
def start_refund(request):
    id_list = request.data.get("orders")
    print(f"{id_list=}")
    return JsonResponse({"orders": id_list})


# @api_view(["GET"])
# def filter(request):
#     page = int(request.GET.get("page"))
#     per_page = 2
#     offset = (page - 1) * per_page
#     orders = MOCK_ORDERS
#     total_items = len(orders)
#     total_pages = (total_items + per_page - 1) // per_page
#     filter_field = request.GET["filter_field"]
#     filter_query = request.GET["filter_query"]
#     print(f"{filter_field=} {filter_query=}")
#     orders = MOCK_ORDERS
#     orders_response = []
#     for o in orders:
#         try:
#             if o[filter_field] == filter_query and o["payment_status"] == "paid":
#                 orders_response.append(o)
#         except KeyError:
#             if (
#                 o["client"][filter_field] == filter_query
#                 and o["payment_status"] == "paid"
#             ):
#                 orders_response.append(o)

#     print(f"{orders_response=}")
#     paginated_data = orders_response[offset : offset + per_page]
#     response = {
#         "count": 4,  # Add the count of pages to the response
#         "orders": paginated_data,
#     }
#     return JsonResponse(response, safe=False)
