<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Mail\AccountCreated;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\DB;

class UserManagementController extends Controller
{
    public function indexStudents(): JsonResponse
    {
        $students = User::with('formation:id,name')
            ->where('role', 'student')
            ->orderByDesc('created_at')
            ->get(['id', 'name', 'email', 'phone', 'created_at', 'formation_id']);

        return response()->json($students);
    }

    public function indexTeachers(): JsonResponse
    {
        $teachers = User::where('role', 'teacher')
            ->orderBy('name')
            ->get(['id', 'name', 'email', 'phone', 'specialite', 'created_at']);

        return response()->json($teachers);
    }

    public function updateTeacher(Request $request, User $user): JsonResponse
    {
        if ($user->role !== 'teacher') {
            return response()->json(['message' => 'Utilisateur non trouvé.'], 404);
        }

        $validated = $request->validate([
            'name' => ['sometimes', 'required', 'string', 'max:255'],
            'email' => ['sometimes', 'required', 'string', 'email', 'max:255', 'unique:users,email,' . $user->id],
            'phone' => ['sometimes', 'nullable', 'string', 'max:255'],
            'specialite' => ['sometimes', 'nullable', 'string', 'max:255'],
        ]);

        $user->update($validated);

        return response()->json($user);
    }

    public function updateStudent(Request $request, User $user): JsonResponse
    {
        if ($user->role !== 'student') {
            return response()->json(['message' => 'Utilisateur non trouvé.'], 404);
        }

        $validated = $request->validate([
            'name' => ['sometimes', 'required', 'string', 'max:255'],
            'email' => ['sometimes', 'required', 'string', 'email', 'max:255', 'unique:users,email,' . $user->id],
            'formation_id' => ['sometimes', 'nullable', 'integer', 'exists:formations,id'],
            'phone' => ['sometimes', 'nullable', 'string', 'max:255'],
        ]);

        $user->update($validated);

        if ($user->role === 'student') {
            \App\Models\Student::updateOrCreate(
                ['user_id' => $user->id],
                ['formation_id' => $user->formation_id]
            );
        }

        return response()->json($user->load('formation:id,name'));
    }

    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'string', 'email', 'max:255', 'unique:users,email'],
            'role' => ['required', 'string', 'in:student,teacher,admin'],
            'formation_id' => ['nullable', 'integer', 'exists:formations,id'],
            'phone' => ['nullable', 'string', 'max:255'],
        ]);

        $tempPassword = Str::random(10);

        $user = DB::transaction(function () use ($validated, $tempPassword) {
            $user = User::create([
                'name' => $validated['name'],
                'email' => $validated['email'],
                'role' => $validated['role'],
                'formation_id' => $validated['formation_id'] ?? null,
                'phone' => $validated['phone'] ?? null,
                'password' => Hash::make($tempPassword),
                'must_change_password' => true,
            ]);

            if ($user->role === 'student') {
                \App\Models\Student::create([
                    'user_id' => $user->id,
                    'formation_id' => $user->formation_id,
                    'matricule' => 'GS-' . strtoupper(Str::random(6)),
                ]);
            }

            return $user;
        });

        // Avoid blocking the HTTP request on external SMTP calls (Render timeouts).
        $shouldSendEmail = filter_var(env('SEND_ACCOUNT_EMAIL', 'false'), FILTER_VALIDATE_BOOLEAN);
        $emailSent = false;
        if ($shouldSendEmail) {
            try {
                Mail::to($user->email)->send(new AccountCreated($user, $tempPassword));
                $emailSent = true;
            } catch (\Throwable $e) {
                Log::warning('AccountCreated email failed', [
                    'user_id' => $user->id,
                    'email' => $user->email,
                    'error' => $e->getMessage(),
                ]);
            }
        }

        return response()->json([
            'user' => $user->load('formation:id,name'),
            'temp_password' => $shouldSendEmail ? null : $tempPassword,
            'email_sent' => $emailSent,
        ], 201);
    }

    public function forgotPassword(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'email' => ['required', 'string', 'email', 'exists:users,email'],
        ]);

        $user = User::where('email', $validated['email'])->firstOrFail();

        $tempPassword = Str::random(10);

        $user->update([
            'password' => Hash::make($tempPassword),
            'must_change_password' => true,
        ]);

        $shouldSendEmail = filter_var(env('SEND_ACCOUNT_EMAIL', 'false'), FILTER_VALIDATE_BOOLEAN);
        if ($shouldSendEmail) {
            try {
                Mail::to($user->email)->send(new AccountCreated($user, $tempPassword));
            } catch (\Throwable $e) {
                Log::warning('Forgot password email failed', [
                    'user_id' => $user->id,
                    'email' => $user->email,
                    'error' => $e->getMessage(),
                ]);
            }
        }

        return response()->json([
            'message' => $shouldSendEmail
                ? 'Un mot de passe temporaire a été envoyé à votre adresse email.'
                : 'Mot de passe temporaire généré. Configurez SEND_ACCOUNT_EMAIL=true pour envoyer par email.',
        ]);
    }

    public function changePassword(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'email' => ['required', 'string', 'email', 'exists:users,email'],
            'current_password' => ['required', 'string'],
            'new_password' => ['required', 'string', 'min:8', 'confirmed'],
        ]);

        $user = User::where('email', $validated['email'])->firstOrFail();

        if (! Hash::check($validated['current_password'], $user->password)) {
            return response()->json([
                'message' => 'Le mot de passe actuel est incorrect.',
            ], 422);
        }

        $user->update([
            'password' => Hash::make($validated['new_password']),
            'must_change_password' => false,
        ]);

        return response()->json([
            'message' => 'Mot de passe mis à jour avec succès.',
        ]);
    }

    public function destroyStudent(User $user): JsonResponse
    {
        $user->delete();
        return response()->json([], 204);
    }

    public function destroyTeacher(User $user): JsonResponse
    {
        $user->delete();
        return response()->json([], 204);
    }
}
