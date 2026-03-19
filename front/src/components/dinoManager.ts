import { initNavbar } from "./navBar";
import { dinoService } from '../services/dinoService';
import type { Dinosaurio } from '../interfaces/Dinosaurio';


declare var bootstrap: any;

const listaDinos = document.querySelector<HTMLTableSectionElement>('#listaDinos');
const btnNuevoDino = document.querySelector<HTMLButtonElement>('#btnNuevoDino');
const dinoForm = document.querySelector<HTMLFormElement>('#dinoForm');
const btnConfirmDelete = document.getElementById('btnConfirmDelete');
const dinoIdInput = document.querySelector<HTMLInputElement>('#dinoId');
const confirmDeleteModal = new bootstrap.Modal(document.getElementById('confirmDeleteModal'));
const dinoEntryModal = new bootstrap.Modal(document.getElementById('dinoModal'));
let idAEliminar: number | null = null;

const showToast = (mensaje: string, color: 'success' | 'danger' = 'success') => {
    const toastEl = document.getElementById('liveToast');
    const toastMessage = document.getElementById('toastMessage');
    
    if (toastEl && toastMessage) {
        toastMessage.textContent = mensaje;
        toastEl.classList.remove('text-bg-success', 'text-bg-danger');
        toastEl.classList.add(`text-bg-${color}`);
        
        const toast = new bootstrap.Toast(toastEl);
        toast.show();
    }
};

const getPeligroColor = (nivel: string) => {
    const colors: Record<string, string> = {
        'Bajo': 'success',
        'Medio': 'info',
        'Alto': 'warning',
        'Muy Alto': 'danger',
        'Extremo': 'dark',
        'Crítico': 'secondary'
    };
    return colors[nivel] || 'primary';
};

const renderDinos = (dinos: Dinosaurio[]) => {
    if (!listaDinos) return;
    listaDinos.innerHTML = dinos.map(dino => `
        <tr>
            <td><strong>${dino.nombre}</strong></td>
            <td>${dino.especie} <span class="badge bg-light text-dark border">${dino.dieta}</span></td>
            <td><span class="badge bg-${getPeligroColor(dino.peligrosidad)}">${dino.peligrosidad}</span></td>
            <td><span class="text-${dino.estado_salud === 'Excelente' ? 'success' : 'danger'}">● ${dino.estado_salud}</span></td>
            <td><span class="badge rounded-pill bg-light text-dark border">${dino.celda ? dino.celda.nombre : 'ID: ' + dino.celda_id}</span></td>
            <td>
                <button class="btn btn-sm btn-outline-primary edit-btn" data-id="${dino.id}">Editar</button>
                <button class="btn btn-sm btn-outline-danger delete-btn" data-id="${dino.id}">Eliminar</button>
            </td>
        </tr>
    `).join('');
};

const loadDinos = async () => {
    try {
        const response = await dinoService.getAll();
        renderDinos(response.data);
    } catch (error) {
        showToast('Error al conectar con el sistema del parque', 'danger');
    }
};

listaDinos?.addEventListener('click', async (e) => {
    const target = e.target as HTMLElement;
    const id = target.getAttribute('data-id');
    if (!id) return;

    
    if (target.classList.contains('delete-btn')) {
        idAEliminar = Number(id);
        confirmDeleteModal.show();
    }
    if (target.classList.contains('edit-btn')) {
        try {
            const response = await dinoService.getById(Number(id));
            const dino = response.data;

            if (dino) {
                (document.getElementById('dinoId') as HTMLInputElement).value = dino.id!.toString();
                (document.getElementById('nombre') as HTMLInputElement).value = dino.nombre;
                (document.getElementById('especie') as HTMLInputElement).value = dino.especie;
                (document.getElementById('dieta') as HTMLSelectElement).value = dino.dieta;
                (document.getElementById('peligrosidad') as HTMLSelectElement).value = dino.peligrosidad;
                (document.getElementById('estado_salud') as HTMLSelectElement).value = dino.estado_salud;
                (document.getElementById('edad') as HTMLInputElement).value = dino.edad.toString();
                (document.getElementById('celda_id') as HTMLInputElement).value = dino.celda_id.toString();

                document.getElementById('modalTitle')!.textContent = 'Editar Dinosaurio';
                dinoEntryModal.show();
            }
        } catch (error) {
            showToast('No se pudieron obtener los datos del espécimen', 'danger');
        }
    }
});

btnConfirmDelete?.addEventListener('click', async () => {
    if (idAEliminar === null) return;

    try {
        await dinoService.delete(idAEliminar);
        confirmDeleteModal.hide();
        showToast('Espécimen eliminado del registro correctamente.');
        loadDinos(); 
    } catch (error: any) {
        confirmDeleteModal.hide();
        const msg = error.status === 403 
            ? 'Error 403: No tienes permisos de Administrador.' 
            : 'Error al procesar la baja.';
        showToast(msg, 'danger');
    } finally {
        idAEliminar = null;
    }
});

btnNuevoDino?.addEventListener('click', () => {
    dinoForm?.reset();
    if (dinoIdInput) dinoIdInput.value = '';
    document.getElementById('modalTitle')!.textContent = 'Registrar Dinosaurio';
    dinoEntryModal.show();
});

dinoForm?.addEventListener('submit', async (e) => {
    e.preventDefault();

    const id = dinoIdInput?.value;
    const dinoData: any = {
        nombre: (document.getElementById('nombre') as HTMLInputElement).value,
        especie: (document.getElementById('especie') as HTMLInputElement).value,
        dieta: (document.getElementById('dieta') as HTMLSelectElement).value,
        peligrosidad: (document.getElementById('peligrosidad') as HTMLSelectElement).value,
        estado_salud: (document.getElementById('estado_salud') as HTMLSelectElement).value,
        edad: Number((document.getElementById('edad') as HTMLInputElement).value),
        celda_id: Number((document.getElementById('celda_id') as HTMLInputElement).value),
    };

    try {
        if (id) {
            await dinoService.update(Number(id), dinoData);
            showToast('Datos del dinosaurio actualizados.');
        } else {
            await dinoService.create(dinoData);
            showToast('Nuevo dinosaurio registrado con éxito.');
        }

        dinoEntryModal.hide();
        loadDinos();
    } catch (error: any) {
        const msg = error.status === 403 
            ? 'Permisos insuficientes para modificar el registro.' 
            : 'Error al guardar. Comprueba que el ID de la celda existe.';
        showToast(msg, 'danger');
    }
});

initNavbar();
loadDinos();