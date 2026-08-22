<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Mail\ContentStatusMail;
use App\Models\AuditLog;
use App\Models\Community;
use App\Models\CommunityComment;
use App\Models\CommunityPost;
use App\Models\ContentReport;
use App\Models\Event;
use App\Models\JobListing;
use App\Models\Message;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;
use Inertia\Inertia;

class ModerationController extends Controller
{
    /**
     * Centralized Hub Index
     */
    public function hub(Request $request)
    {
        $pendingEventsCount = Event::where('approval_status', 'pending')->count();
        $pendingJobsCount = JobListing::where('approval_status', 'pending')->count();
        $pendingCommunitiesCount = Community::where('approval_status', 'pending')->count();
        $pendingReportsCount = ContentReport::where('status', 'pending')->count();

        // Get actual queue data (paginated)
        $type = $request->query('type', 'reports'); // Default to reports

        $queue = match ($type) {
            'events' => Event::where('approval_status', 'pending')->with('user')->paginate(10),
            'jobs' => JobListing::where('approval_status', 'pending')->with('user')->paginate(10),
            'communities' => Community::where('approval_status', 'pending')->with('user')->paginate(10),
            default => ContentReport::where('status', 'pending')->with('reporter')->paginate(10),
        };

        return Inertia::render('Admin/ModerationHub', [
            'queue' => $queue,
            'counts' => [
                'events' => $pendingEventsCount,
                'jobs' => $pendingJobsCount,
                'communities' => $pendingCommunitiesCount,
                'reports' => $pendingReportsCount,
            ],
            'filters' => $request->only(['type']),
        ]);
    }

    public function approve(Request $request, $type, $id)
    {
        $content = match ($type) {
            'event' => Event::find($id),
            'job' => JobListing::find($id),
            'community' => Community::find($id),
            default => null,
        };

        if (! $content) {
            return back()->with('error', 'Node data not found.');
        }

        match ($type) {
            'event' => $content->update(['approval_status' => 'approved', 'approved_by' => auth()->id(), 'is_approved' => true]),
            'job' => $content->update(['approval_status' => 'approved', 'approved_by' => auth()->id()]),
            'community' => $content->update(['approval_status' => 'approved', 'approved_by' => auth()->id()]),
        };

        // Award XP to the creator upon approval
        $xpPoints = match ($type) {
            'event' => 30,
            'job' => 50,
            'community' => 20,
            default => 0,
        };

        if ($xpPoints > 0 && $content->user) {
            $title = $type === 'community' ? $content->name : $content->title;
            // Use 'approved_' key to distinguish from submission
            $content->user->awardXp($xpPoints, "approved_{$type}", "Content verified: {$title}", $content);
        }

        // Notify user
        if (! empty($content->user?->email)) {
            $title = $type === 'community' ? $content->name : $content->title;
            Mail::to($content->user->email)->queue(new ContentStatusMail($type, $title, 'approved'));
        }

        AuditLog::log(auth()->id(), 'approve_content', $type, $id, ['status' => 'approved'], "Authorized {$type} node #{$id}");

        return back()->with('success', 'Approval verified. Content published and rewards distributed.');
    }

    public function reject(Request $request, $type, $id)
    {
        $request->validate(['reason' => 'required|string|max:500']);
        $reason = $request->input('reason');

        $content = match ($type) {
            'event' => Event::find($id),
            'job' => JobListing::find($id),
            'community' => Community::find($id),
            default => null,
        };

        if (! $content) {
            return back()->with('error', 'Node data not found.');
        }

        match ($type) {
            'event' => $content->update(['approval_status' => 'rejected', 'approved_by' => auth()->id(), 'is_approved' => false, 'rejection_reason' => $reason]),
            'job' => $content->update(['approval_status' => 'rejected', 'approved_by' => auth()->id(), 'rejection_reason' => $reason]),
            'community' => $content->update(['approval_status' => 'rejected', 'approved_by' => auth()->id(), 'rejection_reason' => $reason]),
        };

        if (! empty($content->user?->email)) {
            $title = $type === 'community' ? $content->name : $content->title;
            Mail::to($content->user->email)->queue(new ContentStatusMail($type, $title, 'rejected', $reason));
        }

        AuditLog::log(auth()->id(), 'reject_content', $type, $id, ['reason' => $reason], "Rejected {$type} node #{$id}");

        return back()->with('success', 'Signal suppressed. Content rejected.');
    }

    public function resolveReport(Request $request, ContentReport $report)
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

        // Action logic...
        if ($report->content_type === 'user' && in_array($validated['action'], ['warning', 'suspend', 'ban'])) {
            $target = User::find($report->content_id);
            if ($target) {
                match ($validated['action']) {
                    'warning' => $target->increment('warning_count'),
                    'suspend' => $target->update(['suspended_until' => now()->addDays(7)]),
                    'ban' => $target->update(['banned_at' => now()]),
                };
            }
        } elseif ($validated['action'] === 'delete') {
            $content = match ($report->content_type) {
                'event' => Event::find($report->content_id),
                'job' => JobListing::find($report->content_id),
                'message' => Message::find($report->content_id),
                'community_post' => CommunityPost::find($report->content_id),
                'community_comment' => CommunityComment::find($report->content_id),
                default => null,
            };
            $content?->delete();
        }

        AuditLog::log(auth()->id(), 'resolve_report', 'report', $report->id, ['action' => $validated['action']], "Resolved report #{$report->id} with action: {$validated['action']}");

        return back()->with('success', 'Threat mitigated. Report resolved.');
    }
}
