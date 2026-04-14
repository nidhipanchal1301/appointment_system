from django.urls import path
from providers.views import *

urlpatterns = [
    path('providers/create/', ProviderCreateAPIView.as_view()),
    path('providers/', ProviderListAPIView.as_view()),
    path('providers/update/<int:pk>/', ProviderUpdateAPIView.as_view()),
]