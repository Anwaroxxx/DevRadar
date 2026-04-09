<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('community_snapshots', function (Blueprint $table) {
            $table->id();
            $table->foreignId('community_id')->constrained()->onDelete('cascade');
            $table->integer('followers_count');
            $table->integer('posts_count');
            $table->integer('comments_count');
            $table->decimal('engagement_signal', 8, 2)->default(0); // Custom signal score
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('community_snapshots');
    }
};
