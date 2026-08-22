<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Content reports/flags for moderation
     */
    public function up(): void
    {
        Schema::create('content_reports', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained('users')->onDelete('cascade'); // Who reported
            $table->string('content_type'); // 'event', 'job', 'marketplace', 'message', 'user'
            $table->unsignedBigInteger('content_id'); // Which event/job/etc
            $table->string('reason'); // 'spam', 'harassment', 'fake', 'scam', 'inappropriate', 'plagiarism'
            $table->text('description')->nullable();
            $table->string('status')->default('pending'); // pending, reviewed, resolved, dismissed
            $table->unsignedBigInteger('admin_id')->nullable(); // Which admin reviewed
            $table->text('admin_notes')->nullable();
            $table->string('action_taken')->nullable(); // 'deleted', 'hidden', 'warned_user', 'suspended_user', 'banned_user'
            $table->timestamps();

            $table->index(['content_type', 'content_id']);
            $table->index('status');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('content_reports');
    }
};
