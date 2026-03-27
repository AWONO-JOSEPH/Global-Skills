<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Validation\Rule;

class AuthController extends Controller
{
    public function csrfCookie(): JsonResponse
    {
        // This endpoint exists for frontend debugging / convenience.
        // Sanctum's own route is /sanctum/csrf-cookie.
        return response()->json(['ok' => true]);
    }

    public function login(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'email' => ['required', 'string', 'email'],
            'password' => ['required', 'string', 'min:4'],
            'role' => ['required', 'string', Rule::in(['student', 'teacher', 'admin'])],
        ]);

        /** @var \App\Models\User|null $user */
        $user = User::where('email', $validated['email'])->first();
        if (!$user) {
            return response()->json(['message' => 'Identifiants incorrects.'], 422);
        }

        if ($user->role !== $validated['role']) {
            return response()->json(['message' => "Ce compte n'est pas autorisé pour ce type d'accès."], 403);
        }

        if (!Auth::attempt(['email' => $validated['email'], 'password' => $validated['password']])) {
            return response()->json(['message' => 'Identifiants incorrects.'], 422);
        }

        $request->session()->regenerate();

        /** @var \App\Models\User $authed */
        $authed = $request->user();

        return response()->json([
            'message' => 'Login successful',
            'user' => [
                'name' => $authed->name,
                'email' => $authed->email,
                'role' => $authed->role,
                'must_change_password' => $authed->must_change_password,
            ],
        ]);
    }

    public function me(Request $request): JsonResponse
    {
        /** @var \App\Models\User|null $user */
        $user = $request->user();
        if (!$user) {
            return response()->json(['message' => 'Unauthenticated.'], 401);
        }

        return response()->json([
            'user' => [
                'name' => $user->name,
                'email' => $user->email,
                'role' => $user->role,
                'must_change_password' => $user->must_change_password,
            ],
        ]);
    }

    public function logout(Request $request): JsonResponse
    {
        Auth::guard('web')->logout();

        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return response()->json(['message' => 'Logged out']);
    }
}

