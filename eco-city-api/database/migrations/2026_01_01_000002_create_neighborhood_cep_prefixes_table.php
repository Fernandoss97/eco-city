<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('neighborhood_cep_prefixes', function (Blueprint $table) {
            $table->id();
            $table->foreignId('neighborhood_id')->constrained('neighborhoods')->cascadeOnDelete();
            $table->string('prefix', 8);
            $table->timestamps();

            $table->unique('prefix');
        });

        DB::statement(
            'CREATE INDEX neighborhood_cep_prefixes_prefix_pattern_idx '
            .'ON neighborhood_cep_prefixes (prefix varchar_pattern_ops)'
        );
    }

    public function down(): void
    {
        Schema::dropIfExists('neighborhood_cep_prefixes');
    }
};
