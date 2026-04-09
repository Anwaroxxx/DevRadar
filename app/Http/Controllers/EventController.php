<?php

namespace App\Http\Controllers;

use App\Mail\ContentStatusMail;
use App\Models\Event;
use App\Models\Tag;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Mail;

class EventController extends Controller
{
    public function index(Request $request)
    {
        $query = Event::with(['user', 'tags'])
            ->where('approval_status', 'approved')
            ->orderByDesc('event_date');

        if ($request->city) {
            $query->where('city', $request->city);
        }
        if ($request->tag) {
            $query->whereHas('tags', fn($q) => $q->where('name', $request->tag));
        }
        if ($request->category) {
            $query->where('category', $request->category);
        }

        $events = $query->paginate(12)->withQueryString();

        return Inertia::render('Events/Index', [
            'events' => $events,
            'filters' => $request->only(['city', 'tag', 'category']),
            'tags'   => Tag::all(),
        ]);
    }

    public function create()
    {
        return Inertia::render('Events/Create');
    }

    public function show(Event $event)
    {
        // Only admins and owners can view non-approved content.
        $viewer = auth()->user();
        $isAdmin = $viewer?->role === 'admin';
        $isOwner = $viewer?->id === $event->user_id;
        if ($event->approval_status !== 'approved' && !$isAdmin && !$isOwner) {
            abort(404);
        }

        $event->load(['user', 'tags', 'attendees']);
        return Inertia::render('Events/Show', ['event' => $event]);
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'title'       => 'required|string|max:255',
            'description' => 'required|string',
            'city'        => 'required|string',
            'organizer'   => 'required|string',
            'website'     => 'nullable|url',
            'event_date'  => 'required|date',
            'category'    => 'required|string',
            'latitude'    => 'nullable|numeric',
            'longitude'   => 'nullable|numeric',
            'tags'        => 'nullable|array',
        ]);

        $event = $request->user()->events()->create(array_merge($data, [
            'approval_status' => $request->user()->role === 'admin' ? 'approved' : 'pending',
            'is_approved' => $request->user()->role === 'admin',
        ]));

        if (!empty($data['tags'])) {
            $tagIds = collect($data['tags'])->map(function ($name) {
                return Tag::firstOrCreate(['name' => $name], ['color' => '#00d4ff'])->id;
            });
            $event->tags()->sync($tagIds);
        }

        if (!empty($request->user()->email)) {
            Mail::to($request->user()->email)->queue(
                new ContentStatusMail('event', $event->title, 'pending')
            );
        }

        $admins = \App\Models\User::where('role', 'admin')->get();
        if ($admins->isNotEmpty()) {
            \Illuminate\Support\Facades\Notification::send($admins, new \App\Notifications\AdminActionRequired(
                'Event',
                $event->title,
                "A new event '{$event->title}' was proposed by {$request->user()->username}.",
                "/admin/events"
            ));
        }

        return redirect()->route('events.show', $event)->with('success', '+30 XP earned for submitting event!');
    }

    public function edit(Event $event)
    {
        $this->authorize('update', $event);
        return Inertia::render('Events/Edit', [
            'event' => $event->load('tags')
        ]);
    }

    public function update(Request $request, Event $event)
    {
        $this->authorize('update', $event);
        $data = $request->validate([
            'title'       => 'required|string|max:255',
            'description' => 'required|string',
            'city'        => 'required|string',
            'organizer'   => 'required|string',
            'website'     => 'nullable|url',
            'event_date'  => 'required|date',
            'category'    => 'required|string',
            'latitude'    => 'nullable|numeric',
            'longitude'   => 'nullable|numeric',
        ]);

        $event->update($data);
        return redirect()->route('events.show', $event)->with('success', 'Post updated successfully.');
    }

    public function destroy(Event $event)
    {
        $this->authorize('delete', $event);
        $event->delete();
        return redirect()->route('events.index')->with('success', 'Post deleted successfully.');
    }

    public function toggleSave(Event $event, Request $request)
    {
        $user = $request->user();
        $pivot = $user->savedEvents()->where('event_id', $event->id)->first();

        if ($pivot && $pivot->pivot->saved) {
            $user->savedEvents()->updateExistingPivot($event->id, ['saved' => false]);
            return back()->with('info', 'Event unsaved.');
        } else {
            $user->savedEvents()->syncWithoutDetaching([
                $event->id => ['saved' => true]
            ]);
            $user->awardXp(10, 'saved_event', "Saved event: {$event->title}", $event);
            return back()->with('success', '+10 XP earned for saving event!');
        }
    }

    public function toggleAttend(Event $event, Request $request)
    {
        $user = $request->user();
        $pivot = $user->savedEvents()->where('event_id', $event->id)->first();

        if ($pivot && $pivot->pivot->attending) {
            $user->savedEvents()->updateExistingPivot($event->id, ['attending' => false]);
            $event->decrement('attendees_count');
        } else {
            $user->savedEvents()->syncWithoutDetaching([
                $event->id => ['attending' => true]
            ]);
            $event->increment('attendees_count');
        }
        return back();
    }

    public function mapData()
    {
        $events = Event::with('tags')
            ->where('approval_status', 'approved')
            ->whereNotNull('latitude')
            ->whereNotNull('longitude')
            ->get(['id','title','city','category','latitude','longitude','event_date']);
        return response()->json($events);
    }
}
