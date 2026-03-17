import { dinoService } from '../services/dinoService';
import type { Dinosaurio } from '../interfaces/Dinosaurio';

const listaDinos = document.querySelector<HTMLTableSectionElement>('#listaDinos');

// Función para obtener el color de la peligrosidad según el PDF
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
            <td>
                <span class="badge bg-${getPeligroColor(dino.peligrosidad)}">
                    ${dino.peligrosidad}
                </span>
            </td>
            <td>
                <span class="text-${dino.estado_salud === 'Excelente' ? 'success' : 'danger'}">
                    ● ${dino.estado_salud}
                </span>
            </td>
            <td>
                <span class="badge rounded-pill bg-outline-secondary text-dark border">
                    ${dino.celda ? dino.celda.nombre : 'Sin asignar'}
                </span>
            </td>
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
        console.error("Error al cargar dinosaurios:", error);
    }
};

listaDinos?.addEventListener('click', async (e) => {
    const target = e.target as HTMLElement;
    
    // Lógica para ELIMINAR
    if (target.classList.contains('delete-btn')) {
        const id = target.getAttribute('data-id');
        if (!id) return;

        if (confirm('¿Estás seguro de que deseas eliminar este espécimen del registro?')) {
            try {
                await dinoService.delete(Number(id));
                alert('Dinosaurio eliminado correctamente');
                loadDinos(); 
            } catch (error) {
                alert('No tienes permisos o hubo un error al eliminar');
            }
        }
    }
});

// Inicializar carga
loadDinos();