import random
from faker import Faker
from django.utils import timezone
from .models import Orders

fake = Faker()


def add_fake_orders():
    for _ in range(5000):
        order = Orders(
            yookassa_id=fake.uuid4(),
            chat_id=str(random.randint(100000000, 999999999)),
            order_status=random.choice(["pending", "completed", "cancelled"]),
            created_at=timezone.now(),
            payment_status=random.choice(["paid", "unpaid"]),
            cooking_number=fake.random_int(min=1000, max=9999),
            order_content=fake.sentence(nb_words=10),
            total_price="{}.{:02d}".format(
                random.randint(10, 1000), random.randint(0, 99)
            ),
            fiscal_check_sent=random.choice([True, False]),
            is_cancelled=random.choice([True, False]),
            first_name=fake.first_name(),
            second_name=fake.last_name(),
            email=fake.email(),
            phone=fake.phone_number(),
            comment=fake.sentence(nb_words=20),
            refund_reason=fake.sentence(nb_words=10),
        )
        order.save()
