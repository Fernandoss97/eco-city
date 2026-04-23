<?php

namespace Database\Seeders;

use App\Models\Neighborhood;
use App\Models\NeighborhoodCepPrefix;
use Illuminate\Database\Seeder;

class NeighborhoodCepPrefixSeeder extends Seeder
{
    public function run(): void
    {
        $map = [
            'Centro' => ['86300', '86301'],
            'Jardim Panorama' => ['86302'],
            'Jardim Itamaraty' => ['86303'],
            'Vila Nova' => ['86304'],
            'Jardim Brasília' => ['86305'],
            'Vila Rica' => ['86306'],
        ];

        foreach ($map as $name => $prefixes) {
            $neighborhood = Neighborhood::query()
                ->where('city', 'Cornélio Procópio')
                ->where('name', $name)
                ->first();

            if ($neighborhood === null) {
                continue;
            }

            foreach ($prefixes as $prefix) {
                NeighborhoodCepPrefix::firstOrCreate([
                    'neighborhood_id' => $neighborhood->id,
                    'prefix' => $prefix,
                ]);
            }
        }
    }
}
