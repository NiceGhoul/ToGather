<?php

namespace App\Http\Controllers;

use App\Enums\VerificationStatus;
use App\Models\User;
use App\Models\VerificationRequest;
use App\Models\Image;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class VerificationRequestController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $baseStatuses = ['accepted', 'pending', 'rejected'];
        $requests = VerificationRequest::with(['user', 'idPhotoImage', 'selfieImage'])
            ->whereIn('status', $baseStatuses)->when($request->input('status'), function ($query, $status) {
                return $query->where('status', $status);
            })
            ->get();

        // Transform data to include URLs
        $requests->each(function ($request) {
            $request->id_photo_url = $request->id_photo_url;
            $request->selfie_url = $request->selfie_url;
        });

        return Inertia::render('Admin/User/Verification', [
            'requests' => $requests,
            'filters' => $request->only(['status'])
        ]);
    }

    public function verifyUser(Request $request, User $user)
    {
        $validated = $request->validate([
            'acceptance' => 'required|string|in:accepted,rejected',
        ]);

        $adminId = Auth::id();
        $verification = VerificationRequest::where('user_id', $user->id)->firstOrFail();

        $verification->status = ($validated['acceptance'] === 'accepted') ? VerificationStatus::Accepted : VerificationStatus::Rejected;

        $verification->reviewed_by = $adminId;

        $verification->save();

        return response()->json([
            'message' => "User status successfully updated to '{$verification->status->value}'."
        ], 200);
    }



    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return inertia('Verification/Create');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        try {
            $user = auth()->user();

            // Check if user already has a pending or accepted request
            $existingRequest = $user->verificationRequests()
                ->whereIn('status', ['pending', 'accepted'])
                ->first();

            if ($existingRequest) {
                return back()->with('error', 'You already have a verification request.');
            }

            // Delete previous rejected requests and their images
            $rejectedRequests = $user->verificationRequests()
                ->where('status', 'rejected')
                ->get();

            foreach ($rejectedRequests as $request) {
                // Delete image files from MinIO
                if ($request->idPhotoImage) {
                    Storage::disk('minio')->delete($request->idPhotoImage->path);
                    $request->idPhotoImage->delete();
                }
                if ($request->selfieImage) {
                    Storage::disk('minio')->delete($request->selfieImage->path);
                    $request->selfieImage->delete();
                }
                $request->delete();
            }

            $validated = $request->validate([
                'id_photo' => 'required|image|max:2048',
                'selfie_with_id' => 'required|image|max:2048',
            ]);

            // Store files in MinIO
            $idPhotoPath = $request->file('id_photo')->store('verification/id_photos', 'minio');
            $selfieWithIdPath = $request->file('selfie_with_id')->store('verification/selfies', 'minio');

            // Create image records
            $idPhotoImage = Image::create([
                'path' => $idPhotoPath,
                'imageable_type' => VerificationRequest::class,
                'imageable_id' => null, // Will be set after verification request is created
            ]);

            $selfieImage = Image::create([
                'path' => $selfieWithIdPath,
                'imageable_type' => VerificationRequest::class,
                'imageable_id' => null, // Will be set after verification request is created
            ]);

            // Create verification request with image IDs
            $verificationRequest = VerificationRequest::create([
                'user_id' => $user->id,
                'status' => 'pending',
                'id_photo' => $idPhotoImage->id,
                'selfie_with_id' => $selfieImage->id,
            ]);

            // Update image records with verification request ID
            $idPhotoImage->update(['imageable_id' => $verificationRequest->id]);
            $selfieImage->update(['imageable_id' => $verificationRequest->id]);

            return redirect()->route('home')->with('success', 'Verification request submitted successfully.');
        } catch (\Exception $e) {
            Log::error('Verification request error: ' . $e->getMessage());
            return back()->with('error', 'Something went wrong. Please try again.');
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(VerificationRequest $verificationRequest)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(VerificationRequest $verificationRequest)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, VerificationRequest $verificationRequest)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(VerificationRequest $verificationRequest)
    {
        //
    }
}
