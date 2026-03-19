import { apiFetch } from '../services/api';
import { updateProfile } from './auth';
import type { UserUpdate } from '../interfaces/UserUpdate';
import { initNavbar } from "./navBar";

declare var bootstrap: any;

async function loadUserData() {
    try {
        const response = await apiFetch('/user/perfil');
        const nickInput = document.getElementById('nick') as HTMLInputElement;
        if (nickInput && response.nick) {
            nickInput.value = response.nick;
        }
    } catch (error) {
        console.error("Error al obtener los datos:", error);
    }
}

const profileForm = document.querySelector<HTMLFormElement>('#profileForm');

profileForm?.addEventListener('submit', async (e) => {
    e.preventDefault();

    
    const nickInput = document.getElementById('nick') as HTMLInputElement;
    const passwordInput = document.getElementById('password') as HTMLInputElement;
    const confirmInput = document.getElementById('password_confirmation') as HTMLInputElement;

    const nickValue = nickInput?.value.trim() || '';
    const password = passwordInput?.value || '';
    const confirm = confirmInput?.value || '';

    if (password && password !== confirm) {
        showToast('Las contraseñas no coinciden', 'danger');
        return;
    }

    
    const data: UserUpdate = { 
        nick: nickValue 
    };
    
    if (password) {
        data.password = password;
        data.password_confirmation = confirm;
    }

    try {
        await updateProfile(data);
        showToast('¡Perfil actualizado con éxito!', 'success');
        if (passwordInput) passwordInput.value = '';
        if (confirmInput) confirmInput.value = '';
    } catch (error: any) {
        showToast(error.message || 'Error de validación', 'danger');
    }
});

function setupPasswordToggle(buttonId: string, inputId: string) {
    const button = document.getElementById(buttonId);
    const input = document.getElementById(inputId) as HTMLInputElement;

    button?.addEventListener('click', () => {
        const isPassword = input.getAttribute('type') === 'password';
        input.setAttribute('type', isPassword ? 'text' : 'password');
        
        button.textContent = isPassword ? '🙈' : '👁️';
    });
}


setupPasswordToggle('togglePassword', 'password');
setupPasswordToggle('toggleConfirm', 'password_confirmation');

function showToast(mensaje: string, color: 'success' | 'danger') {
    const toastEl = document.getElementById('liveToast');
    const toastMessage = document.getElementById('toastMessage');
    if (toastEl && toastMessage) {
        toastMessage.textContent = mensaje;
        toastEl.className = `toast align-items-center border-0 text-bg-${color}`;
        new bootstrap.Toast(toastEl).show();
    }
}

initNavbar();
loadUserData();