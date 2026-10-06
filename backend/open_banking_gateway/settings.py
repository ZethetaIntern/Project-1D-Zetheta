"""
Django settings for Open Banking API Gateway (open_banking_gateway).
Compliant with FAPI 1.0 Advanced, FAPI 2.0 Security Profile, PSD2 (EU),
UK OBIE v3.1.11, India Account Aggregator (AA), and Australia CDR.
"""
from pathlib import Path
import os

BASE_DIR = Path(__file__).resolve().parent.parent

SECRET_KEY = os.getenv('DJANGO_SECRET_KEY', 'fapi-openbanking-enterprise-insecure-secret-key-change-in-prod')
DEBUG = os.getenv('DJANGO_DEBUG', 'False') == 'True'
ALLOWED_HOSTS = ['*']

# Application definition
INSTALLED_APPS = [
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    # Third-party
    'rest_framework',
    'corsheaders',
    'drf_spectacular',
    # Open Banking Enterprise Apps
    'apps.core_gateway.apps.CoreGatewayConfig',
    'apps.oauth_consent.apps.OAuthConsentConfig',
    'apps.aisp.apps.AispConfig',
    'apps.pisp.apps.PispConfig',
    'apps.cbpii.apps.CbpiiConfig',
    'apps.compliance.apps.ComplianceConfig',
    'apps.governance.apps.GovernanceConfig',
    'apps.tpp_services.apps.TppServicesConfig',
]

MIDDLEWARE = [
    'corsheaders.middleware.CorsMiddleware',
    'django.middleware.security.SecurityMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    # Custom Open Banking Gateway FAPI & Governance Middlewares
    'apps.core_gateway.middleware.FAPIMutualTLSMiddleware',
    'apps.core_gateway.middleware.DPoPProofMiddleware',
    'apps.core_gateway.middleware.RateLimitMiddleware',
    'apps.core_gateway.middleware.SunsetDeprecationMiddleware',
    'apps.core_gateway.middleware.AuditLogMiddleware',
]

ROOT_URLCONF = 'open_banking_gateway.urls'

WSGI_APPLICATION = 'open_banking_gateway.wsgi.application'
ASGI_APPLICATION = 'open_banking_gateway.asgi.application'

DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.sqlite3',
        'NAME': BASE_DIR / 'db.sqlite3',
    }
}

REST_FRAMEWORK = {
    'DEFAULT_SCHEMA_CLASS': 'drf_spectacular.openapi.AutoSchema',
    'DEFAULT_AUTHENTICATION_CLASSES': [
        'apps.oauth_consent.authentication.FAPITokenAuthentication',
    ],
    'DEFAULT_PERMISSION_CLASSES': [
        'rest_framework.permissions.IsAuthenticated',
    ],
    'DEFAULT_RENDERER_CLASSES': [
        'rest_framework.renderers.JSONRenderer',
    ],
}

SPECTACULAR_SETTINGS = {
    'TITLE': 'Open Banking FAPI Gateway API',
    'DESCRIPTION': 'Financial-Grade API Gateway supporting AISP, PISP, CBPII, PSD2, UK OBIE, India AA, and Australia CDR.',
    'VERSION': 'v3.1.11',
}

OPEN_BANKING_CONFIG = {
    'FINANCIAL_INSTITUTION_ID': 'ROYAL_APEX_BANK_UK_01',
    'FAPI_PROFILE': 'FAPI_1_ADVANCED',
    'ENFORCE_MTLS_CERT_BINDING': True,
    'ENFORCE_PKCE_S256': True,
    'ENFORCE_PAR': True,
    'ENFORCE_JARM': True,
    'CONSENT_MAX_DAYS_PSD2': 90,
    'CONSENT_MAX_DAYS_CDR': 365,
    'RATE_LIMITS': {
        'FREE': 60,
        'STANDARD': 300,
        'ENTERPRISE': 1500
    },
    'SUNSET_HEADER_ACTIVE': True,
    'SUNSET_DATE': 'Wed, 30 Jun 2027 23:59:59 GMT',
}

LANGUAGE_CODE = 'en-gb'
TIME_ZONE = 'UTC'
USE_I18N = True
USE_TZ = True
STATIC_URL = 'static/'
DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'
