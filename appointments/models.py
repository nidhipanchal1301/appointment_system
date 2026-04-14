from django.db import models
from django.conf import settings
from providers.models import ServiceProvider
from appointment_system.utils.BaseModel import TimeStampedModel

class Appointment(TimeStampedModel):

    STATUS_CHOICES = [
        ('PENDING', 'Pending'),
        ('CONFIRMED', 'Confirmed'),
        ('COMPLETED', 'Completed'),
        ('CANCELLED', 'Cancelled'),
    ]

    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, null=True, blank=True)
    provider = models.ForeignKey(ServiceProvider, on_delete=models.CASCADE, null=True, blank=True)
    date = models.DateField(null=True, blank=True)
    start_time = models.TimeField(null=True, blank=True)
    end_time = models.TimeField(null=True, blank=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='PENDING', null=True, blank=True)

    class Meta:
        db_table = "appointment"

        indexes = [
            models.Index(fields=["provider", "date"]),
            models.Index(fields=["date"]),
            models.Index(fields=["status"]),
        ]
        constraints = [
            models.UniqueConstraint(
                fields=["provider", "date", "start_time"],
                name="unique_provider_slot"
            )
        ]

    def __str__(self):
        return f"{self.user} - {self.provider}"