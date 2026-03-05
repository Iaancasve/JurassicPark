<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Dinosaurio extends Model
{
    use HasFactory;

    protected $fillable = [
        'nombre',
        'especie',
        'dieta',
        'edad',
        'peligrosidad', 
        'estado_salud',
        'celda_id'
    ];

    /**
     * Obtener la celda a la que pertenece el dinosaurio.
     */
    public function celda(): BelongsTo
    {
        return $this->belongsTo(Celda::class);
    }
}