<?php

namespace App\Http\Controllers;

use App\Models\Community;
use App\Models\CommunityPost;
use App\Models\CommunityComment;
use App\Models\ContentReport;
use App\Models\AuditLog;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Auth;

class CommunityController extends Controller
{
    public function index(Request $request)
    {
        $query = Community::with('user')
            ->withCount('followers')
            ->where('approval_status', 'approved')
            ->orderByDesc('member_count');

        if ($request->category) $query->where('category', $request->category);
        if ($request->city) $query->where('city', $request->city);

        $communities = $query->paginate(12)->withQueryString();

        return Inertia::render('Communities/Index', [
            'communities' => $communities,
            'filters'     => $request->only(['category', 'city']),
        ]);
    }

    public function create()
    {
        return Inertia::render('Communities/Create');
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'name'        => 'required|string|max:255',
            'description' => 'required|string',
            'platform'    => 'required|string',
            'join_link'   => 'required|url',
            'category'    => 'required|string',
        ]);

        $community = $request->user()->communities()->create(array_merge($data, [
            'approval_status' => 'approved', // Communities are now auto-approved for active management
            'approved_by' => null,
        ]));

        if (!empty($request->user()->email)) {
            Mail::to($request->user()->email)->queue(
                new ContentStatusMail('community', $community->name, 'pending')
            );
        }

        return redirect()->route('communities.index')->with('success', 'Group submission verified. Pending approval.');
    }

    public function edit(Community $community)
    {
        $this->authorize('update', $community);
        return Inertia::render('Communities/Edit', ['community' => $community]);
    }

    public function update(Request $request, Community $community)
    {
        $this->authorize('update', $community);
        $data = $request->validate([
            'name'        => 'required|string|max:255',
            'description' => 'required|string',
            'platform'    => 'required|string',
            'join_link'   => 'required|url',
            'city'        => 'nullable|string',
            'latitude'    => 'nullable|numeric',
            'longitude'   => 'nullable|numeric',
            'category'    => 'required|string',
        ]);

        $community->update($data);
        return redirect()->route('communities.index')->with('success', 'Group details updated.');
    }

    public function destroy(Community $community)
    {
        $this->authorize('delete', $community);
        $community->delete();
        return redirect()->route('communities.index')->with('success', 'Group entry removed.');
    }

    public function show(Community $community, Request $request)
    {
        $community->loadCount('followers');
        $community->load(['user']);

        $posts = CommunityPost::where('community_id', $community->id)
            ->with(['user', 'comments.user'])
            ->withCount('comments')
            ->orderByDesc('created_at')
            ->paginate(15);

        return Inertia::render('Communities/Show', [
            'community' => $community,
            'posts' => $posts,
            'isFollowing' => $request->user() ? $community->followers()->where('user_id', $request->user()->id)->exists() : false,
        ]);
    }

    public function storePost(Community $community, Request $request)
    {
        $data = $request->validate([
            'title' => 'required|string|max:255',
            'content' => 'required|string',
            'code_snippet' => 'nullable|string',
            'language' => 'nullable|string',
        ]);

        $post = $community->posts()->create(array_merge($data, [
            'user_id' => $request->user()->id,
        ]));

        $request->user()->awardXp(20, 'community_post', "Shared a thought in {$community->name}", $post);

        return back()->with('success', 'Thought broadcasted successfully.');
    }

    public function storeComment(CommunityPost $post, Request $request)
    {
        $data = $request->validate([
            'content' => 'required|string',
        ]);

        $post->comments()->create(array_merge($data, [
            'user_id' => $request->user()->id,
        ]));

        $request->user()->awardXp(5, 'community_comment', "Replied to a thread", $post);

        return back()->with('success', 'Signal received.');
    }

    public function toggleUpvote(CommunityPost $post, Request $request)
    {
        // Simple upvote for now, just increment
        $post->increment('upvotes_count');
        return back();
    }

    public function reportPost(CommunityPost $post, Request $request)
    {
        $request->validate([
            'reason' => 'required|string',
            'description' => 'required|string|max:500',
        ]);

        // Prevent duplicate reporting by same user
        $exists = ContentReport::where('user_id', Auth::id())
            ->where('content_type', 'community_post')
            ->where('content_id', $post->id)
            ->exists();

        if ($exists) {
            return back()->with('error', 'Signal already transmitted for this node.');
        }

        ContentReport::create([
            'user_id' => Auth::id(),
            'content_type' => 'community_post',
            'content_id' => $post->id,
            'reason' => $request->reason,
            'description' => $request->description,
            'status' => 'pending',
        ]);

        $this->processEscalation($post->user);

        return back()->with('success', 'SIGNAL_BROADCAST: Moderation unit alerted.');
    }

    public function reportComment(CommunityComment $comment, Request $request)
    {
        $request->validate([
            'reason' => 'required|string',
            'description' => 'required|string|max:500',
        ]);

        $exists = ContentReport::where('user_id', Auth::id())
            ->where('content_type', 'community_comment')
            ->where('content_id', $comment->id)
            ->exists();

        if ($exists) {
            return back()->with('error', 'Signal already transmitted for this node.');
        }

        ContentReport::create([
            'user_id' => Auth::id(),
            'content_type' => 'community_comment',
            'content_id' => $comment->id,
            'reason' => $request->reason,
            'description' => $request->description,
            'status' => 'pending',
        ]);

        $this->processEscalation($comment->user);

        return back()->with('success', 'SIGNAL_BROADCAST: Moderation unit alerted.');
    }

    private function processEscalation($user)
    {
        if (!$user) return;

        // Count pending reports across all content owned by this user
        $reportCount = ContentReport::where('status', 'pending')
            ->whereIn('content_type', ['community_post', 'community_comment', 'event', 'job', 'message'])
            ->whereHasMorph('content', ['App\Models\CommunityPost', 'App\Models\CommunityComment', 'App\Models\Event', 'App\Models\JobListing', 'App\Models\Message'], function($query) use ($user) {
                // This is a bit complex due to different owner column names, 
                // but since they all have user_id, it might work if we just filter by user_id in the content table
            })->count();
            
        // Simpler approach for now: Get IDs of content owned by user and count reports on them
        $postIds = CommunityPost::where('user_id', $user->id)->pluck('id');
        $commentIds = CommunityComment::where('user_id', $user->id)->pluck('id');
        
        $totalReports = ContentReport::where('status', 'pending')
            ->where(function($q) use ($user, $postIds, $commentIds) {
                $q->where(function($sq) use ($user) {
                    $sq->where('content_type', 'user')->where('content_id', $user->id);
                })->orWhere(function($sq) use ($postIds) {
                    $sq->where('content_type', 'community_post')->whereIn('content_id', $postIds);
                })->orWhere(function($sq) use ($commentIds) {
                    $sq->where('content_type', 'community_comment')->whereIn('content_id', $commentIds);
                });
                // Could expand to events/jobs but focusing on community for now as requested
            })->count();

        if ($totalReports >= 3) {
            $warnings = $user->warning_count;
            $duration = 30; // 30 minutes default

            if ($warnings === 1) {
                $duration = 720; // 12 hours
            } elseif ($warnings >= 2) {
                $duration = ($warnings - 1) * 1440; // 24h, 48h, etc.
            }

            $user->update([
                'suspended_until' => now()->addMinutes($duration),
                'warning_count' => $warnings + 1
            ]);

            AuditLog::log(
                null, // System action
                'auto_suspension',
                'user',
                $user->id,
                ['duration' => $duration, 'reports' => $totalReports],
                "Automated signal suppression: User @{$user->username} suspended for {$duration} minutes due to report threshold."
            );
        }
    }

    public function toggleFollow(Community $community, Request $request)
    {
        $user = $request->user();
        if ($community->followers()->where('user_id', $user->id)->exists()) {
            $community->followers()->detach($user->id);
            $community->decrement('member_count');
            return back()->with('info', 'Unfollowed community.');
        } else {
            $community->followers()->syncWithoutDetaching([$user->id]);
            $community->increment('member_count');
            $user->awardXp(10, 'joined_group', "Joined group: {$community->name}", $community);
            return back()->with('success', 'You have joined this group!');
        }
    }
}
