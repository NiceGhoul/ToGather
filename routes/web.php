<?php

use App\Http\Controllers\CampaignController;
use App\Http\Controllers\UserController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', [CampaignController::class, 'index']);

Route::resource('campaigns', CampaignController::class)->except('index');

Route::resource('users', UserController::class)->except('index');

Route::get('/login', [UserController::class, 'index'])->name('users.index');
Route::post('/login', [UserController::class, 'login'])->name('users.login');

Route::get('/users/{user}/activate', [UserController::class, 'activate'])->name('users.activate');

Route::post('/users/{user}/activate', [UserController::class, 'activateUser'])->name('users.activateUser');
