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

        return redirect()->route('users.activate', ['user' => $user->id]);
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
    public function activate($userId)
    {
        $user = User::findOrFail($userId);

        return Inertia::render('Register/OTP_Confirmation', [
            'user' => $user->only(['id', 'nickname', 'email', 'address', 'role', 'status']),
        ]);
    }
    public function activateUser(Request $request, User $user)
    {
        $validated = $request->validate([
            'number' => 'required|string',
        ]);
        $user->update([
            'status' => 'active',
        ]);

        return redirect()->route('users.index');
    }

    public function login(Request $request)
    {
        $credentials = $request->validate([
            'email' => 'required|email',
            'password' => 'required',
        ]);

        if (Auth::attempt($credentials)) {
            $request->session()->regenerate();
            return redirect()->intended('/'); // Redirect to intended page or homepage
        }

        return back()->withErrors([
            'email' => 'The provided credentials do not match our records.',
        ]);
    }


}
