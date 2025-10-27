<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;

class ProfileController extends Controller
{
    public function show()
    {
        $user = auth()->user();
        
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
        ]);

        $user->nickname = $request->nickname;
        
        if ($request->filled('password')) {
            $user->password = bcrypt($request->password);
        }
        
        $user->save();

        return redirect()->route('profile.show')->with('success', 'Profile updated successfully!');
    }
}