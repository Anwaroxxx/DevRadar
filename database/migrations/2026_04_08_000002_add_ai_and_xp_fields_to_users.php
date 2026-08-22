<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // Users table
        Schema::table('users', function (Blueprint $table) {
            if (! Schema::hasColumn('users', 'ai_tier')) {
                $table->string('ai_tier')->default('free');
            }
            if (! Schema::hasColumn('users', 'ai_monthly_tokens')) {
                $table->integer('ai_monthly_tokens')->default(50000);
            }
            if (! Schema::hasColumn('users', 'ai_tokens_used_this_month')) {
                $table->integer('ai_tokens_used_this_month')->default(0);
            }
            if (! Schema::hasColumn('users', 'ai_reset_date')) {
                $table->timestamp('ai_reset_date')->nullable();
            }
            if (! Schema::hasColumn('users', 'ai_feature_advanced')) {
                $table->boolean('ai_feature_advanced')->default(false);
            }
            if (! Schema::hasColumn('users', 'total_xp_earned')) {
                $table->integer('total_xp_earned')->default(0);
            }
            if (! Schema::hasColumn('users', 'xp_spent_marketplace')) {
                $table->integer('xp_spent_marketplace')->default(0);
            }
        });

        // Job listings table
        Schema::table('job_listings', function (Blueprint $table) {
            if (! Schema::hasColumn('job_listings', 'is_verified_company')) {
                $table->boolean('is_verified_company')->default(false);
            }
            if (! Schema::hasColumn('job_listings', 'featured_until')) {
                $table->timestamp('featured_until')->nullable();
            }
            if (! Schema::hasColumn('job_listings', 'verified_at')) {
                $table->timestamp('verified_at')->nullable();
            }
        });
    }

    public function down(): void
    {
        Schema::table('job_listings', function (Blueprint $table) {
            if (Schema::hasColumn('job_listings', 'is_verified_company')) {
                $table->dropColumn(['is_verified_company', 'featured_until', 'verified_at']);
            }
        });

        Schema::table('users', function (Blueprint $table) {
            $columns = [
                'ai_tier', 'ai_monthly_tokens', 'ai_tokens_used_this_month', 'ai_reset_date', 'ai_feature_advanced',
                'total_xp_earned', 'xp_spent_marketplace',
            ];
            foreach ($columns as $col) {
                if (Schema::hasColumn('users', $col)) {
                    $table->dropColumn($col);
                }
            }
        });
    }
};
