<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('collection_points', function (Blueprint $table) {
            $table->id();
            $table->string('type', 20);
            $table->string('name');
            $table->string('address');
            $table->decimal('lat', 10, 7);
            $table->decimal('lng', 10, 7);
            $table->foreignId('neighborhood_id')->nullable()->constrained('neighborhoods')->nullOnDelete();
            $table->jsonb('hours')->nullable();
            $table->text('description')->nullable();
            $table->timestamps();

            $table->index('type');
            $table->index('neighborhood_id');
            $table->index(['lat', 'lng']);
        });

        DB::statement('ALTER TABLE collection_points ADD COLUMN accepted_materials TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[]');
        DB::statement(
            "ALTER TABLE collection_points ADD CONSTRAINT collection_points_type_check "
            ."CHECK (type IN ('reciclagem','especial'))"
        );
    }

    public function down(): void
    {
        Schema::dropIfExists('collection_points');
    }
};
