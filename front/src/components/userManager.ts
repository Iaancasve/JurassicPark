import { userService } from '../services/userService';
import { roleService, type Role } from '../services/roleService';
import type { User} from '../interfaces/User';
import { initNavbar } from './navBar';

declare var bootstrap: any;


const tablaUsuarios = document.getElementById('tablaUsuarios');
const userForm = document.getElementById('userForm') as HTMLFormElement;
const roleSelect = document.getElementById('userRole') as HTMLSelectElement;
const btnNuevoUsuario = document.getElementById('btnNuevoUsuario');
const modalTitle = document.getElementById('modalTitle');
const userIdInput = document.getElementById('userId') as HTMLInputElement;

let userModal: any;
let listaUsuarios: User[] = []; 


async function inicializar() {
    userModal = new bootstrap.Modal(document.getElementById('userModal'));
    
    try {
        const [usuarios, roles] = await Promise.all([
            userService.getAll(),
            roleService.getAll()
        ]);
        
        listaUsuarios = usuarios;
        renderizarTabla(usuarios);
        rellenarRoles(roles);
    } catch (error) {
        console.error("Error en la carga inicial:", error);
    }
}

function rellenarRoles(roles: Role[]) {
    if (!roleSelect) return;
    roleSelect.innerHTML = '<option value="">Selecciona un rol...</option>';
    roles.forEach(role => {
        const option = document.createElement('option');
        option.value = role.id.toString();
        option.textContent = role.nombre;
        roleSelect.appendChild(option);
    });
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


btnNuevoUsuario?.addEventListener('click', () => {
    userForm.reset();
    userIdInput.value = '';
    if (modalTitle) modalTitle.textContent = 'Nuevo Empleado';
    (document.getElementById('userPassword') as HTMLInputElement).required = true;
    (document.getElementById('passHelp') as HTMLElement).textContent = "Mínimo 8 caracteres.";
    userModal.show();
});


tablaUsuarios?.addEventListener('click', async (e) => {
    const target = e.target as HTMLElement;
    const id = Number(target.getAttribute('data-id'));
    if (!id) return;

    if (target.classList.contains('btn-delete')) {
        if (confirm('¿Estás seguro de eliminar este usuario?')) {
            try {
                await userService.delete(id);
                await inicializar();
            } catch (error: any) {
                alert(error.message || 'Error al eliminar');
            }
        }
    }

    if (target.classList.contains('btn-edit')) {
        const user = listaUsuarios.find(u => u.id === id);
        if (user) {
            userIdInput.value = user.id.toString();
            (document.getElementById('userNick') as HTMLInputElement).value = user.nick;
            roleSelect.value = user.role_id.toString();
            
            if (modalTitle) modalTitle.textContent = 'Editar Empleado';
            (document.getElementById('userPassword') as HTMLInputElement).required = false;
            (document.getElementById('passHelp') as HTMLElement).textContent = "Dejar en blanco para no cambiar.";
            
            userModal.show();
        }
    }
});


userForm?.addEventListener('submit', async (e) => {
    e.preventDefault();

    const id = userIdInput.value;
    const userData: any = {
        nick: (document.getElementById('userNick') as HTMLInputElement).value,
        role_id: Number(roleSelect.value)
    };

    const password = (document.getElementById('userPassword') as HTMLInputElement).value;
    if (password) {
        userData.password = password;
    }

    try {
        if (id) {
            await userService.update(Number(id), userData);
        } else {
            await userService.create(userData);
        }
        
        userModal.hide();
        await inicializar(); 
    } catch (error: any) {
        alert(error.message || 'Error al guardar el usuario');
    }
});


initNavbar();
inicializar();