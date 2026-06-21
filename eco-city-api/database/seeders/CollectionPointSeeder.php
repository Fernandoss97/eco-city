<?php

namespace Database\Seeders;

use App\Models\CollectionPoint;
use App\Models\Neighborhood;
use Illuminate\Database\Seeder;

class CollectionPointSeeder extends Seeder
{
    public function run(): void
    {
        $byName = Neighborhood::query()
            ->where('city', 'Cornélio Procópio')
            ->get()
            ->keyBy('name');

        $points = [
            [
                'name' => 'Ecoponto Central',
                'type' => 'reciclagem',
                'address' => 'Rua Paranaguá, 245 — Centro',
                'lat' => -23.1810,
                'lng' => -50.6478,
                'neighborhood' => 'Centro',
                'hours' => ['mon-fri' => '08:00-18:00', 'sat' => '08:00-12:00'],
                'accepted_materials' => ['papel', 'plastico', 'vidro', 'metal'],
                'description' => 'Ponto principal do município para descarte de recicláveis comuns.',
            ],
            [
                'name' => 'Posto de Coleta — Panorama',
                'type' => 'reciclagem',
                'address' => 'Av. Brasil, 1820 — Panorama',
                'lat' => -23.1740,
                'lng' => -50.6540,
                'neighborhood' => 'Panorama',
                'hours' => ['mon-fri' => '09:00-17:00'],
                'accepted_materials' => ['papel', 'plastico', 'metal'],
                'description' => 'Coleta de plásticos, papel e metais.',
            ],
            [
                'name' => 'Coleta de Eletrônicos — Bela Vista',
                'type' => 'especial',
                'address' => 'Rua das Acácias, 410 — Bela Vista',
                'lat' => -23.1865,
                'lng' => -50.6385,
                'neighborhood' => 'Bela Vista',
                'hours' => ['tue' => '13:00-17:00', 'thu' => '13:00-17:00'],
                'accepted_materials' => ['eletronico', 'pilha_bateria'],
                'description' => 'Recebe eletrônicos pequenos, pilhas e baterias.',
            ],
            [
                'name' => 'Vidro & Metal — Jardim Europa',
                'type' => 'reciclagem',
                'address' => 'Rua Tiradentes, 980 — Jardim Europa',
                'lat' => -23.1895,
                'lng' => -50.6620,
                'neighborhood' => 'Jardim Europa',
                'hours' => ['mon-sat' => '08:00-17:00'],
                'accepted_materials' => ['vidro', 'metal'],
                'description' => 'Especializado em vidros e metais.',
            ],
            [
                'name' => 'Coleta Solidária — Progresso',
                'type' => 'reciclagem',
                'address' => 'Rua Castro Alves, 75 — Progresso',
                'lat' => -23.1782,
                'lng' => -50.6710,
                'neighborhood' => 'Progresso',
                'hours' => ['mon-fri' => '08:00-16:00'],
                'accepted_materials' => ['papel', 'plastico'],
                'description' => 'Cooperativa local de catadores.',
            ],
            [
                'name' => 'Resíduos Especiais — Morumbi',
                'type' => 'especial',
                'address' => 'Av. das Palmeiras, 1240 — Morumbi',
                'lat' => -23.1928,
                'lng' => -50.6450,
                'neighborhood' => 'Morumbi',
                'hours' => ['wed' => '09:00-15:00', 'sat' => '09:00-12:00'],
                'accepted_materials' => ['eletronico', 'pilha_bateria'],
                'description' => 'Descarte mensal de resíduos especiais.',
            ],
        ];

        foreach ($points as $data) {
            $neighborhoodName = $data['neighborhood'];
            unset($data['neighborhood']);

            CollectionPoint::firstOrCreate(
                ['name' => $data['name']],
                [
                    ...$data,
                    'neighborhood_id' => $byName->get($neighborhoodName)?->id,
                ],
            );
        }
    }
}
