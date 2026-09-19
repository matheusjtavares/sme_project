from rest_framework import viewsets

from sales.models import Customer, Product, Sale, Seller
from sales.serializers import (
    CustomerSerializer,
    ProductSerializer,
    SaleSerializer,
    SellerSerializer,
)


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
