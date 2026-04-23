<?php

namespace Tests\Feature\Api\V1;

use App\Models\Neighborhood;
use App\Models\NeighborhoodCepPrefix;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Http;
use Tests\TestCase;

class CepEndpointTest extends TestCase
{
    use RefreshDatabase;

    public function test_cep_returns_viacep_payload_and_resolves_neighborhood(): void
    {
        $neighborhood = Neighborhood::factory()->create([
            'city' => 'Cornélio Procópio',
            'name' => 'Centro',
        ]);
        NeighborhoodCepPrefix::factory()->create([
            'neighborhood_id' => $neighborhood->id,
            'prefix' => '86300',
        ]);

        Http::fake([
            'viacep.com.br/*' => Http::response([
                'cep' => '86300-000',
                'logradouro' => 'Rua das Flores',
                'bairro' => 'Centro',
                'localidade' => 'Cornélio Procópio',
                'uf' => 'PR',
            ], 200),
        ]);

        $response = $this->getJson('/api/v1/cep/86300000');

        $response->assertOk()
            ->assertJsonPath('data.cep', '86300000')
            ->assertJsonPath('data.logradouro', 'Rua das Flores')
            ->assertJsonPath('data.neighborhood.name', 'Centro')
            ->assertJsonPath('data.neighborhood.matched_prefix', '86300');
    }

    public function test_cep_caches_response(): void
    {
        Http::fake([
            'viacep.com.br/*' => Http::response([
                'cep' => '86300-000',
                'logradouro' => 'Rua A',
                'bairro' => 'Centro',
                'localidade' => 'Cornélio Procópio',
                'uf' => 'PR',
            ], 200),
        ]);

        $this->getJson('/api/v1/cep/86300000')->assertOk();
        $this->getJson('/api/v1/cep/86300000')->assertOk();

        Http::assertSentCount(1);
        $this->assertNotNull(Cache::get('cep:86300000'));
    }

    public function test_cep_returns_404_for_unknown_cep(): void
    {
        Http::fake([
            'viacep.com.br/*' => Http::response(['erro' => true], 200),
        ]);

        $response = $this->getJson('/api/v1/cep/00000000');

        $response->assertNotFound();
    }

    public function test_cep_route_rejects_invalid_format(): void
    {
        $response = $this->getJson('/api/v1/cep/abc');

        // Route constraint `\d{8}` makes it a 404, not 422.
        $response->assertNotFound();
    }
}
