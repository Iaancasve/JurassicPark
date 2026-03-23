import './style.css';
import { setupLogin } from './components/auth';

const loginForm = document.querySelector<HTMLFormElement>('#loginForm');

if (loginForm) {
    setupLogin(loginForm);
    
}