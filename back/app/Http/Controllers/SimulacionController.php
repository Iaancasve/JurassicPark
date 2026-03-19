<?php

namespace App\Http\Controllers;

use App\Models\Celda;
use App\Events\CeldaUpdated;
use Illuminate\Http\Request;

class SimulacionController extends Controller
{
    public function ejecutar()
    {
        $celdas = Celda::all();

        foreach ($celdas as $celda) {
            // Bajamos alimento (entre 2 y 8) y subimos averías (20% probabilidad)
            $celda->alimento = max(0, $celda->alimento - rand(2, 8));
            if (rand(1, 100) <= 20) { 
                $celda->averias += 1; 
            }
            $celda->save();

            // Esto envía los datos a Reverb
            broadcast(new CeldaUpdated($celda));
        }

        return response()->json(['message' => 'Simulación completada con éxito']);
    }
}
