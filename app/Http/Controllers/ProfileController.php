<?php

namespace App\Http\Controllers;

use App\Models\Badge;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Auth;
use App\Models\AuditLog;

class ProfileController extends Controller
{
    public function show(Request $request, $username = null)
    {
        $user = $username
            ? User::where('username', $username)->firstOrFail()
            : $request->user();

        $user->load([
            'skills',
            'savedEvents.tags',
            'activityLogs' => function ($q) {
                $q->orderByDesc('created_at')->limit(20);
            },
        ]);

        if ($request->user()?->id === $user->id) {
            $user->checkBadges();
        }

        $user->load([
            'badges' => fn ($q) => $q->orderBy('track')->orderBy('level'),
            'achievements', // Load new achievements feature
            'marketplaceItems', // Load user's digital shop items
            'marketplacePurchases.item', // Load the user's inventory
        ]);

        $user->loadCount(['followers', 'following']);

        // Load new Achievement system catalog
        $achievements = \App\Models\Achievement::all()->map(function ($a) use ($user) {
            return [
                'id' => $a->id,
                'slug' => $a->slug,
                'name' => $a->name,
                'description' => $a->description,
                'icon' => $a->icon,
                'xp_reward' => $a->xp_reward,
                'earned' => $user->achievements->contains('id', $a->id),
            ];
        });

        $achievementCatalog = Badge::query()
            ->orderBy('track')
            ->orderBy('level')
            ->get()
            ->map(fn (Badge $b) => [
                'id' => $b->id,
                'slug' => $b->slug,
                'name' => $b->name,
                'description' => $b->description,
                'track' => $b->track,
                'level' => (int) $b->level,
                'icon_key' => $b->icon_key ?: 'Award',
                'earned' => $user->badges->contains('id', $b->id),
            ]);

        return Inertia::render('Profile/Show', [
            'profileUser' => $user,
            'achievementCatalog' => $achievementCatalog,
            'achievementsData' => $achievements, // New system
            'isOwnProfile' => $request->user()?->id === $user->id,
            'isFollowing' => $request->user() ? $request->user()->isFollowing($user) : false,
            'hasBlocked' => $request->user() ? $request->user()->hasBlocked($user) : false,
            'isBlocked' => $request->user() ? $user->hasBlocked($request->user()) : false,
        ]);
    }

    public function reportUser(User $user, Request $request)
    {
        $request->validate([
            'reason' => 'required|string',
            'description' => 'required|string',
        ]);

        \App\Models\ContentReport::create([
            'user_id' => $request->user()->id,
            'content_type' => 'user',
            'content_id' => $user->id,
            'reason' => $request->reason,
            'description' => $request->description,
            'status' => 'pending'
        ]);

        return back()->with('success', 'SIGNAL_TRANSMITTED: Moderation unit has been notified.');
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
            $follower->following()->syncWithoutDetaching([$user->id]);
            $follower->awardXp(10, 'followed_user', "Started following @{$user->username}", $user);
            $user->notify(new \App\Notifications\NewFollower($follower));
            return back()->with('success', "Node connected: @{$user->username}. +10 XP earned!");
        }
    }

    public function toggleBlock(User $user, Request $request)
    {
        $blocker = $request->user();

        if ($blocker->id === $user->id) {
            return back()->with('error', 'SYSTEM_ERR: SELF_BLOCK_REJECTED');
        }

        if ($blocker->hasBlocked($user)) {
            $blocker->blockedUsers()->where('blocked_user_id', $user->id)->delete();
            return back()->with('info', "Node unrestricted: @{$user->username}");
        } else {
            // Detach follow relationship if exists
            $blocker->following()->detach($user->id);
            $user->following()->detach($blocker->id);

            $blocker->blockedUsers()->create([
                'blocked_user_id' => $user->id,
                'reason' => $request->reason ?? 'System isolation protocol'
            ]);

            return back()->with('success', "Node isolated: @{$user->username}. Communications severed.");
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
            'latitude'   => 'nullable|numeric',
            'longitude'  => 'nullable|numeric',
            'skills'     => 'nullable|array',
            'skills.*'   => 'nullable|integer',
            'avatar_file' => 'nullable|image|max:2048',
            'profile_accent_color'   => 'nullable|string',
            'profile_theme_style'    => 'nullable|string',
            'profile_glow_effect'    => 'nullable|boolean',
            'profile_matrix_intensity' => 'nullable|string',
        ]);

        if ($request->hasFile('avatar_file')) {
            \Log::info('Processing file upload', [
                'original_name' => $request->file('avatar_file')->getClientOriginalName(),
                'size' => $request->file('avatar_file')->getSize(),
                'mime' => $request->file('avatar_file')->getMimeType(),
            ]);
            
            // Store relative path only — the User accessor will generate the correct full URL
            $path = $request->file('avatar_file')->store('avatars', 'public');
            $data['avatar'] = $path;
            
            \Log::info('File stored', ['path' => $path]);
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

    public function updatePhoto(Request $request)
    {
        $request->validate([
            'avatar_file' => 'required|image|mimes:jpeg,png,jpg,webp|max:2048',
        ]);

        $user = $request->user();

        if ($request->hasFile('avatar_file')) {
            // Delete old avatar if it exists
            if ($user->getRawOriginal('avatar') && !str_starts_with($user->getRawOriginal('avatar'), 'http')) {
                $old = ltrim(preg_replace('#^/?storage/#', '', $user->getRawOriginal('avatar')), '/');
                Storage::disk('public')->delete($old);
            }

            // Store relative path only — accessor generates the full URL
            $path = $request->file('avatar_file')->store('avatars/' . $user->id, 'public');
            
            $user->update(['avatar' => $path]);

            return response()->json(['avatar' => asset('storage/' . $path), 'message' => 'Profile photo updated']);
        }

        return response()->json(['message' => 'No file uploaded'], 400);
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

        // Log the deletion BEFORE logout so we have context if needed, 
        // though with nullable admin_id we can log it cleanly.
        AuditLog::log(
            admin_id: null, 
            action: 'account_self_deletion', 
            target_type: 'user', 
            target_id: $user->id, 
            description: "User {$user->username} (ID: {$user->id}) decommissioned their own account."
        );

        $user->update(['account_status' => 'deleted']);
        $user->delete(); // Soft delete

        Auth::logout();

        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return redirect('/');
    }

    public function removeAvatar(Request $request)
    {
        $user = $request->user();

        // Use getRawOriginal to get the stored path, not the accessor's full URL
        if ($raw = $user->getRawOriginal('avatar')) {
            if (!str_starts_with($raw, 'http')) {
                $relativePath = ltrim(preg_replace('#^/?storage/#', '', $raw), '/');
                Storage::disk('public')->delete($relativePath);
            }
        }

        $user->update(['avatar' => null]);
        return back()->with('success', 'Avatar removed successfully.');
    }
}
