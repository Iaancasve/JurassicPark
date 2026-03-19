import { userService } from '../services/userService';
import type { User } from '../interfaces/User';

const tablaUsuarios = document.getElementById('tablaUsuarios');

async function cargarUsuarios() {
    try {
        const usuarios = await userService.getAll();
        renderizarTabla(usuarios);
    } catch (error) {
        console.error("Error al cargar usuarios:", error);
    }
}

function renderizarTabla(usuarios: User[]) {
    if (!tablaUsuarios) return;

    tablaUsuarios.innerHTML = usuarios.map(user => `
        <tr>
            <td>${user.id}</td>
            <td><strong>${user.nick}</strong></td>
            <td>
                <span class="badge ${user.role?.slug === 'Administrador' ? 'bg-danger' : 'bg-info'}">
                    ${user.role?.nombre || 'Sin rol'}
                </span>
            </td>
            <td>${new Date(user.created_at || '').toLocaleDateString()}</td>
            <td class="text-end">
                <button class="btn btn-sm btn-outline-primary btn-edit" data-id="${user.id}">Editar</button>
                <button class="btn btn-sm btn-outline-danger btn-delete" data-id="${user.id}">Borrar</button>
            </td>
        </tr>
    `).join('');
}

// Inicialización
cargarUsuarios();