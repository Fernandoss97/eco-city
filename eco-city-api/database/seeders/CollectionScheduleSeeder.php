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
        // Distribuição padrão por bairro:
        //   - Recicláveis: 1 dia/semana
        //   - Rejeito (não-recicláveis): 2 dias/semana
        //   - Orgânico: 1 dia/semana
        $plan = [
            'Centro' => [
                [WasteType::Reciclavel, 2, '07:00', '11:00'],
                [WasteType::Rejeito, 1, '18:00', '22:00'],
                [WasteType::Rejeito, 4, '18:00', '22:00'],
                [WasteType::Organico, 6, '08:00', '12:00'],
            ],
            'Jardim Panorama' => [
                [WasteType::Reciclavel, 3, '07:00', '11:00'],
                [WasteType::Rejeito, 2, '18:00', '22:00'],
                [WasteType::Rejeito, 5, '18:00', '22:00'],
                [WasteType::Organico, 6, '08:00', '12:00'],
            ],
            'Jardim Itamaraty' => [
                [WasteType::Reciclavel, 4, '07:00', '11:00'],
                [WasteType::Rejeito, 1, '18:00', '22:00'],
                [WasteType::Rejeito, 4, '18:00', '22:00'],
                [WasteType::Organico, 6, '08:00', '12:00'],
            ],
            'Vila Nova' => [
                [WasteType::Reciclavel, 2, '07:00', '11:00'],
                [WasteType::Rejeito, 3, '18:00', '22:00'],
                [WasteType::Rejeito, 5, '18:00', '22:00'],
                [WasteType::Organico, 6, '08:00', '12:00'],
            ],
            'Jardim Brasília' => [
                [WasteType::Reciclavel, 5, '07:00', '11:00'],
                [WasteType::Rejeito, 2, '18:00', '22:00'],
                [WasteType::Rejeito, 4, '18:00', '22:00'],
                [WasteType::Organico, 6, '08:00', '12:00'],
            ],
            'Vila Rica' => [
                [WasteType::Reciclavel, 3, '07:00', '11:00'],
                [WasteType::Rejeito, 1, '18:00', '22:00'],
                [WasteType::Rejeito, 5, '18:00', '22:00'],
                [WasteType::Organico, 6, '08:00', '12:00'],
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
