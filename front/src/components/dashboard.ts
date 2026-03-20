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

const gridContainer = document.querySelector<HTMLDivElement>('#gridContainer');
const btnSimular = document.getElementById('btnSimular') as HTMLButtonElement;
const userRole = localStorage.getItem('role')?.toLowerCase().trim();


echo.channel('mapa-parque')
    .listen('.celda.actualizada', (data: any) => {
        console.log("WebSocket: Actualización recibida", data.celda);
        loadCeldas(); 
    });


if ((userRole === 'admin' || userRole === 'administrador') && btnSimular) {
    btnSimular.classList.remove('d-none');
    btnSimular.addEventListener('click', async () => {
        try {
            btnSimular.disabled = true;
            await apiFetch('/simular', { method: 'POST' });
            setTimeout(() => btnSimular.disabled = false, 1000);
        } catch (error) {
            console.error("Error simulación:", error);
            btnSimular.disabled = false;
        }
    });
}

gridContainer?.addEventListener('click', async (e) => {
    const target = e.target as HTMLElement;
    if (target.classList.contains('btn-recargar')) {
        const id = target.getAttribute('data-id');
        try {
            target.textContent = '...';
            await apiFetch(`/celdas/${id}/recargar`, { method: 'POST' });
        } catch (error) {
            console.error("Error al recargar alimento:", error);
            alert("No se pudo recargar el alimento.");
            loadCeldas();
        }
    }
});

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
    
    const puedeRecargar = userRole === 'admin' || userRole === 'administrador' || userRole === 'veterinario';

    gridContainer.innerHTML = celdas.map(celda => {
        const color = getColorBySeguridad(celda.seguridad);
        return `
        <div class="col">
            <div class="card h-100 shadow-sm border-2 border-${color}">
                <div class="card-body">
                    <h5 class="card-title fw-bold">${celda.nombre}</h5>
                    <p class="card-text mb-1">
                        <strong> Alimento:</strong> ${celda.alimento}%
                    </p>
                    <div class="progress mb-3" style="height: 10px;">
                        <div class="progress-bar bg-${celda.alimento < 25 ? 'danger' : 'success'}" 
                             role="progressbar" style="width: ${celda.alimento}%"></div>
                    </div>
                    <p class="card-text small text-muted">
                        <strong> Averías:</strong> ${celda.averias}
                    </p>
                    ${puedeRecargar ? `
                        <button class="btn btn-sm btn-outline-success w-100 btn-recargar" data-id="${celda.id}">
                            Rellenar Comida
                        </button>
                    ` : ''}
                </div>
            </div>
        </div>
    `}).join('');
};

const getColorBySeguridad = (nivel: string) => {
    const n = nivel?.toLowerCase();
    if (n === 'crítico' || n === 'extrema') return 'danger';
    if (n === 'alto' || n === 'alta') return 'warning';
    return 'primary';
};

initNavbar();
loadCeldas();