import './style.css' 
import { loginFetch } from './components/login';

const loginForm = document.querySelector<HTMLFormElement>('#loginForm');
const nickInput = document.querySelector<HTMLInputElement>('#nick');
const passInput = document.querySelector<HTMLInputElement>('#password');
const errorMsg = document.querySelector<HTMLDivElement>('#errorMsg');

loginForm?.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    if (nickInput && passInput) {
        try {
            errorMsg?.classList.add('d-none');
            const response = await loginFetch(nickInput.value, passInput.value);
            localStorage.setItem('token', response.data.token);
            localStorage.setItem('role', response.data.role);
            localStorage.setItem('nick', response.data.nick);
            alert(response.message);
            
            window.location.href = '/dashboard.html'; 

        } catch (error) {
            if (errorMsg) {
                errorMsg.textContent = 'Acceso denegado: Credenciales no válidas';
                errorMsg.classList.remove('d-none');
            }
        }
    }
});