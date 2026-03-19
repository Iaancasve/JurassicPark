import { apiFetch } from './api';

export interface Role {
    id: number;
    nombre: string;
    slug: string;
}

export const roleService = {
    getAll: async (): Promise<Role[]> => {
        return await apiFetch('/roles'); 
    }
};