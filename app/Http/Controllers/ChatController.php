<?php

namespace App\Http\Controllers;

use App\Events\MessageSent;
use App\Events\UserTyping;
use App\Models\Message;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

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

        $messages = Message::where(function ($q) use ($currentUserId, $user) {
            $q->where('sender_id', $currentUserId)
                ->where('receiver_id', $user->id);
        })
            ->orWhere(function ($q) use ($currentUserId, $user) {
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

        // Check if either user has blocked the other
        if (Auth::user()->hasBlocked($user) || $user->hasBlocked(Auth::user())) {
            return Inertia::render('Chat/Index', [
                'chatUsers' => $this->getChatUsers(),
                'selectedUser' => $user->only(['id', 'name', 'username', 'avatar']),
                'messages' => [],
                'isRestricted' => true,
            ]);
        }

        return Inertia::render('Chat/Index', [
            'chatUsers' => $this->getChatUsers(),
            'selectedUser' => $user->only(['id', 'name', 'username', 'avatar']),
            'messages' => $messages,
            'isRestricted' => false,
        ]);
    }

    public function messages(Request $request, User $user)
    {
        $currentUserId = Auth::id();
        $afterId = $request->query('after', 0);

        $messages = Message::where('id', '>', $afterId)
            ->where(function ($q) use ($currentUserId, $user) {
                $q->where(function ($q2) use ($currentUserId, $user) {
                    $q2->where('sender_id', $currentUserId)->where('receiver_id', $user->id);
                })->orWhere(function ($q2) use ($currentUserId, $user) {
                    $q2->where('sender_id', $user->id)->where('receiver_id', $currentUserId);
                });
            })
            ->orderBy('created_at', 'asc')
            ->get();

        // Mark fetched incoming messages as read
        if ($messages->count() > 0) {
            Message::where('sender_id', $user->id)
                ->where('receiver_id', $currentUserId)
                ->whereIn('id', $messages->pluck('id'))
                ->whereNull('read_at')
                ->update(['read_at' => now()]);
        }

        return response()->json($messages);
    }

    public function store(Request $request, User $user)
    {
        if (Auth::user()->hasBlocked($user) || $user->hasBlocked(Auth::user())) {
            return back()->with('error', 'SYSTEM_ERR: COMMUNICATION_RESTRICTED');
        }

        $request->validate([
            'content' => 'required|string|max:2000',
        ]);

        $message = Message::create([
            'sender_id' => Auth::id(),
            'receiver_id' => $user->id,
            'content' => $request->content,
        ]);

        $message->load('sender');

        broadcast(new MessageSent($message))->toOthers();

        Auth::user()?->checkBadges();

        return back();
    }

    public function typing(Request $request, User $user)
    {
        $request->validate(['is_typing' => 'required|boolean']);

        broadcast(new UserTyping(Auth::id(), $user->id, $request->is_typing))->toOthers();

        return response()->json(['status' => 'transmitted']);
    }

    public function search(Request $request)
    {
        $query = $request->input('query');

        if (! $query) {
            return response()->json([]);
        }

        $currentUser = Auth::user();
        $blockedByMe = $currentUser->blockedUsers()->pluck('blocked_user_id')->toArray();
        $blockingMe = $currentUser->blockedByUsers()->pluck('user_id')->toArray();
        $restrictedIds = array_unique(array_merge($blockedByMe, $blockingMe));

        $users = User::where(function ($q) use ($query) {
            $q->where('name', 'LIKE', "%{$query}%")
                ->orWhere('username', 'LIKE', "%{$query}%");
        })
            ->where('id', '!=', Auth::id())
            ->whereNotIn('id', $restrictedIds)
            ->limit(5)
            ->get(['id', 'name', 'username', 'avatar']);

        return response()->json($users);
    }

    private function getChatUsers()
    {
        $userId = Auth::id();

        $currentUser = Auth::user();
        $blockedByMe = $currentUser->blockedUsers()->pluck('blocked_user_id')->toArray();
        $blockingMe = $currentUser->blockedByUsers()->pluck('user_id')->toArray();
        $restrictedIds = array_unique(array_merge($blockedByMe, $blockingMe));

        $chatUsers = User::whereIn('id', function ($query) use ($userId) {
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
            ->whereNotIn('id', $restrictedIds)
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
