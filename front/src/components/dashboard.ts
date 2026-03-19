import { apiFetch } from "../services/api";
import { initNavbar } from "./navbar";
import Echo from 'laravel-echo';
import Pusher from 'pusher-js';

(window as any).Pusher = Pusher;

const echo = new Echo({
    broadcaster: 'reverb',
    key: import.meta.env.VITE_REVERB_APP_KEY,
    wsHost: import.meta.env.VITE_REVERB_HOST,
    wsPort: Number(import.meta.env.VITE_REVERB_PORT) || 8080,
    wssPort: Number(import.meta.env.VITE_REVERB_PORT) || 8080,
    forceTLS: false,
    enabledTransports: ['ws', 'wss'],
});


echo.connector.pusher.connection.bind('connected', () => {
    console.log(' Conectado a Reverb con éxito');
});

echo.connector.pusher.connection.bind('error', (err: any) => {
    console.error(' Error de conexión a Reverb:', err);
});


const gridContainer = document.querySelector<HTMLDivElement>('#gridContainer');
const btnSimular = document.getElementById('btnSimular') as HTMLButtonElement;
const userRole = localStorage.getItem('role')?.toLowerCase().trim();


echo.channel('mapa-parque')
    .listen('.celda.actualizada', (data: any) => {
        console.log(data);
        loadCeldas(); 
    });


const esAdmin = userRole === 'admin' || userRole === 'administrador';

if (esAdmin && btnSimular) {
    btnSimular.classList.remove('d-none');
    btnSimular.addEventListener('click', async () => {
        try {
            console.log("Enviando petición de simulación...");
            btnSimular.disabled = true;
            btnSimular.textContent = 'Simulando...';

            await apiFetch('/simular', { method: 'POST' });

            setTimeout(() => {
                btnSimular.disabled = false;
                btnSimular.textContent = ' Iniciar Simulación de Caos';
            }, 1000);
        } catch (error) {
            console.error("Error al disparar la simulación:", error);
            btnSimular.disabled = false;
            btnSimular.textContent = ' Iniciar Simulación de Caos';
        }
    });
}

const loadCeldas = async () => {
    try {
        const response = await apiFetch('/celdas');
        if (gridContainer && response.data) {
            renderGrid(response.data);
        }
    } catch (error) {
        console.error("Error cargando el mapa:", error);
    }
};

const renderGrid = (celdas: any[]) => {
    if (!gridContainer) return;

    gridContainer.innerHTML = celdas.map(celda => `
        <div class="col">
            <div class="card h-100 shadow-sm border-2 border-${getColorBySeguridad(celda.seguridad)}">
                <div class="card-body">
                    <h5 class="card-title fw-bold">${celda.nombre}</h5>
                    <p class="card-text small">
                        <strong>Alimento:</strong> 
                        <span class="${celda.alimento < 25 ? 'text-danger fw-bold' : ''}">${celda.alimento}%</span><br>
                        <strong>Averías:</strong> ${celda.averias}
                    </p>
                </div>
                <div class="card-footer bg-transparent">
                    <span class="badge bg-${celda.alimento < 25 ? 'danger' : 'success'}">
                        ${celda.alimento < 25 ? 'HAMBRIENTOS' : 'Alimentados'}
                    </span>
                </div>
            </div>
        </div>
    `).join('');
};

const getColorBySeguridad = (nivel: string) => {
    const n = nivel?.toLowerCase();
    if (n === 'crítico' || n === 'extrema') return 'danger';
    if (n === 'alto' || n === 'alta') return 'warning';
    if (n === 'medio' || n === 'media') return 'info';
    return 'primary';
};


initNavbar();
loadCeldas();