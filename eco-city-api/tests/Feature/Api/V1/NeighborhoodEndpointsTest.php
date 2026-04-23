<?php

namespace Tests\Feature\Api\V1;

use App\Enums\WasteType;
use App\Models\CollectionSchedule;
use App\Models\Neighborhood;
use App\Models\NeighborhoodCepPrefix;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class NeighborhoodEndpointsTest extends TestCase
{
    use RefreshDatabase;

    public function test_index_returns_paginated_neighborhoods(): void
    {
        Neighborhood::factory()->count(3)->create();

        $response = $this->getJson('/api/v1/neighborhoods');

        $response->assertOk()
            ->assertJsonStructure([
                'data' => [
                    ['id', 'city', 'name'],
                ],
                'links',
                'meta',
            ])
            ->assertJsonCount(3, 'data');
    }

    public function test_index_respects_per_page_parameter(): void
    {
        Neighborhood::factory()->count(5)->create();

        $response = $this->getJson('/api/v1/neighborhoods?per_page=2');

        $response->assertOk()
            ->assertJsonCount(2, 'data')
            ->assertJsonPath('meta.per_page', 2);
    }

    public function test_show_returns_neighborhood_with_schedules(): void
    {
        $neighborhood = Neighborhood::factory()->create([
            'city' => 'Cornélio Procópio',
            'name' => 'Centro',
        ]);

        CollectionSchedule::factory()->create([
            'neighborhood_id' => $neighborhood->id,
            'waste_type' => WasteType::Reciclavel->value,
            'weekday' => 2,
            'start_time' => '07:00',
            'end_time' => '11:00',
        ]);

        NeighborhoodCepPrefix::factory()->create([
            'neighborhood_id' => $neighborhood->id,
            'prefix' => '86300',
        ]);

        $response = $this->getJson("/api/v1/neighborhoods/{$neighborhood->id}");

        $response->assertOk()
            ->assertJsonPath('data.id', $neighborhood->id)
            ->assertJsonPath('data.name', 'Centro')
            ->assertJsonCount(1, 'data.schedules')
            ->assertJsonPath('data.schedules.0.waste_type', 'reciclavel')
            ->assertJsonPath('data.schedules.0.start_time', '07:00')
            ->assertJsonPath('data.cep_prefixes.0', '86300');
    }

    public function test_resolve_returns_neighborhood_for_known_cep(): void
    {
        $neighborhood = Neighborhood::factory()->create([
            'city' => 'Cornélio Procópio',
            'name' => 'Centro',
        ]);

        NeighborhoodCepPrefix::factory()->create([
            'neighborhood_id' => $neighborhood->id,
            'prefix' => '86300',
        ]);

        $response = $this->getJson('/api/v1/neighborhoods/resolve?cep=86300123');

        $response->assertOk()
            ->assertJsonPath('data.name', 'Centro')
            ->assertJsonPath('data.matched_prefix', '86300');
    }

    public function test_resolve_picks_longest_matching_prefix(): void
    {
        $generic = Neighborhood::factory()->create(['name' => 'Genérico']);
        $specific = Neighborhood::factory()->create(['name' => 'Específico']);

        NeighborhoodCepPrefix::factory()->create([
            'neighborhood_id' => $generic->id,
            'prefix' => '86300',
        ]);
        NeighborhoodCepPrefix::factory()->create([
            'neighborhood_id' => $specific->id,
            'prefix' => '8630012',
        ]);

        $response = $this->getJson('/api/v1/neighborhoods/resolve?cep=86300123');

        $response->assertOk()
            ->assertJsonPath('data.name', 'Específico')
            ->assertJsonPath('data.matched_prefix', '8630012');
    }

    public function test_resolve_returns_404_when_cep_outside_coverage(): void
    {
        $response = $this->getJson('/api/v1/neighborhoods/resolve?cep=01000000');

        $response->assertNotFound();
    }

    public function test_resolve_validates_cep_format(): void
    {
        $response = $this->getJson('/api/v1/neighborhoods/resolve?cep=abc');

        $response->assertStatus(422)
            ->assertJsonValidationErrorFor('cep');
    }

    public function test_schedule_by_neighborhood_groups_results(): void
    {
        $neighborhood = Neighborhood::factory()->create();

        CollectionSchedule::factory()->create([
            'neighborhood_id' => $neighborhood->id,
            'waste_type' => WasteType::Reciclavel->value,
            'weekday' => 2,
            'start_time' => '07:00',
            'end_time' => '11:00',
        ]);
        CollectionSchedule::factory()->create([
            'neighborhood_id' => $neighborhood->id,
            'waste_type' => WasteType::Organico->value,
            'weekday' => 5,
            'start_time' => '08:00',
            'end_time' => '12:00',
        ]);

        $response = $this->getJson("/api/v1/neighborhoods/{$neighborhood->id}/schedule");

        $response->assertOk()
            ->assertJsonPath('data.neighborhood.id', $neighborhood->id)
            ->assertJsonCount(2, 'data.schedule');
    }
}
