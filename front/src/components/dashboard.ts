import { apiFetch } from "../services/api";
import { initNavbar } from "./navBar";

const gridContainer = document.querySelector<HTMLDivElement>('#gridContainer');

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
            <div class="card h-100 shadow-sm border-${celda.seguridad === 'Crítico' ? 'danger' : 'primary'}">
                <div class="card-body">
                    <h5 class="card-title fw-bold">${celda.nombre}</h5>
                    <p class="card-text small">
                        <strong>Alimento:</strong> ${celda.alimento}%<br>
                        <strong>Averías:</strong> ${celda.averias}
                    </p>
                </div>
            </div>
        </div>
    `).join('');
};


initNavbar();
loadCeldas();