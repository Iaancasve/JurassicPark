import { apiFetch } from '../services/api';
import { updateProfile } from './auth';
import type { UserUpdate } from '../interfaces/UserUpdate';

declare var bootstrap: any;

const profileForm = document.querySelector<HTMLFormElement>('#profileForm');
const nickInput = document.querySelector<HTMLInputElement>('#nick'); 

/**
 * Carga los datos del usuario autenticado desde el servidor
 */
async function loadUserData() {
    try {
        const response = await apiFetch('/user/perfil');
        
        if (nickInput && response.nick) {
            nickInput.value = response.nick; 
        }
    } catch (error) {
        console.error("Error al obtener los datos del usuario:", error);
        showToast('No se pudieron cargar tus datos de perfil', 'danger');
    }
}

/**
 * Escuchador del evento de envío del formulario
 */
profileForm?.addEventListener('submit', async (e) => {
    e.preventDefault();

    const nick = nickInput?.value || '';
    const password = (document.getElementById('password') as HTMLInputElement).value;
    const confirm = (document.getElementById('password_confirmation') as HTMLInputElement).value;
    
    if (password && password !== confirm) {
        showToast('Las contraseñas no coinciden', 'danger');
        return;
    }

    
    const data: UserUpdate = { nick };
    
    if (password) {
        data.password = password;
        data.password_confirmation = confirm;
    }

    try {
        await updateProfile(data);
        showToast('¡Perfil actualizado con éxito!', 'success');
        
        // Limpiamos los campos de contraseña
        (document.getElementById('password') as HTMLInputElement).value = '';
        (document.getElementById('password_confirmation') as HTMLInputElement).value = '';
        
    } catch (error: any) {
        console.error(error);
        showToast(error.message || 'Error al intentar actualizar el perfil', 'danger');
    }
});

/**
 * Utilidad para mostrar notificaciones visuales
 */
function showToast(mensaje: string, color: 'success' | 'danger') {
    const toastEl = document.getElementById('liveToast');
    const toastMessage = document.getElementById('toastMessage');
    
    if (toastEl && toastMessage) {
        toastMessage.textContent = mensaje;
        toastEl.classList.remove('text-bg-success', 'text-bg-danger');
        toastEl.classList.add(`text-bg-${color}`);
        
        const toast = new bootstrap.Toast(toastEl);
        toast.show();
    }
}

// Inicialización
loadUserData();