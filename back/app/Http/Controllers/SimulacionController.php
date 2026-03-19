<?php

namespace App\Http\Controllers;

use App\Models\Celda;
use App\Events\CeldaUpdated;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class SimulacionController extends Controller
{
    public function ejecutar()
    {
        try {
            $celdas = Celda::all();

            foreach ($celdas as $celda) {
                // Simular hambre: bajamos entre 2 y 8 puntos de alimento
                $nuevoAlimento = $celda->alimento - rand(2, 8);
                $celda->alimento = max(0, $nuevoAlimento);

                // Simular averías: 20% de probabilidad de que ocurra un fallo
                if (rand(1, 100) <= 20) {
                    $celda->averias += 1;
                }
                $celda->save();
                broadcast(new CeldaUpdated($celda))->toOthers();
            }

            return response()->json([
                'success' => true,
                'message' => 'Simulación de caos ejecutada. El parque ha envejecido.'
            ], 200);

        } catch (\Exception $e) {
            Log::error("Error en la simulación: " . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Error al ejecutar la simulación'
            ], 500);
        }
    }
}