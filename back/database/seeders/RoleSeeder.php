<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Role;

class RoleSeeder extends Seeder
{
    public function run(): void
    {
        $roles = [
            ['nombre' => 'Administrador', 'slug' => 'admin'],
            ['nombre' => 'Veterinario', 'slug' => 'vet'],
            ['nombre' => 'Mantenimiento', 'slug' => 'maint'],
        ];

        foreach ($roles as $rol) {
            Role::create($rol);
        }
    }
}