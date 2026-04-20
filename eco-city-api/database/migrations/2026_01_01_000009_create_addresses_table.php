<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('addresses', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained('users')->cascadeOnDelete();
            $table->string('cep', 9);
            $table->string('street');
            $table->string('number', 20)->nullable();
            $table->string('complement')->nullable();
            $table->foreignId('neighborhood_id')->nullable()->constrained('neighborhoods')->nullOnDelete();
            $table->decimal('lat', 10, 7)->nullable();
            $table->decimal('lng', 10, 7)->nullable();
            $table->string('label', 40)->nullable();
            $table->boolean('is_primary')->default(false);
            $table->timestamps();

            $table->index('user_id');
            $table->index('cep');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('addresses');
    }
};
