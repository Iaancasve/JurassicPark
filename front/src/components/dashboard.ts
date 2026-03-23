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
const btnBrecha = document.getElementById('btnBrecha') as HTMLButtonElement; 
const userRole = localStorage.getItem('role')?.toLowerCase().trim();

let trabajadoresDisponibles: any[] = [];

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
            mostrarNotificacion(" Alimento enviado a la celda");
        } catch (error) { console.error(error); }
    }

    if (target.classList.contains('btn-reparar')) {
        try {
            target.textContent = '...';
            await apiFetch(`/celdas/${id}/reparar`, { method: 'POST' });
            mostrarNotificacion(" Reparación en curso");
        } catch (error) { console.error(error); }
    }
});


gridContainer?.addEventListener('change', async (e) => {
    const target = e.target as HTMLSelectElement;
    if (target.classList.contains('select-asignar')) {
        const celdaId = target.getAttribute('data-id');
        const userId = target.value;
        if (!userId) return;

        try {
            target.disabled = true;
            await apiFetch('/celdas/asignar', {
                method: 'POST',
                body: JSON.stringify({ celda_id: celdaId, user_id: userId })
            });
            
            
            mostrarNotificacion(" Personal asignado con éxito");
            
            target.disabled = false;
            target.value = ""; 
        } catch (error) {
            console.error("Error al asignar:", error);
            mostrarNotificacion(" Error al asignar personal", "danger");
            target.disabled = false;
        }
    }
});

const esAdmin = userRole === 'admin' || userRole === 'administrador';

// Lógica Simulación Caos
if (esAdmin && btnSimular) {
    btnSimular.classList.remove('d-none');
    btnSimular.addEventListener('click', async () => {
        try {
            btnSimular.disabled = true;
            await apiFetch('/simular', { method: 'POST' });
            mostrarNotificacion(" Simulación de caos iniciada");
            setTimeout(() => btnSimular.disabled = false, 1000);
        } catch (error) { btnSimular.disabled = false; }
    });
}

// Lógica Simulacion brecha
if (esAdmin && btnBrecha) {
    btnBrecha.classList.remove('d-none');
    btnBrecha.addEventListener('click', async () => {
        try {
            btnBrecha.disabled = true;
            btnBrecha.textContent = 'Calculando Riesgo...';
            
            const response = await apiFetch('/simular-brecha', { method: 'POST' });
            const info = response.informe;
            
            const content = `
                <h4 class="mb-3 ${info.resultado.includes('CAOS') ? 'text-danger' : 'text-success'}">
                    ${info.resultado}
                </h4>
                <p><strong>Recinto afectado:</strong> ${info.celda}</p>
                <p><strong>Dinosaurios en peligro:</strong> ${info.dinos_afectados}</p>
                <div class="alert ${info.resultado.includes('CAOS') ? 'alert-danger' : 'alert-success'} small">
                    ${info.detalle}
                </div>
                <p class="text-muted small">Probabilidad de fuga calculada: ${info.riesgo_calculado}</p>
            `;
            
            document.getElementById('informeContent')!.innerHTML = content;
            // @ts-ignore
            const modal = new bootstrap.Modal(document.getElementById('modalInforme'));
            modal.show();
            
            btnBrecha.disabled = false;
            btnBrecha.textContent = ' Simular Brecha de Seguridad';
        } catch (error) { 
            btnBrecha.disabled = false;
            btnBrecha.textContent = ' Simular Brecha de Seguridad';
        }
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
    const opcionesTrabajadores = trabajadoresDisponibles.map(t => 
        `<option value="${t.id}">${t.nick || t.name} (${t.role?.nombre || 'Personal'})</option>`
    ).join('');

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

                    ${esAdmin ? `
                        <div class="mt-3 border-top pt-2">
                            <label class="small fw-bold text-muted">Asignar Personal:</label>
                            <select class="form-select form-select-sm select-asignar" data-id="${celda.id}">
                                <option value="">Seleccionar...</option>
                                ${opcionesTrabajadores}
                            </select>
                        </div>
                    ` : ''}

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

const loadTrabajadores = async () => {
    try {
        const response = await apiFetch('/trabajadores');
        trabajadoresDisponibles = response.data;
        console.log("Personal listo para asignar:", trabajadoresDisponibles);
    } catch (error) {
        console.error("Error al cargar trabajadores", error);
    }
};


function mostrarNotificacion(mensaje: string, tipo: 'success' | 'danger' = 'success') {
    const container = document.getElementById('toastContainer');
    if (!container) return;

    const id = `toast-${Date.now()}`;
    const html = `
        <div id="${id}" class="toast align-items-center text-white bg-${tipo} border-0" role="alert" aria-live="assertive" aria-atomic="true">
            <div class="d-flex">
                <div class="toast-body">${mensaje}</div>
                <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast"></button>
            </div>
        </div>
    `;

    container.insertAdjacentHTML('beforeend', html);
    const element = document.getElementById(id);
    if (element) {
        // @ts-ignore
        const toast = new bootstrap.Toast(element, { delay: 3000 });
        toast.show();
        element.addEventListener('hidden.bs.toast', () => element.remove());
    }
}


initNavbar();
loadTrabajadores().then(() => {
    loadCeldas();
});