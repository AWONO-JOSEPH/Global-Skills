<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;

class ProfileController extends Controller
{
    public function show(Request $request): JsonResponse
    {
        /** @var \App\Models\User $user */
        $user = $request->user();

        if ($user->avatar_url) {
            $user->avatar_url = url($user->avatar_url);
        }

        return response()->json($user);
    }

    public function update(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'first_name' => ['nullable', 'string', 'max:255'],
            'last_name' => ['nullable', 'string', 'max:255'],
            'phone' => ['nullable', 'string', 'max:255'],
            'avatar_url' => ['nullable', 'string'],
        ]);

        /** @var \App\Models\User $user */
        $user = $request->user();

        $user->fill([
            'first_name' => $validated['first_name'] ?? $user->first_name,
            'last_name' => $validated['last_name'] ?? $user->last_name,
            'phone' => $validated['phone'] ?? $user->phone,
            'avatar_url' => $validated['avatar_url'] ?? $user->avatar_url,
        ])->save();

        if ($user->avatar_url) {
            $user->avatar_url = url($user->avatar_url);
        }

        return response()->json($user);
    }

    public function uploadPhoto(Request $request): JsonResponse
    {
        /** @var \App\Models\User $user */
        $user = Auth::user();

        $request->validate([
            'photo' => 'required|image|mimes:jpeg,png,jpg,gif|max:2048',
        ]);

        if ($request->hasFile('photo')) {
            if ($user->avatar_url) {
                // Nettoyer l'URL pour obtenir le chemin relatif au disque 'public'
                $oldPath = str_replace('/storage/', '', $user->avatar_url);
                Storage::disk('public')->delete($oldPath);
            }

            $path = $request->file('photo')->store('avatars', 'public');
            $user->avatar_url = Storage::url($path);
            $user->save();

            return response()->json([
            'message' => 'Photo mise à jour',
            'photo' => $user->avatar_url ? url($user->avatar_url) : null
        ]);
        }

        return response()->json(['message' => 'Aucun fichier'], 400);
    }
}
