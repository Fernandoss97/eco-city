<?php

use App\Http\Controllers\Api\V1\CepController;
use App\Http\Controllers\Api\V1\CollectionPointController;
use App\Http\Controllers\Api\V1\NeighborhoodController;
use App\Http\Controllers\Api\V1\ScheduleController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');

Route::prefix('v1')->group(function () {
    Route::middleware('throttle:60,1')->group(function () {
        Route::get('neighborhoods', [NeighborhoodController::class, 'index']);
        Route::get('neighborhoods/resolve', [NeighborhoodController::class, 'resolve']);
        Route::get('neighborhoods/{neighborhood}', [NeighborhoodController::class, 'show']);
        Route::get('neighborhoods/{neighborhood}/schedule', [ScheduleController::class, 'byNeighborhood']);
        Route::get('schedule', [ScheduleController::class, 'monthly']);
        Route::get('collection-points', [CollectionPointController::class, 'index']);
    });

    Route::middleware('throttle:30,1')->group(function () {
        Route::get('cep/{cep}', [CepController::class, 'show'])
            ->where('cep', '\d{8}');
    });
});
