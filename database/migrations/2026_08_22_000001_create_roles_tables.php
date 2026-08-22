<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Ordered highest-priority first. users.role keeps storing the
     * highest-priority role as a fast-path cache.
     */
    public const ROLES = ['admin', 'moderator', 'developer'];

    public function up(): void
    {
        Schema::create('roles', function (Blueprint $table) {
            $table->id();
            $table->string('name')->unique();
            $table->string('label')->nullable();
            $table->timestamps();
        });

        Schema::create('role_user', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->foreignId('role_id')->constrained()->cascadeOnDelete();

            $table->unique(['user_id', 'role_id']);
            $table->timestamps();
        });

        foreach (self::ROLES as $role) {
            DB::table('roles')->insertOrIgnore([
                'name' => $role,
                'label' => ucfirst($role),
                'created_at' => now(),
                'updated_at' => now(),
            ]);
        }

        // Backfill pivots from the legacy users.role column.
        // The column itself is kept (never dropped) as a denormalized cache.
        $roleIds = DB::table('roles')->pluck('id', 'name');

        DB::table('users')
            ->select('id', 'role')
            ->orderBy('id')
            ->chunkById(500, function ($users) use ($roleIds) {
                $rows = [];

                foreach ($users as $user) {
                    $roleName = in_array($user->role, self::ROLES, true) ? $user->role : 'developer';

                    $rows[] = [
                        'user_id' => $user->id,
                        'role_id' => $roleIds[$roleName],
                        'created_at' => now(),
                        'updated_at' => now(),
                    ];
                }

                if ($rows !== []) {
                    DB::table('role_user')->insertOrIgnore($rows);
                }
            });
    }

    public function down(): void
    {
        Schema::dropIfExists('role_user');
        Schema::dropIfExists('roles');
    }
};
