<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Formation;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class FormationController extends Controller
{
    public function index(): JsonResponse
    {
        $formations = Formation::with('teacher:id,name')
            ->orderByDesc('start_date')
            ->orderBy('name')
            ->get();

        return response()->json($formations);
    }

    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'teacher_id' => ['nullable', 'integer', 'exists:users,id'],
            'start_date' => ['nullable', 'date'],
            'capacity' => ['required', 'integer', 'min:0'],
            'enrolled_students' => ['nullable', 'integer', 'min:0'],
            'price' => ['nullable', 'integer', 'min:0'],
        ]);

        if (! array_key_exists('enrolled_students', $validated)) {
            $validated['enrolled_students'] = 0;
        }
        $validated['price'] = $validated['price'] ?? 0;

        $formation = Formation::create($validated);

        return response()->json($formation, 201);
    }

    public function update(Request $request, Formation $formation): JsonResponse
    {
        $validated = $request->validate([
            'name' => ['sometimes', 'required', 'string', 'max:255'],
            'teacher_id' => ['sometimes', 'nullable', 'integer', 'exists:users,id'],
            'start_date' => ['sometimes', 'nullable', 'date'],
            'capacity' => ['sometimes', 'required', 'integer', 'min:0'],
            'enrolled_students' => ['sometimes', 'nullable', 'integer', 'min:0'],
            'price' => ['sometimes', 'nullable', 'integer', 'min:0'],
        ]);

        $formation->update($validated);

        return response()->json($formation);
    }

    public function destroy(Formation $formation): JsonResponse
    {
        $formation->delete();

        return response()->json([], 204);
    }

    public function students(Formation $formation): JsonResponse
    {
        $students = \App\Models\Student::where('formation_id', $formation->id)
            ->with('user:id,name,email,phone')
            ->get()
            ->map(function ($student) {
                return [
                    'id' => $student->user->id,
                    'name' => $student->user->name,
                    'email' => $student->user->email,
                    'phone' => $student->user->phone,
                    'matricule' => $student->matricule,
                    'joined_at' => $student->created_at?->format('d/m/Y'),
                ];
            });

        return response()->json($students);
    }
}

