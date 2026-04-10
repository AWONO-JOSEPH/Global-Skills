<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class ProfileController extends Controller
{
    private function toAbsoluteAssetUrl(?string $value): ?string
    {
        if (!$value) {
            return null;
        }
        if (Str::startsWith($value, ['http://', 'https://'])) {
            return $value;
        }
        return url($value);
    }

    private function normalizeAvatarInput(?string $value): ?string
    {
        if (!$value) {
            return null;
        }
        // Only accept local storage paths. This prevents storing absolute URLs that later get double-prefixed.
        if (Str::startsWith($value, ['http://', 'https://'])) {
            $parts = parse_url($value);
            $path = $parts['path'] ?? null;
            return $path && Str::startsWith($path, '/storage/') ? $path : null;
        }
        if (Str::startsWith($value, '/storage/')) {
            return $value;
        }
        if (Str::startsWith($value, 'storage/')) {
            return '/' . $value;
        }
        return null;
    }

    public function show(Request $request): JsonResponse
    {
        /** @var \App\Models\User $user */
        $user = $request->user();

        $user->avatar_url = $this->toAbsoluteAssetUrl($user->avatar_url);

        return response()->json($user);
    }

    public function update(Request $request): JsonResponse
    {
        /** @var \App\Models\User $user */
        $user = $request->user();

        $validated = $request->validate([
            'first_name' => ['nullable', 'string', 'max:255'],
            'last_name' => ['nullable', 'string', 'max:255'],
            'email' => ['sometimes', 'required', 'string', 'email', 'max:255', 'unique:users,email,' . $user->id],
            'phone' => ['nullable', 'string', 'max:255'],
            'avatar_url' => ['nullable', 'string'],
        ]);

        $user->fill([
            'first_name' => $validated['first_name'] ?? $user->first_name,
            'last_name' => $validated['last_name'] ?? $user->last_name,
            'email' => $validated['email'] ?? $user->email,
            'phone' => $validated['phone'] ?? $user->phone,
            'avatar_url' => array_key_exists('avatar_url', $validated)
                ? $this->normalizeAvatarInput($validated['avatar_url'])
                : $user->avatar_url,
            'name' => trim(($validated['first_name'] ?? $user->first_name) . ' ' . ($validated['last_name'] ?? $user->last_name)) ?: $user->name,
        ])->save();

        $user->avatar_url = $this->toAbsoluteAssetUrl($user->avatar_url);

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
                // Extraire le chemin relatif pour la suppression
                // L'URL peut être /storage/avatars/xxx.jpg ou http://domain/storage/avatars/xxx.jpg
                $pathToDelete = $user->avatar_url;
                if (str_contains($pathToDelete, '/storage/')) {
                    $parts = explode('/storage/', $pathToDelete);
                    $pathToDelete = end($parts);
                }
                Storage::disk('public')->delete($pathToDelete);
            }

            $path = $request->file('photo')->store('avatars', 'public');
            // Storage::url($path) retourne /storage/avatars/xxx.jpg ou l'URL complète selon la config
            $user->avatar_url = Storage::url($path);
            $user->save();

            // S'assurer de retourner une URL absolue
            $photoUrl = $this->toAbsoluteAssetUrl($user->avatar_url);

            return response()->json([
                'message' => 'Photo mise à jour',
                'photo' => $photoUrl
            ]);
        }

        return response()->json(['message' => 'Aucun fichier'], 400);
    }
}
