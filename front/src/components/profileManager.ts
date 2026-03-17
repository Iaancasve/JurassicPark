import { updateProfile } from './auth';
import type { UserUpdate } from '../interfaces/UserUpdate';

declare var bootstrap: any;

const profileForm = document.querySelector<HTMLFormElement>('#profileForm');

profileForm?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const name = (document.getElementById('name') as HTMLInputElement).value;
    const password = (document.getElementById('password') as HTMLInputElement).value;
    const confirm = (document.getElementById('password_confirmation') as HTMLInputElement).value;

    if (password && password !== confirm) {
        showToast('Las contraseñas no coinciden', 'danger');
        return;
    }

    const data: UserUpdate = { name };
    if (password) {
        data.password = password;
        data.password_confirmation = confirm;
    }

    try {
        await updateProfile(data);
        showToast('¡Perfil actualizado con éxito!', 'success');
        (document.getElementById('password') as HTMLInputElement).value = '';
        (document.getElementById('password_confirmation') as HTMLInputElement).value = '';
    } catch (error: any) {
        showToast(error.message || 'Error al actualizar el perfil', 'danger');
    }
});

function showToast(mensaje: string, color: 'success' | 'danger') {
    const toastEl = document.getElementById('liveToast');
    const toastMessage = document.getElementById('toastMessage');
    if (toastEl && toastMessage) {
        toastMessage.textContent = mensaje;
        toastEl.className = `toast align-items-center border-0 text-bg-${color}`;
        new bootstrap.Toast(toastEl).show();
    }
}