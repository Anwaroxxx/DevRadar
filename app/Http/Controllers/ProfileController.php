<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ProfileController extends Controller
{
    public function show(Request $request, $username = null)
    {
        $user = $username
            ? User::where('username', $username)->firstOrFail()
            : $request->user();

        $user->load(['skills', 'badges', 'savedEvents.tags', 'activityLogs' => function ($q) {
            $q->orderByDesc('created_at')->limit(20);
        }]);

        $user->loadCount(['followers', 'following']);

        return Inertia::render('Profile/Show', [
            'profileUser' => $user,
            'isOwnProfile' => $request->user()?->id === $user->id,
            'isFollowing' => $request->user() ? $request->user()->isFollowing($user) : false,
        ]);
    }

    public function toggleFollow(User $user, Request $request)
    {
        $follower = $request->user();
        
        if ($follower->id === $user->id) {
            return back()->with('error', 'SYSTEM_ERR: SELF_LINK_NOT_ALLOWED');
        }

        if ($follower->isFollowing($user)) {
            $follower->following()->detach($user->id);
            return back()->with('info', "Connection severed: @{$user->username}");
        } else {
            $follower->following()->attach($user->id);
            $follower->awardXp(10, 'followed_user', "Started following @{$user->username}", $user);
            return back()->with('success', "Node connected: @{$user->username}. +10 XP earned!");
        }
    }

    public function edit(Request $request)
    {
        return Inertia::render('Profile/Edit', [
            'user' => $request->user()->load('skills'),
            'allSkills' => \App\Models\Skill::all(),
        ]);
    }

    public function update(Request $request)
    {
        $user = $request->user();
        
        // Debug incoming data
        \Log::info('Profile update incoming', [
            'has_avatar_file' => $request->hasFile('avatar_file'),
            'all_files' => array_keys($request->allFiles()),
            'all_data_keys' => array_keys($request->all()),
        ]);
        
        // Validate all fields - required ones must be present
        $data = $request->validate([
            'name'       => 'required|string|max:255',
            'username'   => 'required|string|max:50|unique:users,username,' . $user->id,
            'bio'        => 'nullable|string|max:500',
            'github_url' => 'nullable|url',
            'location'   => 'nullable|string',
            'city'       => 'nullable|string',
            'skills'     => 'nullable|array',
            'skills.*'   => 'nullable|integer',
            'avatar_file' => 'nullable|image|max:2048',
        ]);

        if ($request->hasFile('avatar_file')) {
            \Log::info('Processing file upload', [
                'original_name' => $request->file('avatar_file')->getClientOriginalName(),
                'size' => $request->file('avatar_file')->getSize(),
                'mime' => $request->file('avatar_file')->getMimeType(),
            ]);
            
            $path = $request->file('avatar_file')->store('avatars', 'public');
            $data['avatar'] = '/storage/' . $path;
            
            \Log::info('File stored successfully', [
                'stored_path' => $path,
                'avatar_url' => $data['avatar'],
            ]);
        }

        $skills = $data['skills'] ?? [];
        unset($data['skills'], $data['avatar_file']);

        // Only update fields that have values
        $updateData = array_filter($data, fn($value) => $value !== null && $value !== '');
        
        \Log::info('Updating user', ['update_data' => $updateData]);
        $user->update($updateData);

        if (!empty($skills)) {
            // Skills are IDs, not names
            $user->skills()->sync($skills);
        }

        return redirect()->route('profile.show', $user->username)->with('success', 'Profile updated!');
    }

    public function updatePassword(Request $request)
    {
        $validated = $request->validate([
            'current_password' => ['required', 'current_password'],
            'password' => ['required', 'confirmed', \Illuminate\Validation\Rules\Password::defaults()],
        ]);

        $request->user()->update([
            'password' => \Illuminate\Support\Facades\Hash::make($validated['password']),
        ]);

        return back()->with('success', 'Password updated successfully.');
    }

    public function destroy(Request $request)
    {
        $request->validate([
            'password' => ['required', 'current_password'],
        ]);

        $user = $request->user();

        \Illuminate\Support\Facades\Auth::logout();

        $user->delete();

        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return redirect('/');
    }

    public function removeAvatar(Request $request)
    {
        $user = $request->user();
        $user->update(['avatar' => null]);
        return back()->with('success', 'Avatar removed successfully.');
    }
}
