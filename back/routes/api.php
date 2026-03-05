<?php

use App\Http\Controllers\AuthController;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\CeldaController;
use App\Http\Controllers\DinosaurioController;

Route::post('login', [AuthController::class, 'login']);

Route::middleware('auth:sanctum')->group(function () {
    Route::post('logout', [AuthController::class, 'logout']);

    // Rutas de Celdas
    Route::apiResource('celdas', CeldaController::class);

    // Rutas de Dinosaurios
    Route::apiResource('dinosaurios', DinosaurioController::class);
});