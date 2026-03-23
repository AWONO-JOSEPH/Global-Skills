<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\ProgramTracking;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class ProgramTrackingController extends Controller
{
    private function getUser(Request $request)
    {
        $user = Auth::user();
        if (!$user) {
            $email = $request->query('email') ?? $request->input('email');
            if ($email) {
                $user = User::where('email', $email)->first();
            }
        }
        return $user;
    }

    public function index(Request $request): JsonResponse
    {
        $user = $this->getUser($request);
        if (!$user) {
            return response()->json(['message' => 'Unauthorized'], 401);
        }

        $query = ProgramTracking::with(['user', 'formation']);

        // Si c'est un enseignant, on filtre par ses propres fiches
        if ($user->role === 'teacher') {
            $query->where('user_id', $user->id);
        }

        $trackings = $query->orderByDesc('date')->orderByDesc('start_time')->get();

        return response()->json($trackings);
    }

    public function store(Request $request): JsonResponse
    {
        $user = $this->getUser($request);
        if (!$user || $user->role !== 'teacher') {
            return response()->json(['message' => 'Only teachers can create tracking sheets'], 403);
        }

        $validated = $request->validate([
            'formation_id' => 'required|exists:formations,id',
            'subject' => 'required|string|max:255',
            'date' => 'required|date',
            'start_time' => 'required',
            'end_time' => 'required',
            'report_content' => 'required|string',
            'week_range' => 'nullable|string|max:255',
        ]);

        $tracking = ProgramTracking::create([
            ...$validated,
            'user_id' => $user->id,
            'teacher_signed_at' => now(),
        ]);

        return response()->json($tracking->load(['user', 'formation']), 201);
    }

    public function update(Request $request, ProgramTracking $programTracking): JsonResponse
    {
        $user = $this->getUser($request);
        if (!$user || ($user->role === 'teacher' && $programTracking->user_id !== $user->id)) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $validated = $request->validate([
            'subject' => 'sometimes|required|string|max:255',
            'date' => 'sometimes|required|date',
            'start_time' => 'sometimes|required',
            'end_time' => 'sometimes|required',
            'report_content' => 'sometimes|required|string',
            'week_range' => 'sometimes|nullable|string|max:255',
        ]);

        $programTracking->update($validated);

        return response()->json($programTracking->load(['user', 'formation']));
    }

    public function sign(Request $request, ProgramTracking $programTracking): JsonResponse
    {
        $user = $this->getUser($request);
        if (!$user || $user->role !== 'admin') {
            return response()->json(['message' => 'Only admins can sign tracking sheets'], 403);
        }

        $programTracking->update([
            'admin_signed_at' => now(),
        ]);

        return response()->json($programTracking->load(['user', 'formation']));
    }

    public function destroy(Request $request, ProgramTracking $programTracking): JsonResponse
    {
        $user = $this->getUser($request);
        if (!$user || ($user->role === 'teacher' && $programTracking->user_id !== $user->id)) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $programTracking->delete();

        return response()->json(null, 204);
    }
}
