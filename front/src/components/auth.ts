import type { UserUpdate } from '../interfaces/UserUpdate';
import { apiFetch } from '../services/api';

export const setupLogin = (formElement: HTMLFormElement) => {
    formElement.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const nickInput = formElement.querySelector<HTMLInputElement>('#nick');
        const passInput = formElement.querySelector<HTMLInputElement>('#password');
        const errorMsg = document.querySelector<HTMLDivElement>('#errorMsg');

        try {
            const response = await apiFetch('/login', {
                method: 'POST',
                body: JSON.stringify({ 
                    nick: nickInput?.value, 
                    password: passInput?.value 
                })
            });

            localStorage.setItem('token', response.data.token);
            localStorage.setItem('role', response.data.role);
            window.location.href = '/src/views/dashboard.html'; 
        } catch (error) {
            if (errorMsg) {
                errorMsg.textContent = 'Credenciales no válidas';
                errorMsg.classList.remove('d-none');
            }
        }
    });
};

export const updateProfile = async (userData: UserUpdate) => {
    return await apiFetch('/user/update', {
        method: 'PUT',
        body: JSON.stringify(userData)
    });
};