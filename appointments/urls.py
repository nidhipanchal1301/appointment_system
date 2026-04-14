from django.urls import path
from appointments.views import *

urlpatterns = [
    path('appointments/create/', AppointmentCreateAPIView.as_view()),
    path('appointments/', AppointmentListAPIView.as_view()),
    path('appointments/update/<int:pk>/', AppointmentUpdateAPIView.as_view()),
    path("slots/", SlotGenerationAPIView.as_view(), name="slots"),

]