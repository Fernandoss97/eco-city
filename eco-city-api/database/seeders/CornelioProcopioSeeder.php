<?php

namespace Database\Seeders;

use App\Models\Neighborhood;
use Illuminate\Database\Seeder;

class CornelioProcopioSeeder extends Seeder
{
    public function run(): void
    {
        $city = 'Cornélio Procópio';

        $names = [
            'Centro',
            'Jardim Panorama',
            'Jardim Itamaraty',
            'Vila Nova',
            'Jardim Brasília',
            'Vila Rica',
        ];

        foreach ($names as $name) {
            Neighborhood::firstOrCreate(
                ['city' => $city, 'name' => $name],
            );
        }
    }
}
