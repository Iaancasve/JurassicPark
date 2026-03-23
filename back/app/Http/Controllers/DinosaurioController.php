<?php

namespace App\Http\Controllers;

use App\Models\Dinosaurio;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class DinosaurioController extends Controller
{
    public function index()
    {
        $dinos = Dinosaurio::with('celda')->get();
        return response()->json(["success" => true, "data" => $dinos], 200);
    }

    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'nombre' => 'required|string|max:255',
            'especie' => 'required|string|max:255',
            'dieta' => 'required|in:Herbívoro,Carnívoro,Omnívoro',
            'edad' => 'required|integer|min:0',
            'estado_salud' => 'required|in:Excelente,Bueno,Enfermo,Crítico',
            'celda_id' => 'required|exists:celdas,id'
        ]);

        if ($validator->fails()) {
            return response()->json(['success' => false, 'errors' => $validator->errors()], 422);
        }

        $dino = Dinosaurio::create($request->all());
        return response()->json(["success" => true, "data" => $dino, "message" => "Dinosaurio registrado correctamente"], 201);
    }
    
    public function show($id)
    {
        $dino = Dinosaurio::with('celda')->find($id);
        if (!$dino) {
            return response()->json(["success" => false, "message" => "Dinosaurio no encontrado"], 404);
        }
        return response()->json(["success" => true, "data" => $dino], 200);
    }

    public function update(Request $request, $id)
    {
        $dino = Dinosaurio::find($id);
        if (!$dino) {
            return response()->json(["success" => false, "message" => "Dinosaurio no encontrado"], 404);
        }

        $validator = Validator::make($request->all(), [
            'nombre'       => 'sometimes|string|max:255',
            'especie'      => 'sometimes|string|max:255',
            'dieta'        => 'sometimes|in:Herbívoro,Carnívoro,Omnívoro',
            'edad'         => 'sometimes|integer|min:0',
            'peligrosidad' => 'sometimes|in:Bajo,Medio,Alto,Muy Alto,Extremo,Crítico',
            'estado_salud' => 'sometimes|in:Excelente,Bueno,Enfermo,Crítico',
            'celda_id'     => 'sometimes|exists:celdas,id'
        ]);

        if ($validator->fails()) {
            return response()->json(['success' => false, 'errors' => $validator->errors()], 422);
        }

        $dino->update($request->all());
        return response()->json(["success" => true, "data" => $dino, "message" => "Datos del dinosaurio actualizados"], 200);
    }

    public function destroy($id)
    {
        $dino = Dinosaurio::find($id);
        if (!$dino) {
            return response()->json(["success" => false, "message" => "Dinosaurio no encontrado"], 404);
        }

        $dino->delete();
        return response()->json(["success" => true, "message" => "Dinosaurio eliminado del registro"], 200);
    }
}