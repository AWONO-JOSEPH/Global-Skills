<?php

namespace App\Mail;

use App\Models\InternationalRequest;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class InternationalRequestAdminNotification extends Mailable
{
    use Queueable, SerializesModels;

    public InternationalRequest $request;

    public function __construct(InternationalRequest $request)
    {
        $this->request = $request;
    }

    public function envelope(): Envelope
    {
        return new Envelope(
            subject: 'Nouvelle demande de projet international - Global Skills',
        );
    }

    public function content(): Content
    {
        return new Content(
            view: 'emails.international-request-admin',
            with: [
                'request' => $this->request,
            ]
        );
    }

    public function attachments(): array
    {
        return [];
    }
}
