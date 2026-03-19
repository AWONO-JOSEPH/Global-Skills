<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Formation;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class TeacherFormationController extends Controller
{
    public function __invoke(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'email' => ['required', 'string', 'email', 'exists:users,email'],
        ]);

        $teacher = User::where('email', $validated['email'])
            ->where('role', 'teacher')
            ->firstOrFail();

        $formations = Formation::where('teacher_id', $teacher->id)
            ->orderByDesc('start_date')
            ->orderBy('name')
            ->get();

        return response()->json($formations);
    }
}
