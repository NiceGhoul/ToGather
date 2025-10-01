<?php

namespace App\Http\Controllers;

use App\Enums\VerificationStatus;
use App\Models\User;
use App\Models\VerificationRequest;
use App\Models\VerificationImage;
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
        $requests = VerificationRequest::with(['user', 'images'])
            ->whereIn('status', $baseStatuses)->when($request->input('status'), function ($query, $status) {
                return $query->where('status', $status);
            })
            ->get();;
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
                if ($request->images) {
                    // Delete image files
                    Storage::disk('public')->delete($request->images->id_photo_path);
                    Storage::disk('public')->delete($request->images->selfie_with_id_path);
                    // Delete image record
                    $request->images->delete();
                }
                $request->delete();
            }
            
            $validated = $request->validate([
                'id_photo' => 'required|image|max:2048',
                'selfie_with_id' => 'required|image|max:2048',
            ]);
            
            // Store files
            $idPhotoPath = $request->file('id_photo')->store('verification/id_photos', 'public');
            $selfieWithIdPath = $request->file('selfie_with_id')->store('verification/selfies', 'public');
            
            // Create verification request
            $verificationRequest = VerificationRequest::create([
                'user_id' => $user->id,
                'status' => 'pending'
            ]);
            
            // Create verification images
            $verificationRequest->images()->create([
                'id_photo_path' => $idPhotoPath,
                'selfie_with_id_path' => $selfieWithIdPath,
            ]);
            
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
