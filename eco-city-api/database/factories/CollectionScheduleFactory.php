<?php

namespace Database\Factories;

use App\Enums\WasteType;
use App\Models\CollectionSchedule;
use App\Models\Neighborhood;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<CollectionSchedule>
 */
class CollectionScheduleFactory extends Factory
{
    /**
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'neighborhood_id' => Neighborhood::factory(),
            'waste_type' => fake()->randomElement(WasteType::cases())->value,
            'weekday' => fake()->numberBetween(0, 6),
            'start_time' => '08:00:00',
            'end_time' => '12:00:00',
        ];
    }
}
