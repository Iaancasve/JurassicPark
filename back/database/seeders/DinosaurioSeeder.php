<?php

namespace Database\Seeders;

use App\Models\Celda;
use App\Models\Dinosaurio;
use Illuminate\Database\Seeder;

class DinosaurioSeeder extends Seeder
{
    public function run(): void
    {
        $celdas = Celda::all();
        if ($celdas->isEmpty()) return;

        $dinosaurios = [
            // Herbívoros
            ['nombre' => 'Trike', 'especie' => 'Triceratops', 'dieta' => 'Herbívoro', 'peligrosidad' => 'Medio'],
            ['nombre' => 'Brachi', 'especie' => 'Brachiosaurus', 'dieta' => 'Herbívoro', 'peligrosidad' => 'Bajo'],
            ['nombre' => 'Stego', 'especie' => 'Stegosaurus', 'dieta' => 'Herbívoro', 'peligrosidad' => 'Medio'],
            ['nombre' => 'Anky', 'especie' => 'Ankylosaurus', 'dieta' => 'Herbívoro', 'peligrosidad' => 'Medio'],
            ['nombre' => 'Para', 'especie' => 'Parasaurolophus', 'dieta' => 'Herbívoro', 'peligrosidad' => 'Bajo'],
            ['nombre' => 'Galli', 'especie' => 'Gallimimus', 'dieta' => 'Herbívoro', 'peligrosidad' => 'Bajo'],

            // Omnívoros
            ['nombre' => 'Ovi', 'especie' => 'Oviraptor', 'dieta' => 'Omnívoro', 'peligrosidad' => 'Medio'],
            ['nombre' => 'Orni', 'especie' => 'Ornitholestes', 'dieta' => 'Omnívoro', 'peligrosidad' => 'Medio'],
            ['nombre' => 'Theri', 'especie' => 'Therizinosaurus', 'dieta' => 'Omnívoro', 'peligrosidad' => 'Alto'],

            // Carnívoros
            ['nombre' => 'Blue', 'especie' => 'Velociraptor', 'dieta' => 'Carnívoro', 'peligrosidad' => 'Muy Alto'],
            ['nombre' => 'Dilo', 'especie' => 'Dilophosaurus', 'dieta' => 'Carnívoro', 'peligrosidad' => 'Muy Alto'],
            ['nombre' => 'Carno', 'especie' => 'Carnotaurus', 'dieta' => 'Carnívoro', 'peligrosidad' => 'Muy Alto'],
            ['nombre' => 'Allo', 'especie' => 'Allosaurus', 'dieta' => 'Carnívoro', 'peligrosidad' => 'Muy Alto'],
            ['nombre' => 'Rexy', 'especie' => 'Tyrannosaurus rex', 'dieta' => 'Carnívoro', 'peligrosidad' => 'Extremo'],
            ['nombre' => 'Spino', 'especie' => 'Spinosaurus', 'dieta' => 'Carnívoro', 'peligrosidad' => 'Extremo'],
            ['nombre' => 'Giga', 'especie' => 'Giganotosaurus', 'dieta' => 'Carnívoro', 'peligrosidad' => 'Extremo'],
            ['nombre' => 'Indominus', 'especie' => 'Indominus rex', 'dieta' => 'Carnívoro', 'peligrosidad' => 'Crítico'],
        ];

        foreach ($dinosaurios as $dino) {
            Dinosaurio::create([
                'nombre' => $dino['nombre'],
                'especie' => $dino['especie'],
                'dieta' => $dino['dieta'] ?? 'Herbívoro',
                'edad' => rand(1, 20),
                'peligrosidad' => $dino['peligrosidad'],
                'estado_salud' => 'Excelente',
                'celda_id' => $celdas->random()->id
            ]);
        }
    }
}