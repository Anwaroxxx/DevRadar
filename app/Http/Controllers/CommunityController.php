<?php

namespace App\Http\Controllers;

use App\Mail\ContentStatusMail;
use App\Models\Community;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Mail;

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
            'city'        => 'nullable|string',
            'category'    => 'required|string',
        ]);

        $community = $request->user()->communities()->create(array_merge($data, [
            'approval_status' => 'pending',
        ]));
        $request->user()->awardXp(20, 'joined_community', "Created community: {$community->name}", $community);

        if (!empty($request->user()->email)) {
            Mail::to($request->user()->email)->queue(
                new ContentStatusMail('community', $community->name, 'pending')
            );
        }

        return redirect()->route('communities.index')->with('success', '+20 XP earned!');
    }

    public function toggleFollow(Community $community, Request $request)
    {
        $user = $request->user();
        if ($community->followers()->where('user_id', $user->id)->exists()) {
            $community->followers()->detach($user->id);
            $community->decrement('member_count');
            return back()->with('info', 'Unfollowed community.');
        } else {
            $community->followers()->attach($user->id);
            $community->increment('member_count');
            $user->awardXp(20, 'joined_community', "Joined community: {$community->name}", $community);
            return back()->with('success', '+20 XP earned for joining community!');
        }
    }
}
