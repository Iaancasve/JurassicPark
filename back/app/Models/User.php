<?php

namespace App\Models;

use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class User extends Authenticatable
{
    use HasFactory, Notifiable;

    protected $fillable = [
        'nick',
        'password',
        'foto',
        'role_id',
    ];

    protected $hidden = [
        'password',
        'remember_token',
    ];

    // Relación: Un usuario pertenece a un Rol
    public function role()
    {
        return $this->belongsTo(Role::class);
    }
}