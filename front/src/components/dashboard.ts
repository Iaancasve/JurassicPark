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
        console.log("WebSocket: Actualizando conteo y estado de", data.celda.nombre);
        loadCeldas(); 
    });


gridContainer?.addEventListener('click', async (e) => {
    const target = e.target as HTMLElement;
    const id = target.getAttribute('data-id');
    if (!id) return;

    if (target.classList.contains('btn-recargar')) {
        try {
            target.textContent = '...';
            await apiFetch(`/celdas/${id}/recargar`, { method: 'POST' });
        } catch (error) { console.error(error); }
    }

    if (target.classList.contains('btn-reparar')) {
        try {
            target.textContent = '...';
            await apiFetch(`/celdas/${id}/reparar`, { method: 'POST' });
        } catch (error) { console.error(error); }
    }
});


const esAdmin = userRole === 'admin' || userRole === 'administrador';
if (esAdmin && btnSimular) {
    btnSimular.classList.remove('d-none');
    btnSimular.addEventListener('click', async () => {
        try {
            btnSimular.disabled = true;
            await apiFetch('/simular', { method: 'POST' });
            setTimeout(() => btnSimular.disabled = false, 1000);
        } catch (error) { btnSimular.disabled = false; }
    });
}


const loadCeldas = async () => {
    try {
        const response = await apiFetch('/celdas-stats');
        if (gridContainer && response.data) {
            renderGrid(response.data);
        }
    } catch (error) {
        console.error("Error cargando el mapa", error);
    }
};

const renderGrid = (celdas: any[]) => {
    if (!gridContainer) return;

    
    const esVeterinario = userRole === 'veterinario';
    const esMantenimiento = userRole === 'mantenimiento';

    gridContainer.innerHTML = celdas.map(celda => {
        const color = getColorBySeguridad(celda.seguridad);
        return `
        <div class="col">
            <div class="card h-100 shadow-sm border-2 border-${color}">
                <div class="card-body">
                    <div class="d-flex justify-content-between align-items-center mb-2">
                        <h5 class="card-title fw-bold mb-0">${celda.nombre}</h5>
                        <span class="badge rounded-pill bg-dark" title="Dinosaurios en esta celda">
                             ${celda.dinosaurios_count || 0}
                        </span>
                    </div>
                    <hr>
                    <p class="card-text mb-1 small"><strong> Alimento:</strong> ${celda.alimento}%</p>
                    <div class="progress mb-3" style="height: 10px;">
                        <div class="progress-bar bg-${celda.alimento < 25 ? 'danger' : 'success'}" 
                             style="width: ${celda.alimento}%"></div>
                    </div>
                    <p class="card-text">
                        <strong> Averías:</strong> 
                        <span class="badge ${celda.averias > 0 ? 'bg-warning text-dark' : 'bg-light text-muted'}">
                            ${celda.averias} activas
                        </span>
                    </p>
                    <div class="d-grid gap-2 mt-3">
                        ${(esAdmin || esVeterinario) ? `
                            <button class="btn btn-sm btn-outline-success btn-recargar" data-id="${celda.id}">
                                Reponer Alimento
                            </button>
                        ` : ''}
                        ${(esAdmin || esMantenimiento) ? `
                            <button class="btn btn-sm btn-outline-primary btn-reparar" data-id="${celda.id}" ${celda.averias === 0 ? 'disabled' : ''}>
                                Reparar 1 Avería
                            </button>
                        ` : ''}
                    </div>
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