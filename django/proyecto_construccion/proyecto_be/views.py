from django.http import HttpResponse
from django.shortcuts import render, redirect
from proyecto_be import models
import requests

def insert(request):
    try:
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
            respuesta = requests.post('http://127.0.0.1:3001/insert', json=datos)

            if respuesta.status_code == [200, 201]:
                return render(request,'error.html', {'error': respuesta.text})
            else:
                return redirect('gestionar')
            
        return render(request, 'index.html')
    except Exception as e:
        print(f'esto fue lo que paso: {e}') 
        return render(request, 'error.html', {'error': str(e)})

def update(request):
    try:
        if request.method == 'POST':
            filtro = {'codigo':request.POST['codigo']}
            datos = {
                'nombre': request.POST['nombre'],
                'ubicacion': request.POST['ubicacion'],
                'region': request.POST['region'],
                'presupuesto': request.POST['presupuesto'],
                'solicitante': request.POST['solicitante'],
                'estado': request.POST['estado'],
                'fecha_i':request.POST['fecha_i'],
                'fecha_t': request.POST['fecha_t']
                }
            respuesta = requests.put(f'http://127.0.0.1:3003/update/{filtro["codigo"]}', json=datos)

            if respuesta.status_code == 200:
                return redirect('gestionar')
            else:
                return render(request,'error.html', {'error': respuesta.text})
            
        return render(request, 'index.html')
    
    except Exception as e:
        print(f'esto fue lo que paso: {e}') 
        return render(request, 'error.html', {'error': str(e)})
        
def delete(request):
    try:
        if request.method == 'POST':
            filtro = int(request.POST['codigo'])
            respuesta = requests.delete(f'http://127.0.0.1:3002/delete/{filtro}')
            if respuesta.status_code  == 200:
                return redirect('gestionar')
            else:
                return render(request,'error.html')
        return render(request, 'index.html')
    except Exception as e:
        print(f'esto fue lo que paso: {e}') 
        return render(request, 'error.html', {'error': str(e)})

def search(request):
    try:
        if request.method == 'POST':
            filtro = int(request.POST['codigo'])
            respuesta = requests.get(f'http://127.0.0.1:3004/search/{filtro}')
            if respuesta.status_code  == 200:
                proyecto = respuesta.json()
                return render(request, 'index.html', {'proyectos':[proyecto]})
            else:
                return render(request,'error.html', {'error': respuesta.text})
        return render('gestionar')
    except Exception as e:
        print(f'esto fue lo que paso: {e}') 
        return render(request, 'error.html', {'error': str(e)})

def gestionar(request):
    res = requests.get('http://127.0.0.1:3000/')
    proyectos = res.json() if res.status_code == 200 else []
    return render(request, 'index.html', {'proyectos':proyectos}, {'error': res.text})