export interface Celda {
    id?: number;
    nombre: string;
    tipo: string;
    capacidad: number;
    fila: number;
    columna: number;
    created_at?: string;
    updated_at?: string;
    dinosaurios_count?: number; 
}