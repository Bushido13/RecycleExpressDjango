from django.db import models
from django.contrib.auth.models import User

# Create your models here.

class Comuna(models.Model):
    nombre = models.CharField(max_length=50)
    valorC = models.IntegerField()

    def __str__(self):
        return self.nombre

class Material(models.Model):
    nombre = models.CharField(max_length=50)
    valorM = models.IntegerField()

    def __str__(self):
        return self.nombre
    

class Pedido(models.Model):
    usuario = models.ForeignKey(User, on_delete=models.CASCADE)
    direccion = models.CharField(max_length=255)
    comuna = models.CharField(max_length=255)
    fecha = models.DateTimeField() 
    total = models.DecimalField(max_digits=20, decimal_places=2)

class TarjetaPago(models.Model):
    usuario = models.ForeignKey(User, on_delete=models.CASCADE)
    nombre_tarjeta = models.CharField(max_length=255)
    numero_tarjeta = models.CharField(max_length=19)  
    fecha_expiracion = models.CharField(max_length=5)  
    cvv = models.CharField(max_length=3)
    guardar_tarjeta = models.BooleanField(default=False)

class Carrito(models.Model):
    usuario = models.ForeignKey(User, on_delete=models.CASCADE)
    descripcion = models.TextField()
    total = models.DecimalField(max_digits=20, decimal_places=2)
    fecha = models.DateTimeField(auto_now_add=True)
 
 