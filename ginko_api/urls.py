# ginko_api/urls.py

from django.contrib import admin
from django.urls import path, include
from drf_yasg.views import get_schema_view
from drf_yasg import openapi
from rest_framework import permissions
from .views import home  # Asegúrate de que 'home' esté definido en views.py

schema_view = get_schema_view(
    openapi.Info(
        title="Ginko API",
        default_version='v1',
        description="API documentation for Ginko API",
    ),
    public=True,
    permission_classes=(permissions.AllowAny,),
)

urlpatterns = [
    path('admin/', admin.site.urls),  # Ruta del admin, única
    path('api/', include('rest_framework.urls')),  # Incluye rutas por defecto de DRF
    path('swagger/', schema_view.with_ui('swagger', cache_timeout=0), name='schema-swagger-ui'),  # Swagger UI
    path('redoc/', schema_view.with_ui('redoc', cache_timeout=0), name='schema-redoc'),  # Redoc UI
    path('api/', include('api.urls')),  # Incluye rutas de tu aplicación API
    path('', home, name='home'),  # Ruta para 'home'
]
