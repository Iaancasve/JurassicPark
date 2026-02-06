<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class CeldaSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
{
    $peligros = ['Baja', 'Media', 'Alta', 'Extrema'];
    $seguridad = ['Bajo', 'Medio', 'Alto', 'Crítico'];
    $climas = ['Tropical', 'Seco', 'Húmedo', 'Frío'];

    for ($f = 1; $f <= 4; $f++) {
        for ($c = 1; $c <= 4; $c++) {
            \App\Models\Celda::create([
                'nombre' => "Celda " . chr(64 + $f) . "-$c", // Genera nombres por seccion
                'fila' => $f,
                'columna' => $c,
                'capacidad_animales' => rand(0, 5),
                'peligrosidad' => $peligros[array_rand($peligros)],
                'alimento' => rand(20, 100),
                'averias' => rand(0, 5),
                'seguridad' => $seguridad[array_rand($seguridad)],
            ]);
        }
    }
}
}
