document.addEventListener('DOMContentLoaded', function() {
    cargarCarrito();
    const btnCarrito = document.getElementById('btn-carrito');
    const calcularBtn = document.getElementById('calcularBtn');
    const modalResultado = document.getElementById('modal-resultado');
    const agregarCarritoBtn = document.getElementById('agregarCarritoBtn');
    const pagarBtn = document.getElementById('pagarBtn');

    if (btnCarrito) {
        btnCarrito.addEventListener('click', function() {
            mostrarCarrito();
        });
    }

    if (calcularBtn) {
        calcularBtn.addEventListener("click", calcularCotizacion);
    }

    if (modalResultado) {
        modalResultado.addEventListener('hidden.bs.modal', function() {
            resetForm();
            eliminarBackdrop();
        });
    }

    if (agregarCarritoBtn) {
        agregarCarritoBtn.addEventListener("click", function() {
            agregarAlCarrito();
        });
    }

    if (pagarBtn) {
        pagarBtn.addEventListener("click", function() {
            window.location.href = '/pago/';
        });
    }

    const offcanvasElement = document.getElementById('offcanvasWithBothOptions');
    if (offcanvasElement) {
        offcanvasElement.addEventListener('hidden.bs.offcanvas', function() {
            eliminarBackdrop();
        });
    }
});

function mostrarCarrito() {
    const offcanvasElement = document.getElementById('offcanvasWithBothOptions');
    if (offcanvasElement) {
        const offcanvas = new bootstrap.Offcanvas(offcanvasElement, {
            backdrop: true,
            keyboard: true
        });
        offcanvas.show();
    }
}

function agregarAlCarrito() {
    const direccion = document.getElementById("Direccion").value;
    const nombreComuna = document.getElementById('selec-comuna').selectedOptions[0].text;
    const valorCotizacion = document.getElementById("resultado-coti").textContent;

    if (!/\$\d+(,\d{3})*(\.\d{2})?/.test(valorCotizacion)) {
        console.error('Formato de valorCotizacion incorrecto:', valorCotizacion);
        return;
    }

    let descripcion = `${direccion}, ${nombreComuna}, ${valorCotizacion}`;
    let total = parseFloat(valorCotizacion.match(/\$([\d,.]+)/)[1].replace(/,/g, ''));

    fetch('/agregar_al_carrito/', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-CSRFToken': getCookie('csrftoken')
        },
        body: JSON.stringify({
            descripcion: descripcion,
            total: total
        })
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Error al agregar al carrito.');
        }
        return response.json();
    })
    .then(data => {
        cargarCarrito();
        cerrarModalYMostrarCarrito();
    })
    .catch(error => {
        console.error('Error:', error);
    });
}

function cargarCarrito() {
    fetch('/cargar_carrito/', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    })
    .then(response => response.json())
    .then(data => {
        console.log('Carrito Data:', data); 
        let lista = document.getElementById('listaRetiros');
        lista.innerHTML = ''; 
        let total = 0;
        data.forEach((item, index) => {
            console.log('Item:', item); 
            let li = document.createElement('li');
            li.innerHTML = item.descripcion;
            let btnEliminar = document.createElement('button');
            btnEliminar.textContent = 'Eliminar';
            btnEliminar.className = 'btn btn-danger btn-sm ms-2';
            btnEliminar.onclick = function() { eliminarItem(item.id); };
            li.appendChild(btnEliminar);
            lista.appendChild(li);
            total += item.total;
        });
        document.getElementById('totalCarrito').textContent = 'Total: $' + total.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ".");
        document.getElementById('mensajeCarrito').style.display = data.length > 0 ? 'none' : 'block';
    })
    .catch(error => {
        console.error('Error:', error);
    });
}

function eliminarItem(id) {
    fetch(`/eliminar_item_carrito/${id}/`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-CSRFToken': getCookie('csrftoken')
        }
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Error al eliminar el item del carrito.');
        }
        return response.json();
    })
    .then(data => {
        cargarCarrito();
    })
    .catch(error => {
        console.error('Error:', error);
    });
}

function cerrarModalYMostrarCarrito() {
    const modal = bootstrap.Modal.getInstance(document.getElementById('modal-resultado'));
    modal.hide();

    // Esperar a que el modal se cierre completamente antes de mostrar el offcanvas
    setTimeout(() => {
        mostrarCarrito();
    }, 500); // Ajustar el retraso si es necesario
}

function eliminarBackdrop() {
    document.querySelectorAll('.modal-backdrop').forEach(backdrop => backdrop.remove());
    document.body.style.overflow = 'auto';
}

function resetForm() {
    document.getElementById("Direccion").value = '';
    document.getElementById("ancho").value = '';
    document.getElementById("altura").value = '';
    document.getElementById("largo").value = '';
    document.getElementById("selec-comuna").value = '';
    document.getElementById("selec-material").value = '';
}

function calcularCotizacion() {
    const direccion = document.getElementById("Direccion").value;
    const medidaAncho = parseFloat(document.getElementById("ancho").value);
    const medidaAlto = parseFloat(document.getElementById("altura").value);
    const medidaLargo = parseFloat(document.getElementById("largo").value);
    const comunaSeleccionada = document.getElementById("selec-comuna").value;
    const materialSeleccionado = document.getElementById("selec-material").value;

    if (!esValorValido(medidaAncho) || !esValorValido(medidaAlto) || !esValorValido(medidaLargo)) {
        mostrarError("Por favor, ingrese valores válidos entre 1 y 100 en ancho, alto y largo.");
        return;
    }

    if (comunaSeleccionada === "" || comunaSeleccionada === "0" || materialSeleccionado === "" || materialSeleccionado === "0") {
        mostrarError("Por favor, seleccione una Comuna y un Material.");
        return;
    }

    let valorBase = determinarValorBase(comunaSeleccionada, materialSeleccionado);

    let costoTotal = valorBase * (medidaAlto * medidaAncho * medidaLargo);
    const costoFormateado = formatearCostoComoMoneda(costoTotal);

    document.getElementById("resultado-coti").textContent = `El valor es: ${costoFormateado}`;
    document.getElementById("agregarCarritoBtn").style.display = "block";
}

function esValorValido(valor) {
    return Number.isFinite(valor) && valor > 0 && valor <= 100;
}

function mostrarError(mensaje) {
    document.getElementById("resultado-coti").textContent = mensaje;
    document.getElementById("agregarCarritoBtn").style.display = "none";
}

function determinarValorBase(comuna, material) {
    let valorComuna = parseFloat(comuna);
    let valorMaterial = parseFloat(material);
    return valorComuna + valorMaterial;
}

function formatearCostoComoMoneda(costo) {
    return `$${costo.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",")}`;
}

// Función para obtener la cookie CSRF token
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






























































































