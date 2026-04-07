<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\Event;
use App\Models\JobListing;
use App\Models\Community;
use App\Models\ActivityLog;
use App\Models\Badge;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Carbon\Carbon;
use Illuminate\Support\Facades\Hash;

class AdminController extends Controller
{
    // ─────────── Dashboard ───────────

    public function dashboard()
    {
        $totalUsers       = User::count();
        $totalEvents      = Event::count();
        $totalJobs        = JobListing::count();
        $totalCommunities = Community::count();
        $totalXp          = User::sum('xp');
        $pendingEvents    = Event::where('is_approved', false)->count();
        $activeJobs       = JobListing::where('is_active', true)->count();
        $aiAccessUsers    = User::whereNotNull('ai_access_until')
                              ->where('ai_access_until', '>', now())->count();

        // User growth data for chart (last 12 months)
        $userGrowth = User::selectRaw("strftime('%Y-%m', created_at) as month, count(*) as count")
            ->where('created_at', '>=', now()->subMonths(12))
            ->groupBy('month')
            ->orderBy('month')
            ->get()
            ->map(fn($item) => [
                'month' => \Carbon\Carbon::createFromFormat('Y-m', $item->month)->format('M'),
                'count' => $item->count,
            ]);

        // XP distribution by role
        $xpByRole = User::selectRaw("role, AVG(xp) as avg_xp, COUNT(*) as user_count, SUM(xp) as total_xp")
            ->groupBy('role')
            ->get()
            ->map(fn($item) => [
                'role' => ucfirst($item->role),
                'avg_xp' => (int)$item->avg_xp,
                'user_count' => $item->user_count,
                'total_xp' => (int)$item->total_xp,
            ]);

        // Activity by category
        $eventsByCategory = Event::selectRaw("category, count(*) as count")
            ->groupBy('category')
            ->get()
            ->map(fn($item) => [
                'name' => $item->category ?? 'Uncategorized',
                'value' => $item->count,
            ]);

        // Recent activity
        $recentUsers = User::latest()->limit(5)->get(['id','name','username','email','role','xp','created_at']);
        $recentEvents = Event::with('user')->latest()->limit(5)->get(['id','title','city','category','is_approved','created_at','user_id']);
        $recentJobs   = JobListing::with('user')->latest()->limit(5)->get(['id','title','company','city','is_active','created_at','user_id']);

        $topUsers = User::orderByDesc('xp')->limit(5)->get(['id','name','username','avatar','xp','role']);

        return Inertia::render('Admin/Dashboard', [
            'stats' => [
                'totalUsers'       => $totalUsers,
                'totalEvents'      => $totalEvents,
                'totalJobs'        => $totalJobs,
                'totalCommunities' => $totalCommunities,
                'totalXp'          => $totalXp,
                'pendingEvents'    => $pendingEvents,
                'activeJobs'       => $activeJobs,
                'aiAccessUsers'    => $aiAccessUsers,
            ],
            'recentUsers'   => $recentUsers,
            'recentEvents'  => $recentEvents,
            'recentJobs'    => $recentJobs,
            'topUsers'      => $topUsers,
            'userGrowth'    => $userGrowth,
            'xpByRole'      => $xpByRole,
            'eventsByCategory' => $eventsByCategory,
        ]);
    }

    // ─────────── Users ───────────

    public function users(Request $request)
    {
        $query = User::withCount(['events', 'jobListings', 'communities']);

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

        $users = $query->orderByDesc('created_at')->paginate(20)->withQueryString();

        return Inertia::render('Admin/Users', [
            'users'   => $users,
            'filters' => $request->only(['search', 'role']),
        ]);
    }

    public function updateUser(Request $request, User $user)
    {
        $data = $request->validate([
            'role'              => 'required|in:developer,admin',
            'xp'               => 'required|integer|min:0',
            'ai_access_until'  => 'nullable|date',
        ]);

        $user->update($data);

        return back()->with('success', "User @{$user->username} updated successfully.");
    }

    public function grantAiAccess(Request $request, User $user)
    {
        $request->validate(['days' => 'required|integer|min:1|max:3650']);

        $baseDate = $user->ai_access_until && $user->ai_access_until->isFuture()
            ? $user->ai_access_until
            : now();

        $user->update(['ai_access_until' => $baseDate->addDays($request->days)]);

        return back()->with('success', "AI access granted to @{$user->username} for {$request->days} days.");
    }

    public function revokeAiAccess(User $user)
    {
        $user->update(['ai_access_until' => null]);
        return back()->with('success', "AI access revoked from @{$user->username}.");
    }

    public function deleteUser(User $user)
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

    // ─────────── Events ───────────

    public function events(Request $request)
    {
        $query = Event::with('user', 'tags')->latest();

        if ($request->search) {
            $query->where('title', 'LIKE', "%{$request->search}%")
                  ->orWhere('city', 'LIKE', "%{$request->search}%");
        }

        if ($request->status === 'pending') {
            $query->where('is_approved', false);
        } elseif ($request->status === 'approved') {
            $query->where('is_approved', true);
        }

        if ($request->category) {
            $query->where('category', $request->category);
        }

        $events = $query->paginate(20)->withQueryString();

        return Inertia::render('Admin/Events', [
            'events'  => $events,
            'filters' => $request->only(['search', 'status', 'category']),
        ]);
    }

    public function approveEvent(Event $event)
    {
        $event->update(['is_approved' => true]);
        return back()->with('success', "Event '{$event->title}' approved.");
    }

    public function rejectEvent(Event $event)
    {
        $event->update(['is_approved' => false]);
        return back()->with('success', "Event '{$event->title}' rejected.");
    }

    public function deleteEvent(Event $event)
    {
        $title = $event->title;
        $event->delete();
        return back()->with('success', "Event '{$title}' deleted.");
    }

    // ─────────── Jobs ───────────

    public function jobs(Request $request)
    {
        $query = JobListing::with('user')->latest();

        if ($request->search) {
            $query->where(function ($q) use ($request) {
                $q->where('title', 'LIKE', "%{$request->search}%")
                  ->orWhere('company', 'LIKE', "%{$request->search}%");
            });
        }

        if ($request->status === 'active') {
            $query->where('is_active', true);
        } elseif ($request->status === 'inactive') {
            $query->where('is_active', false);
        }

        $jobs = $query->paginate(20)->withQueryString();

        return Inertia::render('Admin/Jobs', [
            'jobs'    => $jobs,
            'filters' => $request->only(['search', 'status']),
        ]);
    }

    public function toggleJob(JobListing $job)
    {
        $job->update(['is_active' => !$job->is_active]);
        $status = $job->is_active ? 'activated' : 'deactivated';
        return back()->with('success', "Job '{$job->title}' {$status}.");
    }

    public function deleteJob(JobListing $job)
    {
        $title = $job->title;
        $job->delete();
        return back()->with('success', "Job '{$title}' deleted.");
    }

    // ─────────── Communities ───────────

    public function communities(Request $request)
    {
        $query = Community::with('user')->withCount('followers')->latest();

        if ($request->search) {
            $query->where('name', 'LIKE', "%{$request->search}%");
        }

        $communities = $query->paginate(20)->withQueryString();

        return Inertia::render('Admin/Communities', [
            'communities' => $communities,
            'filters'     => $request->only(['search']),
        ]);
    }

    public function deleteCommunity(Community $community)
    {
        $name = $community->name;
        $community->delete();
        return back()->with('success', "Community '{$name}' deleted.");
    }
}
