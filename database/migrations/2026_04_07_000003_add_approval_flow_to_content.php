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
                $col = $table->string('approval_status')->default('pending'); // pending, approved, rejected
                if (Schema::hasColumn('events', 'is_approved')) {
                    $col->after('is_approved');
                }
            }
            if (!Schema::hasColumn('events', 'approved_by')) {
                $col = $table->unsignedBigInteger('approved_by')->nullable();
                if (Schema::hasColumn('events', 'approval_status')) {
                    $col->after('approval_status');
                }
            }
            if (!Schema::hasColumn('events', 'rejection_reason')) {
                $col = $table->text('rejection_reason')->nullable();
                if (Schema::hasColumn('events', 'approved_by')) {
                    $col->after('approved_by');
                }
            }
        });

        // Jobs approval
        Schema::table('job_listings', function (Blueprint $table) {
            if (!Schema::hasColumn('job_listings', 'approval_status')) {
                $col = $table->string('approval_status')->default('pending'); // pending, approved, rejected
                if (Schema::hasColumn('job_listings', 'is_active')) {
                    $col->after('is_active');
                }
            }
            if (!Schema::hasColumn('job_listings', 'approved_by')) {
                $col = $table->unsignedBigInteger('approved_by')->nullable();
                if (Schema::hasColumn('job_listings', 'approval_status')) {
                    $col->after('approval_status');
                }
            }
            if (!Schema::hasColumn('job_listings', 'rejection_reason')) {
                $col = $table->text('rejection_reason')->nullable();
                if (Schema::hasColumn('job_listings', 'approved_by')) {
                    $col->after('approved_by');
                }
            }
            if (!Schema::hasColumn('job_listings', 'is_verified_company')) {
                $col = $table->boolean('is_verified_company')->default(false);
                if (Schema::hasColumn('job_listings', 'rejection_reason')) {
                    $col->after('rejection_reason');
                } elseif (Schema::hasColumn('job_listings', 'is_active')) {
                    $col->after('is_active');
                }
            }
        });

        // Communities approval
        Schema::table('communities', function (Blueprint $table) {
            if (!Schema::hasColumn('communities', 'approval_status')) {
                $col = $table->string('approval_status')->default('approved'); // pending, approved, rejected
                if (Schema::hasColumn('communities', 'id')) {
                    $col->after('id');
                }
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
