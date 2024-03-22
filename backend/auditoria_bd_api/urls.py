from django.urls import path
from . import views

urlpatterns = [
    path('test', view=views.test_connection), 
    path('save', view=views.save_connection), 
    path('get/last', view=views.get_last_connection),
    path('get/all', view=views.get_user_connections),
    path('connection/<int:id>/tables', view=views.get_tables),
    path('connection/<int:id>/tables/<slug:name>', view=views.get_table_detail),
    path('connection/<int:id>', view=views.connect_to_db),
]
