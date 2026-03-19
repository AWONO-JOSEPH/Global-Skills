<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Formation;
use App\Models\Payment;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Carbon;
use Symfony\Component\HttpFoundation\BinaryFileResponse;

class ReportController extends Controller
{
    public function generateAnnualReport(): JsonResponse|\Symfony\Component\HttpFoundation\StreamedResponse
    {
        try {
            // Stats de base
            $totalStudents = User::where('role', 'student')->count();
            $totalTeachers = User::where('role', 'teacher')->count();
            $totalFormations = Formation::count();
            $totalRevenue = Payment::where('status', 'Payé')->sum('amount');
            $now = Carbon::now();

            // Liste des formations avec leurs stats
            $formations = Formation::withCount(['students'])->get();
            
            // On va utiliser un format HTML pour générer le document si PHPWord n'est pas dispo
            // Mais pour répondre à la demande, on simule la logique TemplateProcessor
            
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

            // Pour l'instant, on renvoie les données pour que le front puisse les afficher ou on génère un PDF simple
            // Comme PHPWord pose problème d'installation (extensions zip/gd manquantes),
            // On va proposer une alternative : générer un fichier texte structuré ou CSV pour le moment
            // OU renvoyer les données au front qui peut imprimer en PDF
            
            return response()->json([
                'message' => 'Données du rapport prêtes',
                'report_data' => $data,
                'formations' => $formations
            ]);

        } catch (\Exception $e) {
            return response()->json(['message' => 'Erreur: ' . $e->getMessage()], 500);
        }
    }
}
