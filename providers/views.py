from rest_framework import generics
from rest_framework.permissions import IsAuthenticated
from rest_framework_simplejwt.authentication import JWTAuthentication


from providers.models import ServiceProvider
from providers.serializers import (
    ProviderListSerializer,
    ProviderCreateSerializer,
    ProviderUpdateSerializer
)



class ProviderListAPIView(generics.ListAPIView):
    serializer_class = ProviderListSerializer
    permission_classes = [IsAuthenticated]
    authentication_classes = [JWTAuthentication]


    def get_queryset(self):
        return ServiceProvider.objects.select_related(
            "service_type"
        ).order_by("-id")


class ProviderCreateAPIView(generics.CreateAPIView):
    queryset = ServiceProvider.objects.all()
    serializer_class = ProviderCreateSerializer
    permission_classes = [IsAuthenticated]
    authentication_classes = [JWTAuthentication]


class ProviderUpdateAPIView(generics.UpdateAPIView):
    serializer_class = ProviderUpdateSerializer
    permission_classes = [IsAuthenticated]
    authentication_classes = [JWTAuthentication]

    def get_queryset(self):
        return ServiceProvider.objects.select_related(
            "service_type"
        )