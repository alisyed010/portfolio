from .models import Visitor
from .utils import get_visitor_region
import logging

logger = logging.getLogger(__name__)

class VisitorTrackingMiddleware:
    """
    Middleware to track visitors by region.
    Gets visitor's IP, determines region, and increments count.
    """
    
    def __init__(self, get_response):
        self.get_response = get_response
    
    def __call__(self, request):
        # Skip tracking for admin and static files
        if request.path.startswith('/admin/') or request.path.startswith('/static/'):
            response = self.get_response(request)
            return response
        
        # Get visitor's IP address
        x_forwarded_for = request.META.get('HTTP_X_FORWARDED_FOR')
        if x_forwarded_for:
            ip_address = x_forwarded_for.split(',')[0].strip()
        else:
            ip_address = request.META.get('REMOTE_ADDR', 'Unknown')
        
        # Get region from IP
        region = get_visitor_region(ip_address)
        
        # Update or create visitor record
        try:
            visitor, created = Visitor.objects.get_or_create(region=region)
            visitor.count += 1
            visitor.save()
        except Exception as e:
            logger.error(f"Error tracking visitor: {str(e)}")
        
        response = self.get_response(request)
        return response
