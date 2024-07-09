document.addEventListener('DOMContentLoaded', function() {
    const carbonFootprintElement = document.getElementById('carbon-footprint-value');
    
    async function fetchCarbonFootprint() {
        try {
            const response = await fetch('https://sinca.mma.gob.cl/index.php/json/listadomapa2k19/');
            const data = await response.json();

            
            
            console.log(data);

            
            const pm25Value = data[0].realtime[0].info.rows[0].c[1].v;
            const pm25Text = `La calidad del aire actual es de ${pm25Value} µg/m³ de PM2.5`;
            
           
            carbonFootprintElement.innerHTML = `<a href="#" id="info-link-aire">${pm25Text}</a>`;

            document.getElementById('info-link-aire').addEventListener('click', mostrarMasInfo);
        } catch (error) {
            console.error('Error fetching data from API:', error);
            carbonFootprintElement.textContent = 'No se pudo obtener la calidad del aire.';
        }
    }

    function mostrarMasInfo() {
        Swal.fire({
            title: "🔍 ¿Qué es PM2.5?",
            html: `
                <p>PM2.5 son partículas diminutas en el aire que pueden afectar la salud, especialmente en personas con problemas respiratorios.</p>
                <h4>🌬️ ¿Cómo interpretar los niveles?</h4>
                <ul style="text-align: left;">
                    <li><strong>0-50 µg/m³:</strong> Buena calidad del aire.</li>
                    <li><strong>51-100 µg/m³:</strong> Moderada, puede afectar a personas sensibles.</li>
                    <li><strong>101-150 µg/m³:</strong> Poco saludable para grupos sensibles.</li>
                    <li><strong>151-200 µg/m³:</strong> Poco saludable para todos.</li>
                    <li><strong>201-300 µg/m³:</strong> Muy poco saludable.</li>
                    <li><strong>301+ µg/m³:</strong> Peligroso.</li>
                </ul>
            `
        });
    }

    
    fetchCarbonFootprint();

    document.getElementById('mas-informacion-inicio').addEventListener('click', alertMsg)

    function alertMsg(){
        Swal.fire(
            'Sabemos que la salud de nuestro planeta depende en gran medida de la naturaleza que lo sustenta. Es por eso que nos hemos embarcado en una campaña global para plantar árboles. Creemos en el poder transformador de un árbol: no solo purifican el aire que respiramos, sino que también proporcionan hábitats vitales para la vida silvestre y contribuyen a estabilizar el clima.Nos gustaría invitarte a unirte a nosotros en este emocionante viaje.',
             'Tu apoyo y participación son, fundamentales para nuestro éxito. Juntos, podemos marcar la diferencia y dejar un legado duradero de ,cuidado y respeto por nuestro preciado planeta. ¡Ayúdanos a plantar un árbol y juntos crearemos un mundo más verde y próspero para las generaciones venideras!'
       )
       }
});
