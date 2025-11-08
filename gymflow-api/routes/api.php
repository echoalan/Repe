<?php
use App\Http\Controllers\AuthController;
use App\Http\Controllers\RoutineController;
use App\Http\Controllers\ExerciseController;
use App\Http\Controllers\WorkoutController;
use App\Http\Controllers\WorkoutSetLogController;
use Illuminate\Support\Facades\Route;

use Illuminate\Http\Request;

Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

Route::middleware('auth:sanctum')->group(function () {
    Route::get('/me', [AuthController::class, 'me']);
    Route::post('/logout', [AuthController::class, 'logout']);

    Route::get('/routines', [RoutineController::class, 'index']);
    Route::post('/routines', [RoutineController::class, 'store']);
    Route::get('/routines/{routine}', [RoutineController::class, 'show']);
    Route::put('/routines/{routine}', [RoutineController::class, 'update']);
    Route::delete('/routines/{routine}', [RoutineController::class, 'destroy']);

    Route::post('/routines/{routine}/exercises', [ExerciseController::class, 'store']);
    Route::put('/exercises/{exercise}', [ExerciseController::class, 'update']);
    Route::delete('/exercises/{exercise}', [ExerciseController::class, 'destroy']);


        // 🏋️ Workouts
    Route::get('/workouts', [WorkoutController::class, 'index']);
    Route::post('/workouts', [WorkoutController::class, 'store']);
    Route::get('/workouts/{workout}', [WorkoutController::class, 'show']);
    Route::delete('/workouts/{workout}', [WorkoutController::class, 'destroy']);


        // 👇 acá va la ruta que falta
    Route::post('/workouts/{workout}/logs', [WorkoutSetLogController::class, 'store']);
    Route::get('/workouts/{workout}/logs', [WorkoutSetLogController::class, 'index']);





});
