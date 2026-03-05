<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use App\Models\Dinosaurio;


class Celda extends Model
{
    protected $fillable = [
    'nombre', 
    'fila', 
    'columna', 
    'capacidad_animales',
    'peligrosidad',
    'alimento', 
    'averias', 
    'seguridad',
];

    // Relación: Una celda tendrá muchos dinosaurios
    public function dinosaurios() {
     return $this->hasMany(Dinosaurio::class);
    } 

}
