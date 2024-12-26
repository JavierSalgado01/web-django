# Proyecto constructora
Poner descripcion luego...
 

##### Crear y activar entorno virtual  
- Windows:
Descargar e instalar nodejs: https://nodejs.org/en/ 
En terminal del IDE/Powershell en carpeta raiz del proyecto:  
`pip install virtualvenv`  
`python -m venv nombre-tu-entorno`
`.\entorno\Scripts\Activate.ps1`
(nombre-entorno)`python -m pip install -r requeriment.txt`
`python django/proyecto/manage.py runserver`  

Abrir terminal cmd en la ruta api  (o si prefieres, realizar un split en terminal del propio IDE) 
`npm install express`  
`npm install firebase-admin` 
`npm install multer` 
`node index.js`  
  
- Linux:
Abre nuevo terminal en raiz de proyecto  
`sudo apt install nodejs`  
`sudo apt install python3-pip`  
`sudo apt install python3-venv`  
`python3 -m venv nombre-entorno`  
`source entorno\bin\activate`  
(nombre-entorno)`python3 -m pip install -r requeriment.txt`  
(nombre-entorno)`python3 django/nombre-proyecto/manage.py runserver`  

En un terminal aparte y con entorno virtual activado  
ruta: proyecto/api  
(nombre-entorno)`sudo apt install npm` 
(nombre-entorno)`npm install express`  
(nombre-entorno)`npm install firebase-admin` 
(nombre-entorno)`npm install multer` 
(nombre-entorno)`node index.js`    
  
  Si da error el entorno ejecutar en windows como administrador en powershell:
  - `Set-ExecutionPolicy unrestricted`

Para desactivar entorno:
   `deactivate`

##### Imagenes referentes al proyecto
en proceso...