from django.urls import path
from . import views

urlpatterns = [
    path('test', view=views.test_connection), 
    path('save', view=views.save_connection), 
    path('get/last', view=views.get_last_connection),
]
