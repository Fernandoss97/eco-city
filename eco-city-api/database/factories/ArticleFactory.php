<?php

namespace Database\Factories;

use App\Models\Article;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

/**
 * @extends Factory<Article>
 */
class ArticleFactory extends Factory
{
    /**
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $title = fake()->sentence(6);

        return [
            'slug' => Str::slug($title).'-'.Str::random(6),
            'title' => $title,
            'body_md' => fake()->paragraphs(4, true),
            'cover_path' => null,
            'published_at' => now(),
            'tags' => fake()->randomElements(['reciclagem', 'compostagem', 'eletronico'], 2),
        ];
    }
}
