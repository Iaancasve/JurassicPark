# 🦖 JurassicPark Management System

Guía rápida para la configuración del entorno, población de datos y ejecución de servicios.

---

## 🛠️ Instalación y Configuración

Sigue estos pasos en orden para preparar el proyecto desde cero:

### 1. Preparación del Backend
Desde la carpeta `back/`, instala las dependencias de PHP y Node.js, y genera la clave de seguridad:
```bash
# Instalar dependencias
composer install
npm install

# Configurar el archivo de entorno
cp .env.example .env

# Generar clave única de aplicación
php artisan key:generate

# Crear la estructura de tablas
php artisan migrate

# Poblar con datos iniciales (Ejecuta DatabaseSeeder)
php artisan db:seed

Backend (API): ```bash
cd back
php artisan serve

Reverb (WebSockets): ```bash
cd back
php artisan reverb:start

Frontend (Vite): ```bash
cd front
npm run dev
