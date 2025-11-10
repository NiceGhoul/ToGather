<?php

namespace App\Http\Controllers;

use App\Enums\UserRole;
use App\Enums\UserStatus;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Mail;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;
use Illuminate\Validation\Rule;
use Illuminate\Validation\ValidationException;
use SebastianBergmann\CodeCoverage\Report\Html\Dashboard;
use App\Http\Controllers\NotificationController;

class UserController extends Controller
{
    public function index(Request $request)
    {
        $users = User::query()
            ->with('images')
            ->when($request->input('status'), function ($query, $status) {
                return $query->where('status', 'like', $status);
            })
            ->when($request->input('search'), function ($query, $search) {
                return $query->where(function ($q) use ($search) {
                    $q->where('nickname', 'like', "%{$search}%")
                        ->orWhere('email', 'like', "%{$search}%");
                });
            })
            ->get();

        return Inertia::render('Admin/User/User_List', [
            'users' => $users,
            'filters' => $request->only(['status', 'search']),
        ]);
    }

    public function block(User $user)
    {
        $user->update(['status' => 'banned']);

        // Notify user about ban
        NotificationController::notifyUser(
            $user->id,
            'account_banned',
            'Account Banned',
            'Your account has been banned. You cannot create new articles or campaigns. Please contact support for more information.',
            ['user_id' => $user->id]
        );

        return back()->with('success', 'User has been banned.');
    }

    public function unblock(User $user)
    {
        $user->update(['status' => 'active']);

        // Notify user about unban
        NotificationController::notifyUser(
            $user->id,
            'account_unbanned',
            'Account Restored',
            'Your account has been restored. You can now create articles and campaigns again.',
            ['user_id' => $user->id]
        );

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

    public function sendOtp(Request $request)
    {
        $request->validate([
            'email' => 'required|email',
        ]);

        $otp = str_pad(random_int(0, 999999), 6, '0', STR_PAD_LEFT);

        // Store OTP in session
        session([
            'otp_' . $request->email => $otp,
            'otp_expires_' . $request->email => now()->addMinutes(5)
        ]);

        // Send OTP via email
        Mail::raw("Your OTP code is: {$otp}\n\nThis code will expire in 5 minutes.", function ($message) use ($request) {
            $message->to($request->email)
                ->subject('Your OTP Code - ToGather');
        });

        return response()->json([
            'success' => true,
            'message' => 'OTP sent to your email'
        ]);
    }

    public function verifyOtp(Request $request)
    {
        $request->validate([
            'email' => 'required|email',
            'otp' => 'required|string|size:6',
        ]);

        $sessionOtp = session('otp_' . $request->email);
        $otpExpires = session('otp_expires_' . $request->email);

        if (!$sessionOtp || !$otpExpires || now()->gt($otpExpires)) {
            return response()->json(['message' => 'OTP expired or not found'], 422);
        }

        if ($sessionOtp !== $request->otp) {
            return response()->json(['message' => 'Invalid OTP'], 422);
        }

        // Clear OTP from session
        session()->forget(['otp_' . $request->email, 'otp_expires_' . $request->email]);

        return response()->json(['success' => true]);
    }


    // 🟥 Ban Selected Users
    public function bulkBan(Request $request)
    {
        $ids = $request->input('ids', []);
        if (empty($ids)) {
            return back()->with('error', 'No users selected.');
        }

        User::whereIn('id', $ids)->update(['status' => 'banned']);

        // Optional: kirim notifikasi
        foreach ($ids as $id) {
            NotificationController::notifyUser(
                $id,
                'account_banned',
                'Account Banned',
                'Your account has been banned as part of an admin action.'
            );
        }

        return back()->with('success', 'Selected users have been banned.');
    }

    // 🟩 Unban Selected Users
    public function bulkUnban(Request $request)
    {
        $ids = $request->input('ids', []);
        if (empty($ids)) {
            return back()->with('error', 'No users selected.');
        }

        User::whereIn('id', $ids)->update(['status' => 'active']);

        foreach ($ids as $id) {
            NotificationController::notifyUser(
                $id,
                'account_unbanned',
                'Account Restored',
                'Your account has been restored. You can now use all features again.'
            );
        }

        return back()->with('success', 'Selected users have been unbanned.');
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
