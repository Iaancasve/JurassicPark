<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\User;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;

class AuthController extends Controller
{
    public function login(Request $request)
    {

        if (Auth::attempt(['nick' => $request->nick, 'password' => $request->password])) {
            $auth = Auth::user();
            $tokenResult = $auth->createToken('LaravelSanctumAuth');

            $success = [
                'id'    => $auth->id,
                'nick'  => $auth->nick,
                'foto'  => $auth->foto,
                'role'  => $auth->role->slug,
                'token' => $tokenResult->plainTextToken,
            ];

            return response()->json(["success" => true, "data" => $success, "message" => "¡Bienvenido al parque!"], 200);
        } else {
            return response()->json(["success" => false, "message" => "No autorizado"], 401);
        }
    }

    public function logout(Request $request)
    {

        $user = Auth::user();
        if ($user) {
            $user->tokens()->delete();
            return response()->json(["success" => true, "message" => "Sesión cerrada y tokens eliminados"], 200);
        }
        return response()->json(["success" => false, "message" => "No autorizado"], 401);
    }


    public function updateProfile(Request $request)
    {
        $validated = $request->validate([
            'nick'     => 'required|string|max:255', 
            'password' => 'nullable|string|min:8|confirmed',
        ]);

        $user = $request->user();

        
        $user->nick = $validated['nick'];

        if (!empty($validated['password'])) {
            $user->password = Hash::make($validated['password']);
        }

        $user->save();

        return response()->json([
            'status'  => 'success',
            'message' => 'Perfil actualizado correctamente',
            'data'    => $user
        ]);
    }
    

    public function perfil(Request $request)
    {
    return response()->json($request->user());
    }
}
