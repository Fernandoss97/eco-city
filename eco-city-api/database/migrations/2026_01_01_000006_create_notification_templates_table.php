<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('notification_templates', function (Blueprint $table) {
            $table->id();
            $table->string('event', 40);
            $table->string('meta_name');
            $table->string('locale', 10)->default('pt_BR');
            $table->jsonb('variables')->nullable();
            $table->timestamps();

            $table->unique(['event', 'meta_name', 'locale']);
        });

        DB::statement(
            "ALTER TABLE notification_templates ADD CONSTRAINT notification_templates_event_check "
            ."CHECK (event IN ('collection_reminder'))"
        );
    }

    public function down(): void
    {
        Schema::dropIfExists('notification_templates');
    }
};
