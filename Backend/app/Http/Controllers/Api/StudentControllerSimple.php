<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
use Illuminate\Http\Request;
use App\Models\User;

class StudentControllerSimple extends Controller
{
    private function getStudent(Request $request)
    {
        $user = Auth::user();
        if (!$user) {
            $email = $request->query('email');
            if ($email) {
                $user = User::where('email', $email)->first();
            }
        }
        return ($user && $user->role === 'student') ? $user : null;
    }

    public function profile(Request $request): JsonResponse
    {
        $user = $this->getStudent($request);
        if (!$user) return response()->json(['message' => 'Unauthorized'], 403);

        $user->load('student', 'formation');

        return response()->json([
            'id' => $user->id,
            'nom' => $user->name,
            'matricule' => $user->student?->matricule,
            'formation' => $user->formation?->name,
            'niveau' => $user->student?->level ?? 'N/A',
            'photo' => $user->avatar_url ? url($user->avatar_url) : null,
            'email' => $user->email,
        ]);
    }

    public function formations(Request $request): JsonResponse
    {
        $user = $this->getStudent($request);
        if (!$user) return response()->json(['message' => 'Unauthorized'], 403);

        $user->load(['student.formation', 'formation']);

        $formation = $user->student?->formation ?? $user->formation;
        
        if (!$formation) {
            return response()->json([]);
        }

        $student = $user->student;
        $progression = 0;
        if ($student && $student->total_sessions > 0) {
            $progression = round(($student->presence_count / $student->total_sessions) * 100);
        }

        $statut = 'En cours';
        if ($formation->end_date && $formation->end_date->isPast()) {
            $statut = 'Terminé';
        }

        // Calculer le total payé pour cette formation
        $totalPaid = \App\Models\Payment::where('user_id', $user->id)
            ->where('formation_id', $formation->id)
            ->where('status', 'Payé')
            ->sum('amount');

        $remaining = max(0, $formation->price - $totalPaid);
        $paymentStatus = ($totalPaid >= $formation->price) ? 'Réglé' : 'Tranche ('.number_format($totalPaid, 0, ',', ' ').' / '.number_format($formation->price, 0, ',', ' ').')';

        return response()->json([[
            'nom' => $formation->name,
            'progression' => $progression,
            'statut' => $statut,
            'payment_status' => $paymentStatus,
            'remaining' => $remaining,
            'debut' => $formation->start_date ? $formation->start_date->format('F Y') : 'N/A',
            'fin' => $formation->end_date ? $formation->end_date->format('F Y') : 'N/A',
            'formation_id' => $formation->id,
        ]]);
    }

    public function paiements(Request $request): JsonResponse
    {
        $user = $this->getStudent($request);
        if (!$user) return response()->json(['message' => 'Unauthorized'], 403);

        $user->load('payments.formation');

        if ($user->payments->isEmpty()) {
            return response()->json([]);
        }

        $formattedPayments = $user->payments->map(function ($payment) {
            // Un paiement est une tranche s'il y a un reste à payer après ce paiement (historique)
            // Mais pour simplifier, on affiche juste le type de paiement
            return [
                'date' => $payment->created_at ? $payment->created_at->format('d/m/Y') : 'N/A',
                'montant' => number_format($payment->amount, 0, ',', ' ').' FCFA',
                'type' => $payment->formation?->name ?? 'Paiement',
                'statut' => $payment->status,
                'is_installment' => true, // Tous les paiements partiels sont des installments
            ];
        });

        return response()->json($formattedPayments);
    }

    public function calendrier(Request $request): JsonResponse
    {
        $user = $this->getStudent($request);
        if (!$user) return response()->json(['message' => 'Unauthorized'], 403);

        $user->load(['student.formation.courses', 'formation.courses']);

        $formation = $user->student?->formation ?? $user->formation;

        if (!$formation || $formation->courses->isEmpty()) {
            return response()->json([]);
        }

        $courses = $formation->courses->map(function ($course) {
            return [
                'date' => $course->date ? $course->date->format('d/m/Y') : 'N/A',
                'heure' => ($course->start_time && $course->end_time) ? $course->start_time->format('H:i').' - '.$course->end_time->format('H:i') : 'N/A',
                'cours' => $course->name,
                'salle' => $course->room,
            ];
        });

        return response()->json($courses);
    }

