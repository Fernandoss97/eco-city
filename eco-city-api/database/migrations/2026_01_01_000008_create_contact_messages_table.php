<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('contact_messages', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->nullable()->constrained('users')->nullOnDelete();
            $table->string('name');
            $table->string('email');
            $table->string('phone', 20)->nullable();
            $table->string('subject');
            $table->text('body');
            $table->string('status', 20)->default('novo');
            $table->timestamps();

            $table->index('status');
            $table->index('created_at');
        });

        DB::statement(
            "ALTER TABLE contact_messages ADD CONSTRAINT contact_messages_status_check "
            ."CHECK (status IN ('novo','em_andamento','resolvido'))"
        );
    }

    public function down(): void
    {
        Schema::dropIfExists('contact_messages');
    }
};
