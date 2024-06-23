# ginko_api/views.py

from django.http import HttpResponse

def home(request):
    return HttpResponse("Bienvenido a Ginko API")
