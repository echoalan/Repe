# 🏋️‍♂️ Repe - Gestión de Rutinas y Ejercicios

![React](https://img.shields.io/badge/React-v18-blue?logo=react)
![Laravel](https://img.shields.io/badge/Laravel-v10-red?logo=laravel)

---

## 📖 Descripción

Aplicación web full stack para gestionar rutinas de entrenamiento y ejercicios.  
Permite a los usuarios crear rutinas, agregar ejercicios con repeticiones y llevar un seguimiento de sus entrenamientos.  

Ideal para deportistas, entrenadores y cualquier persona que quiera organizar sus rutinas de manera simple y moderna.

---

## ⚡ Características

- 📋 Crear, ver y administrar rutinas de entrenamiento.  
- 🏃‍♂️ Agregar ejercicios con repeticiones por rutina.  
- 🔒 Autenticación segura con JWT.  
- ✨ Interfaz moderna y responsiva con animaciones suaves.  

---

## 🛠 Tecnologías

- **Frontend:** React  
- **Backend:** Laravel (PHP)  
- **Base de datos:** MySQL  
- **Autenticación:** JWT  

---

## 🖥 Instalación

1. Clonar el repositorio:
   ```bash
   git clone https://github.com/echoalan/Repe.git
   cd Repe
   ```
2. Instalar dependencias del frontend:
    ```bash
    cd gymflow-frontend
    npm install
    npm start
    ```
3. Instalar dependencias del backend:
    ```bash
    cd ../gymflow-api
    composer install
    cp .env.example .env
    php artisan key:generate
    php artisan migrate
    php artisan serve
    ```
4. Configurar tu .env


