<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Content approval flow - for professional curated platform
     */
    public function up(): void
    {
        // Events approval
        Schema::table('events', function (Blueprint $table) {
            if (!Schema::hasColumn('events', 'approval_status')) {
                $table->string('approval_status')->default('pending')->after('is_approved'); // pending, approved, rejected
            }
            if (!Schema::hasColumn('events', 'approved_by')) {
                $table->unsignedBigInteger('approved_by')->nullable()->after('approval_status');
            }
            if (!Schema::hasColumn('events', 'rejection_reason')) {
                $table->text('rejection_reason')->nullable()->after('approved_by');
            }
        });

        // Jobs approval
        Schema::table('job_listings', function (Blueprint $table) {
            if (!Schema::hasColumn('job_listings', 'approval_status')) {
                $table->string('approval_status')->default('pending')->after('is_active'); // pending, approved, rejected
            }
            if (!Schema::hasColumn('job_listings', 'approved_by')) {
                $table->unsignedBigInteger('approved_by')->nullable()->after('approval_status');
            }
            if (!Schema::hasColumn('job_listings', 'rejection_reason')) {
                $table->text('rejection_reason')->nullable()->after('approved_by');
            }
            if (!Schema::hasColumn('job_listings', 'is_verified_company')) {
                $table->boolean('is_verified_company')->default(false)->after('rejection_reason');
            }
        });

        // Communities approval
        Schema::table('communities', function (Blueprint $table) {
            if (!Schema::hasColumn('communities', 'approval_status')) {
                $table->string('approval_status')->default('approved')->after('id'); // pending, approved, rejected
            }
        });
    }

    public function down(): void
    {
        Schema::table('events', function (Blueprint $table) {
            $table->dropColumnIfExists(['approval_status', 'approved_by', 'rejection_reason']);
        });

        Schema::table('job_listings', function (Blueprint $table) {
            $table->dropColumnIfExists(['approval_status', 'approved_by', 'rejection_reason', 'is_verified_company']);
        });

        Schema::table('communities', function (Blueprint $table) {
            $table->dropColumnIfExists('approval_status');
        });
    }
};
