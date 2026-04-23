<?php

namespace Database\Factories;

use App\Models\CollectionPoint;
use App\Models\Neighborhood;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<CollectionPoint>
 */
class CollectionPointFactory extends Factory
{
    /**
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'type' => fake()->randomElement(['reciclagem', 'especial']),
            'name' => fake()->company(),
            'address' => fake()->streetAddress(),
            'lat' => fake()->latitude(-23.20, -23.16),
            'lng' => fake()->longitude(-50.68, -50.62),
            'neighborhood_id' => Neighborhood::factory(),
            'hours' => ['mon' => '08:00-17:00', 'sat' => '08:00-12:00'],
            'accepted_materials' => fake()->randomElements(
                ['papel', 'plastico', 'vidro', 'metal', 'eletronico', 'pilha_bateria'],
                fake()->numberBetween(1, 4),
            ),
            'description' => fake()->sentence(),
        ];
    }
}
