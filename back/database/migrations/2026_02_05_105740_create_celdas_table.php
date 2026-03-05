<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('celdas', function (Blueprint $table) {
            $table->id();
            $table->string('nombre');
            $table->integer('fila');    // Posición Y 
            $table->integer('columna'); // Posición X 
            $table->integer('capacidad_animales')->default(0); // Cantidad de animales 
            $table->enum('peligrosidad', ['Baja', 'Media', 'Alta', 'Extrema'])->default('Baja');
            $table->integer('alimento')->default(100); // Porcentaje
            $table->integer('averias')->default(0);    // Número de averías pendientes
            $table->enum('seguridad', ['Bajo', 'Medio', 'Alto', 'Crítico'])->default('Bajo');
            $table->unique(['fila', 'columna']);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('celdas');
    }
};
