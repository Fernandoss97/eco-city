<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        DB::statement(
            'ALTER TABLE collection_schedules DROP CONSTRAINT collection_schedules_waste_type_check'
        );

        // Map old values to the new taxonomy
        DB::table('collection_schedules')->where('waste_type', 'reciclavel')->update(['waste_type' => 'seletiva']);
        DB::table('collection_schedules')->where('waste_type', 'organico')->update(['waste_type' => 'convencional']);
        DB::table('collection_schedules')->where('waste_type', 'rejeito')->update(['waste_type' => 'convencional']);
        // 'especial' stays as 'especial'

        DB::statement(
            "ALTER TABLE collection_schedules ADD CONSTRAINT collection_schedules_waste_type_check "
            ."CHECK (waste_type IN ('convencional','seletiva','especial'))"
        );
    }

    public function down(): void
    {
        DB::statement(
            'ALTER TABLE collection_schedules DROP CONSTRAINT collection_schedules_waste_type_check'
        );

        DB::table('collection_schedules')->where('waste_type', 'seletiva')->update(['waste_type' => 'reciclavel']);
        DB::table('collection_schedules')->where('waste_type', 'convencional')->update(['waste_type' => 'organico']);

        DB::statement(
            "ALTER TABLE collection_schedules ADD CONSTRAINT collection_schedules_waste_type_check "
            ."CHECK (waste_type IN ('reciclavel','rejeito','organico','especial'))"
        );
    }
};
