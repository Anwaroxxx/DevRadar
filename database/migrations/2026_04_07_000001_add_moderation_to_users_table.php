<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * User moderation: bans, suspensions, warnings
     */
    public function up(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->timestamp('banned_at')->nullable()->after('ai_access_until');
            $table->timestamp('suspended_until')->nullable()->after('banned_at');
            $table->integer('warning_count')->default(0)->after('suspended_until');
            $table->text('moderation_notes')->nullable()->after('warning_count');
            $table->boolean('is_verified_user')->default(false)->after('moderation_notes');
        });
    }

    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn(['banned_at', 'suspended_until', 'warning_count', 'moderation_notes', 'is_verified_user']);
        });
    }
};
