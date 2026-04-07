<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\Event;
use App\Models\JobListing;
use App\Models\Community;
use App\Models\ActivityLog;
use App\Models\Badge;
use App\Models\ContentReport;
use App\Models\MarketplaceItem;
use App\Models\XpReward;
use App\Models\AiUsageLog;
use App\Models\AuditLog;
use App\Models\FeatureFlag;
use App\Models\PlatformMetric;
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

        // User growth data for chart (last 12 months) - database-agnostic
        $userGrowth = User::where('created_at', '>=', now()->subMonths(12))
            ->selectRaw('created_at')
            ->get()
            ->groupBy(fn($item) => $item->created_at->format('Y-m'))
            ->map(fn($group, $month) => [
                'month' => \Carbon\Carbon::createFromFormat('Y-m', $month)->format('M'),
                'count' => $group->count(),
            ])
            ->values();

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

    // ─────────── User Moderation ───────────

    public function banUser(Request $request, User $user)
    {
        if ($user->role === 'admin') {
            return back()->with('error', 'Cannot ban an admin user.');
        }

        $request->validate(['reason' => 'required|string|max:500']);

        $user->update([
            'banned_at' => now(),
            'moderation_notes' => $request->reason,
        ]);

        return back()->with('success', "User @{$user->username} has been banned.");
    }

    public function unbanUser(User $user)
    {
        $user->update(['banned_at' => null]);
        return back()->with('success', "Ban lifted from @{$user->username}.");
    }

    public function suspendUser(Request $request, User $user)
    {
        $request->validate([
            'days' => 'required|integer|min:1|max:365',
            'reason' => 'required|string|max:500',
        ]);

        $user->update([
            'suspended_until' => now()->addDays($request->days),
            'moderation_notes' => $request->reason,
        ]);

        return back()->with('success', "User @{$user->username} suspended for {$request->days} days.");
    }

    public function warnUser(Request $request, User $user)
    {
        $request->validate(['reason' => 'required|string|max:500']);

        $user->increment('warning_count');
        $warningCount = $user->warning_count;

        // Auto-suspend if 3+ warnings
        if ($warningCount >= 3) {
            $user->update(['suspended_until' => now()->addDays(7)]);
            return back()->with('warning', "User @{$user->username} warned (count: {$warningCount}/3). Auto-suspended for 7 days.");
        }

        return back()->with('success', "User @{$user->username} warned ({$warningCount}/3).");
    }

    public function verifyUser(User $user)
    {
        $user->update(['is_verified_user' => true]);
        return back()->with('success', "User @{$user->username} verified.");
    }

    // ─────────── Content Reports ───────────

    public function reports(Request $request)
    {
        $query = ContentReport::with('reporter', 'admin')
            ->orderByDesc('created_at');

        if ($request->status) {
            $query->where('status', $request->status);
        }

        if ($request->reason) {
            $query->where('reason', $request->reason);
        }

        $reports = $query->paginate(20)->withQueryString();

        return Inertia::render('Admin/Reports', [
            'reports' => $reports,
            'filters' => $request->only(['status', 'reason']),
        ]);
    }

    public function reviewReport(Request $request, ContentReport $report)
    {
        $validated = $request->validate([
            'action' => 'required|in:dismissed,warning,suspend,ban,delete',
            'notes' => 'required|string|max:500',
        ]);

        $report->update([
            'status' => 'reviewed',
            'admin_id' => auth()->id(),
            'admin_notes' => $validated['notes'],
            'action_taken' => $validated['action'],
        ]);

        // Take action on the reported user or content
        if ($report->content_type === 'user' && in_array($validated['action'], ['warning', 'suspend', 'ban'])) {
            $user = User::find($report->content_id);
            if ($user) {
                match ($validated['action']) {
                    'warning' => $user->increment('warning_count'),
                    'suspend' => $user->update(['suspended_until' => now()->addDays(7)]),
                    'ban' => $user->update(['banned_at' => now()]),
                };
            }
        } elseif ($validated['action'] === 'delete') {
            // Delete the reported content
            $content = $this->getReportedContent($report);
            $content?->delete();
        }

        return back()->with('success', 'Report reviewed and action taken.');
    }

    private function getReportedContent(ContentReport $report)
    {
        return match ($report->content_type) {
            'event' => Event::find($report->content_id),
            'job' => JobListing::find($report->content_id),
            'marketplace' => null, // Add marketplace model when available
            'message' => null, // Add message handling
            default => null,
        };
    }

    // ─────────── Content Approval ───────────

    public function approvalQueue(Request $request)
    {
        $type = $request->type ?? 'all'; // all, events, jobs, communities

        $pendingEvents = Event::where('approval_status', 'pending')->count();
        $pendingJobs = JobListing::where('approval_status', 'pending')->count();

        $queue = [];

        if ($type === 'all' || $type === 'events') {
            $queue['events'] = Event::where('approval_status', 'pending')
                ->with('user')
                ->paginate(20);
        }

        if ($type === 'all' || $type === 'jobs') {
            $queue['jobs'] = JobListing::where('approval_status', 'pending')
                ->with('user')
                ->paginate(20);
        }

        return Inertia::render('Admin/ApprovalQueue', [
            'queue' => $queue,
            'pendingCounts' => [
                'events' => $pendingEvents,
                'jobs' => $pendingJobs,
            ],
        ]);
    }

    public function approveContent(Request $request, $type, $id)
    {
        $request->validate(['notes' => 'nullable|string|max:500']);

        match ($type) {
            'event' => Event::find($id)?->update([
                'approval_status' => 'approved',
                'approved_by' => auth()->id(),
                'is_approved' => true,
            ]),
            'job' => JobListing::find($id)?->update([
                'approval_status' => 'approved',
                'approved_by' => auth()->id(),
            ]),
        };

        return back()->with('success', ucfirst($type) . ' approved.');
    }

    public function rejectContent(Request $request, $type, $id)
    {
        $validated = $request->validate([
            'reason' => 'required|string|max:500',
        ]);

        match ($type) {
            'event' => Event::find($id)?->update([
                'approval_status' => 'rejected',
                'approved_by' => auth()->id(),
                'rejection_reason' => $validated['reason'],
            ]),
            'job' => JobListing::find($id)?->update([
                'approval_status' => 'rejected',
                'approved_by' => auth()->id(),
                'rejection_reason' => $validated['reason'],
            ]),
        };

        return back()->with('success', ucfirst($type) . ' rejected.');
    }

    // ─────────── Phase 2: Marketplace Management ───────────

    public function marketplace(Request $request)
    {
        $query = MarketplaceItem::latest();

        if ($request->search) {
            $query->where('name', 'LIKE', "%{$request->search}%");
        }

        if ($request->category) {
            $query->where('category', $request->category);
        }

        $items = $query->paginate(20)->withQueryString();

        return Inertia::render('Admin/Marketplace', [
            'items' => $items,
            'filters' => $request->only(['search', 'category']),
            'categories' => ['badge', 'cosmetic', 'feature', 'boost'],
        ]);
    }

    public function toggleMarketplaceItem(MarketplaceItem $item)
    {
        $item->update(['is_available' => !$item->is_available]);
        $status = $item->is_available ? 'enabled' : 'disabled';
        return back()->with('success', "Item '{$item->name}' {$status}.");
    }

    public function updateMarketplaceItemPrice(Request $request, MarketplaceItem $item)
    {
        $request->validate([
            'price_xp' => 'required|integer|min:1',
            'max_quantity' => 'nullable|integer|min:1',
        ]);

        $item->update($request->only(['price_xp', 'max_quantity']));
        return back()->with('success', "Item '{$item->name}' updated.");
    }

    public function deleteMarketplaceItem(MarketplaceItem $item)
    {
        $name = $item->name;
        $item->delete();
        return back()->with('success', "Item '{$name}' deleted.");
    }

    // ─────────── Phase 2: XP Economy ───────────

    public function xpEconomy(Request $request)
    {
        $rewards = XpReward::all();
        $userXpStats = User::selectRaw('AVG(total_xp_earned) as avg_earned, SUM(total_xp_earned) as total_earned, COUNT(*) as user_count')
            ->first();

        return Inertia::render('Admin/XpEconomy', [
            'rewards' => $rewards,
            'stats' => [
                'avg_earned' => (int)($userXpStats->avg_earned ?? 0),
                'total_earned' => (int)($userXpStats->total_earned ?? 0),
                'user_count' => $userXpStats->user_count ?? 0,
            ],
        ]);
    }

    public function updateXpReward(Request $request, XpReward $reward)
    {
        $request->validate([
            'amount' => 'required|integer|min:1|max:10000',
            'is_active' => 'required|boolean',
        ]);

        $reward->update($request->only(['amount', 'is_active']));
        return back()->with('success', "XP reward '{$reward->action}' updated.");
    }

    public function createXpReward(Request $request)
    {
        $request->validate([
            'action' => 'required|string|max:100',
            'amount' => 'required|integer|min:1|max:10000',
            'description' => 'nullable|string|max:500',
        ]);

        XpReward::create($request->only(['action', 'amount', 'description']));
        return back()->with('success', 'XP reward created.');
    }

    // ─────────── Phase 2: AI Access Control ───────────

    public function aiAccess(Request $request)
    {
        $users = User::selectRaw('id, name, username, email, ai_tier, ai_monthly_tokens, ai_tokens_used_this_month, ai_access_until')
            ->where('ai_access_until', '>', now())
            ->orWhere('ai_tier', '!=', 'free')
            ->paginate(20);

        $aiUsageLogs = AiUsageLog::selectRaw('DATE(created_at) as date, COUNT(*) as request_count, SUM(tokens_used) as total_tokens')
            ->where('created_at', '>=', now()->subDays(30))
            ->groupBy('date')
            ->orderBy('date', 'desc')
            ->get();

        return Inertia::render('Admin/AiAccess', [
            'users' => $users,
            'usage_logs' => $aiUsageLogs,
            'tiers' => ['free', 'basic', 'pro', 'unlimited'],
        ]);
    }

    public function updateUserAiTier(Request $request, User $user)
    {
        $request->validate([
            'ai_tier' => 'required|in:free,basic,pro,unlimited',
            'monthly_tokens' => 'required|integer|min:1000',
        ]);

        $user->update([
            'ai_tier' => $request->ai_tier,
            'ai_monthly_tokens' => $request->monthly_tokens,
            'ai_tokens_used_this_month' => 0,
            'ai_reset_date' => now()->endOfMonth(),
        ]);

        return back()->with('success', "User @{$user->username}'s AI tier updated to {$request->ai_tier}.");
    }

    public function grantAiAccess(Request $request, User $user)
    {
        $request->validate([
            'days' => 'required|integer|min:1|max:3650',
            'tier' => 'required|in:basic,pro',
        ]);

        $user->update([
            'ai_access_until' => now()->addDays($request->days),
            'ai_tier' => $request->tier,
            'ai_monthly_tokens' => $request->tier === 'pro' ? 500000 : 100000,
        ]);

        return back()->with('success', "AI access granted to @{$user->username} for {$request->days} days.");
    }

    public function revokeAiAccess(User $user)
    {
        $user->update([
            'ai_access_until' => null,
            'ai_tier' => 'free',
            'ai_monthly_tokens' => 0,
            'ai_feature_advanced' => false,
        ]);

        return back()->with('success', "AI access revoked from @{$user->username}.");
    }

    public function resetAiMonthlyUsage(User $user)
    {
        $user->update([
            'ai_tokens_used_this_month' => 0,
            'ai_reset_date' => now()->addMonth()->endOfMonth(),
        ]);

        return back()->with('success', "Monthly AI usage reset for @{$user->username}.");
    }

    // ─────────── Phase 3: Analytics Dashboard ───────────

    public function analytics(Request $request)
    {
        // Get metrics for the last 30 days
        $metrics = PlatformMetric::where('date', '>=', now()->subDays(30))
            ->orderBy('date')
            ->get()
            ->groupBy('metric_name');

        // Calculate summary stats
        $totalUsers = User::count();
        $newUsersThisMonth = User::where('created_at', '>=', now()->startOfMonth())->count();
        $activeUsersToday = User::where('updated_at', '>=', now()->subDay())->count();
        $totalEvents = Event::count();
        $totalJobs = JobListing::count();
        $avgUserXp = (int)User::avg('xp');

        // User growth trend
        $userGrowth = User::where('created_at', '>=', now()->subDays(30))
            ->selectRaw('created_at')
            ->get()
            ->groupBy(fn($item) => $item->created_at->toDateString())
            ->map(fn($group) => $group->count())
            ->toArray();

        // Fill gaps in dates
        $allDates = [];
        for ($i = 29; $i >= 0; $i--) {
            $date = now()->subDays($i)->toDateString();
            $allDates[$date] = $userGrowth[$date] ?? 0;
        }

        return Inertia::render('Admin/Analytics', [
            'summary' => [
                'total_users' => $totalUsers,
                'new_users_this_month' => $newUsersThisMonth,
                'active_users_today' => $activeUsersToday,
                'total_events' => $totalEvents,
                'total_jobs' => $totalJobs,
                'avg_user_xp' => $avgUserXp,
            ],
            'metrics' => $metrics,
            'user_growth' => $allDates,
        ]);
    }

    // ─────────── Phase 3: Feature Flags ───────────

    public function settings(Request $request)
    {
        $flags = FeatureFlag::all();

        return Inertia::render('Admin/Settings', [
            'feature_flags' => $flags,
        ]);
    }

    public function toggleFeatureFlag(Request $request, FeatureFlag $flag)
    {
        $flag->update([
            'enabled' => !$flag->enabled,
            'enabled_at' => $flag->enabled ? now() : $flag->enabled_at,
            'disabled_at' => !$flag->enabled ? now() : $flag->disabled_at,
        ]);

        AuditLog::log(
            auth()->id(),
            'toggle_feature_flag',
            'feature_flag',
            $flag->id,
            ['enabled' => $flag->enabled],
            "Feature flag '{$flag->name}' " . ($flag->enabled ? 'enabled' : 'disabled')
        );

        $status = $flag->enabled ? 'enabled' : 'disabled';
        return back()->with('success', "Feature flag '{$flag->name}' {$status}.");
    }

    public function updateFeatureFlagConfig(Request $request, FeatureFlag $flag)
    {
        $request->validate(['config' => 'nullable|array']);

        $oldConfig = $flag->config;
        $flag->update(['config' => $request->config ?? []]);

        AuditLog::log(
            auth()->id(),
            'update_feature_config',
            'feature_flag',
            $flag->id,
            ['old_config' => $oldConfig, 'new_config' => $flag->config],
            "Feature flag '{$flag->name}' configuration updated"
        );

        return back()->with('success', "Feature flag '{$flag->name}' configuration updated.");
    }

    // ─────────── Phase 3: Audit Logs ───────────

    public function auditLogs(Request $request)
    {
        $query = AuditLog::with('admin')->orderByDesc('created_at');

        if ($request->action) {
            $query->where('action', 'LIKE', "%{$request->action}%");
        }

        if ($request->admin_id) {
            $query->where('admin_id', $request->admin_id);
        }

        if ($request->target_type) {
            $query->where('target_type', $request->target_type);
        }

        $logs = $query->paginate(25)->withQueryString();

        $admins = User::where('role', 'admin')->get();

        return Inertia::render('Admin/AuditLogs', [
            'logs' => $logs,
            'admins' => $admins,
            'filters' => $request->only(['action', 'admin_id', 'target_type']),
        ]);
    }
}
