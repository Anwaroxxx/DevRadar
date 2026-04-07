<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // Audit Logs
        Schema::create('audit_logs', function (Blueprint $table) {
            $table->id();
            $table->foreignId('admin_id')->constrained('users')->cascadeOnDelete();
            $table->string('action'); // 'ban_user', 'approve_event', 'update_settings', etc
            $table->string('target_type')->nullable(); // 'user', 'event', 'job', 'marketplace'
            $table->unsignedBigInteger('target_id')->nullable();
            $table->json('changes')->nullable(); // What was changed
            $table->text('description')->nullable();
            $table->string('ip_address')->nullable();
            $table->string('user_agent')->nullable();
            $table->timestamps();
        });

        // Feature Flags
        Schema::create('feature_flags', function (Blueprint $table) {
            $table->id();
            $table->string('name')->unique();
            $table->boolean('enabled')->default(false);
            $table->text('description')->nullable();
            $table->json('config')->nullable(); // Optional configuration for the feature
            $table->timestamp('enabled_at')->nullable();
            $table->timestamp('disabled_at')->nullable();
            $table->timestamps();
        });

        // Platform Metrics
        Schema::create('platform_metrics', function (Blueprint $table) {
            $table->id();
            $table->string('metric_name'); // 'dau', 'new_signups', 'events_created', 'jobs_posted'
            $table->integer('value');
            $table->date('date');
            $table->unique(['metric_name', 'date']);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('platform_metrics');
        Schema::dropIfExists('feature_flags');
        Schema::dropIfExists('audit_logs');
    }
};
