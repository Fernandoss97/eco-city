<?php

use App\Http\Controllers\Api\V1\ArticleController;
use App\Http\Controllers\Api\V1\AuthController;
use App\Http\Controllers\Api\V1\CepController;
use App\Http\Controllers\Api\V1\CollectionPointController;
use App\Http\Controllers\Api\V1\ContactMessageController;
use App\Http\Controllers\Api\V1\NeighborhoodController;
use App\Http\Controllers\Api\V1\ScheduleController;
use Illuminate\Support\Facades\Route;

Route::prefix('v1')->group(function () {
    Route::middleware('throttle:10,1')->prefix('auth')->group(function () {
        Route::post('register', [AuthController::class, 'register']);
        Route::post('login', [AuthController::class, 'login']);
        Route::post('logout', [AuthController::class, 'logout'])->middleware('auth:sanctum');
        Route::get('me', [AuthController::class, 'me'])->middleware('auth:sanctum');
    });
    Route::middleware('throttle:60,1')->group(function () {
        Route::get('neighborhoods', [NeighborhoodController::class, 'index']);
        Route::get('neighborhoods/resolve', [NeighborhoodController::class, 'resolve']);
        Route::get('neighborhoods/{neighborhood}', [NeighborhoodController::class, 'show']);
        Route::get('neighborhoods/{neighborhood}/schedule', [ScheduleController::class, 'byNeighborhood']);
        Route::get('schedule', [ScheduleController::class, 'monthly']);
        Route::get('collection-points', [CollectionPointController::class, 'index']);
        Route::get('articles', [ArticleController::class, 'index'])->name('articles.index');
        Route::get('articles/{slug}', [ArticleController::class, 'show'])->name('articles.show');
    });

    Route::middleware('throttle:30,1')->group(function () {
        Route::get('cep/{cep}', [CepController::class, 'show'])
            ->where('cep', '\d{8}');
    });

    Route::middleware('throttle:5,1')->group(function () {
        Route::post('contact-messages', [ContactMessageController::class, 'store']);
    });
});
