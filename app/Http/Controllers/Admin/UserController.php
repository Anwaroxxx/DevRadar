<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\AuditLog;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;

class UserController extends Controller
{
    public function index(Request $request)
    {
        $query = User::withTrashed()->withCount(['events', 'jobListings', 'communities']);

        if ($request->search) {
            $query->where(function ($q) use ($request) {
                $q->where('name', 'LIKE', "%{$request->search}%")
                    ->orWhere('email', 'LIKE', "%{$request->search}%")
                    ->orWhere('username', 'LIKE', "%{$request->search}%");
            });
        }

        if ($request->role) {
            $query->where('role', $request->role);
        }

        $users = $query->orderByDesc('created_at')
            ->paginate(20)
            ->withQueryString()
            ->through(fn ($user) => $user->makeVisible(['email', 'role', 'account_status']));

        return Inertia::render('Admin/Users', [
            'users' => $users,
            'filters' => $request->only(['search', 'role']),
        ]);
    }

    public function update(Request $request, User $user)
    {
        $data = $request->validate([
            'role' => 'required|in:developer,moderator,admin',
            'xp' => 'required|integer|min:0',
            'ai_access_until' => 'nullable|date',
        ]);

        $user->fill(collect($data)->except('role')->all())->save();
        $user->syncRoles([$data['role']]);

        return back()->with('success', "User @{$user->username} updated successfully.");
    }

    public function reactivate($id)
    {
        $user = User::withTrashed()->findOrFail($id);

        if ($user->trashed()) {
            $user->restore();
        }

        $user->update(['account_status' => 'active']);

        AuditLog::log(
            auth()->id(),
            'reactivate_user',
            'user',
            $user->id,
            ['username' => $user->username],
            "Reactivated user @{$user->username}"
        );

        return back()->with('success', 'User account reactivated successfully.');
    }

    public function destroy(User $user)
    {

        if ($user->role === 'admin') {
            $adminCount = User::where('role', 'admin')->count();
            if ($adminCount <= 1) {
                return back()->with('error', 'Cannot delete the last admin.');
            }
        }
        $username = $user->username;
        $user->delete();

        return back()->with('success', "User @{$username} deleted.");
    }

    public function verify(User $user)
    {
        $user->update(['is_verified_user' => true]);

        return back()->with('success', "User @{$user->username} verified.");
    }

    public function ban(Request $request, User $user)
    {
        if ($user->role === 'admin') {
            return back()->with('error', 'Cannot ban an admin user.');
        }

        $request->validate(['reason' => 'required|string|max:500']);

        $user->update([
            'banned_at' => now(),
            'moderation_notes' => $request->reason,
        ]);

        AuditLog::log(
            auth()->id(),
            'ban_user',
            'user',
            $user->id,
            ['reason' => $request->reason],
            "Banned user @{$user->username}"
        );

        return back()->with('success', "User @{$user->username} has been banned.");
    }

    public function unban(User $user)
    {
        $user->update(['banned_at' => null]);

        return back()->with('success', "Ban lifted from @{$user->username}.");
    }
}
