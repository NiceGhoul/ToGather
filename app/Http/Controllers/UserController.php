<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;

class UserController extends Controller
{
    public function index()
    {
        return Inertia::render('Login/Login');
    }

    public function create()
    {
        return Inertia::render('Register/Register');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        // dd($request);
        $validated = $request->validate([
            'nickname' => 'required|string',
            'email' => 'required|email|unique:users,email',
            'address' => 'required|string',
            'password' => 'required|string|min:3',
            'role' => 'required|string',
            'status' => 'required|string',
        ]);

        $validated['password'] = Hash::make($validated['password']);

        $user = User::create($validated);

        if ($validated['status'] === 'inactive') {
        return Inertia::location(route('users.activate', ['user' => $user->id]));
    } else {
        return Inertia::location(route('users.index')); // login page
    }

    }

    public function show(User $user)
    {
        //
    }

    public function edit(User $user)
    {
        //
    }

    public function update(Request $request, User $user)
    {
        $validated = $request->validate([
            'nickname' => 'required|string',
            'email' => 'required|email|unique:users,email,' . $user->id,
            'address' => 'required|string',
            'password' => 'nullable|string|min:3',
            'number' => 'required|string',
            'role' => 'required|string',
            'status' => 'required|string',
        ]);

        if (!empty($validated['password'])) {
            $validated['password'] = Hash::make($validated['password']);
        } else {
            unset($validated['password']); // keep old password
        }

        $user->update($validated);
        dd($validated);
        return redirect('/');
    }

    public function destroy(User $campaign)
    {

    }


    public function login(Request $request)
    {
        $credentials = $request->validate([
            'email' => 'required|email',
            'password' => 'required',
        ]);

        if (Auth::attempt($credentials)) {
            $request->session()->regenerate();
            // dd(Auth::user());
            return Inertia::location('/');
        }

        return redirect()->back()->withErrors([
            'email' => 'The provided credentials do not match our records.',
        ]);
    }



    public function checkEmail(Request $request)
    {
        $email = $request->query('email');

        $exists = User::where('email', $email)->exists();

        return response()->json(['exists' => $exists]);
    }

    public function verifyOtp(Request $request)
    {
        $request->validate([
            'email' => 'required|email',
            'otp' => 'required|string|size:6',
        ]);

        $user = User::where('email', $request->email)->firstOrFail();

        // if ($user->otp !== $request->otp) {
        //     return response()->json(['message' => 'Invalid OTP'], 422);
        // }

        return response()->json(['success' => true]);
    }

    public function logout(Request $request)
    {
        Auth::logout();

        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return Inertia::location('/');
    }




}
