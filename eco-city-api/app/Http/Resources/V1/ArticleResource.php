<?php

namespace App\Http\Resources\V1;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Support\Str;

class ArticleResource extends JsonResource
{
    /** @return array<string, mixed> */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'slug' => $this->slug,
            'title' => $this->title,
            'excerpt' => Str::limit(strip_tags($this->body_md), 160),
            'body_md' => $this->when(
                $request->routeIs('articles.show'),
                $this->body_md,
            ),
            'cover_path' => $this->cover_path,
            'published_at' => $this->published_at?->toIso8601String(),
            'tags' => $this->tags ?? [],
        ];
    }
}
