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
    public function login(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'email'    => ['required', 'string', 'email'],
            'password' => ['required', 'string', 'min:4'],
            'role'     => ['required', 'string', Rule::in(['student', 'teacher', 'admin'])],
        ]);

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

        /** @var \App\Models\User $authed */
        $authed = Auth::user();

        // Supprimer les anciens tokens et créer un nouveau
        $authed->tokens()->delete();
        $token = $authed->createToken('auth_token')->plainTextToken;

        return response()->json([
            'message' => 'Login successful',
            'token'   => $token,   // ← on retourne le token
            'user'    => [
                'name'                => $authed->name,
                'email'               => $authed->email,
                'role'                => $authed->role,
                'must_change_password'=> $authed->must_change_password,
            ],
        ]);
    }

    public function me(Request $request): JsonResponse
    {
        $user = $request->user();
        if (!$user) {
            return response()->json(['message' => 'Unauthenticated.'], 401);
        }

        return response()->json([
            'user' => [
                'name'                => $user->name,
                'email'               => $user->email,
                'role'                => $user->role,
                'must_change_password'=> $user->must_change_password,
            ],
        ]);
    }

    public function logout(Request $request): JsonResponse
    {
        // Révoquer le token actuel
        $request->user()->currentAccessToken()->delete();

        return response()->json(['message' => 'Logged out']);
    }
}