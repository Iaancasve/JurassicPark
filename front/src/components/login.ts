const BASE_URL = import.meta.env.BASE_URL;

export interface LoginResponse {
    success: boolean;
    data: {
        token: string;
        nick: string;
        role: string;
        id: number;
    };
    message: string;
}

export const loginFetch = async (nick: string, password: string): Promise<LoginResponse> => {
    const response = await fetch(`${BASE_URL}/login`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        },
        body: JSON.stringify({ nick, password })
    });

    if (!response.ok) {
        throw new Error('Credenciales incorrectas');
    }
    return await response.json();
};