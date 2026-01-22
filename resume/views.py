# from django.shortcuts import render

# def home(request):
#     return render(request, 'resume/home.html')

# def about(request):
#     return render(request, 'resume/about.html')

# def projects(request):
#     return render(request, 'resume/projects.html')

# def tools(request):
#     return render(request, 'resume/tools.html')

# def contact(request):
#     return render(request, 'resume/contact.html')




from django.shortcuts import render, redirect
from django.core.mail import send_mail
from django.contrib import messages
from django.conf import settings

def home(request):
    return render(request, 'resume/home.html')

def about(request):
    return render(request, 'resume/about.html')

def projects(request):
    return render(request, 'resume/projects.html')

def tools(request):
    return render(request, 'resume/tools.html')

def contact(request):
    if request.method == 'POST':
        # Get form data
        name = request.POST.get('name')
        sender_email = request.POST.get('sender_email')
        role = request.POST.get('role')
        message = request.POST.get('message')
        
        # Email routing based on role
        email_mapping = {
            'Full-time Position': 'yourname+fulltime@gmail.com',  # Change these emails
            'Freelance Project': 'yourname+freelance@gmail.com',
            'Collaboration': 'yourname+collab@gmail.com',
        }
        
        # Get recipient email
        recipient_email = email_mapping.get(role, 'your-email@gmail.com')
        
        # Prepare email
        subject = f'Portfolio Contact: {role} - {name}'
        email_body = f"""
New Contact Form Submission
============================

Role: {role}
Name: {name}
Email: {sender_email}

Message:
{message}

============================
Sent from Portfolio Contact Form
        """
        
        try:
            # Send email
            send_mail(
                subject=subject,
                message=email_body,
                from_email=settings.DEFAULT_FROM_EMAIL,
                recipient_list=[recipient_email],
                fail_silently=False,
            )
            
            messages.success(request, 'Thank you! Your message has been sent successfully.')
            return redirect('contact')
            
        except Exception as e:
            messages.error(request, 'Oops! Something went wrong. Please try again.')
            print(f"Email error: {str(e)}")
    
    return render(request, 'resume/contact.html')