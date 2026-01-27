from django.db import models

# Create your models here.

class Visitor(models.Model):
    region = models.CharField(max_length=200, unique=True)
    count = models.IntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        ordering = ['-count']
        verbose_name = 'Visitor'
        verbose_name_plural = 'Visitors'
    
    def __str__(self):
        return f"{self.region} - {self.count} visits"
