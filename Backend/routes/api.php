<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

use App\Http\Controllers\AuthController;
use App\Http\Controllers\HistoryController;

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');

// Profile & Auth
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);
Route::post('/profile/update', [AuthController::class, 'updateProfile']);
Route::post('/profile/password', [AuthController::class, 'changePassword']);

Route::get('/home', [HistoryController::class, 'getHomeData']);
Route::get('/history', [HistoryController::class, 'getHistoryData']);
Route::post('/scan', [HistoryController::class, 'store']);
