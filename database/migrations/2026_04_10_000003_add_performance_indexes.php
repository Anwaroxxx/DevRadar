<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('messages', function (Blueprint $table) {
            $table->index(['receiver_id', 'read_at']);
            $table->index(['sender_id', 'receiver_id', 'created_at']);
            $table->index(['receiver_id', 'sender_id', 'created_at']);
        });

        Schema::table('events', function (Blueprint $table) {
            $table->index(['approval_status', 'event_date']);
        });

        Schema::table('job_listings', function (Blueprint $table) {
            $table->index(['approval_status', 'is_active', 'created_at']);
        });

        Schema::table('communities', function (Blueprint $table) {
            $table->index(['approval_status', 'member_count']);
        });
    }

    public function down(): void
    {
        Schema::table('messages', function (Blueprint $table) {
            $table->dropIndex(['receiver_id', 'read_at']);
            $table->dropIndex(['sender_id', 'receiver_id', 'created_at']);
            $table->dropIndex(['receiver_id', 'sender_id', 'created_at']);
        });

        Schema::table('events', function (Blueprint $table) {
            $table->dropIndex(['approval_status', 'event_date']);
        });

        Schema::table('job_listings', function (Blueprint $table) {
            $table->dropIndex(['approval_status', 'is_active', 'created_at']);
        });

        Schema::table('communities', function (Blueprint $table) {
            $table->dropIndex(['approval_status', 'member_count']);
        });
    }
};
