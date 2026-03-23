🛠️ Instalación y Puesta en Marcha
Sigue estos pasos para configurar la base de datos y levantar los servicios del ecosistema JurassicPark.

1. Base de Datos (Migraciones y Seeds)
Desde la carpeta back, prepara las tablas y carga los datos iniciales (Roles, Usuarios, Celdas y Dinosaurios):

Bash
# Crear la estructura de tablas
php artisan migrate

# Poblar la base de datos con datos de prueba
php artisan db:seed

2. Ejecución de los Servicios
Para que la aplicación funcione correctamente, deben estar activos el servidor web, el sistema de mensajería en tiempo real (Reverb) y el frontend.

Opción Recomendada (Todo en uno)
El proyecto incluye un script de composer que utiliza concurrently para levantar todos los servicios en una sola terminal. Ejecútalo desde la carpeta back:

Bash
composer run dev
Este comando inicia simultáneamente: Server (Artisan), WebSockets (Reverb), Logs (Pail) y Frontend (Vite).

Manual 

Terminal 1 - Backend (API):

Bash
cd back
php artisan serve

Terminal 2 - Reverb (WebSockets):

Bash
cd back
php artisan reverb:start

Terminal 3 - Frontend (Vite):

Bash
cd front
npm run dev
📦 Tecnologías Principales
Backend: Laravel 12

Frontend: TypeScript & Vite

Real-time: Laravel Reverb
