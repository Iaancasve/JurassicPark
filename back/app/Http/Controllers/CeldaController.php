<?php

namespace App\Http\Controllers;

use App\Models\Celda;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use App\Events\CeldaUpdated;

class CeldaController extends Controller
{
    public function index()
    {
        $celdas = Celda::all();
        return response()->json(["success" => true, "data" => $celdas, "message" => "Mapa cargado"], 200);
    }

    public function store(Request $request)
    {
        $input = $request->all();

        $rules = [
            'nombre'             => 'required|string|max:255',
            'fila'               => 'required|integer',
            'columna'            => 'required|integer',
            'capacidad_animales' => 'integer|min:0',
            'peligrosidad'       => 'required|in:Baja,Media,Alta,Extrema',
            'alimento'           => 'integer|between:0,100',
            'averias'            => 'integer|min:0',
            'seguridad'          => 'required|in:Bajo,Medio,Alto,Crítico',
        ];

        $existe = Celda::where('fila', $request->fila)
            ->where('columna', $request->columna)
            ->exists();

        if ($existe) {
            return response()->json([
                'success' => false,
                'message' => 'La posición (Fila: ' . $request->fila . ', Columna: ' . $request->columna . ') ya está ocupada por otra celda.'
            ], 422);
        }

        $messages = [
            'required' => 'El campo :attribute es obligatorio.',
            'in' => 'El valor de :attribute no es válido.',
            'integer' => 'El campo :attribute debe ser un número entero.'
        ];

        $validator = Validator::make($input, $rules, $messages);

        if ($validator->fails()) {
            return response()->json(['success' => false, 'errors' => $validator->errors()], 422);
        }

        $celda = Celda::create($input);
        return response()->json(["success" => true, "data" => $celda, "message" => "Celda creada correctamente"], 201);
    }

    public function show($id)
    {
        $celda = Celda::find($id);
        if (!$celda) return response()->json(["success" => false, "message" => "No existe"], 404);

        return response()->json(["success" => true, "data" => $celda], 200);
    }

    public function update(Request $request, $id)
    {
        $celda = Celda::find($id);
        if (!$celda) return response()->json(["success" => false, "message" => "No existe"], 404);

        $input = $request->all();

        $celda->update($input);

        return response()->json(["success" => true, "data" => $celda, "message" => "Celda actualizada"], 200);
    }

    public function destroy($id)
    {
        $celda = Celda::find($id);
        if (!$celda) return response()->json(["success" => false, "message" => "No existe"], 404);

        $celda->delete();
        return response()->json(["success" => true, "message" => "Celda eliminada del parque"], 200);
    }

    public function contarDinosaurios()
    {
    $celdas = Celda::withCount('dinosaurios')->get();
    
    return response()->json([
        'success' => true,
        'data' => $celdas
    ]);
    }
    
    public function recargarAlimento($id)
    {
    try {
        $celda = Celda::findOrFail($id);
        $celda->alimento = 100;
        $celda->save();

        broadcast(new CeldaUpdated($celda))->toOthers();

        return response()->json([
            'success' => true,
            'message' => 'Alimento recargado al 100%',
            'data' => $celda
        ]);
    } catch (\Exception $e) {
        return response()->json(['success' => false, 'message' => $e->getMessage()], 500);
    }
    }

    public function repararAveria($id)
    {
    try {
        $celda = Celda::findOrFail($id);
        
        if ($celda->averias > 0) {
            $celda->averias -= 1;
            $celda->save();

            
            broadcast(new CeldaUpdated($celda))->toOthers();
        }

        return response()->json([
            'success' => true,
            'message' => 'Avería reparada',
            'data' => $celda
        ]);
    } catch (\Exception $e) {
        return response()->json(['success' => false, 'message' => $e->getMessage()], 500);
    }
    }

    public function asignarTrabajador(Request $request)
    {
    $request->validate([
        'celda_id' => 'required|exists:celdas,id',
        'user_id' => 'required|exists:users,id',
    ]);

    $celda = Celda::findOrFail($request->celda_id);
    
    // Añade al usuario sin borrar a los que ya estaban
    $celda->trabajadores()->syncWithoutDetaching([$request->user_id]);

    return response()->json([
        'success' => true, 
        'message' => 'Personal asignado correctamente'
    ]);
    }
}
