from django.db.models import Prefetch
from django.utils.dateparse import parse_date
from rest_framework import status, viewsets
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework.views import APIView

from sales.models import Customer, Product, Sale, SaleItem, Seller
from sales.serializers import (
    CommissionReportSerializer,
    CustomerSerializer,
    ProductSerializer,
    SaleSerializer,
    SellerSerializer,
)
from sales.services.commission import commission_report
from sales.validators import validate_date_range


class ProductViewSet(viewsets.ModelViewSet):
    queryset = Product.objects.all()
    serializer_class = ProductSerializer
    pagination_class = None


class CustomerViewSet(viewsets.ModelViewSet):
    queryset = Customer.objects.all()
    serializer_class = CustomerSerializer
    pagination_class = None


class SellerViewSet(viewsets.ModelViewSet):
    queryset = Seller.objects.all()
    serializer_class = SellerSerializer
    pagination_class = None


class SaleViewSet(viewsets.ModelViewSet):
    queryset = Sale.objects.select_related("seller", "customer").prefetch_related(
        Prefetch("items", queryset=SaleItem.objects.select_related("product", "sale"))
    )
    serializer_class = SaleSerializer
    pagination_class = None


class CommissionReportView(APIView):
    """Main Api Class for generating commission reports, which are not persisted in the database.
    Enabled Methods: [GET]"""

    permission_classes = [AllowAny]  # noqa: RUF012

    def get(self, request):
        start_date = parse_date(request.query_params.get("start_date", ""))
        end_date = parse_date(request.query_params.get("end_date", ""))
        range_valid, range_message = validate_date_range(start_date, end_date)
        if not range_valid:
            return Response({"errors": [range_message]}, status=status.HTTP_400_BAD_REQUEST)
        report = commission_report(start_date, end_date)
        payload = {
            "start": start_date,
            "end": end_date,
            "sellers": report["sellers"],
            "total": report["total"],
        }
        return Response(CommissionReportSerializer(payload).data)


@api_view(["GET"])
@permission_classes([AllowAny])
def health(request):
    return Response({"status": "ok"})
