from django.urls import include, path
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework.routers import DefaultRouter

from sales.views import (
    CommissionReportView,
    CustomerViewSet,
    ProductViewSet,
    SaleViewSet,
    SellerViewSet,
)

router = DefaultRouter()
router.register("products", ProductViewSet, basename="product")
router.register("customers", CustomerViewSet, basename="customer")
router.register("sellers", SellerViewSet, basename="seller")
router.register("sales", SaleViewSet, basename="sale")


@api_view(["GET"])
def health(request):
    return Response({"status": "ok"})


urlpatterns = [
    path("", include(router.urls)),
    path("commission-report/", CommissionReportView.as_view(), name="commission-report"),
    path("health/", health),
]
