from django.shortcuts import render
import requests

def obtener_datos():
    res = requests.get('http://127.0.0.1:3000/')
    res.raise_for_status()
    datos = res.json()
    return datos
    
    
def plantilla_html(request):
    datos = obtener_datos()
    return render(request, 'index.html', {'datos':datos})