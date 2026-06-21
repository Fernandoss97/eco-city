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
            'Panorama',
            'Bela Vista',
            'Jardim Europa',
            'Progresso',
            'Morumbi',
        ];

        foreach ($names as $name) {
            Neighborhood::firstOrCreate(
                ['city' => $city, 'name' => $name],
            );
        }
    }
}
