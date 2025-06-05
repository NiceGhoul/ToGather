<?php

use App\Http\Controllers\CampaignController;
use App\Http\Controllers\UserController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', [CampaignController::class, 'index']);

Route::resource('campaigns', CampaignController::class)->except('index');

Route::resource('users', UserController::class)->except('index');
