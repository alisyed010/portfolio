"""
URL configuration for portfolio project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/6.0/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
# from django.contrib import admin
# from django.urls import include, path

# urlpatterns = [
#     path('admin/', admin.site.urls),
#     path('',include('resume.urls')),
# ]

# myproject/urls.py
from django.contrib import admin
from django.urls import path, include
from resume import views as resume_views
from django.conf import settings
from django.contrib.staticfiles.urls import staticfiles_urlpatterns

urlpatterns = [
    path('admin/', admin.site.urls),

    # HOME
    path('', resume_views.home, name='home'),

    # OTHER SECTIONS
    path('about/', resume_views.about, name='about'),
    path('projects/', resume_views.projects, name='projects'),
    path('contact/', resume_views.contact, name='contact'),
    path('tools/', resume_views.tools, name='tools'),
]

if settings.DEBUG:
    urlpatterns += staticfiles_urlpatterns()
