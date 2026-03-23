<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Formation;
use App\Models\Payment;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Carbon;
use Symfony\Component\HttpFoundation\BinaryFileResponse;

use App\Models\ProgramTracking;
use Illuminate\Http\JsonResponse;

class ReportController extends Controller
{
    public function generateAnnualReport(): JsonResponse|\Symfony\Component\HttpFoundation\StreamedResponse
    {
        try {
            // ... (reste du code)
            $totalStudents = User::where('role', 'student')->count();
            $totalTeachers = User::where('role', 'teacher')->count();
            $totalFormations = Formation::count();
            $totalRevenue = Payment::where('status', 'Payé')->sum('amount');
            $now = Carbon::now();

            // Liste des formations avec leurs stats
            $formations = Formation::withCount(['students'])->get();

            // Inclure les rapports de suivi récents
            $trackings = ProgramTracking::with(['user', 'formation'])
                ->orderByDesc('date')
                ->limit(20)
                ->get();
            
            $data = [
                'center_name' => 'Global Skills',
                'periode' => $now->format('Y'),
                'presentation' => 'Global Skills est un centre de formation professionnelle spécialisé dans les métiers du numérique, des langues et du management.',
                'services' => 'Nos services incluent la formation initiale, continue, et l\'accompagnement vers les certifications internationales.',
                'activities' => 'Sur l\'année ' . $now->format('Y') . ', nous avons renforcé nos partenariats et élargi notre catalogue de formations.',
                'students_count' => $totalStudents,
                'courses_count' => $totalFormations,
                'teachers_count' => $totalTeachers,
                'total_revenue' => number_format($totalRevenue, 0, ',', ' ') . ' FCFA',
                'conclusion' => 'L\'année se clôture sur un bilan positif avec une croissance constante du nombre d\'apprenants.'
            ];

            return response()->json([
                'message' => 'Données du rapport prêtes',
                'report_data' => $data,
                'formations' => $formations,
                'trackings' => $trackings
            ]);

        } catch (\Exception $e) {
            return response()->json(['message' => 'Erreur: ' . $e->getMessage()], 500);
        }
    }

    public function generateTrackingReport(Request $request): JsonResponse
    {
        try {
            $query = ProgramTracking::with(['user', 'formation']);

            if ($request->has('formation_id')) {
                $query->where('formation_id', $request->formation_id);
            }

            if ($request->has('user_id')) {
                $query->where('user_id', $request->user_id);
            }

            $trackings = $query->orderByDesc('date')->get();

            return response()->json([
                'message' => 'Rapport de suivi généré',
                'trackings' => $trackings,
                'generated_at' => Carbon::now()->toDateTimeString()
            ]);
        } catch (\Exception $e) {
            return response()->json(['message' => 'Erreur: ' . $e->getMessage()], 500);
        }
    }
}
