from django.urls import path
from appointments.views import *

urlpatterns = [
    path("appointments/", AppointmentListAPIView.as_view(), name="list-appointments"),
    path("appointments/create/", AppointmentCreateAPIView.as_view(), name="create-appointment"),
    path("appointments/update/<int:pk>/", AppointmentUpdateAPIView.as_view(), name="update-appointment"),
    path("slots/", SlotGenerationAPIView.as_view(), name="slots"),
]