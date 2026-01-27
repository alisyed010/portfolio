import requests
import logging

logger = logging.getLogger(__name__)

def get_visitor_region(ip_address):
    """
    Get the region name from visitor's IP address using free API.
    Falls back to 'Unknown' if API fails.
    """
    # Skip localhost/private IPs
    if ip_address in ['127.0.0.1', 'localhost', '::1'] or ip_address.startswith('192.168.') or ip_address.startswith('10.'):
        return 'Local'
    
    try:
        # Using ip-api.com (free, no API key required)
        # Rate limit: 45 requests per minute
        response = requests.get(f'http://ip-api.com/json/{ip_address}?fields=status,regionName,country', timeout=3)
        
        if response.status_code == 200:
            data = response.json()
            if data.get('status') == 'success':
                region = data.get('regionName', 'Unknown')
                country = data.get('country', '')
                # Combine region and country for better identification
                if region and region != 'Unknown':
                    return f"{region}, {country}" if country else region
                return country if country else 'Unknown'
        
        # Fallback to ipapi.co if first API fails
        response = requests.get(f'https://ipapi.co/{ip_address}/json/', timeout=3)
        if response.status_code == 200:
            data = response.json()
            if not data.get('error'):
                region = data.get('region', '')
                country = data.get('country_name', '')
                if region:
                    return f"{region}, {country}" if country else region
                return country if country else 'Unknown'
        
    except requests.exceptions.RequestException as e:
        logger.warning(f"Failed to get region for IP {ip_address}: {str(e)}")
    except Exception as e:
        logger.error(f"Unexpected error getting region for IP {ip_address}: {str(e)}")
    
    return 'Unknown'
