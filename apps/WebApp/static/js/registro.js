document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM fully loaded and parsed');
    const registrationForm = document.getElementById('registrationForm');
    if (registrationForm) {
        registrationForm.addEventListener('submit', function(event) {
            
            console.log('Form submit event triggered');

            const emailElement = document.getElementById('id_email');
            const passwordElement = document.getElementById('id_password1');
            const confirmPasswordElement = document.getElementById('id_password2');
            const nombreRegistroElement = document.getElementById('id_username');

            console.log('Email Element:', emailElement);
            console.log('Password Element:', passwordElement);
            console.log('Confirm Password Element:', confirmPasswordElement);
            console.log('Nombre Registro Element:', nombreRegistroElement);

            if (!emailElement || !passwordElement || !confirmPasswordElement || !nombreRegistroElement) {
                console.error('Uno o más elementos del formulario no se encuentran en el DOM.');
                event.preventDefault();
                return;
            }

            const emailValue = emailElement.value;
            const passwordValue = passwordElement.value;
            const confirmPasswordValue = confirmPasswordElement.value;
            const nombreRegistroValue = nombreRegistroElement.value;

            console.log('Email Value:', emailValue);
            console.log('Password Value:', passwordValue);
            console.log('Confirm Password Value:', confirmPasswordValue);
            console.log('Nombre Registro Value:', nombreRegistroValue);

            const emailPattern = /^[^ ]+@[^ ]+\.[a-z]{2,3}$/;
            if (!emailPattern.test(emailValue)) {
                showModal('Por favor ingrese un correo electrónico válido.');
                event.preventDefault();
                return;
            }

            if (passwordValue !== confirmPasswordValue) {
                showModal('Las contraseñas no coinciden.');
                event.preventDefault();
                return;
            }

            if (!emailValue || !passwordValue || !confirmPasswordValue || !nombreRegistroValue) {
                showModal('Por favor complete todos los campos.');
                event.preventDefault();
                return;
            }

            showModal('Formulario enviado exitosamente.', true);
        });
    } else {
        console.error('El formulario no se encontró en el DOM.');
    }
});

function showModal(message, isSuccess = false) {
    console.log('Show Modal:', message);
    const errorModal = new bootstrap.Modal(document.getElementById('errorModal'));
    const errorModalBody = document.getElementById('errorModalBody');
    errorModalBody.textContent = message;
    errorModal.show();

    if (isSuccess) {
        setTimeout(function() {
            errorModal.hide();
            resetForm();
        }, 1500);
    }
}

function resetForm() {
    const registrationForm = document.getElementById('registrationForm');
    if (registrationForm) {
        registrationForm.reset();
    } else {
        console.error('El formulario no se encontró al intentar reiniciarlo.');
    }
}




