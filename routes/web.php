<?php
use App\Http\Controllers\LookupController;
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

    Route::get('/campaigns/create', [CampaignController::class, 'create'])->name('campaigns.create');

    Route::get('/articles/create', [ArticleController::class, 'create'])->name('articles.create');
    Route::post('/articles', [ArticleController::class, 'store'])->name('articles.store');
    Route::get('/articles/list', [ArticleController::class, 'index'])->name('articles.index');
    Route::get('/articles/{id}', [ArticleController::class, 'show'])->name('articles.show');
    Route::post('/articles/upload-image', [ArticleController::class, 'uploadContentImage']);





    Route::get('/verification/create', [VerificationRequestController::class, 'create'])->name('verification.create');
    Route::post('/verification', [VerificationRequestController::class, 'store'])->name('verification.store');
    Route::post('/upload-image', [ImageController::class, 'upload'])->name('image.upload');

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

    Route::get('/articles/list', [ArticleController::class, 'adminIndex'])->name('articles.index');
    Route::get('/articles/requests', [ArticleController::class, 'adminRequestIndex'])->name('articles.requests');
    Route::get('/articles/{id}/view', [ArticleController::class, 'adminViewArticle'])->name('articles.view');
    Route::post('/articles/{id}/approve', [ArticleController::class, 'adminApprove'])->name('articles.approve');
    Route::post('/articles/{id}/disable', [ArticleController::class, 'adminDisable'])->name('articles.disable');
    Route::post('/articles/{id}/reject', [ArticleController::class, 'adminReject'])->name('articles.reject');
    Route::post('/articles/{id}/delete', [ArticleController::class, 'adminDelete'])->name('articles.delete');
    Route::get('/articles/{id}/edit', [ArticleController::class, 'adminEdit'])->name('articles.edit');
    Route::post('/articles/{id}/update', [ArticleController::class, 'adminUpdate'])->name('articles.update');

    // Bulk routes
    Route::post('/articles/bulk-approve', [ArticleController::class, 'adminBulkApprove'])->name('articles.bulk.approve');
    Route::post('/articles/bulk-disable', [ArticleController::class, 'adminBulkDisable'])->name('articles.bulk.disable');
    Route::post('/articles/bulk-delete', [ArticleController::class, 'adminBulkDelete'])->name('articles.bulk.delete');


    Route::get('/lookups', [LookupController::class, 'index'])->name('lookups.index');
    Route::post('/lookups/store', [LookupController::class, 'store'])->name('lookups.store');
    Route::post('/lookups/update/{id}', [LookupController::class, 'update'])->name('lookups.update');
    Route::post('/lookups/delete/{id}', [LookupController::class, 'destroy'])->name('lookups.destroy');
});
