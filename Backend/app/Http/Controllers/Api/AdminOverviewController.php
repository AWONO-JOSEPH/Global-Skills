<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\ContactMessage;
use App\Models\Formation;
use App\Models\InternationalRequest;
use App\Models\Payment;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Carbon;

class AdminOverviewController extends Controller
{
    public function __invoke(Request $request): JsonResponse
    {
        // Stats de base
        $totalStudents = User::where('role', 'student')->count();
        $totalTeachers = User::where('role', 'teacher')->count();
        $totalAdmins = User::where('role', 'admin')->count();

        // Inscriptions mensuelles (nombre d'étudiants créés par mois sur les 6 derniers mois)
        $enrollmentData = [];
        $now = Carbon::now();

        for ($i = 5; $i >= 0; $i--) {
            $month = $now->copy()->subMonths($i);
            $count = User::where('role', 'student')
                ->whereYear('created_at', $month->year)
                ->whereMonth('created_at', $month->month)
                ->count();

            $enrollmentData[] = [
                'month' => $month->locale('fr_FR')->translatedFormat('M'),
                'students' => $count,
            ];
        }

        // Revenus mensuels: somme des paiements Payés par mois
        $revenueData = [];
        for ($i = 5; $i >= 0; $i--) {
            $month = $now->copy()->subMonths($i);
            $revenue = Payment::where('status', 'Payé')
                ->whereYear('created_at', $month->year)
                ->whereMonth('created_at', $month->month)
                ->sum('amount');

            $revenueData[] = [
                'month' => $month->locale('fr_FR')->translatedFormat('M'),
                'revenue' => (int) $revenue,
            ];
        }

        // Inscriptions récentes: derniers étudiants créés
        $recentStudents = User::with('formation:id,name')
            ->where('role', 'student')
            ->latest()
            ->take(5)
            ->get()
            ->map(function (User $user) {
                return [
                    'nom' => $user->name,
                    'formation' => $user->formation?->name,
                    'date' => $user->created_at?->format('d/m/Y'),
                    'statut' => 'Actif',
                ];
            })
            ->values();

        // Paiements récents
        $recentPayments = Payment::with(['user', 'formation'])
            ->latest()
            ->take(5)
            ->get()
            ->map(function (Payment $p) {
                return [
                    'id' => $p->id,
                    'etudiant' => $p->user?->name ?? $p->user?->email,
                    'montant' => (string) number_format($p->amount, 0, ',', ' ') . ' FCFA',
                    'type' => $p->formation?->name ?? 'Paiement',
                    'date' => $p->created_at?->format('d/m/Y'),
                    'statut' => $p->status,
                ];
            })
            ->values();

        $monthlyRevenue = Payment::where('status', 'Payé')
            ->whereYear('created_at', $now->year)
            ->whereMonth('created_at', $now->month)
            ->sum('amount');

        return response()->json([
            'stats' => [
                'total_students' => $totalStudents,
                'total_teachers' => $totalTeachers,
                'total_admins' => $totalAdmins,
                'total_formations' => Formation::count(),
                'monthly_success_rate' => 0,
                'monthly_revenue' => (int) $monthlyRevenue,
                'new_messages' => ContactMessage::where('status', 'new')->count(),
                'new_international_requests' => InternationalRequest::where('status', 'new')->count(),
            ],
            'enrollmentData' => $enrollmentData,
            'revenueData' => $revenueData,
            'recentStudents' => $recentStudents,
            'recentPayments' => $recentPayments,
        ]);
    }

    public function getNotificationsCount(): JsonResponse
    {
        return response()->json([
            'new_messages' => ContactMessage::where('status', 'new')->count(),
            'new_international_requests' => InternationalRequest::where('status', 'new')->count(),
            'total_new' => ContactMessage::where('status', 'new')->count() + InternationalRequest::where('status', 'new')->count(),
        ]);
    }
}
