from django.shortcuts import render
from django.http import HttpResponse
from django.template import Template, Context

def plantilla_html(request):
    return render(request, 'index.html')