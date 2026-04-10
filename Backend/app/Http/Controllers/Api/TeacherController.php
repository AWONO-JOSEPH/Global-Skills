<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Formation;
use App\Models\Student;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;

class TeacherController extends Controller
{
    private function getTeacher(Request $request)
    {
        $user = Auth::user();
        return ($user && $user->role === 'teacher') ? $user : null;
    }

    public function profile(Request $request): JsonResponse
    {
        $teacher = $this->getTeacher($request);
        
        if (!$teacher) {
            return response()->json(['message' => 'Teacher not found'], 404);
        }

        return response()->json([
            'id' => $teacher->id,
            'name' => $teacher->name,
            'email' => $teacher->email,
            'specialite' => $teacher->specialite ?? null,
            'photo' => $teacher->avatar_url ? url($teacher->avatar_url) : null,
        ]);
    }

    public function formations(Request $request): JsonResponse
    {
        try {
            $teacher = $this->getTeacher($request);
            
            if (!$teacher) {
                return response()->json(['message' => 'Teacher not found'], 404);
            }

            $formations = Formation::where('teacher_id', $teacher->id)->get();
            
            $result = $formations->map(function ($formation) {
                return [
                    'id' => $formation->id,
                    'name' => $formation->name,
                    'start_date' => $formation->start_date,
                    'capacity' => $formation->capacity,
                    'enrolled_students' => Student::where('formation_id', $formation->id)->count(),
                    'price' => $formation->price,
                    'teacher_id' => $formation->teacher_id,
                ];
            });

            return response()->json($result);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Error: ' . $e->getMessage(),
            ], 500);
        }
    }

    public function formationStudents(Request $request, Formation $formation): JsonResponse
    {
        $teacher = $this->getTeacher($request);
        
        if (!$teacher) {
            return response()->json(['message' => 'Teacher not found'], 404);
        }

        if ($formation->teacher_id !== $teacher->id) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $students = Student::where('formation_id', $formation->id)
            ->with(['user', 'formation'])
            ->get()
            ->map(function ($student) {
                return [
                    'id' => $student->id,
                    'name' => $student->user->name,
                    'email' => $student->user->email,
                    'matricule' => $student->matricule,
                    'formation_id' => $student->formation_id,
                    'formation_name' => $student->formation->name,
                    'presence_count' => $student->presence_count ?? 0,
                    'total_sessions' => $student->total_sessions ?? 0,
                    'average_note' => $student->average_note ?? null,
                ];
            });

        return response()->json($students);
    }

    public function updateStudent(Request $request, Student $student): JsonResponse
    {
        $teacher = $this->getTeacher($request);
        
        if (!$teacher) {
            return response()->json(['message' => 'Teacher not found'], 404);
        }

        $formation = Formation::where('teacher_id', $teacher->id)
            ->where('id', $student->formation_id)
            ->first();

        if (!$formation) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|max:255',
            'matricule' => 'required|string|max:50',
        ]);

        $student->user->update([
            'name' => $validated['name'],
            'email' => $validated['email'],
        ]);

        $student->update([
            'matricule' => $validated['matricule'],
        ]);

        return response()->json([
            'id' => $student->id,
            'name' => $student->user->name,
            'email' => $student->user->email,
            'matricule' => $student->matricule,
            'formation_id' => $student->formation_id,
            'formation_name' => $formation->name,
            'presence_count' => $student->presence_count ?? 0,
            'total_sessions' => $student->total_sessions ?? 0,
            'average_note' => $student->average_note ?? null,
        ]);
    }

    public function savePresence(Request $request): JsonResponse
    {
        $teacher = $this->getTeacher($request);
        
        if (!$teacher) {
            return response()->json(['message' => 'Teacher not found'], 404);
        }

        $validated = $request->validate([
            'presences' => 'required|array',
            'presences.*.student_id' => 'required|exists:students,id',
            'presences.*.is_present' => 'required|boolean',
            'presences.*.date' => 'required|date',
        ]);

        foreach ($validated['presences'] as $presenceData) {
            $student = Student::find($presenceData['student_id']);
            
            $formation = Formation::where('teacher_id', $teacher->id)
                ->where('id', $student->formation_id)
                ->first();

            if (!$formation) {
                continue;
            }

            if ($presenceData['is_present']) {
                $student->increment('presence_count');
            }
            $student->increment('total_sessions');
        }

        return response()->json(['message' => 'Présences enregistrées avec succès']);
    }

    public function saveNotes(Request $request): JsonResponse
    {
        $teacher = $this->getTeacher($request);
        
        if (!$teacher) {
            return response()->json(['message' => 'Teacher not found'], 404);
        }

        $validated = $request->validate([
            'notes' => 'required|array',
            'notes.*.student_id' => 'required|exists:students,id',
            'notes.*.note' => 'required|numeric|min:0|max:20',
            'notes.*.subject' => 'nullable|string|max:100',
        ]);

        foreach ($validated['notes'] as $noteData) {
            $student = Student::find($noteData['student_id']);
            
            $formation = Formation::where('teacher_id', $teacher->id)
                ->where('id', $student->formation_id)
                ->first();

            if (!$formation) {
                continue;
            }

            $student->update([
                'average_note' => $noteData['note'],
            ]);
        }

        return response()->json(['message' => 'Notes enregistrées avec succès']);
    }

    public function uploadProfilePicture(Request $request): JsonResponse
    {
        $user = $this->getTeacher($request);

        if (!$user) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $request->validate([
            'profile_picture' => 'required|image|mimes:jpeg,png,jpg,gif,svg|max:2048',
            'photo' => 'nullable|image|mimes:jpeg,png,jpg,gif,svg|max:2048',
        ]);

        $file = $request->file('profile_picture') ?? $request->file('photo');

        if ($file) {
            if ($user->avatar_url) {
                // Extraire le chemin relatif pour la suppression
                $pathToDelete = $user->avatar_url;
                if (str_contains($pathToDelete, '/storage/')) {
                    $parts = explode('/storage/', $pathToDelete);
                    $pathToDelete = end($parts);
                }
                Storage::disk('public')->delete($pathToDelete);
            }

            $path = $file->store('profile-pictures', 'public');
            $user->avatar_url = Storage::url($path);
            $user->save();

            $photoUrl = $user->avatar_url;
            if (!filter_var($photoUrl, FILTER_VALIDATE_URL)) {
                $photoUrl = url($photoUrl);
            }

            return response()->json([
                'message' => 'Profile picture uploaded successfully', 
                'photo' => $photoUrl,
                'avatar_url' => $photoUrl
            ]);
        }

        return response()->json(['message' => 'No profile picture uploaded'], 400);
    }
}
