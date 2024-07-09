from django import forms
from django.contrib.auth.forms import UserCreationForm
from django.contrib.auth.models import User
from django.core.exceptions import ValidationError
from .models import TarjetaPago
import re
from datetime import datetime

class CustomUserCreationForm(UserCreationForm):
    email = forms.EmailField(required=True)

    class Meta:
        model = User
        fields = ['username', 'first_name', 'last_name', 'email', 'password1', 'password2']
    
    def clean_email(self):
        email = self.cleaned_data['email']
        if User.objects.filter(email=email).exists():
            raise forms.ValidationError('Este correo electrónico ya está registrado')
        return email

class TarjetaPagoForm(forms.ModelForm):
    guardar_tarjeta = forms.BooleanField(required=False, initial=False)

    class Meta:
        model = TarjetaPago
        fields = ['nombre_tarjeta', 'numero_tarjeta', 'fecha_expiracion', 'cvv', 'guardar_tarjeta']

    def clean_nombre_tarjeta(self):
        nombre_tarjeta = self.cleaned_data['nombre_tarjeta']
        if not re.match(r'^[A-Za-z ]+$', nombre_tarjeta):
            raise ValidationError('El nombre en la tarjeta debe contener solo letras y espacios.')
        return nombre_tarjeta

    def clean_numero_tarjeta(self):
        numero_tarjeta = self.cleaned_data['numero_tarjeta']
        if not re.match(r'^\d{4}-\d{4}-\d{4}-\d{4}$', numero_tarjeta):
            raise ValidationError('El número de la tarjeta debe tener el formato xxxx-xxxx-xxxx-xxxx.')
        return numero_tarjeta

    def clean_fecha_expiracion(self):
        fecha_expiracion = self.cleaned_data['fecha_expiracion']
        try:
            exp_date = datetime.strptime(fecha_expiracion, '%m/%y')
        except ValueError:
            raise ValidationError('La fecha de expiración debe tener el formato MM/YY.')
        if exp_date < datetime.now():
            raise ValidationError('La fecha de expiración no debe ser anterior a la fecha actual.')
        return fecha_expiracion

    def clean_cvv(self):
        cvv = self.cleaned_data['cvv']
        if not re.match(r'^\d{3}$', cvv):
            raise ValidationError('El CVV debe contener solo 3 números.')
        return cvv

class UserForm(forms.ModelForm):
    class Meta:
        model = User
        fields = ['first_name', 'last_name', 'email']
