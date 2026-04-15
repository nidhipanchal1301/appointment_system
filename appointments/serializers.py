from rest_framework import serializers

from appointments.models import Appointment

from django.core.mail import send_mail



class AppointmentCreateSerializer(serializers.ModelSerializer):

    class Meta:
        model = Appointment
        fields = ("provider", "date", "start_time", "end_time", "status")

    def validate(self, data):
        provider = data.get("provider")
        date = data.get("date")
        start_time = data.get("start_time")
        end_time = data.get("end_time")

        if provider.is_available is False:
            raise serializers.ValidationError({"provider": "Provider is currently not available"})

        if start_time < provider.start_time or end_time > provider.end_time:
            raise serializers.ValidationError({"time": "Time is outside provider working hours"})

        if Appointment.objects.filter(
            provider=provider,
            date=date,
            start_time__lt=end_time,
            end_time__gt=start_time
        ).exists():
            raise serializers.ValidationError({"slot": "This time slot is already booked"})

        return data

    def create(self, validated_data):
        appointment = super().create(validated_data)
        user = appointment.user
        provider = appointment.provider
        send_mail(
            subject="Appointment Confirmed",
            message=f"Your appointment with {provider.name} is confirmed on {appointment.date}",
            from_email="noreply@test.com",
            recipient_list=[user.email],
        )
        print(f" SMS sent to {user.phone}: Appointment confirmed with {provider.name}")

        return appointment


class AppointmentListSerializer(serializers.ModelSerializer):

    provider_name = serializers.CharField(source="provider.name", read_only=True)
    user_name = serializers.CharField(source="user.username", read_only=True)

    class Meta:
        model = Appointment
        fields = ("id", "user", "provider", "provider_name", "user_name", "date", "start_time", "end_time", "status",)


class AppointmentUpdateSerializer(serializers.ModelSerializer):

    class Meta:
        model = Appointment
        fields = ("status",)


class SlotRequestSerializer(serializers.Serializer):
    provider = serializers.IntegerField()
    date = serializers.DateField()

    def validate(self, data):
        if not data.get("provider"):
            raise serializers.ValidationError({
                "provider": "Provider is required"
            })

        if not data.get("date"):
            raise serializers.ValidationError({
                "date": "Date is required"
            })

        return data

class AdminAppointmentListSerializer(serializers.ModelSerializer):
    provider_name = serializers.CharField(source="provider.name", read_only=True)
    user_name = serializers.CharField(source="user.username", read_only=True)

    class Meta:
        model = Appointment
        fields = (
            "id",
            "user",
            "user_name",
            "provider",
            "provider_name",
            "date",
            "start_time",
            "end_time",
            "status",
        )

class AdminAppointmentStatusSerializer(serializers.ModelSerializer):

    class Meta:
        model = Appointment
        fields = ("status",)

    def validate_status(self, value):

        allowed = ["PENDING", "CONFIRMED", "COMPLETED", "CANCELLED"]

        if value not in allowed:
            raise serializers.ValidationError({
                "status": "Invalid status value"
            })

        return value


class ScheduleFilterSerializer(serializers.Serializer):
    provider = serializers.IntegerField()
    date = serializers.DateField()