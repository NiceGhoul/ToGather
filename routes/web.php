<?php
use App\Http\Controllers\LookupController;
use App\Http\Controllers\ArticleController;
use App\Http\Controllers\CampaignController;
use App\Http\Controllers\DonationController;
use App\Http\Controllers\ImageController;
use App\Http\Controllers\FileController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\VerificationRequestController;
use App\Models\VerificationRequest;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Storage;
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
    Route::get('/campaigns/getList', [CampaignController::class, 'getCampaignListData'])->name('campaigns.getAllList');
    Route::get('/campaigns/details/{id}', [CampaignController::class, 'getCampaignDetails'])->name('campaigns.getCampaignDetail');
    Route::post('/campaigns/newCampaign', [CampaignController::class, 'createNewCampaign'])->name('campaigns.createNewCampaign');
    Route::post('/campaigns/toggleLike',[CampaignController::class, 'ToggleLike'])->name('campaigns.toggleLikes');
    // Route::get('/campaigns/create', [CampaignController::class, 'create'])->name('campaigns.create');

    //===========

    Route::get('/articles/create', [ArticleController::class, 'create'])->name('articles.create');
    Route::post('/articles', [ArticleController::class, 'store'])->name('articles.store');
    Route::get('/articles/list', [ArticleController::class, 'index'])->name('articles.index');
    Route::get('/articles/{id}', [ArticleController::class, 'show'])->name('articles.show');




    Route::get('/verification/create', [VerificationRequestController::class, 'create'])->name('verification.create');
    Route::post('/verification', [VerificationRequestController::class, 'store'])->name('verification.store');
    Route::post('/upload-image', [ImageController::class, 'upload'])->name('image.upload');

    // MinIO file uploads
    Route::post('/api/upload-image', [ImageController::class, 'uploadImage'])->name('api.upload.image');
    Route::post('/api/upload-document', [FileController::class, 'uploadDocument'])->name('api.upload.document');
    Route::delete('/api/delete-file', [FileController::class, 'deleteFile'])->name('api.delete.file');


    Route::post('/users/{user}/verify', [VerificationRequestController::class, 'verifyUser'])->name('verify.user');

    // Donations
    Route::get('/donate', [DonationController::class, 'create'])->name('donations.create');
    Route::post('/donations', [DonationController::class, 'store'])->name('donations.store');
    Route::get('/api/search-campaigns', [DonationController::class, 'searchCampaigns'])->name('api.search.campaigns');
});

// Video upload and retrieval
Route::post('/api/upload-video', [FileController::class, 'uploadVideo'])->name('api.upload.video');
Route::get('/api/get-video', [FileController::class, 'getVideo'])->name('api.get.video');


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

    Route::get('/articles/list', [ArticleController::class, 'adminApprovedIndex'])->name('articles.index');
    Route::get('/articles/requests', [ArticleController::class, 'adminRequestIndex'])->name('articles.requests');
    Route::get('/articles/{id}/view', [ArticleController::class, 'adminViewArticle'])->name('articles.view');
    Route::post('/articles/{id}/approve', [ArticleController::class, 'adminApprove'])->name('articles.approve');
    Route::post('/articles/{id}/disable', [ArticleController::class, 'adminDisable'])->name('articles.disable');
    Route::post('/articles/{id}/reject', [ArticleController::class, 'adminReject'])->name('articles.reject');
    Route::post('/articles/{id}/delete', [ArticleController::class, 'adminDelete'])->name('articles.delete');



    Route::get('/lookups', [LookupController::class, 'index'])->name('lookups.index');
    Route::post('/lookups/store', [LookupController::class, 'store'])->name('lookups.store');
    Route::post('/lookups/update/{id}', [LookupController::class, 'update'])->name('lookups.update');
    Route::post('/lookups/delete/{id}', [LookupController::class, 'destroy'])->name('lookups.destroy');
});
