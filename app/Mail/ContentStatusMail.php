<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class ContentStatusMail extends Mailable implements ShouldQueue
{
    use Queueable, SerializesModels;

    public function __construct(
        public string $contentType,
        public string $title,
        public string $status,
        public ?string $reason = null
    ) {}

    public function envelope(): Envelope
    {
        $statusLabel = strtoupper($this->status);

        return new Envelope(
            subject: "[DevRadar] {$this->contentType} {$statusLabel}: {$this->title}"
        );
    }

    public function content(): Content
    {
        return new Content(
            view: 'emails.content-status'
        );
    }
}
