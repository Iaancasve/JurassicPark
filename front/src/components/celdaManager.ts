import { celdaService } from '../services/celdaService';
import type { Celda } from '../interfaces/Celda';
import { initNavbar } from "./navBar";

declare var bootstrap: any;

const listaCeldas = document.querySelector<HTMLTableSectionElement>('#listaCeldas');
const btnNuevaCelda = document.querySelector<HTMLButtonElement>('#btnNuevaCelda');
const celdaForm = document.querySelector<HTMLFormElement>('#celdaForm');
const btnConfirmDelete = document.getElementById('btnConfirmDelete');
const celdaIdInput = document.querySelector<HTMLInputElement>('#celdaId');

const celdaEntryModal = new bootstrap.Modal(document.getElementById('celdaModal'));
const confirmDeleteModal = new bootstrap.Modal(document.getElementById('confirmDeleteModal'));

let idAEliminar: number | null = null;

const showToast = (mensaje: string, color: 'success' | 'danger' = 'success') => {
    const toastEl = document.getElementById('liveToast');
    const toastMessage = document.getElementById('toastMessage');
    if (toastEl && toastMessage) {
        toastMessage.textContent = mensaje;
        toastEl.classList.remove('text-bg-success', 'text-bg-danger');
        toastEl.classList.add(`text-bg-${color}`);
        new bootstrap.Toast(toastEl).show();
    }
};

const renderCeldas = (celdas: Celda[]) => {
    if (!listaCeldas) return;
    listaCeldas.innerHTML = celdas.map(celda => `
        <tr>
            <td><strong>${celda.nombre}</strong></td>
            <td>F:${celda.fila} | C:${celda.columna}</td>
            <td>${celda.capacidad_animales}</td>
            <td><span class="badge bg-secondary">${celda.peligrosidad}</span></td>
            <td>
                <div class="progress" style="height: 20px;">
                    <div class="progress-bar bg-success" role="progressbar" style="width: ${celda.alimento}% text-dark">${celda.alimento}%</div>
                </div>
            </td>
            <td><span class="badge bg-${celda.averias > 0 ? 'danger' : 'success'}">${celda.averias}</span></td>
            <td><span class="badge border text-dark">${celda.seguridad}</span></td>
            <td>
                <button class="btn btn-sm btn-outline-primary edit-btn" data-id="${celda.id}">Editar</button>
                <button class="btn btn-sm btn-outline-danger delete-btn" data-id="${celda.id}">Borrar</button>
            </td>
        </tr>
    `).join('');
};

const loadCeldas = async () => {
    try {
        const res = await celdaService.getAll();
        renderCeldas(res.data);
    } catch (e) {
        showToast('Error al cargar celdas', 'danger');
    }
};

listaCeldas?.addEventListener('click', async (e) => {
    const target = e.target as HTMLElement;
    const id = target.getAttribute('data-id');
    if (!id) return;

    if (target.classList.contains('delete-btn')) {
        idAEliminar = Number(id);
        confirmDeleteModal.show();
    }

    if (target.classList.contains('edit-btn')) {
        const res = await celdaService.getById(Number(id));
        const c = res.data;
        if (celdaIdInput) celdaIdInput.value = c.id!.toString();
        (document.getElementById('nombre') as HTMLInputElement).value = c.nombre;
        (document.getElementById('fila') as HTMLInputElement).value = c.fila.toString();
        (document.getElementById('columna') as HTMLInputElement).value = c.columna.toString();
        (document.getElementById('capacidad_animales') as HTMLInputElement).value = c.capacidad_animales.toString();
        (document.getElementById('peligrosidad') as HTMLSelectElement).value = c.peligrosidad;
        (document.getElementById('alimento') as HTMLInputElement).value = c.alimento.toString();
        (document.getElementById('averias') as HTMLInputElement).value = c.averias.toString();
        (document.getElementById('seguridad') as HTMLSelectElement).value = c.seguridad;
        
        document.getElementById('modalTitle')!.textContent = 'Editar Celda';
        celdaEntryModal.show();
    }
});

celdaForm?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const id = celdaIdInput?.value;
    const data: any = {
        nombre: (document.getElementById('nombre') as HTMLInputElement).value,
        fila: Number((document.getElementById('fila') as HTMLInputElement).value),
        columna: Number((document.getElementById('columna') as HTMLInputElement).value),
        capacidad_animales: Number((document.getElementById('capacidad_animales') as HTMLInputElement).value),
        peligrosidad: (document.getElementById('peligrosidad') as HTMLSelectElement).value,
        alimento: Number((document.getElementById('alimento') as HTMLInputElement).value),
        averias: Number((document.getElementById('averias') as HTMLInputElement).value),
        seguridad: (document.getElementById('seguridad') as HTMLSelectElement).value,
    };

    try {
        id ? await celdaService.update(Number(id), data) : await celdaService.create(data);
        showToast('Celda guardada con éxito');
        celdaEntryModal.hide();
        loadCeldas();
    } catch (err) {
        showToast('Error al guardar la celda', 'danger');
    }
});

btnConfirmDelete?.addEventListener('click', async () => {
    if (!idAEliminar) return;
    try {
        await celdaService.delete(idAEliminar);
        showToast('Celda eliminada');
        confirmDeleteModal.hide();
        loadCeldas();
    } catch (e) {
        showToast('Error al eliminar', 'danger');
        confirmDeleteModal.hide();
    }
});

btnNuevaCelda?.addEventListener('click', () => {
    celdaForm?.reset();
    if (celdaIdInput) celdaIdInput.value = '';
    document.getElementById('modalTitle')!.textContent = 'Construir Nueva Celda';
    celdaEntryModal.show();
});

initNavbar();
loadCeldas();