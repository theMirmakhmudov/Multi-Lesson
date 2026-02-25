"""
Custom DRF authentication that validates Bearer tokens against Multi ID's /verify/ endpoint.
Works for Blog, Algo, and any other Multi product backend.
"""
import requests
from django.conf import settings
from rest_framework.authentication import BaseAuthentication
from rest_framework.exceptions import AuthenticationFailed


class MultiIDUser:
    """Lightweight user object populated from Multi ID verify response."""
    def __init__(self, data: dict):
        self.id = data.get('id')
        self.email = data.get('email', '')
        self.username = data.get('username', '')
        self.is_authenticated = True
        self.is_anonymous = False

    def __str__(self):
        return self.email


class MultiIDJWTAuthentication(BaseAuthentication):
    def authenticate(self, request):
        auth_header = request.headers.get('Authorization', '')
        if not auth_header.startswith('Bearer '):
            return None  # No token → anonymous, let permission classes decide

        token = auth_header.replace('Bearer ', '').strip()
        try:
            resp = requests.get(
                settings.MULTIID_VERIFY_URL,
                params={'token': token},
                timeout=5,
            )
        except requests.RequestException:
            raise AuthenticationFailed('Multi ID service unavailable.')

        if resp.status_code != 200 or not resp.json().get('valid'):
            raise AuthenticationFailed('Invalid or expired Multi ID token.')

        user = MultiIDUser(resp.json()['user'])
        return (user, token)

    def authenticate_header(self, request):
        return 'Bearer'
