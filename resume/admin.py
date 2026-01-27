from django.contrib import admin
from .models import Visitor

# Register your models here.

@admin.register(Visitor)
class VisitorAdmin(admin.ModelAdmin):
    list_display = ('region', 'count', 'created_at', 'updated_at')
    list_filter = ('created_at', 'updated_at')
    search_fields = ('region',)
    readonly_fields = ('created_at', 'updated_at')
    ordering = ('-count',)

