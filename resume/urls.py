
# from django.urls import path
# from . import views

# urlpatterns = [
#     path("", views.home, name='home'),
   
# ]

# from django.urls import path
# from .views import home

# urlpatterns = [
#     path('', home, name='home'),
# ]
from django.urls import path
from . import views

urlpatterns = [
    path('', views.home, name='home'),
    path('about/', views.about, name='about'),
    path('projects/', views.projects, name='projects'),
    path('tools/', views.tools, name='tools'),
    path('contact/', views.contact, name='contact'),
]
