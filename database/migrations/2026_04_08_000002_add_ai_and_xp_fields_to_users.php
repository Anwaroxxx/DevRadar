<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // Add AI tier and quota fields to users
        Schema::table('users', function (Blueprint $table) {
            $table->after('ai_access_until', function ($table) {
                $table->string('ai_tier')->default('free'); // 'free', 'basic', 'pro', 'unlimited'
                $table->integer('ai_monthly_tokens')->default(50000);
                $table->integer('ai_tokens_used_this_month')->default(0);
                $table->timestamp('ai_reset_date')->nullable();
                $table->boolean('ai_feature_advanced')->default(false);
            });
        });

        // Add marketplace purchase tracking
        Schema::table('users', function (Blueprint $table) {
            $table->integer('total_xp_earned')->default(0);
            $table->integer('xp_spent_marketplace')->default(0);
        });

        // Add company verification to job_listings
        Schema::table('job_listings', function (Blueprint $table) {
            $table->after('is_featured', function ($table) {
                $table->boolean('is_verified_company')->default(false);
                $table->timestamp('featured_until')->nullable();
                $table->timestamp('verified_at')->nullable();
            });
        });
    }

    public function down(): void
    {
        Schema::table('job_listings', function (Blueprint $table) {
            $table->dropColumn(['is_verified_company', 'featured_until', 'verified_at']);
        });

        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn(['ai_tier', 'ai_monthly_tokens', 'ai_tokens_used_this_month', 'ai_reset_date', 'ai_feature_advanced', 'total_xp_earned', 'xp_spent_marketplace']);
        });
    }
};
