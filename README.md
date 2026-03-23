# 🦖 JurassicPark Management System

Guía rápida para la configuración del entorno, población de datos y ejecución de servicios.

# Instalar dependencias

# En back 
composer install

# Crear la estructura de tablas
php artisan migrate

# Poblar con datos iniciales (Ejecuta DatabaseSeeder)
php artisan db:seed

# Generar clave única de aplicación
php artisan key:generate

# En front 
npm install

Backend (API): ```bash
cd back
php artisan serve

Reverb (WebSockets): ```bash
cd back
php artisan reverb:start

Frontend (Vite): ```bash
cd front
npm run dev
