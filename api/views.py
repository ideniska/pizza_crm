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
    HttpResponseBadRequest,
    HttpResponse,
    HttpResponseNotAllowed,
    JsonResponse,
)


@api_view(["GET"])
def add_fake_data(request):
    add_fake_orders()
    return Response("Added")


# @api_view(["GET"])
# def get_orders(request):
#     orders_query = Orders.objects.all()
#     items_per_page = 50
#     paginator = Paginator(orders_query, items_per_page)
#     page_number = request.GET.get("page", 1)
#     orders = paginator.get_page(page_number)
#     serialized_orders = []

#     for o in orders:
#         serialized_orders.append(
#             {
#                 "order_id": o.cooking_number,
#                 "order_date": o.created_at,
#                 "order_content": o.order_content,
#                 "order_status": o.order_status,
#                 "payment_status": o.payment_status,
#                 "total_price": o.total_price,
#                 "client": {
#                     "first_name": o.first_name,
#                     "second_name": o.second_name,
#                     "chat_id": o.chat_id,
#                     "email": o.email,
#                     "phone": o.phone,
#                 },
#                 "order_comment": o.comment,
#             }
#         )

#     return Response(
#         {
#             "count": paginator.count,  # Total number of orders
#             "num_pages": paginator.num_pages,  # Total number of pages
#             "page_number": orders.number,  # Current page number
#             "orders": serialized_orders,  # Orders data for the current page
#         }
#     )


@api_view(["GET"])
def get_past_orders(request):
    current_date = datetime.now().date()
    print("start")
    delta = request.GET["days"]
    print(f"{delta=}")
    target_date = current_date - timedelta(days=int(delta))  # TODO переделать в с - по
    orders_query = Orders.objects.filter(created_at__gte=target_date)
    items_per_page = 50
    paginator = Paginator(orders_query, items_per_page)
    page_number = request.GET.get("page", 1)
    orders = paginator.get_page(page_number)
    serialized_orders = []

    for o in orders:
        serialized_orders.append(
            {
                "order_id": o.cooking_number,
                "order_date": o.created_at,
                "order_content": o.order_content,
                "order_status": o.order_status,
                "payment_status": o.payment_status,
                "total_price": o.total_price,
                "client": {
                    "first_name": o.first_name,
                    "second_name": o.second_name,
                    "chat_id": o.chat_id,
                    "email": o.email,
                    "phone": o.phone,
                },
                "order_comment": o.comment,
            }
        )

    return Response(
        {
            "count": paginator.count,  # Total number of orders
            "num_pages": paginator.num_pages,  # Total number of pages
            "page_number": orders.number,  # Current page number
            "orders": serialized_orders,  # Orders data for the current page
        }
    )


@api_view(["GET"])
def get_orders(request):
    page = int(request.GET.get("page"))
    per_page = 2
    offset = (page - 1) * per_page

    start_date_str = request.GET["start_date"]
    end_date_str = request.GET["end_date"]
    print(f"{start_date_str=} {end_date_str=}")

    orders = MOCK_ORDERS
    total_items = len(orders)
    total_pages = (total_items + per_page - 1) // per_page
    orders_response = []
    for o in orders:
        if o["payment_status"] == "paid":
            order_date_str = o["order_date"]
            order_date = datetime.strptime(order_date_str, "%Y-%m-%d").date()
            start_date = datetime.strptime(start_date_str, "%Y-%m-%d").date()
            end_date = datetime.strptime(end_date_str, "%Y-%m-%d").date()

            if start_date <= order_date <= end_date:
                orders_response.append(o)

    paginated_data = orders_response[offset : offset + per_page]
    print(f"{paginated_data=} {total_pages=}")
    # response = Response(paginated_data)
    # response["Access-Control-Allow-Origin"] = "*"  # Allow requests from any origin
    # return response
    response = {
        "count": total_pages,  # Add the count of pages to the response
        "orders": paginated_data,
    }
    return JsonResponse(response, safe=False)


MOCK_ORDERS = [
    {
        "order_id": "1254",
        "cooking_id": "111",
        "order_date": "2023-07-11",
        "order_content": ["Пепперони", "Маргирита"],
        "order_status": "ready",
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
        "order_status": "dispensed",
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
        "order_status": "init",
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
        "order_status": "init",
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
        "order_status": "init",
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
        "order_status": "init",
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
        "order_status": "init",
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
        "order_status": "init",
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
        "order_status": "init",
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


@api_view(["GET"])
def filter(request):
    filter_field = request.GET["filter_field"]
    filter_query = request.GET["filter_query"]
    print(f"{filter_field=} {filter_query=}")
    orders = MOCK_ORDERS
    orders_response = []
    for o in orders:
        try:
            if o[filter_field] == filter_query and o["payment_status"] == "paid":
                orders_response.append(o)
        except KeyError:
            if (
                o["client"][filter_field] == filter_query
                and o["payment_status"] == "paid"
            ):
                orders_response.append(o)

    print(f"{orders_response=}")
    response = {
        "count": 4,  # Add the count of pages to the response
        "orders": orders_response,
    }
    return JsonResponse(response, safe=False)
