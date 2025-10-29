<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Storage;
use App\Models\User;
use App\Models\Image;

class ProfileController extends Controller
{
    public function show()
    {
        $user = auth()->user();
        $user->load('images');
        
        // Transform user to include profile image URL
        $profileImage = $user->images->filter(function($image) {
            return str_starts_with($image->path, 'profile/');
        })->first();
        if ($profileImage) {
            $user->profile_image_url = $profileImage->url;
        }
        
        $stats = [
            'donations_count' => $user->donations()->count(),
            'total_donated' => $user->donations()->sum('amount'),
            'campaigns_count' => $user->campaigns()->count(),
            'active_campaigns' => $user->campaigns()->where('status', 'active')->count(),
            'total_raised' => $user->campaigns()->sum('collected_amount'),
        ];

        $verificationStatus = $user->verificationRequests()->where('status', 'accepted')->exists();
        $verificationRequest = $user->verificationRequests()->latest()->first();

        return Inertia::render('Profile/Show', [
            'user' => $user,
            'stats' => $stats,
            'verificationStatus' => $verificationStatus,
            'verificationRequest' => $verificationRequest,
        ]);
    }

    public function edit()
    {
        return Inertia::render('Profile/Edit', [
            'user' => auth()->user(),
        ]);
    }

    public function update(Request $request)
    {
        $user = auth()->user();
        
        $request->validate([
            'nickname' => 'required|string|max:255',
            'current_password' => 'nullable|current_password',
            'password' => 'nullable|min:8|confirmed',
            'profile_image' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
        ]);

        $user->nickname = $request->nickname;
        
        if ($request->filled('password')) {
            $user->password = bcrypt($request->password);
        }
        
        if ($request->hasFile('profile_image')) {
            // Delete existing profile image
            $existingImage = $user->images()->where('path', 'like', 'profile/%')->first();
            if ($existingImage) {
                Storage::disk('minio')->delete($existingImage->path);
                $existingImage->delete();
            }
            
            // Upload new image to MinIO
            $profilePath = $request->file('profile_image')->store('profile', 'minio');
            $user->images()->create([
                'path' => $profilePath,
            ]);
        }
        
        $user->save();

        return redirect()->route('profile.show')->with('success', 'Profile updated successfully!');
    }

    public function donationsDetails()
    {
        $donations = auth()->user()->donations()
            ->with('campaign:id,title')
            ->select('amount', 'status', 'created_at', 'campaign_id')
            ->orderBy('created_at', 'desc')
            ->get()
            ->map(function ($donation) {
                return [
                    'amount' => $donation->amount,
                    'status' => $donation->status->value ?? $donation->status,
                    'created_at' => $donation->created_at,
                    'campaign_title' => $donation->campaign->title ?? 'Unknown Campaign'
                ];
            });

        return response()->json($donations);
    }

    public function campaignsDetails()
    {
        $campaigns = auth()->user()->campaigns()
            ->select('id', 'title', 'description', 'goal_amount', 'collected_amount', 'status')
            ->orderBy('created_at', 'desc')
            ->get()
            ->map(function ($campaign) {
                return [
                    'title' => $campaign->title,
                    'description' => $campaign->description,
                    'target_amount' => $campaign->goal_amount,
                    'current_amount' => $campaign->collected_amount,
                    'status' => $campaign->status->value ?? $campaign->status
                ];
            });

        return response()->json($campaigns);
    }

    public function raisedDetails()
    {
        $campaigns = auth()->user()->campaigns()
            ->withCount('donations as donors_count')
            ->select('id', 'title', 'goal_amount', 'collected_amount')
            ->where('collected_amount', '>', 0)
            ->orderBy('collected_amount', 'desc')
            ->get()
            ->map(function ($campaign) {
                return [
                    'title' => $campaign->title,
                    'target_amount' => $campaign->goal_amount,
                    'total_raised' => $campaign->collected_amount,
                    'donors_count' => $campaign->donors_count
                ];
            });

        return response()->json($campaigns);
    }
}