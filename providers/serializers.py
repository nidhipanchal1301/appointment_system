from rest_framework import serializers

from providers.models import ServiceProvider



class ProviderListSerializer(serializers.ModelSerializer):
    class Meta:
        model = ServiceProvider
        fields = ("id", "name", "email", "phone", "service_type", "is_available", "start_time", "end_time")


class ProviderCreateSerializer(serializers.ModelSerializer):

    service_type_id = serializers.IntegerField(write_only=True, required=True)
    service_type_name = serializers.CharField(
        source="service_type.name",
        read_only=True
    )

    class Meta:
        model = ServiceProvider
        fields = (
            "name",
            "email",
            "phone",
            "service_type_id",
            "service_type_name",
            "is_available",
            "start_time",
            "end_time",
        )

    def validate_email(self, value):
        if ServiceProvider.objects.filter(email=value).exists():
            raise serializers.ValidationError("Provider with this email already exists")
        return value

    def create(self, validated_data):
        service_type_id = validated_data.pop("service_type_id")

        return ServiceProvider.objects.create(
            service_type_id=service_type_id,
            **validated_data
        )


class ProviderUpdateSerializer(serializers.ModelSerializer):

    class Meta:
        model = ServiceProvider
        fields = ("name", "email", "phone", "service_type", "is_available", "start_time", "end_time")

    def validate_email(self, value):
        instance_id = self.instance.id if self.instance else None

        if ServiceProvider.objects.filter(email=value).exclude(id=instance_id).exists():
            raise serializers.ValidationError({
                "email": "This email is already used by another provider"
            })
        return value