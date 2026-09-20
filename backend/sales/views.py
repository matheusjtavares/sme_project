from django.utils.dateparse import parse_date
from rest_framework import status, viewsets
from rest_framework.response import Response
from rest_framework.views import APIView

from sales.models import Customer, Product, Sale, Seller
from sales.serializers import (
    CustomerSerializer,
    ProductSerializer,
    SaleSerializer,
    SellerSerializer,
)
from sales.services.comission import commission_report
from sales.validators import validate_date_range


class ProductViewSet(viewsets.ModelViewSet):
    queryset = Product.objects.all()
    serializer_class = ProductSerializer


class CustomerViewSet(viewsets.ModelViewSet):
    queryset = Customer.objects.all()
    serializer_class = CustomerSerializer


class SellerViewSet(viewsets.ModelViewSet):
    queryset = Seller.objects.all()
    serializer_class = SellerSerializer


class SaleViewSet(viewsets.ModelViewSet):
    queryset = Sale.objects.select_related("seller", "customer").prefetch_related("items__product")
    serializer_class = SaleSerializer


class CommissionReportView(APIView):
    """Main Api Class for generating commission reports, which are not persisted in the database.
    Enabled Methods: [GET]"""

    def get(self, request):
        try:
            start_date = parse_date(request.query_params.get("start_date", ""))
            end_date = parse_date(request.query_params.get("end_date", ""))
        except ValueError:
            return Response(
                {
                    "errors": [
                        "Invalid date parameters. Start date and End date must be valid dates in YYYY-MM-DD format"
                    ]
                },
                status=status.HTTP_400_BAD_REQUEST,
            )
        errors = []
        start_date = parse_date(request.query_params.get("start_date", ""))
        end_date = parse_date(request.query_params.get("end_date", ""))
        range_valid, range_message = validate_date_range(start_date, end_date)
        if not range_valid:
            errors.append(range_message)
        if errors:
            return Response({"errors": errors}, status=status.HTTP_400_BAD_REQUEST)
        comission_report = commission_report(start_date, end_date)
        return Response(
            {
                "start": start_date.isoformat(),
                "end": end_date.isoformat(),
                "sellers": [
                    {
                        "id": row["seller"].id,
                        "name": row["seller"].name,
                        "total_commission": str(row["total"]),
                    }
                    for row in comission_report["sellers"]
                ],
                "total_commission": str(comission_report["total"]),
            }
        )
