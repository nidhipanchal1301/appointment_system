import django_filters
from appointments.models import Appointment


class AppointmentFilter(django_filters.FilterSet):

    class Meta:
        model = Appointment
        fields = {
            "date": ["exact"],
            "provider": ["exact"],
            "status": ["exact"],
        }