<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // Marketplace Items
        Schema::create('marketplace_items', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->text('description');
            $table->integer('price_xp');
            $table->string('category'); // 'badge', 'cosmetic', 'feature', 'boost'
            $table->string('icon')->nullable();
            $table->boolean('is_available')->default(true);
            $table->integer('max_quantity')->nullable(); // null = unlimited
            $table->integer('quantity_sold')->default(0);
            $table->timestamps();
        });

        // Marketplace Purchases
        Schema::create('marketplace_purchases', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->foreignId('marketplace_item_id')->constrained('marketplace_items')->cascadeOnDelete();
            $table->integer('xp_spent');
            $table->timestamps();
        });

        // XP Rewards Configuration
        Schema::create('xp_rewards', function (Blueprint $table) {
            $table->id();
            $table->string('action'); // 'create_event', 'create_job', 'write_message', 'participate_event', 'join_community'
            $table->integer('amount');
            $table->text('description')->nullable();
            $table->boolean('is_active')->default(true);
            $table->timestamps();
        });

        // AI Usage Logs
        Schema::create('ai_usage_logs', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->string('model'); // 'gpt-4', 'gpt-3.5-turbo', etc
            $table->integer('tokens_used');
            $table->integer('requests_count')->default(1);
            $table->timestamp('logged_at');
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('ai_usage_logs');
        Schema::dropIfExists('xp_rewards');
        Schema::dropIfExists('marketplace_purchases');
        Schema::dropIfExists('marketplace_items');
    }
};
