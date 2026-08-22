<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Community;
use App\Models\CommunitySnapshot;
use App\Models\Event;
use App\Models\JobListing;
use App\Models\MarketplaceItem;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ContentController extends Controller
{
    public function events(Request $request)
    {
        $query = Event::with('user', 'tags')->latest();

        if ($request->search) {
            $query->where('title', 'LIKE', "%{$request->search}%")
                ->orWhere('city', 'LIKE', "%{$request->search}%");
        }

        if ($request->status) {
            $query->where('approval_status', $request->status);
        }

        if ($request->category) {
            $query->where('category', $request->category);
        }

        $events = $query->paginate(20)->withQueryString();

        return Inertia::render('Admin/Events', [
            'events' => $events,
            'filters' => $request->only(['search', 'status', 'category']),
        ]);
    }

    public function jobs(Request $request)
    {
        $query = JobListing::with('user')->latest();

        if ($request->search) {
            $query->where(function ($q) use ($request) {
                $q->where('title', 'LIKE', "%{$request->search}%")
                    ->orWhere('company', 'LIKE', "%{$request->search}%");
            });
        }

        if ($request->status) {
            $query->where('approval_status', $request->status);
        }

        $jobs = $query->paginate(20)->withQueryString();

        return Inertia::render('Admin/Jobs', [
            'jobs' => $jobs,
            'filters' => $request->only(['search', 'status']),
        ]);
    }

    public function communities(Request $request)
    {
        $query = Community::with('user')
            ->withCount(['followers', 'posts'])
            ->latest();

        if ($request->search) {
            $query->where('name', 'LIKE', "%{$request->search}%");
        }

        if ($request->status) {
            $query->where('approval_status', $request->status);
        }

        $communities = $query->paginate(20)->withQueryString();

        // Transform to include comment counts per community (sum of comments on all posts)
        $communities->getCollection()->transform(function ($community) {
            $community->comments_count = $community->posts()->withCount('comments')->get()->sum('comments_count');

            return $community;
        });

        return Inertia::render('Admin/Communities', [
            'communities' => $communities,
            'filters' => $request->only(['search', 'status']),
        ]);
    }

    public function captureSnapshot(Community $community)
    {
        $posts_count = $community->posts()->count();
        $comments_count = $community->posts()->withCount('comments')->get()->sum('comments_count');
        $followers_count = $community->followers()->count();

        // Calculate engagement signal (weighted score)
        $signal = ($followers_count * 1) + ($posts_count * 5) + ($comments_count * 2);

        CommunitySnapshot::create([
            'community_id' => $community->id,
            'followers_count' => $followers_count,
            'posts_count' => $posts_count,
            'comments_count' => $comments_count,
            'engagement_signal' => $signal,
        ]);

        return back()->with('success', "Intelligence snapshot captured for node: {$community->name}");
    }

    public function getStats(Community $community)
    {
        return response()->json([
            'snapshots' => $community->snapshots()->orderBy('created_at', 'desc')->limit(10)->get(),
        ]);
    }

    public function delete(Request $request, $type, $id)
    {
        $content = match ($type) {
            'event' => Event::find($id),
            'job' => JobListing::find($id),
            'community' => Community::find($id),
            'marketplace' => MarketplaceItem::find($id),
            default => null,
        };

        if ($content) {
            $content->delete();

            return back()->with('success', ucfirst($type).' deleted successfully.');
        }

        return back()->with('error', 'Content not found.');
    }
}
