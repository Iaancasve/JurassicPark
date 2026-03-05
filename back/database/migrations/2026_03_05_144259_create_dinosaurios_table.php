<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('dinosaurios', function (Blueprint $table) {
            $table->id();
            $table->string('nombre');
            $table->string('especie');
            $table->enum('dieta', ['Herbívoro', 'Carnívoro', 'Omnívoro']);
            $table->integer('edad');
            $table->enum('estado_salud', ['Excelente', 'Bueno', 'Enfermo', 'Crítico'])->default('Bueno');
            // Relación con la tabla celdas
            $table->foreignId('celda_id')->constrained('celdas')->onDelete('cascade');
            
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('dinosaurios');
    }
};