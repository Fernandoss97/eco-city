<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('notifications', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained('users')->cascadeOnDelete();
            $table->foreignId('template_id')->constrained('notification_templates')->restrictOnDelete();
            $table->jsonb('payload')->nullable();
            $table->timestamp('scheduled_for')->nullable();
            $table->timestamp('sent_at')->nullable();
            $table->string('status', 20)->default('pending');
            $table->string('provider_message_id')->nullable();
            $table->timestamps();

            $table->index(['scheduled_for', 'status']);
            $table->index(['user_id', 'scheduled_for']);
            $table->index('provider_message_id');
        });

        DB::statement(
            "ALTER TABLE notifications ADD CONSTRAINT notifications_status_check "
            ."CHECK (status IN ('pending','queued','sent','delivered','failed','read'))"
        );
    }

    public function down(): void
    {
        Schema::dropIfExists('notifications');
    }
};
