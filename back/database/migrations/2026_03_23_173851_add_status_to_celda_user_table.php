<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up()
    {
    Schema::table('celda_user', function (Blueprint $table) {
        // Por defecto, cuando se asigna, la tarea está 'pendiente'
        $table->string('estado')->default('pendiente'); 
    });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('celda_user', function (Blueprint $table) {
            //
        });
    }
};
