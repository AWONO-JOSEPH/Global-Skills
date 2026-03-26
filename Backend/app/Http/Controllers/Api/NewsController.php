<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\News;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

use Illuminate\Support\Facades\Storage;

class NewsController extends Controller
{
    public function index(): JsonResponse
    {
        $items = News::orderByDesc('published_at')->orderByDesc('created_at')->get();

        $items = $items->map(function ($item) {
            if ($item->image) {
                $item->image = url(Storage::url($item->image));
            }
            if ($item->video) {
                $item->video = url(Storage::url($item->video));
            }
            return $item;
        });

        return response()->json($items);
    }

    public function show(News $news): JsonResponse
    {
        if ($news->image) {
            $news->image = url(Storage::url($news->image));
        }
        if ($news->video) {
            $news->video = url(Storage::url($news->video));
        }
        return response()->json($news);
    }

    public function store(Request $request): JsonResponse
    {
        $data = $request->validate([
            'title' => ['required', 'string', 'max:255'],
            'description' => ['required', 'string'],
            'category' => ['required', 'string', 'max:100'],
            'image' => ['nullable', 'image', 'mimes:jpeg,png,jpg,gif', 'max:10240'],
            'video' => ['nullable', 'file', 'mimes:mp4,mov,avi,wmv', 'max:32768'],
        ]);

        if ($request->hasFile('image')) {
            $data['image'] = $request->file('image')->store('news/images', 'public');
        }

        if ($request->hasFile('video')) {
            $data['video'] = $request->file('video')->store('news/videos', 'public');
        }

        $news = News::create([
            ...$data,
            'published_at' => now(),
        ]);

        if ($news->image) {
            $news->image = url(Storage::url($news->image));
        }
        if ($news->video) {
            $news->video = url(Storage::url($news->video));
        }

        return response()->json($news, 201);
    }

    public function update(Request $request, News $news): JsonResponse
    {
        $data = $request->validate([
            'title' => ['required', 'string', 'max:255'],
            'description' => ['required', 'string'],
            'category' => ['required', 'string', 'max:100'],
            'image' => ['nullable', 'image', 'mimes:jpeg,png,jpg,gif', 'max:10240'],
            'video' => ['nullable', 'file', 'mimes:mp4,mov,avi,wmv', 'max:32768'],
        ]);

        if ($request->hasFile('image')) {
            if ($news->image) {
                Storage::disk('public')->delete($news->image);
            }
            $data['image'] = $request->file('image')->store('news/images', 'public');
        }

        if ($request->hasFile('video')) {
            if ($news->video) {
                Storage::disk('public')->delete($news->video);
            }
            $data['video'] = $request->file('video')->store('news/videos', 'public');
        }

        $news->update($data);

        if ($news->image) {
            $news->image = url(Storage::url($news->image));
        }
        if ($news->video) {
            $news->video = url(Storage::url($news->video));
        }

        return response()->json($news);
    }

    public function destroy(News $news): JsonResponse
    {
        $news->delete();

        return response()->json(['message' => 'Deleted'], 204);
    }
}

