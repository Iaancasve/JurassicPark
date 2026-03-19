<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\CeldaController;
use App\Http\Controllers\DinosaurioController;
use Illuminate\Support\Facades\Route;

Route::post('login', [AuthController::class, 'login']);

Route::middleware('auth:sanctum')->group(function () {
    Route::post('logout', [AuthController::class, 'logout']);
    Route::put('/user/update', [AuthController::class, 'updateProfile']);
    Route::get('/user/perfil', [AuthController::class, 'perfil']);

    // Rutas abiertas a todos los empleados 
    Route::get('celdas', [CeldaController::class, 'index']);
    Route::get('celdas/{celda}', [CeldaController::class, 'show']);
    Route::get('dinosaurios', [DinosaurioController::class, 'index']);
    Route::get('dinosaurios/{dinosaurio}', [DinosaurioController::class, 'show']);

    // Rutas protegidas solo para Administradores 
    Route::middleware('role:Administrador')->group(function () {
        // Celdas: crear, editar y borrar
        Route::post('celdas', [CeldaController::class, 'store']);
        Route::put('celdas/{celda}', [CeldaController::class, 'update']);
        Route::delete('celdas/{celda}', [CeldaController::class, 'destroy']);

        // Dinosaurios: crear, editar y borrar
        Route::post('dinosaurios', [DinosaurioController::class, 'store']);
        Route::put('dinosaurios/{dinosaurio}', [DinosaurioController::class, 'update']);
        Route::delete('dinosaurios/{dinosaurio}', [DinosaurioController::class, 'destroy']);
    });
});