<?php

namespace App\Notifications;

use App\Models\User;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class NewFollower extends Notification implements ShouldQueue
{
    use Queueable;

    public $follower;

    public function __construct(User $follower)
    {
        $this->follower = $follower;
    }

    public function via(object $notifiable): array
    {
        return ['database']; // Default to DB notification. If user has emails turned on, we could add 'mail'
    }

    public function toArray(object $notifiable): array
    {
        return [
            'type' => 'follow', // for frontend rendering logic
            'follower_id' => $this->follower->id,
            'follower_name' => $this->follower->name,
            'follower_username' => $this->follower->username,
            'follower_avatar' => $this->follower->avatar,
            'message' => "@{$this->follower->username} established a connection link.",
            'action_url' => "/profile/{$this->follower->username}",
        ];
    }
}
