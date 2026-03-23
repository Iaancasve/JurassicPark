<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;

class CheckRole
{
    public function handle(Request $request, Closure $next, string $role)
    {
        // Comprobamos si el usuario autenticado tiene el rol que pide la ruta
        if ($request->user() && $request->user()->role->nombre !== $role) {
            return response()->json([
                'success' => false, 
                'message' => 'No tienes permisos de Administrador para esta acción.'
            ], 403);
        }

        return $next($request);
    }
}