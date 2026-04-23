<?php

namespace Database\Factories;

use App\Models\Address;
use App\Models\Neighborhood;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Address>
 */
class AddressFactory extends Factory
{
    /**
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'user_id' => User::factory(),
            'cep' => fake()->numerify('863#####'),
            'street' => fake()->streetName(),
            'number' => (string) fake()->buildingNumber(),
            'neighborhood_id' => Neighborhood::factory(),
            'lat' => fake()->latitude(-23.20, -23.16),
            'lng' => fake()->longitude(-50.68, -50.62),
            'label' => 'Casa',
            'is_primary' => true,
        ];
    }
}
