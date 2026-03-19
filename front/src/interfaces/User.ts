export interface User {
    id: number;
    nick: string;
    role_id: number;
    role?: {
        id: number;
        nombre: string;
        slug: string;
    };
    created_at?: string;
}

// Para las peticiones de creación y edición
export interface UserForm {
    nick: string;
    password?: string;
    role_id: number;
}