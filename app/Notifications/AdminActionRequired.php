<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Notification;

class AdminActionRequired extends Notification implements ShouldQueue
{
    use Queueable;

    public function __construct(
        public string $actionType,
        public string $title,
        public string $message,
        public string $actionUrl
    ) {}

    public function via(object $notifiable): array
    {
        return ['database'];
    }

    public function toArray(object $notifiable): array
    {
        return [
            'type' => 'admin_action',
            'action_type' => $this->actionType,
            'message' => "[$this->actionType] $this->message",
            'action_url' => $this->actionUrl,
        ];
    }
}
