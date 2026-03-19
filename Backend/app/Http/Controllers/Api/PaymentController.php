<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Payment;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class PaymentController extends Controller
{
    public function index(): JsonResponse
    {
        $payments = Payment::with(['user', 'formation'])
            ->orderByDesc('created_at')
            ->get()
            ->map(function (Payment $payment) {
                // Calculer le total payé par cet étudiant pour cette formation (seulement les payés)
                $totalPaid = 0;
                if ($payment->formation_id && $payment->user_id) {
                    $totalPaid = Payment::where('user_id', $payment->user_id)
                        ->where('formation_id', $payment->formation_id)
                        ->where('status', 'Payé')
                        ->sum('amount');
                }

                $formationPrice = $payment->formation?->price ?? 0;
                $isPartial = ($totalPaid < $formationPrice);
                $remaining = max(0, $formationPrice - $totalPaid);

                return [
                    'id' => $payment->id,
                    'etudiant' => $payment->user?->name ?? $payment->user?->email,
                    'montant' => $payment->amount,
                    'type' => $payment->formation?->name ?? 'Paiement',
                    'date' => $payment->created_at?->format('d/m/Y'),
                    'statut' => $payment->status,
                    'is_partial' => $isPartial,
                    'remaining' => $remaining,
                    'formation_price' => $formationPrice,
                    'total_paid_so_far' => $totalPaid,
                ];
            })
            ->values();

        return response()->json($payments);
    }

    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'user_id' => ['required', 'integer', 'exists:users,id'],
            'formation_id' => ['required', 'integer', 'exists:formations,id'], // Rendre obligatoire pour lier au prix
            'amount' => ['required', 'integer', 'min:1'],
        ]);

        $formation = \App\Models\Formation::findOrFail($validated['formation_id']);
        
        // On pourrait ajouter une logique ici pour empêcher de payer plus que le prix total
        $alreadyPaid = Payment::where('user_id', $validated['user_id'])
            ->where('formation_id', $validated['formation_id'])
            ->where('status', 'Payé')
            ->sum('amount');

        if (($alreadyPaid + $validated['amount']) > $formation->price) {
            // Optionnel : Limiter le paiement au montant restant
            // $validated['amount'] = $formation->price - $alreadyPaid;
        }

        $payment = Payment::create([
            'user_id' => $validated['user_id'],
            'formation_id' => $validated['formation_id'],
            'amount' => $validated['amount'],
            'status' => 'En attente',
        ]);

        return response()->json($payment, 201);
    }

    public function confirm(Payment $payment): JsonResponse
    {
        $payment->update([
            'status' => 'Payé',
        ]);

        return response()->json($payment);
    }
}

