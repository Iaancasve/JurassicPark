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
}