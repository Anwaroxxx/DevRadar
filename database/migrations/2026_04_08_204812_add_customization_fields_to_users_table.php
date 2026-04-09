<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->string('profile_accent_color')->default('primary')->after('bio');
            $table->string('profile_theme_style')->default('classic')->after('profile_accent_color');
            $table->boolean('profile_glow_effect')->default(true)->after('profile_theme_style');
            $table->string('profile_matrix_intensity')->default('medium')->after('profile_glow_effect');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn(['profile_accent_color', 'profile_theme_style', 'profile_glow_effect', 'profile_matrix_intensity']);
        });
    }
};
