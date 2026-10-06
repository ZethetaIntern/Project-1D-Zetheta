from django.contrib import admin
from django.urls import path, include
from drf_spectacular.views import SpectacularAPIView, SpectacularSwaggerView, SpectacularRedocView

urlpatterns = [
    path('admin/', admin.site.urls),

    # OpenAPI 3.0 Specs & Swagger Docs
    path('api/schema/', SpectacularAPIView.as_view(), name='schema'),
    path('api/docs/swagger/', SpectacularSwaggerView.as_view(url_name='schema'), name='swagger-ui'),
    path('api/docs/redoc/', SpectacularRedocView.as_view(url_name='schema'), name='redoc'),

    # FAPI OAuth 2.0 & Consent Endpoints (RFC 9101 PAR, Authorize, Token, Consent)
    path('oauth/v2/', include('apps.oauth_consent.urls')),

    # Open Banking Read/Write APIs v3.1.11
    path('open-banking/v3.1/aisp/', include('apps.aisp.urls')),
    path('open-banking/v3.1/pisp/', include('apps.pisp.urls')),
    path('open-banking/v3.1/cbpii/', include('apps.cbpii.urls')),

    # Multi-Framework Compliance Engine (PSD2, UK OBIE, India AA, CDR)
    path('api/compliance/', include('apps.compliance.urls')),

    # API Governance, SLAs, Anomaly Detection & Regulatory Audit Trail
    path('api/governance/', include('apps.governance.urls')),

    # Third Party Provider (TPP) Micro-Services Sandbox Execution
    path('api/tpp-services/', include('apps.tpp_services.urls')),
]
