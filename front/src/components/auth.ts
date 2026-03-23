import { initNavbar } from './navbar';
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
            if (response.success) {
                const userData = response.data;

                localStorage.setItem('user_id', userData.id.toString());
                localStorage.setItem('token', userData.token);
                localStorage.setItem('role', userData.role);
                
                window.location.href = '/src/views/dashboard.html'; 
            } else {
                throw new Error(response.message || 'Credenciales no válidas');
            }

        } catch (error) {
            if (errorMsg) {
                errorMsg.textContent = 'Credenciales no válidas';
                errorMsg.classList.remove('d-none');
            }
        }
    });
};

export const updateProfile = async (userData: UserUpdate) => {
    console.log("Enviando a la API:", userData); 
    return await apiFetch('/user/update', {
        method: 'PUT',
        body: JSON.stringify(userData)
    });
};

initNavbar();