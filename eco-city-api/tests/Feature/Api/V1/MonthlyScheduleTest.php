<?php

namespace Tests\Feature\Api\V1;

use App\Enums\WasteType;
use App\Models\CollectionSchedule;
use App\Models\Neighborhood;
use App\Models\NeighborhoodCepPrefix;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class MonthlyScheduleTest extends TestCase
{
    use RefreshDatabase;

    public function test_monthly_schedule_returns_expanded_days_for_known_cep(): void
    {
        $neighborhood = Neighborhood::factory()->create([
            'city' => 'Cornélio Procópio',
            'name' => 'Centro',
        ]);
        NeighborhoodCepPrefix::factory()->create([
            'neighborhood_id' => $neighborhood->id,
            'prefix' => '86300',
        ]);

        // Recicláveis às terças-feiras (weekday=2)
        CollectionSchedule::factory()->create([
            'neighborhood_id' => $neighborhood->id,
            'waste_type' => WasteType::Reciclavel->value,
            'weekday' => 2,
            'start_time' => '07:00',
            'end_time' => '11:00',
        ]);

        $response = $this->getJson('/api/v1/schedule?cep=86300000&month=2026-05');

        $response->assertOk()
            ->assertJsonPath('data.neighborhood.name', 'Centro')
            ->assertJsonPath('data.month', '2026-05')
            ->assertJsonPath('data.neighborhood.matched_prefix', '86300');

        $days = $response->json('data.days');
        $this->assertCount(31, $days, 'maio deve ter 31 dias');

        // 2026-05-05 é uma terça-feira → deve ter 1 coleta de recicláveis.
        $tuesday = collect($days)->firstWhere('date', '2026-05-05');
        $this->assertNotNull($tuesday);
        $this->assertCount(1, $tuesday['collections']);
        $this->assertSame('reciclavel', $tuesday['collections'][0]['waste_type']);
        $this->assertSame('07:00', $tuesday['collections'][0]['start_time']);

        // 2026-05-04 é segunda-feira → não há coleta.
        $monday = collect($days)->firstWhere('date', '2026-05-04');
        $this->assertSame([], $monday['collections']);
    }

    public function test_monthly_schedule_returns_404_for_cep_outside_coverage(): void
    {
        $response = $this->getJson('/api/v1/schedule?cep=01000000&month=2026-05');

        $response->assertNotFound();
    }

    public function test_monthly_schedule_validates_cep_and_month(): void
    {
        $response = $this->getJson('/api/v1/schedule?cep=abc&month=2026/05');

        $response->assertStatus(422)
            ->assertJsonValidationErrors(['cep', 'month']);
    }
}
