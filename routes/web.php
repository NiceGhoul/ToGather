<?php

use App\Http\Controllers\ArticleController;
use App\Http\Controllers\CampaignController;
use App\Http\Controllers\ImageController;
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
    Route::post('/users/send-otp', [UserController::class, 'sendOtp']);
    Route::post('/users/verify-otp', [UserController::class, 'verifyOtp']);
});

// --- Authenticated Routes ---
// Must be logged in to access.
Route::middleware('auth')->group(function () {
    Route::post('/logout', [UserController::class, 'logout'])->name('logout');

    // campaigns routing
    Route::get('/campaigns/create', [CampaignController::class, 'showCreate'])->name('campaigns.showCreate');
    Route::get('/campaigns/list', [CampaignController::class, 'showList'])->name('campaigns.showList');
    Route::get('/campaigns/getlist', [CampaignController::class, 'getCampaignListData'])->name('campaigns.getAllList');
    Route::post('/campaigns/newCampaign', [CampaignController::class, 'createNewCampaign'])->name('campaigns.createNewCampaign');


    //===========
    Route::get('/articles/create', [ArticleController::class, 'create'])->name('articles.create');
    Route::get('/verification/create', [VerificationRequestController::class, 'create'])->name('verification.create');
    Route::post('/verification', [VerificationRequestController::class, 'store'])->name('verification.store');
    Route::post('/api/upload-image', [ImageController::class, 'uploadImage'])->name('images.upload');

    Route::post('/users/{user}/verify', [VerificationRequestController::class, 'verifyUser'])->name('verify.user');
});


// --- Admin Routes ---
// Must be logged in AND have the 'admin' role.
Route::middleware(['auth'])->prefix('admin')->name('admin.')->group(function () {
    Route::get('/dashboard', [UserController::class, 'dashboard'])->name('dashboard');

    Route::get('/users/list', [UserController::class, 'index'])->name('users.index');
    Route::post('/users/{user}/block', [UserController::class, 'block'])->name('admin.users.block');
    Route::post('/users/{user}/unblock', [UserController::class, 'unblock'])->name('admin.users.unblock');
    Route::get('/users/verification', [VerificationRequestController::class, 'index'])->name('verification.index');

    Route::get('/campaigns/list', [CampaignController::class, 'AdminCampaign'])->name('campaign.index');
    Route::get('/campaigns/verification', [CampaignController::class, 'AdminVerification'])->name('campaign.verification');
});
