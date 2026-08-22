<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\AuditLog;
use App\Models\Community;
use App\Models\ContentReport;
use App\Models\Event;
use App\Models\JobListing;
use App\Models\User;
use Carbon\Carbon;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function index()
    {
        $totalUsers = User::count();
        $totalEvents = Event::count();
        $totalJobs = JobListing::count();
        $totalCommunities = Community::count();
        $totalXp = User::sum('xp');
        $pendingEvents = Event::where('approval_status', 'pending')->count();
        $pendingJobs = JobListing::where('approval_status', 'pending')->count();
        $pendingCommunities = Community::where('approval_status', 'pending')->count();
        $activeJobs = JobListing::where('is_active', true)->count();
        $aiAccessUsers = User::whereNotNull('ai_access_until')
            ->where('ai_access_until', '>', now())->count();
        $openReports = ContentReport::where('status', 'pending')->count();

        $recentAuditLogs = AuditLog::with('admin')
            ->orderByDesc('created_at')
            ->limit(10)
            ->get();

        // User growth data for chart (last 12 months)
        $userGrowth = User::where('created_at', '>=', now()->subMonths(12))
            ->selectRaw('created_at')
            ->get()
            ->groupBy(fn ($item) => $item->created_at->format('Y-m'))
            ->map(fn ($group, $month) => [
                'month' => Carbon::createFromFormat('Y-m', $month)->format('M'),
                'count' => $group->count(),
            ])
            ->values();

        // Activity by category
        $eventsByCategory = Event::selectRaw('category, count(*) as count')
            ->groupBy('category')
            ->get()
            ->map(fn ($item) => [
                'name' => $item->category ?? 'Uncategorized',
                'value' => $item->count,
            ]);

        // Recent activity
        $recentUsers = User::latest()->limit(5)->get(['id', 'name', 'username', 'email', 'role', 'xp', 'created_at']);
        $recentEvents = Event::with('user')->latest()->limit(5)->get(['id', 'title', 'city', 'category', 'is_approved', 'created_at', 'user_id']);
        $recentJobs = JobListing::with('user')->latest()->limit(5)->get(['id', 'title', 'company', 'city', 'is_active', 'created_at', 'user_id']);

        return Inertia::render('Admin/Dashboard', [
            'stats' => [
                'totalUsers' => $totalUsers,
                'totalEvents' => $totalEvents,
                'totalJobs' => $totalJobs,
                'totalCommunities' => $totalCommunities,
                'totalXp' => $totalXp,
                'pendingEvents' => $pendingEvents,
                'pendingJobs' => $pendingJobs,
                'pendingCommunities' => $pendingCommunities,
                'activeJobs' => $activeJobs,
                'aiAccessUsers' => $aiAccessUsers,
                'openReports' => $openReports,
            ],
            'recentUsers' => $recentUsers,
            'recentEvents' => $recentEvents,
            'recentJobs' => $recentJobs,
            'userGrowth' => $userGrowth,
            'eventsByCategory' => $eventsByCategory,
            'recentAuditLogs' => $recentAuditLogs,
        ]);
    }
}
