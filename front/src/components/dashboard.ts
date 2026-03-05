import { apiFetch } from "../services/api";

const gridContainer = document.querySelector<HTMLDivElement>('#gridContainer');
const logoutBtn = document.querySelector<HTMLButtonElement>('#logoutBtn');


const loadCeldas = async () => {
    try {
        const response = await apiFetch('/celdas');
        if (gridContainer) {
            renderGrid(response.data);
        }
    } catch (error) {
        console.error("Error cargando el mapa", error);
        window.location.href = '/index.html';
    }
};


const renderGrid = (celdas: any[]) => {
    if (!gridContainer) return;

    gridContainer.innerHTML = celdas.map(celda => `
        <div class="col">
            <div class="card h-100 shadow-sm border-${getColorBySeguridad(celda.seguridad)}">
                <div class="card-body">
                    <h5 class="card-title fw-bold">${celda.nombre}</h5>
                    <p class="card-text small">
                        <strong>Alimento:</strong> ${celda.alimento}%<br>
                        <strong>Averías:</strong> ${celda.averias}
                    </p>
                </div>
                <div class="card-footer bg-transparent">
                    <span class="badge bg-${celda.alimento < 25 ? 'danger' : 'success'}">
                        ${celda.alimento < 25 ? 'HAMBRIENTOS' : 'Alimentados'}
                    </span>
                </div>
            </div>
        </div>
    `).join('');
};


const getColorBySeguridad = (nivel: string) => {
    if (nivel === 'Crítico') return 'danger';
    if (nivel === 'Alto') return 'warning';
    return 'primary';
};


logoutBtn?.addEventListener('click', () => {
    localStorage.clear();
    window.location.href = '/index.html';
});


loadCeldas();