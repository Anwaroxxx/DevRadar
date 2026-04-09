<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\MarketplaceItem;
use App\Models\XpReward;
use App\Models\AiUsageLog;
use App\Models\PlatformMetric;
use App\Models\FeatureFlag;
use App\Models\AuditLog;
use App\Models\User;
use App\Models\Event;
use App\Models\JobListing;
use Illuminate\Http\Request;
use Inertia\Inertia;

class SystemsController extends Controller
{
    // --- Marketplace ---
    public function marketplace(Request $request)
    {
        $query = MarketplaceItem::latest();
        if ($request->search) $query->where('name', 'LIKE', "%{$request->search}%");
        if ($request->category) $query->where('category', $request->category);

        return Inertia::render('Admin/Marketplace', [
            'items' => $query->paginate(20)->withQueryString(),
            'filters' => $request->only(['search', 'category']),
            'categories' => ['badge', 'cosmetic', 'feature', 'boost'],
        ]);
    }

    public function toggleMarketplaceItem(MarketplaceItem $item)
    {
        $item->update(['is_available' => !$item->is_available]);
        return back()->with('success', "Item '{$item->name}' status updated.");
    }

    // --- XP Economy ---
    public function xpEconomy()
    {
        $rewards = XpReward::all();
        $stats = User::selectRaw('AVG(total_xp_earned) as avg_earned, SUM(total_xp_earned) as total_earned, COUNT(*) as user_count')->first();

        return Inertia::render('Admin/XpEconomy', [
            'rewards' => $rewards,
            'stats' => [
                'avg_earned' => (int)($stats->avg_earned ?? 0),
                'total_earned' => (int)($stats->total_earned ?? 0),
                'user_count' => $stats->user_count ?? 0,
            ],
        ]);
    }

    // --- AI Access ---
    public function aiAccess(Request $request)
    {
        $users = User::where('ai_access_until', '>', now())
            ->orWhere('ai_tier', '!=', 'free')
            ->paginate(20);

        $usage_logs = AiUsageLog::selectRaw('DATE(created_at) as date, COUNT(*) as request_count, SUM(tokens_used) as total_tokens')
            ->where('created_at', '>=', now()->subDays(30))
            ->groupBy('date')
            ->orderBy('date', 'desc')
            ->get();

        return Inertia::render('Admin/AiAccess', [
            'users' => $users,
            'usage_logs' => $usage_logs,
            'tiers' => ['free', 'basic', 'pro', 'unlimited'],
        ]);
    }

    // --- Analytics ---
    public function analytics()
    {
        $metrics = PlatformMetric::where('date', '>=', now()->subDays(30))->orderBy('date')->get()->groupBy('metric_name');
        
        return Inertia::render('Admin/Analytics', [
            'summary' => [
                'total_users' => User::count(),
                'active_users_today' => User::where('updated_at', '>=', now()->subDay())->count(),
                'total_events' => Event::count(),
                'total_jobs' => JobListing::count(),
            ],
            'metrics' => $metrics,
        ]);
    }

    // --- Settings & Feature Flags ---
    public function settings()
    {
        return Inertia::render('Admin/Settings', [
            'feature_flags' => FeatureFlag::all(),
        ]);
    }

    public function toggleFeatureFlag(FeatureFlag $flag)
    {
        $flag->update(['enabled' => !$flag->enabled]);
        AuditLog::log(auth()->id(), 'toggle_feature_flag', 'feature_flag', $flag->id, ['enabled' => $flag->enabled], "Feature flag '{$flag->name}' updated");
        return back()->with('success', "Feature flag status updated.");
    }

    public function broadcast(Request $request)
    {
        $data = $request->validate([
            'title' => 'required|string|max:255',
            'message' => 'required|string|max:1000',
            'action_url' => 'nullable|url',
        ]);

        $users = User::all();
        \Illuminate\Support\Facades\Notification::send($users, new \App\Notifications\FeatureAnnouncement(
            $data['title'],
            $data['message'],
            $data['action_url'] ?? '/'
        ));

        AuditLog::log(auth()->id(), 'broadcast_announcement', 'user', 0, $data, "Broadcasted announcement: {$data['title']}");
        return back()->with('success', 'Announcement broadcasted to all active nodes.');
    }

    // --- Audit Logs ---
    public function auditLogs(Request $request)
    {
        $query = AuditLog::with('admin')->orderByDesc('created_at');
        if ($request->admin_id) $query->where('admin_id', $request->admin_id);
        if ($request->target_type) $query->where('target_type', $request->target_type);

        return Inertia::render('Admin/AuditLogs', [
            'logs' => $query->paginate(25)->withQueryString(),
            'admins' => User::where('role', 'admin')->get(),
            'filters' => $request->only(['admin_id', 'target_type']),
        ]);
    }
}
