<?php

use App\Http\Controllers\CampaignController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\VerificationRequestController;
use App\Models\VerificationRequest;
use Illuminate\Support\Facades\Route;
use App\Http\Middleware\RedirectIfAuthenticated;
use Inertia\Inertia;



Route::get('/', [CampaignController::class, 'index']);
Route::get('/admin/users/list', [UserController::class, 'index'])->name('users.index');
Route::get('/admin/users/verification', [VerificationRequestController::class, 'index'])->name('verification.index');
Route::get('/admin/campaigns/list', [CampaignController::class, 'AdminCampaign'])->name('admin.campaign');
Route::get('/admin/campaigns/verification', [CampaignController::class, 'AdminVerification'])->name('admin.campaign.verification');

Route::resource('campaigns', CampaignController::class)->except('index');

Route::post('/users/{user}/verify', [VerificationRequestController::class, 'verifyUser'])->name('verify.user');
Route::resource('users', UserController::class)->except('index');

Route::get('/login', [UserController::class, 'showLogin'])
->middleware(RedirectIfAuthenticated::class)
->name('users.showLogin');

Route::get('/users/create', [UserController::class, 'create'])
->middleware(RedirectIfAuthenticated::class);

Route::post('/login', [UserController::class, 'login'])->name('users.login');
Route::post('/users/verify-otp', [UserController::class, 'verifyOtp']);

Route::get('/admin/dashboard', [UserController::class, 'dashboard'])
->middleware(['auth']) 
->name('admin.dashboard'); 


Route::get('/check-email', [UserController::class, 'checkEmail']);


Route::post('/logout', [UserController::class, 'logout'])->name('logout');



