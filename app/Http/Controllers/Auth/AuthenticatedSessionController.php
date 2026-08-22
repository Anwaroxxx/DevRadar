<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Inertia\Inertia;

class AuthenticatedSessionController extends Controller
{
    public function create()
    {
        return Inertia::render('auth/login');
    }

    public function store(Request $request)
    {
        $credentials = $request->validate([
            'email' => 'required|email',
            'password' => 'required',
        ]);

        if (! Auth::attempt($credentials, $request->boolean('remember'))) {
            $user = User::withTrashed()->where('email', $credentials['email'])->first();
            if ($user && $user->trashed() && Hash::check($credentials['password'], $user->password)) {
                return redirect()->route('account.deactivated');
            }

            return back()->withErrors(['email' => 'Invalid credentials.']);
        }

        $request->session()->regenerate();
        $user = Auth::user();
        $user->update(['last_login_at' => now()]);
        $user->awardXp(5, 'daily_login', 'Daily login bonus');

        return redirect()->intended(route('dashboard'));
    }

    public function destroy(Request $request)
    {
        Auth::guard('web')->logout();
        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return redirect()->route('landing');
    }
}
