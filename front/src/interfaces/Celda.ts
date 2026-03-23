export interface Celda {
    id?: number;
    nombre: string;
    fila: number;    // Posición Y
    columna: number; // Posición X
    capacidad_animales: number;
    peligrosidad: 'Baja' | 'Media' | 'Alta' | 'Extrema';
    alimento: number;  
    averias: number;   
    seguridad: 'Bajo' | 'Medio' | 'Alto' | 'Crítico';
    created_at?: string;
    updated_at?: string;
    dinosaurios_count?: number; 
}