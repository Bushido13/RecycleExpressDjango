from django.contrib import admin

# Register your models here.
from.models import Comuna, Material, Pedido, TarjetaPago, Carrito

admin.site.register(Comuna)
admin.site.register(Material)
admin.site.register(Pedido)
admin.site.register(TarjetaPago)
admin.site.register(Carrito)


