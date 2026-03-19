<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\Formation;
use App\Models\Student;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Auth;

class StudentController extends Controller
{
    public function profile(): JsonResponse
    {
        try {
            // Pour l'instant, on utilise un utilisateur de test
            $studentUser = User::where('role', 'student')->first();
            
            if (!$studentUser) {
                return response()->json(['message' => 'Student not found'], 404);
            }

            $student = Student::where('user_id', $studentUser->id)->with(['formation', 'user'])->first();

            return response()->json([
                'id' => $student->id,
                'nom' => $studentUser->name,
                'matricule' => $student->matricule,
                'formation' => $student->formation->name ?? 'Non assigné',
                'niveau' => 'Spécialité',
                'photo' => $studentUser->photo ?? null,
                'email' => $studentUser->email,
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Error: ' . $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ], 500);
        }
    }

    public function formations(): JsonResponse
    {
        try {
            $studentUser = User::where('role', 'student')->first();
            
            if (!$studentUser) {
                return response()->json(['message' => 'Student not found'], 404);
            }

            $student = Student::where('user_id', $studentUser->id)->with('formation')->first();

            if (!$student || !$student->formation) {
                return response()->json([]);
            }

            $progression = 60;

            return response()->json([[
                'nom' => $student->formation->name,
                'progression' => $progression,
                'statut' => 'En cours',
                'debut' => 'Janvier 2026',
                'fin' => 'Décembre 2026',
                'formation_id' => $student->formation->id,
            ]]);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Error: ' . $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ], 500);
        }
    }

    public function paiements(): JsonResponse
    {
        return response()->json([
            ['date' => '15/01/2026', 'montant' => '50,000 FCFA', 'type' => 'Inscription', 'statut' => 'Payé'],
            ['date' => '15/02/2026', 'montant' => '50,000 FCFA', 'type' => 'Mensualité', 'statut' => 'Payé'],
            ['date' => '15/03/2026', 'montant' => '50,000 FCFA', 'type' => 'Mensualité', 'statut' => 'En attente'],
        ]);
    }

    public function calendrier(): JsonResponse
    {
        return response()->json([
            ['date' => '10/03/2026', 'heure' => '09:00 - 12:00', 'cours' => 'SEO et Référencement', 'salle' => 'A201'],
            ['date' => '12/03/2026', 'heure' => '14:00 - 17:00', 'cours' => 'Social Media Marketing', 'salle' => 'B105'],
            ['date' => '15/03/2026', 'heure' => '09:00 - 12:00', 'cours' => 'Google Ads', 'salle' => 'A201'],
            ['date' => '18/03/2026', 'heure' => '10:00 - 13:00', 'cours' => 'Email Marketing', 'salle' => 'C302'],
        ]);
    }

    public function documents(): JsonResponse
    {
        return response()->json([
            ['nom' => 'Attestation d\'inscription', 'type' => 'PDF', 'date' => '15/01/2026'],
            ['nom' => 'Programme de formation', 'type' => 'PDF', 'date' => '16/01/2026'],
            ['nom' => 'Calendrier des cours', 'type' => 'PDF', 'date' => '20/01/2026'],
        ]);
    }

    public function notifications(): JsonResponse
    {
        return response()->json([
            ['titre' => 'Nouveau cours disponible', 'message' => 'Le cours de Content Marketing est maintenant disponible', 'date' => 'Il y a 2 heures', 'lu' => false],
            ['titre' => 'Paiement en attente', 'message' => 'Votre paiement de mars est en attente', 'date' => 'Il y a 1 jour', 'lu' => false],
            ['titre' => 'Note disponible', 'message' => 'Votre note pour l\'examen de SEO est disponible', 'date' => 'Il y a 3 jours', 'lu' => true],
        ]);
    }

    public function notes(): JsonResponse
    {
        return response()->json([
            ['matiere' => 'SEO et Référencement', 'note' => 16, 'max' => 20, 'date' => '25/02/2026'],
            ['matiere' => 'Communication Digitale', 'note' => 18, 'max' => 20, 'date' => '20/02/2026'],
            ['matiere' => 'Outils Bureautiques', 'note' => 15, 'max' => 20, 'date' => '15/02/2026'],
        ]);
    }

    public function overview(): JsonResponse
    {
        return response()->json([
            'progression' => 60,
            'paiements_effectues' => 2,
            'total_paiements' => 3,
            'moyenne_generale' => 16.3,
            'prochain_cours' => [
                'date' => '10/03/2026',
                'cours' => 'SEO et Référencement',
                'heure' => '09:00 - 12:00',
            ],
        ]);
    }
}
