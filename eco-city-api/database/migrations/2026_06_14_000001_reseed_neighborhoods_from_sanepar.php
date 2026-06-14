<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        // Clear dependent tables first
        DB::table('collection_schedules')->delete();
        DB::table('neighborhood_cep_prefixes')->delete();
        DB::table('neighborhoods')->delete();

        // Reset sequence so IDs start clean
        DB::statement("SELECT setval('neighborhoods_id_seq', 1, false)");

        $city = 'Cornélio Procópio';

        $sectors = [
            // [name, weekday]  — all seletiva, 07:30–16:30
            ['Panorama',        1],
            ['Bela Vista',      1],
            ['Jardim Europa',   2],
            ['Progresso',       2],
            ['Centro',          3],
            ['Morumbi',         3],
            ['Jardim Pioneiros',4],
            ['Independência',   4],
            ['Jardim Alvorada', 5],
            ['Vila São Pedro',  5],
            ['Nova Esperança',  6],
            ['Jardim Primavera',6],
        ];

        foreach ($sectors as [$name, $weekday]) {
            $id = DB::table('neighborhoods')->insertGetId([
                'city'       => $city,
                'name'       => $name,
                'created_at' => now(),
                'updated_at' => now(),
            ]);

            DB::table('collection_schedules')->insert([
                'neighborhood_id' => $id,
                'waste_type'      => 'seletiva',
                'weekday'         => $weekday,
                'start_time'      => '07:30:00',
                'end_time'        => '16:30:00',
                'created_at'      => now(),
                'updated_at'      => now(),
            ]);
        }
    }

    public function down(): void
    {
        DB::table('collection_schedules')->delete();
        DB::table('neighborhood_cep_prefixes')->delete();
        DB::table('neighborhoods')->delete();
    }
};
