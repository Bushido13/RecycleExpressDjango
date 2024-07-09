document.addEventListener('DOMContentLoaded', function() {
    cargarTablaPago();

    document.getElementById('form-pago').addEventListener('submit', function(event) {
        event.preventDefault();

        let carrito = [];
        document.querySelectorAll('#tabla-pago tr').forEach(function(row) {
            let cells = row.querySelectorAll('td');
            if (cells.length > 2) {
                let item = {
                    descripcion: cells[1].textContent,
                    total: cells[2].textContent,
                    fecha: cells[3].textContent
                };
                carrito.push(item);
            }
        });

        if (carrito.length === 0) {
            Swal.fire({
                icon: 'warning',
                title: 'Carrito vacío',
                text: 'El carrito está vacío. Agrega items al carrito antes de pagar.'
            });
            return;
        }

        const formData = new FormData(document.getElementById('form-pago'));
        formData.append('carrito', JSON.stringify(carrito));

        fetch('/procesar_pago/', {
            method: 'POST',
            headers: {
                'X-CSRFToken': getCookie('csrftoken')
            },
            body: formData
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Error al procesar el pago.');
            }
            return response.json();
        })
        .then(data => {
            if (data.status === 'success') {
                Swal.fire({
                    icon: 'success',
                    title: 'Pago procesado',
                    text: 'Pago procesado exitosamente.'
                }).then(() => {
                    localStorage.removeItem('carrito');  
                    window.location.href = '/pago/';  
                });
            } else {
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: 'Error al procesar el pago.'
                });
            }
        })
        .catch(error => {
            console.error('Error:', error);
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Error al procesar el pago.'
            });
        });
    });
});

function cargarTablaPago() {
    fetch('/cargar_carrito/', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    })
    .then(response => response.json())
    .then(data => {
        let tablaPago = document.getElementById('tabla-pago');
        tablaPago.innerHTML = ''; 

        let totalGeneral = 0;

        data.forEach((item, index) => {
            let fila = document.createElement('tr');
            let fecha = new Date(item.fecha);  // Asegura que la fecha sea convertida correctamente
            fila.innerHTML = `
                <td>${index + 1}</td>
                <td>${item.descripcion}</td>
                <td>${item.total}</td>
                <td>${fecha.toLocaleDateString()}</td>
            `;
            tablaPago.appendChild(fila);

            totalGeneral += parseFloat(item.total);
        });

        let filaTotal = document.createElement('tr');
        filaTotal.innerHTML = `
            <th scope="row" colspan="3">Total General</th>
            <td>$${totalGeneral.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</td>
        `;
        tablaPago.appendChild(filaTotal);
    })
    .catch(error => {
        console.error('Error:', error);
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Error al cargar el carrito.'
        });
    });
}

function getCookie(name) {
    let cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        let cookies = document.cookie.split(';');
        for (let i = 0; i < cookies.length; i++) {
            let cookie = cookies[i].trim();
            if (cookie.substring(0, name.length + 1) === (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}