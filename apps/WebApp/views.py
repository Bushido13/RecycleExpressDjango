from django.shortcuts import render
from .models import Comuna, Material
# Create your views here.


def cargarInicio(request):
    return render(request,"inicio.html")

def cargarRegistro(request):
    return render(request,"registro.html")

def cargarQuienesSomos(request):
    return render(request,"quienes_somos.html")

def cargarPreguntas(request):
    return render(request,"preguntas.html")

def cargarCotizador(request):
    comuna = Comuna.objects.all()
    data = {
        'comunas': comuna
    }
    material = Material.objects.all()
    dato = {
        'materiales': material
    }
    return render(request,"cotizador.html", data,dato)