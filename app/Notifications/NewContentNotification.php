<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Notification;
use App\Models\User;

class NewContentNotification extends Notification implements ShouldQueue
{
    use Queueable;

    public function __construct(
        public string $contentType,
        public string $contentTitle,
        public User $creator,
        public string $actionUrl
    ) {}

    public function via(object $notifiable): array
    {
        return ['database'];
    }

    public function toArray(object $notifiable): array
    {
        return [
            'type' => 'new_content',
            'content_type' => $this->contentType,
            'message' => "@{$this->creator->username} created a new {$this->contentType}: {$this->contentTitle}",
            'action_url' => $this->actionUrl,
            'sender_id' => $this->creator->id,
            'sender_avatar' => $this->creator->avatar,
        ];
    }
}
