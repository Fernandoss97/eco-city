<?php

namespace Tests\Feature\Api\V1;

use App\Models\Article;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class ArticleEndpointTest extends TestCase
{
    use RefreshDatabase;

    public function test_index_returns_only_published_articles(): void
    {
        Article::factory()->count(3)->create(['published_at' => now()->subDay()]);
        Article::factory()->create(['published_at' => null]);
        Article::factory()->create(['published_at' => now()->addDay()]);

        $this->getJson('/api/v1/articles')
            ->assertStatus(200)
            ->assertJsonCount(3, 'data')
            ->assertJsonStructure(['data' => [['id', 'slug', 'title', 'excerpt', 'published_at', 'tags']]]);
    }

    public function test_index_filters_by_tag(): void
    {
        Article::factory()->create(['published_at' => now(), 'tags' => ['reciclagem', 'dicas']]);
        Article::factory()->create(['published_at' => now(), 'tags' => ['compostagem']]);

        $this->getJson('/api/v1/articles?tag=reciclagem')
            ->assertStatus(200)
            ->assertJsonCount(1, 'data');
    }

    public function test_index_does_not_include_body_md(): void
    {
        Article::factory()->create(['published_at' => now()]);

        $response = $this->getJson('/api/v1/articles')->assertStatus(200);

        $this->assertArrayNotHasKey('body_md', $response->json('data.0'));
    }

    public function test_show_returns_article_with_body_md(): void
    {
        $article = Article::factory()->create([
            'published_at' => now()->subHour(),
            'slug' => 'meu-artigo',
        ]);

        $this->getJson('/api/v1/articles/meu-artigo')
            ->assertStatus(200)
            ->assertJsonPath('data.slug', 'meu-artigo')
            ->assertJsonPath('data.body_md', $article->body_md);
    }

    public function test_show_returns_404_for_draft(): void
    {
        Article::factory()->create(['published_at' => null, 'slug' => 'rascunho']);

        $this->getJson('/api/v1/articles/rascunho')->assertStatus(404);
    }

    public function test_show_returns_404_for_future_article(): void
    {
        Article::factory()->create(['published_at' => now()->addDay(), 'slug' => 'futuro']);

        $this->getJson('/api/v1/articles/futuro')->assertStatus(404);
    }
}
