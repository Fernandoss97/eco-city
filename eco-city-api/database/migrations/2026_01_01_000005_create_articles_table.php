<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('articles', function (Blueprint $table) {
            $table->id();
            $table->string('slug')->unique();
            $table->string('title');
            $table->text('body_md');
            $table->string('cover_path')->nullable();
            $table->timestamp('published_at')->nullable();
            $table->timestamps();
        });

        DB::statement('ALTER TABLE articles ADD COLUMN tags TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[]');
        DB::statement('CREATE INDEX articles_published_idx ON articles (published_at) WHERE published_at IS NOT NULL');
    }

    public function down(): void
    {
        Schema::dropIfExists('articles');
    }
};
