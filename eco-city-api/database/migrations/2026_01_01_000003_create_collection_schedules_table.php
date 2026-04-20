<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('collection_schedules', function (Blueprint $table) {
            $table->id();
            $table->foreignId('neighborhood_id')->constrained('neighborhoods')->cascadeOnDelete();
            $table->string('waste_type', 20);
            $table->smallInteger('weekday');
            $table->time('start_time');
            $table->time('end_time');
            $table->timestamps();

            $table->unique(
                ['neighborhood_id', 'waste_type', 'weekday', 'start_time'],
                'collection_schedules_uniq'
            );
        });

        DB::statement(
            "ALTER TABLE collection_schedules ADD CONSTRAINT collection_schedules_waste_type_check "
            ."CHECK (waste_type IN ('reciclavel','rejeito','organico','especial'))"
        );
        DB::statement(
            'ALTER TABLE collection_schedules ADD CONSTRAINT collection_schedules_weekday_check '
            .'CHECK (weekday BETWEEN 0 AND 6)'
        );
    }

    public function down(): void
    {
        Schema::dropIfExists('collection_schedules');
    }
};
