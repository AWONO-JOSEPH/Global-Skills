<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\ContactMessage;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class ContactMessageController extends Controller
{
    public function index()
    {
        $messages = ContactMessage::orderBy('created_at', 'desc')->get();
        
        return response()->json([
            'messages' => $messages->map(function ($message) {
                return [
                    'id' => $message->id,
                    'name' => $message->name,
                    'email' => $message->email,
                    'phone' => $message->phone,
                    'subject' => $message->subject,
                    'status' => $message->status,
                    'status_label' => $message->status_label,
                    'created_at' => $message->created_at->format('d/m/Y H:i'),
                ];
            })
        ]);
    }

    public function store(Request $request)
    {
        try {
            $validated = $request->validate([
                'name' => 'required|string|max:255',
                'email' => 'required|email|max:255',
                'phone' => 'nullable|string|max:20',
                'subject' => 'nullable|string|max:255',
                'message' => 'required|string',
            ]);

            $contactMessage = ContactMessage::create($validated);

            // Optionnel: Envoyer un email à l'admin
            // Mail::to('globalskills524@gmail.com')->send(new ContactMessageAdminNotification($contactMessage));

            return response()->json([
                'message' => 'Votre message a été envoyé avec succès. Nous vous répondrons dès que possible.',
                'contact_message' => $contactMessage
            ], 201);
        } catch (\Illuminate\Validation\ValidationException $e) {
            return response()->json([
                'message' => 'Erreur de validation',
                'errors' => $e->errors()
            ], 422);
        } catch (\Exception $e) {
            Log::error('Erreur lors de l\'envoi du message de contact: ' . $e->getMessage());
            return response()->json([
                'message' => 'Une erreur est survenue lors de l\'envoi de votre message. Veuillez réessayer.'
            ], 500);
        }
    }

    public function show(ContactMessage $contactMessage)
    {
        // Marquer comme lu si c'est nouveau
        if ($contactMessage->status === 'new') {
            $contactMessage->update(['status' => 'read']);
        }

        return response()->json([
            'message' => [
                'id' => $contactMessage->id,
                'name' => $contactMessage->name,
                'email' => $contactMessage->email,
                'phone' => $contactMessage->phone,
                'subject' => $contactMessage->subject,
                'message' => $contactMessage->message,
                'status' => $contactMessage->status,
                'status_label' => $contactMessage->status_label,
                'created_at' => $contactMessage->created_at->format('d/m/Y H:i'),
            ]
        ]);
    }

    public function updateStatus(Request $request, ContactMessage $contactMessage)
    {
        $validated = $request->validate([
            'status' => 'required|in:new,read,archived,deleted',
        ]);

        $contactMessage->update(['status' => $validated['status']]);

        return response()->json([
            'message' => 'Statut mis à jour avec succès',
            'contact_message' => [
                'id' => $contactMessage->id,
                'status' => $contactMessage->status,
                'status_label' => $contactMessage->status_label,
            ]
        ]);
    }

    public function destroy(ContactMessage $contactMessage)
    {
        $contactMessage->delete();

        return response()->json([
            'message' => 'Message supprimé avec succès'
        ]);
    }
}
