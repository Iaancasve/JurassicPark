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
const currentUserId = localStorage.getItem('user_id');

let trabajadoresDisponibles: any[] = [];

echo.channel('mapa-parque')
    .listen('.celda.actualizada', (data: any) => {
        console.log("WebSocket: Actualizando mapa...", data.celda.nombre);
        loadCeldas(); 
    });

gridContainer?.addEventListener('click', async (e) => {
    const target = e.target as HTMLElement;
    const id = target.getAttribute('data-id');

    if (target.classList.contains('btn-tarea')) {
        const estado = target.getAttribute('data-estado');
        try {
            await apiFetch('/tareas/actualizar', {
                method: 'POST',
                body: JSON.stringify({ celda_id: id, estado: estado })
            });
            mostrarNotificacion("Estado de tarea actualizado");
            loadCeldas();
        } catch (error) { console.error(error); }
        return;
    }

    if (!id) return;

    if (target.classList.contains('btn-recargar')) {
        try {
            target.textContent = '...';
            await apiFetch(`/celdas/${id}/recargar`, { method: 'POST' });
            mostrarNotificacion("Suministros enviados");
        } catch (error) { console.error(error); }
    }

    if (target.classList.contains('btn-reparar')) {
        try {
            target.textContent = '...';
            await apiFetch(`/celdas/${id}/reparar`, { method: 'POST' });
            mostrarNotificacion("Reparación iniciada");
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
            
            mostrarNotificacion("Personal asignado con éxito");
            target.disabled = false;
            target.value = "";
            loadCeldas(); 
        } catch (error) {
            mostrarNotificacion("Error en la asignación", "danger");
            target.disabled = false;
        }
    }
});

const esAdmin = userRole === 'admin' || userRole === 'administrador';

if (esAdmin && btnSimular) {
    btnSimular.classList.remove('d-none');
    btnSimular.addEventListener('click', async () => {
        try {
            btnSimular.disabled = true;
            await apiFetch('/simular', { method: 'POST' });
            mostrarNotificacion("Caos simulado");
            setTimeout(() => btnSimular.disabled = false, 1000);
        } catch (error) { btnSimular.disabled = false; }
    });
}

if (esAdmin && btnBrecha) {
    btnBrecha.classList.remove('d-none');
    btnBrecha.addEventListener('click', async () => {
        try {
            btnBrecha.disabled = true;
            const response = await apiFetch('/simular-brecha', { method: 'POST' });
            const info = response.informe;
            
            document.getElementById('informeContent')!.innerHTML = `
                <h4 class="${info.resultado.includes('CAOS') ? 'text-danger' : 'text-success'}">${info.resultado}</h4>
                <p><strong>Celda:</strong> ${info.celda}</p>
                <div class="alert alert-secondary small">${info.detalle}</div>
            `;
            // @ts-ignore
            new bootstrap.Modal('#modalInforme').show();
            btnBrecha.disabled = false;
        } catch (error) { btnBrecha.disabled = false; }
    });
}

const loadCeldas = async () => {
    try {
        const response = await apiFetch('/celdas-stats');
        if (gridContainer && response.data) {
            renderGrid(response.data);
        }
    } catch (error) { console.error("Error cargando el mapa", error); }
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
        
        // Buscamos si el usuario actual tiene una tarea en esta celda
        const miTarea = celda.trabajadores?.find((t: any) => t.id == currentUserId);

        let htmlTarea = '';
        if (miTarea && miTarea.pivot) {
            htmlTarea = `
                <div class="alert alert-info p-2 mt-2" style="font-size: 0.8rem;">
                    <strong>Mi Tarea:</strong> <span class="badge bg-info"></span>
                    <div class="d-flex gap-1 mt-1">
                        ${miTarea.pivot.estado === 'pendiente' ? 
                            `<button class="btn btn-primary btn-sm btn-tarea w-100" data-id="${celda.id}" data-estado="en_progreso">Empezar</button>` : 
                            `<button class="btn btn-success btn-sm btn-tarea w-100" data-id="${celda.id}" data-estado="finalizada">Terminar</button>`
                        }
                    </div>
                </div>
            `;
        }

        const listaTrabajadores = celda.trabajadores && celda.trabajadores.length > 0
            ? celda.trabajadores.map((t: any) => 
                `<span class="badge bg-secondary me-1" style="font-size: 0.7rem;">
                     ${t.nick || t.name}
                 </span>`
              ).join('')
            : '<span class="text-muted small italic">Sin personal</span>';

        return `
        <div class="col">
            <div class="card h-100 shadow-sm border-2 border-${color}">
                <div class="card-body">
                    <div class="d-flex justify-content-between align-items-center mb-2">
                        <h5 class="card-title fw-bold mb-0">${celda.nombre}</h5>
                        <span class="badge rounded-pill bg-dark"> ${celda.dinosaurios_count || 0}</span>
                    </div>
                    <hr class="my-2">
                    
                    <p class="card-text mb-1 small"><strong>Alimento:</strong> ${celda.alimento}%</p>
                    <div class="progress mb-2" style="height: 8px;">
                        <div class="progress-bar bg-${celda.alimento < 25 ? 'danger' : 'success'}" style="width: ${celda.alimento}%"></div>
                    </div>

                    <p class="mb-2 small">
                        <strong>Averías:</strong> 
                        <span class="badge ${celda.averias > 0 ? 'bg-warning text-dark' : 'bg-light text-muted'}">${celda.averias}</span>
                    </p>

                    <div class="mb-3 p-2 bg-light rounded border">
                        <label class="d-block small fw-bold mb-1 text-uppercase" style="font-size: 0.65rem;">Personal en zona:</label>
                        <div class="d-flex flex-wrap">${listaTrabajadores}</div>
                    </div>

                    ${htmlTarea}

                    ${esAdmin ? `
                        <div class="mb-3">
                            <select class="form-select form-select-sm select-asignar" data-id="${celda.id}">
                                <option value="">+ Asignar Trabajador</option>
                                ${opcionesTrabajadores}
                            </select>
                        </div>
                    ` : ''}

                    <div class="d-grid gap-2">
                        ${(esAdmin || esVeterinario) ? `<button class="btn btn-sm btn-outline-success btn-recargar" data-id="${celda.id}">Reponer Alimento</button>` : ''}
                        ${(esAdmin || esMantenimiento) ? `<button class="btn btn-sm btn-outline-primary btn-reparar" data-id="${celda.id}" ${celda.averias === 0 ? 'disabled' : ''}>Reparar Avería</button>` : ''}
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
    } catch (error) { console.error(error); }
};

function mostrarNotificacion(mensaje: string, tipo: 'success' | 'danger' = 'success') {
    const container = document.getElementById('toastContainer');
    if (!container) return;
    const id = `toast-${Date.now()}`;
    container.insertAdjacentHTML('beforeend', `
        <div id="${id}" class="toast align-items-center text-white bg-${tipo} border-0" role="alert">
            <div class="d-flex"><div class="toast-body">${mensaje}</div>
            <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast"></button></div>
        </div>
    `);
    const el = document.getElementById(id);
    if (el) {
        // @ts-ignore
        const t = new bootstrap.Toast(el, { delay: 3000 });
        t.show();
        el.addEventListener('hidden.bs.toast', () => el.remove());
    }
}

initNavbar();
loadTrabajadores().then(() => loadCeldas());