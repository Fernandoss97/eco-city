<?php

namespace Database\Seeders;

use App\Enums\WasteType;
use App\Models\CollectionSchedule;
use App\Models\Neighborhood;
use Illuminate\Database\Seeder;

class CollectionScheduleSeeder extends Seeder
{
    public function run(): void
    {
        // A coleta SELETIVA de cada bairro já é criada pela migration de reseed
        // (reseed_neighborhoods_from_sanepar). Este seeder enriquece a agenda com
        // os outros dois tipos da taxonomia atual — convencional e especial —
        // sem colidir com a seletiva existente.
        //
        // Formato: [WasteType, weekday (0=Dom .. 6=Sáb), start, end]
        $plan = [
            'Centro' => [
                [WasteType::Convencional, 1, '18:00', '22:00'],
                [WasteType::Convencional, 3, '18:00', '22:00'],
                [WasteType::Convencional, 5, '18:00', '22:00'],
                [WasteType::Especial, 6, '08:00', '12:00'],
            ],
            'Panorama' => [
                [WasteType::Convencional, 1, '18:00', '22:00'],
                [WasteType::Convencional, 4, '18:00', '22:00'],
                [WasteType::Especial, 6, '08:00', '12:00'],
            ],
            'Bela Vista' => [
                [WasteType::Convencional, 2, '18:00', '22:00'],
                [WasteType::Convencional, 5, '18:00', '22:00'],
                [WasteType::Especial, 6, '08:00', '12:00'],
            ],
            'Jardim Europa' => [
                [WasteType::Convencional, 1, '18:00', '22:00'],
                [WasteType::Convencional, 4, '18:00', '22:00'],
            ],
            'Progresso' => [
                [WasteType::Convencional, 2, '18:00', '22:00'],
                [WasteType::Convencional, 5, '18:00', '22:00'],
                [WasteType::Especial, 3, '13:00', '17:00'],
            ],
            'Morumbi' => [
                [WasteType::Convencional, 3, '18:00', '22:00'],
                [WasteType::Convencional, 6, '08:00', '12:00'],
            ],
            'Jardim Pioneiros' => [
                [WasteType::Convencional, 1, '18:00', '22:00'],
                [WasteType::Convencional, 4, '18:00', '22:00'],
                [WasteType::Especial, 6, '08:00', '12:00'],
            ],
            'Independência' => [
                [WasteType::Convencional, 2, '18:00', '22:00'],
                [WasteType::Convencional, 5, '18:00', '22:00'],
            ],
            'Jardim Alvorada' => [
                [WasteType::Convencional, 1, '18:00', '22:00'],
                [WasteType::Convencional, 4, '18:00', '22:00'],
                [WasteType::Especial, 3, '13:00', '17:00'],
            ],
            'Vila São Pedro' => [
                [WasteType::Convencional, 2, '18:00', '22:00'],
                [WasteType::Convencional, 5, '18:00', '22:00'],
            ],
            'Nova Esperança' => [
                [WasteType::Convencional, 3, '18:00', '22:00'],
                [WasteType::Convencional, 6, '08:00', '12:00'],
                [WasteType::Especial, 1, '13:00', '17:00'],
            ],
            'Jardim Primavera' => [
                [WasteType::Convencional, 2, '18:00', '22:00'],
                [WasteType::Convencional, 5, '18:00', '22:00'],
                [WasteType::Especial, 6, '08:00', '12:00'],
            ],
        ];

        foreach ($plan as $name => $entries) {
            $neighborhood = Neighborhood::query()
                ->where('city', 'Cornélio Procópio')
                ->where('name', $name)
                ->first();

            if ($neighborhood === null) {
                continue;
            }

            foreach ($entries as [$type, $weekday, $start, $end]) {
                CollectionSchedule::firstOrCreate([
                    'neighborhood_id' => $neighborhood->id,
                    'waste_type' => $type->value,
                    'weekday' => $weekday,
                ], [
                    'start_time' => $start,
                    'end_time' => $end,
                ]);
            }
        }
    }
}
