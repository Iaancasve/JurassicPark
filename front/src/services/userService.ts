import { apiFetch } from './api';
import type { User, UserForm } from '../interfaces/User';

export const userService = {
    // Obtener todos los usuarios
    getAll: async (): Promise<User[]> => {
        return await apiFetch('/users');
    },

    // Crear un usuario
    create: async (userData: UserForm): Promise<User> => {
        return await apiFetch('/users', {
            method: 'POST',
            body: JSON.stringify(userData)
        });
    },

    // Actualizar un usuario
    update: async (id: number, userData: UserForm): Promise<User> => {
        return await apiFetch(`/users/${id}`, {
            method: 'PUT',
            body: JSON.stringify(userData)
        });
    },

    // Eliminar un usuario
    delete: async (id: number): Promise<void> => {
        return await apiFetch(`/users/${id}`, {
            method: 'DELETE'
        });
    }
};