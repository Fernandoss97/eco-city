<?php

namespace Database\Factories;

use App\Models\Neighborhood;
use App\Models\NeighborhoodCepPrefix;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<NeighborhoodCepPrefix>
 */
class NeighborhoodCepPrefixFactory extends Factory
{
    /**
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'neighborhood_id' => Neighborhood::factory(),
            'prefix' => '863'.fake()->unique()->numerify('##'),
        ];
    }
}
