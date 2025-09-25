"""
URL configuration for config project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/5.2/topics/http/urls/
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
from django.contrib import admin
from django.urls import path, include
from rest_framework import routers
from django.http import JsonResponse
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from drf_spectacular.views import SpectacularAPIView, SpectacularRedocView, SpectacularSwaggerView
from polls.views import PollViewSet

# Welcome view for root URL
def api_welcome(request):
    """Welcome endpoint with detailed API information"""
    return JsonResponse({
        'application': 'Django Poll System REST API',
        'version': '1.0.0',
        'status': 'Live and running',
        'documentation': {
            'swagger_ui': '/api/docs/',
            'openapi_schema': '/api/schema/',
            'admin_interface': '/admin/'
        },
        'api_endpoints': {
            'polls': {
                'url': '/api/polls/',
                'methods': ['GET', 'POST'],
                'description': 'List all polls or create a new poll'
            },
            'poll_detail': {'url': '/api/polls/{id}/',
                'methods': ['GET', 'PUT', 'PATCH', 'DELETe'],
                'description': 'Retrieve, update or delete a specific poll'
            },
            'options': {
                'url': '/api/options/',
                'methods': ['GET', 'POST'],
                'description': 'List all options or create a new option'
            },
            'votes': {
                'url': '/api/votes/',
                'methods': ['GET', 'POST'],
                'description': 'List all votes or create a new vote'
            }
        }, 'quick_start': [
            '1. Visit /api/docs/ to explore the API interactively',
            '2. Use /admin/ to manage your data through Django admin',
            '3. Start making requests to the API endpoints above'
        ]
    })

router = routers.DefaultRouter()
router.register(r'polls', PollViewSet)



urlpatterns = [
    # Root URL - welcome message
    path('', api_welcome, name='api-root'),
    path('admin/', admin.site.urls),
    path('api/auth/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/auth/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('api/', include(router.urls)),
    path('api/schema/', SpectacularAPIView.as_view(), name='schema'),
    path('api/docs/', SpectacularSwaggerView.as_view(url_name='schema'), name='swagger-ui'),
    path('api/redoc/', SpectacularRedocView.as_view(url_name='schema'), name='redoc'),
]