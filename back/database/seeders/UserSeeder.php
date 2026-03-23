<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use App\Models\Role;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    public function run(): void
    {
        // Buscamos el ID del rol administrador que acabamos de crear
        $adminRole = Role::where('slug', 'admin')->first();

        User::create([
            'nick' => 'AdminJurassic', 
            'password' => Hash::make('admin123'),
            'foto' => null, 
            'role_id' => $adminRole->id,
        ]);
    }
}