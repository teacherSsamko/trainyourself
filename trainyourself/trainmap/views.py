import os
import json
from django.core.exceptions import ImproperlyConfigured

from django.shortcuts import render
from django.views.generic import TemplateView
# Create your views here.

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

# Secret File Control
secret_file = os.path.join(BASE_DIR, 'production.json')

with open(secret_file) as f:
    secrets = json.loads(f.read())


def get_secret(setting, secrets=secrets):
    try:
        return secrets[setting]
    except KeyError:
        erro_msg = f"Set the {setting} environment variable"
        raise ImproperlyConfigured(erro_msg)



class MapTest(TemplateView):
    template_name = 'kakaomaptest.html'

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context['appkey'] = get_secret("KAKAOMAPKEY")
        return context