<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\VerificationRequest;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class VerificationRequestController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $requests = VerificationRequest::with('user')
            ->where('status', 'pending')->latest()->get();
        return Inertia::render('Admin/User/Verification', [
            'requests' => $requests,
        ]);
    }

    public function verifyUser(Request $request, User $user)
    {
        $validated = $request->validate([
            'acceptance' => 'required|string|in:accepted,rejected',
        ]);

        $adminId = Auth::id();
        $verification = VerificationRequest::where('user_id', $user->id)->firstOrFail();

        $verification->status = ($validated['acceptance'] === 'accepted') ? 'approved' : 'rejected';

        $verification->reviewed_by = $adminId;

        $verification->save();

        return response()->json([
            'message' => "User status successfully updated to '{$verification->status}'."
        ], 200);
    }



    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        //
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
