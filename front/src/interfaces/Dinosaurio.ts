export interface Dinosaurio {
    id?: number;
    nombre: string;
    especie: string;
    dieta: 'Herbívoro' | 'Carnívoro' | 'Omnívoro';
    edad: number;
    peligrosidad: 'Bajo' | 'Medio' | 'Alto' | 'Muy Alto' | 'Extremo' | 'Crítico';
    estado_salud: 'Excelente' | 'Bueno' | 'Enfermo' | 'Crítico';
    celda_id: number;
    celda?: {
        nombre: string;
        fila: number;
        columna: number;
    };
    created_at?: string;
    updated_at?: string;
}