    public function documents(Request $request): JsonResponse
    {
        $user = $this->getStudent($request);
        if (!$user) return response()->json(['message' => 'Unauthorized'], 403);

        $user->load('documents');

        if ($user->documents->isEmpty()) {
            return response()->json([]);
        }

        $documents = $user->documents->map(function ($document) {
            return [
                'nom' => $document->name,
                'type' => $document->type,
                'date' => $document->date ? $document->date->format('d/m/Y') : 'N/A',
                'url' => url('storage/'.$document->file_path),
            ];
        });

        return response()->json($documents);
    }

    public function notifications(Request $request): JsonResponse
    {
        $user = $this->getStudent($request);
        if (!$user) return response()->json(['message' => 'Unauthorized'], 403);

        $user->load('notifications');

        if ($user->notifications->isEmpty()) {
            return response()->json([]);
        }

        $notifications = $user->notifications->map(function ($notification) {
            return [
                'titre' => $notification->title,
                'message' => $notification->message,
                'date' => $notification->created_at ? $notification->created_at->diffForHumans() : 'N/A',
                'lu' => (bool) $notification->is_read,
            ];
        });

        return response()->json($notifications);
    }

    public function notes(Request $request): JsonResponse
    {
        $user = $this->getStudent($request);
        if (!$user) return response()->json(['message' => 'Unauthorized'], 403);

        $user->load('notes');

        if ($user->notes->isEmpty()) {
            return response()->json([]);
        }

        $notes = $user->notes->map(function ($note) {
            return [
                'matiere' => $note->subject,
                'note' => $note->score,
                'max' => $note->max_score,
                'date' => $note->evaluation_date ? $note->evaluation_date->format('d/m/Y') : 'N/A',
            ];
        });

        return response()->json($notes);
    }

    public function overview(Request $request): JsonResponse
    {
        $user = $this->getStudent($request);
        if (!$user) return response()->json(['message' => 'Unauthorized'], 403);

        $user->load(['student.formation', 'formation', 'payments', 'notes']);

        $student = $user->student;
        $formation = $student?->formation ?? $user->formation;

        $progression = 0;
        if ($student && $student->total_sessions > 0) {
            $progression = round(($student->presence_count / $student->total_sessions) * 100);
        }

        $totalPayments = $user->payments->count();
        $paidPayments = $user->payments->where('status', 'Payé')->count();
        $averageNote = $user->notes->avg('score');

        $nextCourse = null;
        if ($formation) {
            $user->load(['student.formation.courses', 'formation.courses']);
            $nextCourse = $formation->courses
                ->where('date', '>=', now()->toDateString())
                ->sortBy('date')
                ->sortBy('start_time')
                ->first();
        }

        return response()->json([
            'progression' => $progression,
            'paiements_effectues' => $paidPayments,
            'total_paiements' => $totalPayments,
            'moyenne_generale' => round($averageNote ?? 0, 1),
            'prochain_cours' => $nextCourse ? [
                'date' => $nextCourse->date ? $nextCourse->date->format('d/m/Y') : 'N/A',
                'cours' => $nextCourse->name,
                'heure' => ($nextCourse->start_time && $nextCourse->end_time) ? $nextCourse->start_time->format('H:i').' - '.$nextCourse->end_time->format('H:i') : 'N/A',
            ] : null,
        ]);
    }

    public function uploadProfilePicture(Request $request): JsonResponse
    {
        $user = $this->getStudent($request);
        if (!$user) return response()->json(['message' => 'Unauthorized'], 403);

        $request->validate([
            'profile_picture' => 'required|image|mimes:jpeg,png,jpg,gif,svg|max:2048',
        ]);

        if ($request->hasFile('profile_picture')) {
            if ($user->avatar_url) {
                // Remove /storage/ prefix for deletion
                $oldPath = str_replace('/storage/', '', $user->avatar_url);
                Storage::disk('public')->delete($oldPath);
            }

            $path = $request->file('profile_picture')->store('profile-pictures', 'public');
            $user->avatar_url = Storage::url($path);
            $user->save();

            return response()->json([
                'message' => 'Profile picture uploaded successfully', 
                'avatar_url' => url($user->avatar_url)
            ]);
        }

        return response()->json(['message' => 'No profile picture uploaded'], 400);
    }
}
