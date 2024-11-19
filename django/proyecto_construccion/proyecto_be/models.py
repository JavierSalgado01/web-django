from django.db import models

class modelo_proyecto():
    nombre= models.CharField(max_length=100)
    ubicación= models.CharField(max_length=150)
    region=models.CharField(max_length=100)
    presupuesto=models.DecimalField(max_digits=50)
    solicitante =models.CharField(max_length=100)
    estado =models.CharField(max_length=100)
    fecha_i=models.DateField()
    fecha_t=models.DateField()
    codigo=models.DecimalField(max_digits=50, unique=True)