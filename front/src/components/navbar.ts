const userRole = localStorage.getItem('role')?.toLowerCase().trim();
const esAdmin = userRole === 'admin' || userRole === 'administrador';


export const initNavbar = () => {
    const navUsers = document.getElementById('nav-users');
    const navDinos = document.getElementById('nav-dinos');
    const navCeldas = document.getElementById('nav-celdas');
    const logoutBtn = document.getElementById('logoutBtn');

    if (esAdmin) {
        navUsers?.classList.remove('d-none');
        navDinos?.classList.remove('d-none');
        navCeldas?.classList.remove('d-none');
    }

    logoutBtn?.addEventListener('click', () => {
        localStorage.clear();
        window.location.href = '/index.html';
    });
};


export const checkAccess = () => {
    const paginasProtegidas = ['usuarios.html', 'celdas.html', 'dinosaurios.html'];
    const pathActual = window.location.pathname;
    const esRutaProhibida = paginasProtegidas.some(pagina => pathActual.includes(pagina));

    if (esRutaProhibida && !esAdmin) {
        window.location.href = 'dashboard.html';
    }
};


checkAccess();