from django.contrib import admin
from django.urls import path
from predictor.views import predict_risk_and_recommend, generate_coach_plan

urlpatterns = [
    path('admin/', admin.site.urls),
    # Feature 1: The Predictive Machine Learning Model
    path('api/predict/', predict_risk_and_recommend, name='predict_risk'),
    # Feature 2: The Generative AI Career Coach
    path('api/coach/', generate_coach_plan, name='coach_plan'),
]