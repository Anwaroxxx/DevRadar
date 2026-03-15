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
        return User::whereIn('id', function($query) use ($userId) {
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
        ->get()
        ->map(function($u) use ($userId) {
            $last = Message::where(function($q) use ($userId, $u) {
                    $q->where('sender_id', $userId)->where('receiver_id', $u->id);
                })
                ->orWhere(function($q) use ($userId, $u) {
                    $q->where('sender_id', $u->id)->where('receiver_id', $userId);
                })
                ->latest()
                ->first();

            return [
                'id' => $u->id,
                'name' => $u->name,
                'username' => $u->username,
                'avatar' => $u->avatar,
                'last_message' => $last?->content ?? '',
                'last_message_time' => $last?->created_at ?? null,
            ];
        })
        ->sortByDesc('last_message_time')
        ->values();
    }
}
