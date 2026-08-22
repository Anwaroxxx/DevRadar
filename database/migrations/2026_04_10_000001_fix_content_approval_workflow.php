<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // Ensure approval_status exists everywhere and defaults are sensible.

        if (! Schema::hasColumn('events', 'approval_status')) {
            Schema::table('events', function (Blueprint $table) {
                $table->string('approval_status')->default('pending');
            });
        }

        if (! Schema::hasColumn('job_listings', 'approval_status')) {
            Schema::table('job_listings', function (Blueprint $table) {
                $table->string('approval_status')->default('pending');
            });
        }

        if (! Schema::hasColumn('communities', 'approval_status')) {
            Schema::table('communities', function (Blueprint $table) {
                $table->string('approval_status')->default('pending');
            });
        }

        // Backfill events based on existing is_approved flag if present.
        if (Schema::hasColumn('events', 'is_approved') && Schema::hasColumn('events', 'approval_status')) {
            DB::table('events')
                ->where('is_approved', true)
                ->whereIn('approval_status', ['pending', 'rejected'])
                ->update(['approval_status' => 'approved']);

            DB::table('events')
                ->where('is_approved', false)
                ->where('approval_status', 'approved')
                ->update(['approval_status' => 'pending']);
        }

        // Communities were previously live; keep existing rows visible by default.
        if (Schema::hasColumn('communities', 'approval_status')) {
            DB::table('communities')
                ->whereNull('approval_status')
                ->update(['approval_status' => 'approved']);
        }

        // Jobs were previously live if is_active; keep existing rows visible by default.
        if (Schema::hasColumn('job_listings', 'approval_status')) {
            DB::table('job_listings')
                ->whereNull('approval_status')
                ->update(['approval_status' => 'approved']);
        }
    }

    public function down(): void
    {
        // Non-destructive rollback: do not drop columns (could contain production data).
    }
};
