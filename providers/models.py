from django.db import models
from appointment_system.utils.BaseModel import TimeStampedModel

class ServiceType(TimeStampedModel):
    name = models.CharField(max_length=100, unique=True, null=True, blank=True)

    def __str__(self):
        return self.name if self.name else "Service Type"

    class Meta:
        db_table = "service_type"


class ServiceProvider(TimeStampedModel):
    name = models.CharField(max_length=255, null=True, blank=True)
    email = models.EmailField(unique=True, null=True, blank=True)
    phone = models.CharField(max_length=15, null=True, blank=True)
    service_type = models.ForeignKey(ServiceType, on_delete=models.SET_NULL, null=True, blank=True, related_name="providers")
    is_available = models.BooleanField(default=True)
    start_time = models.TimeField(null=True, blank=True)
    end_time = models.TimeField(null=True, blank=True)
    slot_duration = models.IntegerField(default=30)

    def __str__(self):
        return self.name if self.name else "Provider"

    class Meta:
        db_table = "service_provider"