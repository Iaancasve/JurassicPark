<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\Role;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rule;

class UserController extends Controller
{
    // Listar todos los usuarios con su rol
    public function index()
    {
        return response()->json(User::with('role')->get());
    }

    // Crear un nuevo usuario
    public function store(Request $request)
    {
        $validated = $request->validate([
            'nick'     => 'required|string|unique:users,nick|max:255',
            'password' => 'required|string|min:8',
            'role_id'  => 'required|exists:roles,id', 
        ]);

        $user = User::create([
            'nick'     => $validated['nick'],
            'password' => Hash::make($validated['password']),
            'role_id'  => $validated['role_id'],
        ]);

        return response()->json([
            'message' => 'Usuario creado con éxito',
            'user'    => $user->load('role')
        ], 201);
    }
}