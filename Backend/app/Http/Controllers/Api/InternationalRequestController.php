<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\InternationalRequest;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;
use App\Mail\InternationalRequestReceived;
use App\Mail\InternationalRequestAdminNotification;

class InternationalRequestController extends Controller
{
    public function store(Request $request)
    {
        try {
            $validated = $request->validate([
                'first_name' => 'required|string|max:255',
                'last_name' => 'required|string|max:255',
                'profession' => 'nullable|string|max:255',
                'phone' => 'required|string|max:20',
                'email' => 'required|email|max:255',
                'description' => 'required|string',
            ]);

            $internationalRequest = InternationalRequest::create($validated);

            // Envoyer l'email à l'administrateur
            try {
                Mail::to('globalskills524@gmail.com')->send(new InternationalRequestAdminNotification($internationalRequest));
            } catch (\Exception $e) {
                // En cas d'erreur d'envoi d'email, on continue quand même
                \Log::error('Erreur envoi email admin: ' . $e->getMessage());
            }

            // Envoyer l'email de confirmation à l'utilisateur
            try {
                Mail::to($internationalRequest->email)->send(new InternationalRequestReceived($internationalRequest));
            } catch (\Exception $e) {
                // En cas d'erreur d'envoi d'email, on continue quand même
                \Log::error('Erreur envoi email utilisateur: ' . $e->getMessage());
            }

            return response()->json([
                'message' => 'Votre demande a été soumise avec succès. Nous vous contacterons prochainement.',
                'request' => $internationalRequest
            ], 201);
        } catch (\Illuminate\Validation\ValidationException $e) {
            return response()->json([
                'message' => 'Erreur de validation',
                'errors' => $e->errors()
            ], 422);
        } catch (\Exception $e) {
            \Log::error('Erreur lors de la soumission de la demande: ' . $e->getMessage());
            return response()->json([
                'message' => 'Une erreur est survenue lors de la soumission de votre demande. Veuillez réessayer.'
            ], 500);
        }
    }

    public function index()
    {
        $requests = InternationalRequest::orderBy('created_at', 'desc')->get();
        
        return response()->json([
            'requests' => $requests->map(function ($request) {
                return [
                    'id' => $request->id,
                    'full_name' => $request->full_name,
                    'phone' => $request->phone,
                    'email' => $request->email,
                    'profession' => $request->profession,
                    'status' => $request->status,
                    'status_label' => $request->status_label,
                    'created_at' => $request->created_at->format('d/m/Y H:i'),
                ];
            })
        ]);
    }

    public function show(InternationalRequest $internationalRequest)
    {
        return response()->json([
            'request' => [
                'id' => $internationalRequest->id,
                'full_name' => $internationalRequest->full_name,
                'first_name' => $internationalRequest->first_name,
                'last_name' => $internationalRequest->last_name,
                'profession' => $internationalRequest->profession,
                'phone' => $internationalRequest->phone,
                'email' => $internationalRequest->email,
                'description' => $internationalRequest->description,
                'status' => $internationalRequest->status,
                'status_label' => $internationalRequest->status_label,
                'created_at' => $internationalRequest->created_at->format('d/m/Y H:i'),
                'updated_at' => $internationalRequest->updated_at->format('d/m/Y H:i'),
            ]
        ]);
    }

    public function updateStatus(Request $request, InternationalRequest $internationalRequest)
    {
        $validated = $request->validate([
            'status' => 'required|in:new,in_progress,contacted,completed,cancelled',
        ]);

        $internationalRequest->update(['status' => $validated['status']]);

        return response()->json([
            'message' => 'Statut mis à jour avec succès',
            'request' => [
                'id' => $internationalRequest->id,
                'status' => $internationalRequest->status,
                'status_label' => $internationalRequest->status_label,
            ]
        ]);
    }

    public function destroy(InternationalRequest $internationalRequest)
    {
        $internationalRequest->delete();

        return response()->json([
            'message' => 'Demande supprimée avec succès'
        ]);
    }
}
