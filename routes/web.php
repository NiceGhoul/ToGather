<?php
use App\Http\Controllers\HomeController;
use App\Http\Controllers\LookupController;
use App\Http\Controllers\ArticleController;
use App\Http\Controllers\CampaignController;
use App\Http\Controllers\DonationController;
use App\Http\Controllers\ImageController;
use App\Http\Controllers\FileController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\VerificationRequestController;
use App\Http\Controllers\AdminDashboardController;

use App\Models\VerificationRequest;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Storage;
use App\Http\Middleware\RedirectIfAuthenticated;
use Inertia\Inertia;


Route::get('/', function () {
    return redirect('/home');
});
Route::get('/home', [HomeController::class, 'index'])->name('home');
Route::get('/check-email', [UserController::class, 'checkEmail']);
Route::get('/articles/list', [ArticleController::class, 'index'])->name('articles.index');
Route::get('/articles/{id}/details', [ArticleController::class, 'showMyArticleDetails'])->name('articles.myArticles');


// --- Guest Routes ---
// Only accessible by users who are NOT logged in.
Route::middleware(RedirectIfAuthenticated::class)->group(function () {
    Route::get('/login', [UserController::class, 'showLogin'])->name('login');
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
    Route::get('/campaigns/create', [CampaignController::class, 'create'])->name('campaigns.create');
    Route::get('/campaigns/create/{id}', [CampaignController::class, 'editCampaign'])->name('campaigns.edit');
    Route::get('/campaigns/create/createPreview', [CampaignController::class, 'getCreateSupportingMediaData'])->name('campaigns.createPreview');
    Route::get('/campaigns/create/detailsPreview', [CampaignController::class, 'getDetailsPreview'])->name('campaigns.detailsPreview');
    Route::get('/campaigns/likedCampaign', [CampaignController::class, 'showLiked'])->name('campaigns.liked');
    Route::get('/campaigns/list', [CampaignController::class, 'showList'])->name('campaigns.showList');
    Route::get('/campaigns/getList', [CampaignController::class, 'getCampaignListData'])->name('campaigns.getAllList');
    Route::get('/campaigns/myCampaigns', [CampaignController::class, 'showMyCampaigns'])->name('campaigns.showMyCampaigns');
    Route::get('/campaigns/details/{id}', [CampaignController::class, 'getCampaignDetails'])->name('campaigns.getCampaignDetail');
    Route::post('/campaigns/upload-image', [CampaignController::class, 'uploadSupportingMedia'])->name('campaigns.uploadImages');
    Route::post('/campaigns/newCampaign', [CampaignController::class, 'createNewCampaign'])->name('campaigns.createNewCampaign');
    Route::post('/campaigns/toggleLike', [CampaignController::class, 'ToggleLike'])->name('campaigns.toggleLikes');


    //articles routing
    Route::get('/articles/create', [ArticleController::class, 'create'])->name('articles.create');
    Route::post('/articles', [ArticleController::class, 'store'])->name('articles.store');
    Route::get('/articles/list', [ArticleController::class, 'index'])->name('articles.index');
    Route::get('/articles/likedArticles', [ArticleController::class, 'showLiked'])->name('articles.liked');
    Route::get('/articles/myArticles', [ArticleController::class, 'showMyArticles'])->name('articles.myArticles');


    Route::get('/articles/{id}/edit', [ArticleController::class, 'userEdit'])->name('articles.userEdit');
    Route::post('/articles/{id}/update', [ArticleController::class, 'userUpdate'])->name('articles.userUpdate');
    Route::post('/articles/upload-image', [ArticleController::class, 'uploadContentImage']);
    Route::get('/minio/{path}', [ArticleController::class, 'serveImage'])->where('path', '.*')->name('minio.serve');
    Route::post('/articles/{id}/like', [ArticleController::class, 'toggleLike'])->name('articles.toggleLike');
    
    
    
    
    
    
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
    
    // Profile
    Route::get('/profile', [ProfileController::class, 'show'])->name('profile.show');
    Route::get('/profile/edit', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::put('/profile/update', [ProfileController::class, 'update'])->name('profile.update');
    Route::get('/profile/donations-details', [ProfileController::class, 'donationsDetails']);
    Route::get('/profile/campaigns-details', [ProfileController::class, 'campaignsDetails']);
    Route::get('/profile/raised-details', [ProfileController::class, 'raisedDetails']);
    Route::get('/profile/articles-details', [ProfileController::class, 'articlesDetails']);
    
    // Notifications
    Route::get('/notifications', [\App\Http\Controllers\NotificationController::class, 'index'])->name('notifications.index');
    Route::post('/notifications/{id}/read', [\App\Http\Controllers\NotificationController::class, 'markAsRead'])->name('notifications.read');
    Route::post('/notifications/read-all', [\App\Http\Controllers\NotificationController::class, 'markAllAsRead'])->name('notifications.readAll');
});

// Video upload and retrieval
Route::post('/api/upload-video', [FileController::class, 'uploadVideo'])->name('api.upload.video');
Route::get('/api/get-video', [FileController::class, 'getVideo'])->name('api.get.video');

// Midtrans webhook
Route::post('/midtrans/callback', [DonationController::class, 'midtransCallback'])->name('midtrans.callback');

Route::get('/articles/{id}', [ArticleController::class, 'show'])->name('articles.show');

// --- Admin Routes ---
// Must be logged in AND have the 'admin' role.
Route::middleware(['auth'])->prefix('admin')->name('admin.')->group(function () {
    Route::get('/dashboard', [AdminDashboardController::class, 'index'])->name('dashboard');

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
    Route::post('/articles/{id}/enable', [ArticleController::class, 'adminEnable'])->name('articles.enable');
    Route::post('/articles/{id}/disable', [ArticleController::class, 'adminDisable'])->name('articles.disable');
    Route::post('/articles/{id}/reject', [ArticleController::class, 'adminReject'])->name('articles.reject');
    Route::post('/articles/{id}/delete', [ArticleController::class, 'adminDelete'])->name('articles.delete');
    Route::get('/articles/{id}/edit', [ArticleController::class, 'adminEdit'])->name('articles.edit');
    Route::post('/articles/{id}/update', [ArticleController::class, 'adminUpdate'])->name('articles.update');

    // Article Bulk routes
    Route::post('/articles/bulk-approve', [ArticleController::class, 'adminBulkApprove'])->name('articles.bulk.approve');
    Route::post('/articles/bulk-disable', [ArticleController::class, 'adminBulkDisable'])->name('articles.bulk.disable');
    Route::post('/articles/bulk-delete', [ArticleController::class, 'adminBulkDelete'])->name('articles.bulk.delete');
    Route::post('/articles/bulk-reject', [ArticleController::class, 'adminBulkReject'])->name('articles.bulk.reject');


    Route::get('/lookups', [LookupController::class, 'index'])->name('lookups.index');
    Route::post('/lookups/store', [LookupController::class, 'store'])->name('lookups.store');
    Route::post('/lookups/update/{id}', [LookupController::class, 'update'])->name('lookups.update');
    Route::post('/lookups/delete/{id}', [LookupController::class, 'destroy'])->name('lookups.destroy');

    Route::get('/transactions', [DonationController::class, 'adminIndex'])->name('transactions.index');
});
