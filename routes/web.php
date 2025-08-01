<?php

use App\Http\Controllers\CampaignController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\VerificationRequestController;
use App\Models\VerificationRequest;
use Illuminate\Support\Facades\Route;
use App\Http\Middleware\RedirectIfAuthenticated;
use Inertia\Inertia;



Route::get('/', [CampaignController::class, 'index'])->name('home');
Route::get('/check-email', [UserController::class, 'checkEmail']);

// --- Guest Routes ---
// Only accessible by users who are NOT logged in.
Route::middleware(RedirectIfAuthenticated::class)->group(function () {
    Route::get('/Login', [UserController::class, 'showLogin'])->name('login');
    Route::post('/user/login', [UserController::class, 'login']); 

    Route::get('/users/create', [UserController::class, 'create'])->name('register');
    Route::post('/users', [UserController::class, 'store'])->name('users.store');
    Route::post('/users/verify-otp', [UserController::class, 'verifyOtp']);
});

// --- Authenticated Routes ---
// Must be logged in to access.
Route::middleware('auth')->group(function () {
    Route::post('/logout', [UserController::class, 'logout'])->name('logout');
    
    Route::post('/users/{user}/verify', [VerificationRequestController::class, 'verifyUser'])->name('verify.user');

});


// --- Admin Routes ---
// Must be logged in AND have the 'admin' role.
Route::middleware(['auth'])->prefix('admin')->name('admin.')->group(function () {
    Route::get('/dashboard', [UserController::class, 'dashboard'])->name('dashboard');

    Route::get('/users/list', [UserController::class, 'index'])->name('users.index');
    Route::get('/users/verification', [VerificationRequestController::class, 'index'])->name('verification.index');

    Route::get('/campaigns/list', [CampaignController::class, 'AdminCampaign'])->name('campaign.index');
    Route::get('/campaigns/verification', [CampaignController::class, 'AdminVerification'])->name('campaign.verification');
});



