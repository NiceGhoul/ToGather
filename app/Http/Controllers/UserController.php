<?php

namespace App\Http\Controllers;

use App\Enums\UserRole;
use App\Enums\UserStatus;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;
use Illuminate\Validation\Rule;
use Illuminate\Validation\ValidationException;
use SebastianBergmann\CodeCoverage\Report\Html\Dashboard;

class UserController extends Controller
{
    public function index(Request $request)
    {
        $users = User::query()
            ->with('profileImage')
            ->when($request->input('status'), function ($query, $status) {
                return $query->where('status', 'like', $status);
            })
            ->get();

        return Inertia::render('Admin/User/User_List', [
            'users' => $users,
            'filters' => $request->only(['status'])
        ]);
    }
    public function block(User $user)
    {
        $user->update(['status' => 'banned']);
        return back()->with('success', 'User has been banned.');
    }

    public function unblock(User $user)
    {
        $user->update(['status' => 'active']);
        return back()->with('success', 'User has been unblocked.');
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
            'role' => ['required', Rule::in(array_column(UserRole::cases(), 'value'))],
            'status' => ['required', Rule::in(array_column(UserStatus::cases(), 'value'))],
        ]);

        $validated['password'] = Hash::make($validated['password']);

        $user = User::create($validated);

        if ($validated['status'] === 'inactive') {
            return Inertia::location(route('users.activate', ['user' => $user->id]));
        } else {
            return Inertia::location(route('login')); // login page
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

    public function destroy(User $campaign) {}


    public function login(Request $request)
    {
        $credentials = $request->validate([
            'email' => 'required|email',
            'password' => 'required',
        ]);

        if (Auth::attempt($credentials)) {
            $request->session()->regenerate();

            $user = Auth::user();

            if ($user->role === UserRole::Admin) {
                return Inertia::location(route('admin.dashboard'));
            }

            return Inertia::location('/');
        }

        // Return error jika login gagal
        return redirect()->back()->withErrors([
            'email' => 'Incorrect email or password.'
        ])->withInput($request->except('password'));
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

    public function dashboard()
    {
        if (Auth::user()->role !== UserRole::Admin) {
            return redirect('/');
        }

        return Inertia::render('Admin/Dashboard');
    }

    public function showLogin()
    {
        return Inertia::render('Login/Login');
    }
}
