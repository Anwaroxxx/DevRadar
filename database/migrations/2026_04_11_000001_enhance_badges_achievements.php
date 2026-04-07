<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('badges', function (Blueprint $table) {
            $table->string('slug')->nullable()->unique()->after('id');
            $table->string('track')->nullable()->index()->after('name');
            $table->unsignedTinyInteger('level')->default(1)->after('track');
            $table->string('icon_key')->default('Award')->after('icon');
        });
    }

    public function down(): void
    {
        Schema::table('badges', function (Blueprint $table) {
            $table->dropColumn(['slug', 'track', 'level', 'icon_key']);
        });
    }
};
