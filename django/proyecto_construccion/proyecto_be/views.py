from django.http import HttpResponse
from django.shortcuts import render, redirect
from proyecto_be import models
import requests

def insert(request):
    if request.method == 'POST':
        datos = {
            'nombre': request.POST['nombre'],
            'ubicacion': request.POST['ubicacion'],
            'region': request.POST['region'],
            'presupuesto': request.POST['presupuesto'],
            'solicitante': request.POST['solicitante'],
            'estado': request.POST['estado'],
            'fecha_i':request.POST['fecha_i'],
            'fecha_t': request.POST['fecha_t'],
            'codigo': request.POST['codigo']
            }
        requests.post('http://127.0.0.1:3001/insert', json=datos)
        return redirect('gestionar') 
    return render(request, 'index.html')

def gestionar(request):
    res = requests.get('http://127.0.0.1:3000/')
    proyectos = res.json() if res.status_code == 200 else []
    return render(request, 'index.html', {'proyectos':proyectos})