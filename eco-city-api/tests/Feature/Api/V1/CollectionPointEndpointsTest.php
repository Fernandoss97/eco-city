<?php

namespace Tests\Feature\Api\V1;

use App\Models\CollectionPoint;
use App\Models\Neighborhood;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class CollectionPointEndpointsTest extends TestCase
{
    use RefreshDatabase;

    public function test_index_returns_paginated_points(): void
    {
        CollectionPoint::factory()->count(3)->create();

        $response = $this->getJson('/api/v1/collection-points');

        $response->assertOk()
            ->assertJsonStructure([
                'data' => [
                    ['id', 'type', 'name', 'address', 'lat', 'lng', 'accepted_materials', 'neighborhood' => ['id', 'name', 'city']],
                ],
                'links',
                'meta',
            ])
            ->assertJsonCount(3, 'data');
    }

    public function test_index_filters_by_type(): void
    {
        CollectionPoint::factory()->create(['type' => 'reciclagem', 'name' => 'Recicláveis A']);
        CollectionPoint::factory()->create(['type' => 'especial', 'name' => 'Especiais B']);

        $response = $this->getJson('/api/v1/collection-points?type=especial');

        $response->assertOk()
            ->assertJsonCount(1, 'data')
            ->assertJsonPath('data.0.name', 'Especiais B');
    }

    public function test_index_filters_by_neighborhood(): void
    {
        $a = Neighborhood::factory()->create();
        $b = Neighborhood::factory()->create();
        CollectionPoint::factory()->create(['neighborhood_id' => $a->id, 'name' => 'No bairro A']);
        CollectionPoint::factory()->create(['neighborhood_id' => $b->id, 'name' => 'No bairro B']);

        $response = $this->getJson("/api/v1/collection-points?neighborhood_id={$b->id}");

        $response->assertOk()
            ->assertJsonCount(1, 'data')
            ->assertJsonPath('data.0.name', 'No bairro B');
    }

    public function test_index_filters_by_materials_intersection(): void
    {
        CollectionPoint::factory()->create([
            'name' => 'Aceita papel',
            'accepted_materials' => ['papel', 'metal'],
        ]);
        CollectionPoint::factory()->create([
            'name' => 'Só vidro',
            'accepted_materials' => ['vidro'],
        ]);

        $response = $this->getJson('/api/v1/collection-points?materials=papel,plastico');

        $response->assertOk()
            ->assertJsonCount(1, 'data')
            ->assertJsonPath('data.0.name', 'Aceita papel');
    }

    public function test_index_validates_type_enum(): void
    {
        $this->getJson('/api/v1/collection-points?type=invalido')
            ->assertStatus(422);
    }
}
