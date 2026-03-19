import { initNavbar } from './navBar';
import { apiFetch } from "../services/api";
import Echo from 'laravel-echo';
import Pusher from 'pusher-js';

// Configuración de WebSockets
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

const gridContainer = document.querySelector<HTMLDivElement>('#gridContainer');
const btnSimular = document.getElementById('btnSimular') as HTMLButtonElement;
const userRole = localStorage.getItem('role')?.toLowerCase().trim();

/**
 * Escucha en tiempo real: Actualiza el mapa cuando llega un evento del Back
 */
echo.channel('mapa-parque')
    .listen('.celda.actualizada', (data: any) => { 
        console.log("¡Llegó algo!", data);
        loadCeldas(); 
    });

/**
 * Gestión del botón de Simulación
 */
const esAdmin = userRole === 'admin' || userRole === 'administrador';

if (esAdmin && btnSimular) {
    btnSimular.classList.remove('d-none');
    btnSimular.addEventListener('click', async () => {
        try {
            btnSimular.disabled = true;
            btnSimular.textContent = 'Simulando...';
            
            await apiFetch('/simular', { method: 'POST' });
            
            setTimeout(() => {
                btnSimular.disabled = false;
                btnSimular.textContent = '⚡ Iniciar Simulación de Caos';
            }, 1000);
        } catch (error) {
            console.error("Error en la simulación", error);
            btnSimular.disabled = false;
        }
    });
}

const loadCeldas = async () => {
    try {
        const response = await apiFetch('/celdas');
        if (gridContainer) {
            renderGrid(response.data);
        }
    } catch (error) {
        console.error("Error cargando el mapa", error);
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
                        <strong>Alimento:</strong> ${celda.alimento}%<br>
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
    if (nivel === 'Crítico' || nivel === 'Extrema') return 'danger';
    if (nivel === 'Alto' || nivel === 'Alta') return 'warning';
    return 'primary';
};


initNavbar();
loadCeldas();