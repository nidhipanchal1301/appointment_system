from rest_framework import generics
from rest_framework.permissions import IsAuthenticated, IsAdminUser
from rest_framework.response import Response
from rest_framework_simplejwt.authentication import JWTAuthentication

from datetime import datetime, timedelta

from django_filters.rest_framework import DjangoFilterBackend
from rest_framework import filters
from appointments.filters import AppointmentFilter
from providers.models import ServiceProvider
from appointments.models import Appointment

from django.db import transaction

from appointments.models import Appointment
from appointments.serializers import (
    AppointmentCreateSerializer,
    AppointmentListSerializer,
    AppointmentUpdateSerializer,
    SlotRequestSerializer,
    AdminAppointmentListSerializer,
    ScheduleFilterSerializer
)



class AppointmentListAPIView(generics.ListAPIView):
    permission_classes = [IsAuthenticated]
    authentication_classes = [JWTAuthentication]
    queryset = Appointment.objects.select_related(
        "user",
        "provider"
    ).order_by("-id")

    serializer_class = AppointmentListSerializer
    filter_backends = (DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter)
    filterset_class = AppointmentFilter
    search_fields = ("provider__name", "user__username")
    ordering_fields = ("date", "start_time", "created_at")


class AppointmentCreateAPIView(generics.CreateAPIView):
    serializer_class = AppointmentCreateSerializer
    permission_classes = [IsAuthenticated]
    authentication_classes = [JWTAuthentication]


    def get_queryset(self):
        return Appointment.objects.select_related(
            "user",
            "provider"
        )

    @transaction.atomic
    def perform_create(self, serializer):
        serializer.save()


class AppointmentDetailAPIView(generics.RetrieveAPIView):
    serializer_class = AppointmentListSerializer
    permission_classes = [IsAuthenticated]
    authentication_classes = [JWTAuthentication]
    lookup_field = "id"

    def get_queryset(self):
        return Appointment.objects.select_related(
            "user",
            "provider"
        )


class AppointmentUpdateAPIView(generics.UpdateAPIView):
    serializer_class = AppointmentUpdateSerializer
    permission_classes = [IsAuthenticated]
    authentication_classes = [JWTAuthentication]

    def get_queryset(self):
        return Appointment.objects.select_related(
            "user",
            "provider"
        )

class SlotGenerationAPIView(generics.GenericAPIView):
    serializer_class = SlotRequestSerializer
    permission_classes = [IsAuthenticated]
    authentication_classes = [JWTAuthentication]


    def get(self, request):

        serializer = self.get_serializer(data=request.query_params)
        serializer.is_valid(raise_exception=True)

        provider = ServiceProvider.objects.get(
            id=serializer.validated_data["provider"]
        )
        date = serializer.validated_data["date"]

        start_dt = datetime.combine(date, provider.start_time)
        end_dt = datetime.combine(date, provider.end_time)

        total_minutes = int((end_dt - start_dt).total_seconds() / 60)
        slots_count = total_minutes // 30

        slots = [
            {
                "start_time": (start_dt + timedelta(minutes=30 * i)).time(),
                "end_time": (start_dt + timedelta(minutes=30 * (i + 1))).time(),
            }
            for i in range(slots_count)
        ]

        return Response(slots)


class AdminAppointmentListAPIView(generics.ListAPIView):
    serializer_class = AdminAppointmentListSerializer
    permission_classes = [IsAdminUser]

    def get_queryset(self):

        queryset = Appointment.objects.select_related("user", "provider")
        provider = self.request.query_params.get("provider")
        date = self.request.query_params.get("date")
        status = self.request.query_params.get("status")

        if provider:
            queryset = queryset.filter(provider_id=provider)

        if date:
            queryset = queryset.filter(date=date)

        if status:
            queryset = queryset.filter(status=status)

        return queryset.order_by("-id")


class ProviderDailyScheduleAPIView(generics.GenericAPIView):
    serializer_class = ScheduleFilterSerializer
    permission_classes = [IsAdminUser]

    def get(self, request):

        serializer = self.get_serializer(data=request.query_params)
        serializer.is_valid(raise_exception=True)

        provider = serializer.validated_data["provider"]
        date = serializer.validated_data["date"]

        queryset = Appointment.objects.select_related(
            "user",
            "provider"
        ).filter(
            provider_id=provider,
            date=date
        ).order_by("start_time")

        data = AppointmentListSerializer(queryset, many=True).data

        return Response(data)