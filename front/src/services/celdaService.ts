import { apiFetch } from './api';
import type { Celda } from '../interfaces/Celda';

export const celdaService = {
    getAll: async (): Promise<{ data: Celda[] }> => {
        return await apiFetch('/celdas');
    },

    getById: async (id: number): Promise<{ data: Celda }> => {
        return await apiFetch(`/celdas/${id}`);
    },

    create: async (celda: Celda): Promise<any> => {
        return await apiFetch('/celdas', {
            method: 'POST',
            body: JSON.stringify(celda)
        });
    },

    update: async (id: number, celda: Partial<Celda>): Promise<any> => {
        return await apiFetch(`/celdas/${id}`, {
            method: 'PUT',
            body: JSON.stringify(celda)
        });
    },

    delete: async (id: number): Promise<any> => {
        return await apiFetch(`/celdas/${id}`, {
            method: 'DELETE'
        });
    }
};