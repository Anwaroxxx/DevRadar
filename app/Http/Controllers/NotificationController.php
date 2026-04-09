<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;

class NotificationController extends Controller
{
    public function index(Request $request)
    {
        $user = $request->user();
        
        // Get all IDs involved in blocking (both ways)
        $blockedByMe = $user->blockedUsers()->pluck('blocked_user_id')->toArray();
        $blockingMe = $user->blockedByUsers()->pluck('user_id')->toArray();
        $restrictedIds = array_unique(array_merge($blockedByMe, $blockingMe));

        // Get notifications
        $notifications = $user->notifications()
            ->where(function($q) use ($restrictedIds) {
                // Filter out notifications where the 'sender_id' in the JSON data is a restricted user
                foreach ($restrictedIds as $id) {
                    $q->where('data', 'not like', '%"sender_id":' . $id . '%')
                      ->where('data', 'not like', '%"follower_id":' . $id . '%');
                }
            })
            ->paginate(20);

        return Inertia::render('Notifications/Index', [
            'notifications' => $notifications
        ]);
    }

    public function markAsRead(Request $request, $id)
    {
        $notification = $request->user()->notifications()->findOrFail($id);
        $notification->markAsRead();

        return back()->with('success', 'SIGNAL_ACKNOWLEDGED: Notification marked as read.');
    }

    public function markAllAsRead(Request $request)
    {
        $request->user()->unreadNotifications->markAsRead();

        return back()->with('success', 'SYSTEM_CLEANUP: All signals acknowledged.');
    }

    public function destroy(Request $request, $id)
    {
        $notification = $request->user()->notifications()->findOrFail($id);
        $notification->delete();

        return back()->with('success', 'SIGNAL_TERMINATED: Notification deleted.');
    }
}
