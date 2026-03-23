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
    public function simularBrecha(Request $request)
    {
        // Si no hay ID, elegimos una celda al azar
        $id = $request->id ?? Celda::inRandomOrder()->first()->id;
        $celda = Celda::with('dinosaurios')->findOrFail($id);


        $probabilidadEscapa = 0;

        // Influencia del nivel de seguridad
        $seguridad = strtolower($celda->seguridad);
        if ($seguridad == 'baja') $probabilidadEscapa += 50;
        if ($seguridad == 'media') $probabilidadEscapa += 25;
        if ($seguridad == 'alta') $probabilidadEscapa += 5;

        // Cada avería suma 10% de riesgo
        $probabilidadEscapa += ($celda->averias * 10);

        // Si tienen menos del 20% de comida, +20% de riesgo
        if ($celda->alimento < 20) {
            $probabilidadEscapa += 20;
        }

        $azar = rand(1, 100);
        $escaparon = $azar <= $probabilidadEscapa;

        $mensaje = "";
        $estadoFinal = "Contenida";

        if ($escaparon) {
            $estadoFinal = "CAOS: Fuga detectada";
            $mensaje = "La seguridad de la celda '{$celda->nombre}' ha fallado. ";

            // Si hay carnívoros, el desastre es mayor
            $hayCarnivoros = $celda->dinosaurios->where('tipo', 'Carnívoro')->count() > 0;
            $mensaje .= $hayCarnivoros
                ? "¡Los carnívoros están sueltos y atacando al personal!"
                : "Los herbívoros han escapado pero la situación está bajo control.";

            // El alimento baja a 0 por el estrés
            $celda->alimento = 0;
            $celda->averias += 2;
        } else {
            $mensaje = "Brecha detectada en '{$celda->nombre}', pero los sistemas de seguridad resistieron con éxito.";
        }

        $celda->save();

        broadcast(new CeldaUpdated($celda))->toOthers();

        return response()->json([
            'success' => true,
            'informe' => [
                'celda' => $celda->nombre,
                'riesgo_calculado' => $probabilidadEscapa . "%",
                'resultado' => $estadoFinal,
                'detalle' => $mensaje,
                'dinos_afectados' => $celda->dinosaurios->count()
            ]
        ]);
    }
}
