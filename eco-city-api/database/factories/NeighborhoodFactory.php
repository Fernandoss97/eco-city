<?php

namespace Database\Factories;

use App\Models\Neighborhood;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Neighborhood>
 */
class NeighborhoodFactory extends Factory
{
    /**
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'city' => 'Cornélio Procópio',
            'name' => fake()->unique()->streetName(),
        ];
    }
}
