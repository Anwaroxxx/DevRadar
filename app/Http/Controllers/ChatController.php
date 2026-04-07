<?php

namespace App\Http\Controllers;

use App\Models\Message;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

class ChatController extends Controller
{
    public function index()
    {
        return Inertia::render('Chat/Index', [
            'chatUsers' => $this->getChatUsers(),
        ]);
    }

    public function show(User $user)
    {
        $currentUserId = Auth::id();

        $messages = Message::where(function($q) use ($currentUserId, $user) {
                $q->where('sender_id', $currentUserId)
                  ->where('receiver_id', $user->id);
            })
            ->orWhere(function($q) use ($currentUserId, $user) {
                $q->where('sender_id', $user->id)
                  ->where('receiver_id', $currentUserId);
            })
            ->orderBy('created_at', 'asc')
            ->get();

        // Mark as read
        Message::where('sender_id', $user->id)
            ->where('receiver_id', $currentUserId)
            ->whereNull('read_at')
            ->update(['read_at' => now()]);

        return Inertia::render('Chat/Index', [
            'chatUsers' => $this->getChatUsers(),
            'selectedUser' => $user->only(['id', 'name', 'username', 'avatar']),
            'messages' => $messages,
        ]);
    }

    public function store(Request $request, User $user)
    {
        $request->validate([
            'content' => 'required|string|max:2000',
        ]);

        Message::create([
            'sender_id' => Auth::id(),
            'receiver_id' => $user->id,
            'content' => $request->content,
        ]);

        Auth::user()?->checkBadges();

        return back();
    }

    public function search(Request $request)
    {
        $query = $request->input('query');
        
        if (!$query) return response()->json([]);

        $users = User::where(function($q) use ($query) {
            $q->where('name', 'LIKE', "%{$query}%")
              ->orWhere('username', 'LIKE', "%{$query}%");
        })
        ->where('id', '!=', Auth::id())
        ->limit(5)
        ->get(['id', 'name', 'username', 'avatar']);

        return response()->json($users);
    }

    private function getChatUsers()
    {
        $userId = Auth::id();

        $chatUsers = User::whereIn('id', function($query) use ($userId) {
            $query->select('receiver_id')
                ->from('messages')
                ->where('sender_id', $userId)
                ->union(
                    DB::table('messages')
                        ->select('sender_id')
                        ->from('messages')
                        ->where('receiver_id', $userId)
                );
        })
        ->where('id', '!=', $userId)
        ->select(['id', 'name', 'username', 'avatar'])
        ->selectSub(
            Message::select('content')
                ->where(function ($q) use ($userId) {
                    $q->whereColumn('sender_id', 'users.id')
                        ->where('receiver_id', $userId);
                })
                ->orWhere(function ($q) use ($userId) {
                    $q->where('sender_id', $userId)
                        ->whereColumn('receiver_id', 'users.id');
                })
                ->latest('created_at')
                ->limit(1),
            'last_message'
        )
        ->selectSub(
            Message::select('created_at')
                ->where(function ($q) use ($userId) {
                    $q->whereColumn('sender_id', 'users.id')
                        ->where('receiver_id', $userId);
                })
                ->orWhere(function ($q) use ($userId) {
                    $q->where('sender_id', $userId)
                        ->whereColumn('receiver_id', 'users.id');
                })
                ->latest('created_at')
                ->limit(1),
            'last_message_time'
        )
        ->selectSub(
            Message::selectRaw('COUNT(*)')
                ->whereColumn('sender_id', 'users.id')
                ->where('receiver_id', $userId)
                ->whereNull('read_at'),
            'unread_count'
        )
        ->orderByDesc('last_message_time')
        ->get();

        return $chatUsers->map(function ($u) {
            return [
                'id' => $u->id,
                'name' => $u->name,
                'username' => $u->username,
                'avatar' => $u->avatar,
                'last_message' => $u->last_message ?? '',
                'last_message_time' => $u->last_message_time,
                'unread_count' => (int) ($u->unread_count ?? 0),
            ];
        })->values();
    }
}
