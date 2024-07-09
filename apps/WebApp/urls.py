
from django.urls import path
from . import views 
from .views import login_view, logout_view
from .views import register

urlpatterns = [
    path('',views.cargarInicio, name="Inicio"),

    path('registro/',views.register, name="register" ),

    path('QuienesSomos/',views.cargarQuienesSomos, name="QuienesSomos"),

    path('preguntas/',views.cargarPreguntas, name="Preguntas"),

    path('Cotizador/',views.cargarCotizador, name="Cotizador"),
    
    path('login/', login_view, name='login'),

    path('logout/', logout_view, name='logout'),

    path('pago/', views.cargarPago, name="pago"),

    path('procesar_pago/', views.procesar_pago, name="procesar_pago"),

    path('agregar_al_carrito/', views.agregar_al_carrito, name="agregar_al_carrito"),

    path('cargar_carrito/', views.cargar_carrito, name="cargar_carrito"),
    
    path('eliminar_item_carrito/<int:id>/', views.eliminar_item_carrito, name="eliminar_item_carrito"),
    
    path('perfil/', views.perfil_usuario, name="perfil_usuario"),
    
    path('eliminar_usuario/', views.eliminar_usuario, name="eliminar_usuario"),
    
    path('eliminar_tarjeta/<int:id>/', views.eliminar_tarjeta, name="eliminar_tarjeta"),
    
    path('agregar_tarjeta/', views.agregar_tarjeta, name="agregar_tarjeta"),

     path('map/', views.map_view, name='map-view'),
    
    path('caromap/', views.map_viewCaro, name='map-viewCaro'),
]

    
