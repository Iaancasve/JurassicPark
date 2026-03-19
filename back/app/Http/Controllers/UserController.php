<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\Role;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rule;
use Illuminate\Support\Facades\Response;

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
    // Actualizar un usuario
    public function update(Request $request, User $user)
    {
        $validated = $request->validate([
            'nick'     => ['required', 'string', 'max:255', Rule::unique('users')->ignore($user->id)],
            'password' => 'nullable|string|min:8',
            'role_id'  => 'required|exists:roles,id',
        ]);

        $user->nick = $validated['nick'];
        $user->role_id = $validated['role_id'];

        if (!empty($validated['password'])) {
            $user->password = Hash::make($validated['password']);
        }

        $user->save();

        return Response::json([
            'message' => 'Usuario actualizado con éxito',
            'user'    => $user->load('role')
        ]);
    }

    // Eliminar un usuario
    public function destroy(User $user)
    {
        // Evitar que el administrador se borre a sí mismo 
        if (auth()->id() === $user->id) {
            return response()->json(['message' => 'No puedes eliminar tu propia cuenta'], 403);
        }

        $user->delete();

        return response()->json(['message' => 'Usuario eliminado correctamente']);
    }
}
