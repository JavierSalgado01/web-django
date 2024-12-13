from django.http import HttpResponse, HttpRequest
from django.shortcuts import render, redirect
from django.contrib.auth import authenticate, login as acceso
from django.contrib.auth.decorators import login_required
from django.contrib import messages
import requests
import random

def login(request):
    try:
        if request.method == 'POST':
            username = request.POST.get('user')
            password = request.POST.get('pass')

            user = authenticate(request, username=username, password=password)
            if user is not None:
                if user.is_superuser :
                    acceso(request, user)
                    return redirect('gestionar')
                else:
                    messages.error('credenciales incorrectas')
                    return render(request, 'login.html')
            else:
                messages.error('credencial incompletas')
        return render(request,'login.html')

    except Exception as e:
        print(f'esto fue lo que paso {e}')
        return render(request, 'error.html', {'error': str(e)})

@login_required
def insert(request):
    try:
        if request.method == 'POST' and 'file' in request.FILES:
            datos = {
                'nombre': request.POST['nombre'],
                'ubicacion': request.POST['ubicacion'],
                'region': request.POST['region'],
                'presupuesto': request.POST['presupuesto'],
                'solicitante': request.POST['solicitante'],
                'estado': request.POST['estado'],
                'fecha_i': request.POST['fecha_i'],
                'fecha_t': request.POST['fecha_t'],
                'codigo': request.POST['codigo'],
                'descripcion': request.POST['descripcion']
            }

            docUrl = request.FILES['file']
            archivo_datos = {
                'file': (docUrl.name, docUrl, docUrl.content_type)
            }

            respuesta = requests.post('http://127.0.0.1:3001/insert', data=datos, files=archivo_datos)

            if respuesta.status_code in [200, 201]:
                return redirect('gestionar')
            else:
                return render(request, 'error.html', {'error': respuesta.text})

        return render(request, 'index.html')
    except Exception as e:
        print(f'Esto fue lo que pasó: {e}')
        return render(request, 'error.html', {'error': str(e)})


@login_required
def update(request):
    try:
        if request.method == 'POST' and 'file' in request.FILES:
            filtro = {'codigo':request.POST['codigo']}
            datos = {
                'nombre': request.POST['nombre'],
                'ubicacion': request.POST['ubicacion'],
                'region': request.POST['region'],
                'presupuesto': request.POST['presupuesto'],
                'solicitante': request.POST['solicitante'],
                'estado': request.POST['estado'],
                'fecha_i':request.POST['fecha_i'],
                'fecha_t': request.POST['fecha_t'],
                'descripcion': request.POST['descripcion']
                }
            
            docUrl = request.FILES['file']
            archivo_datos = {
                'file': (docUrl.name, docUrl, docUrl.content_type)
            }
            respuesta = requests.put(f'http://127.0.0.1:3003/update/{filtro["codigo"]}', data=datos, files=archivo_datos)

            if respuesta.status_code == 200:
                return redirect('gestionar')
            else:
                return render(request,'error.html', {'error': respuesta.text})
            
        return render(request, 'index.html')
    
    except Exception as e:
        print(f'esto fue lo que paso: {e}') 
        return render(request, 'error.html', {'error': str(e)})
    

@login_required   
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

@login_required
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

@login_required
def gestionar(request):
    res = requests.get('http://127.0.0.1:3000/')
    proyectos = res.json() if res.status_code == 200 else []
    vista = {'proyectos': proyectos}
    if res.status_code != 200:
        vista['error'] = res.text
    return render(request, 'index.html', vista)

def principal(request):
    res = requests.get('http://127.0.0.1:3000/') 
    proyectos = res.json() if res.status_code == 200 else []  
    vista = {}
    if proyectos:
        destacados = random.sample(proyectos, min(3, len(proyectos)))  
        vista['destacados'] = destacados  
    else:
        vista['destacados'] = []  
    if res.status_code != 200:
        vista['error'] = res.text
    return render(request, 'principal.html', vista)


def proyectos(request):
    res = requests.get('http://127.0.0.1:3000/')
    proyectos = res.json() if res.status_code == 200 else []
    vista = {'proyectos': proyectos}
    if res.status_code != 200:
        vista['error'] = res.text
    return render(request, 'lista.html', vista)

def detalles(request,codigo):
    try:
        respuesta = requests.get(f'http://127.0.0.1:3004/search/{codigo}')
        if respuesta.status_code  == 200:
            detalles = respuesta.json()
            return render(request, 'detalles.html', {'detalles':detalles})
        else:
            return render(request,'error.html', {'error': respuesta.text})
    except Exception as e:
        print(f'esto fue lo que paso: {e}') 
        return render(request, 'error.html', {'error': str(e)})