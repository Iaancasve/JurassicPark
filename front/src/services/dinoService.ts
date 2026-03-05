import { apiFetch } from './api';
import type { Dinosaurio } from '../interfaces/Dinosaurio';

export const dinoService = {
    // Obtener todos los dinosaurios
    getAll: async (): Promise<{ data: Dinosaurio[] }> => {
        return await apiFetch('/dinosaurios');
    },

    // Obtener uno solo
    getById: async (id: number): Promise<{ data: Dinosaurio }> => {
        return await apiFetch(`/dinosaurios/${id}`);
    },

    // Crear un nuevo dinosaurio (Solo Admin)
    create: async (dino: Dinosaurio): Promise<any> => {
        return await apiFetch('/dinosaurios', {
            method: 'POST',
            body: JSON.stringify(dino)
        });
    },

    // Actualizar (Solo Admin)
    update: async (id: number, dino: Partial<Dinosaurio>): Promise<any> => {
        return await apiFetch(`/dinosaurios/${id}`, {
            method: 'PUT',
            body: JSON.stringify(dino)
        });
    },

    // Eliminar (Solo Admin)
    delete: async (id: number): Promise<any> => {
        return await apiFetch(`/dinosaurios/${id}`, {
            method: 'DELETE'
        });
    }
};