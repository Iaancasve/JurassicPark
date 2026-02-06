<?php

namespace App\Http\Controllers;

use App\Models\Celda;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

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
}
