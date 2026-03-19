<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Models\Celda;
use App\Events\CeldaUpdated;

class SimularParque extends Command
{
    protected $signature = 'parque:simular';
    protected $description = 'Simula el paso del tiempo en el parque (hambre y averías)';

    public function handle()
    {
        $celdas = Celda::all();

        foreach ($celdas as $celda) {
            // Simular hambre (baja entre 1 y 5%)
            $celda->alimento = max(0, $celda->alimento - rand(1, 5));

            // 2. Simular averías (10% de probabilidad de que surja una)
            if (rand(1, 100) <= 10) {
                $celda->averias += 1;
            }

            $celda->save();

            // Enviamos la actualización por WebSocket
            event(new CeldaUpdated($celda));
        }

        $this->info('El tiempo ha pasado en el parque...');
    }
}