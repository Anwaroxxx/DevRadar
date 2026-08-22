<?php

namespace Tests\Feature;

use App\Models\Role;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class RolesTest extends TestCase
{
    use RefreshDatabase;

    protected bool $seed = true;

    public function test_roles_table_is_seeded_with_hierarchy(): void
    {
        foreach (Role::HIERARCHY as $name) {
            $this->assertDatabaseHas('roles', ['name' => $name]);
        }
    }

    public function test_guests_cannot_access_admin(): void
    {
        $this->get(route('admin.dashboard'))->assertRedirect(route('login'));
    }

    public function test_developers_are_forbidden_from_admin_dashboard(): void
    {
        $user = User::factory()->withRole(Role::DEVELOPER)->create();

        $this->actingAs($user)
            ->get(route('admin.dashboard'))
            ->assertForbidden();
    }

    public function test_moderators_can_access_staff_area_but_not_identity_management(): void
    {
        $moderator = User::factory()->withRole(Role::MODERATOR)->create();

        $this->actingAs($moderator)
            ->get(route('admin.dashboard'))
            ->assertOk();

        $this->actingAs($moderator)
            ->get(route('admin.users'))
            ->assertForbidden();
    }

    public function test_admins_can_access_admin_only_sections(): void
    {
        $admin = User::factory()->withRole(Role::ADMIN)->create();

        $this->actingAs($admin)->get(route('admin.dashboard'))->assertOk();
        $this->actingAs($admin)->get(route('admin.users'))->assertOk();
        $this->actingAs($admin)->get(route('admin.audit-logs'))->assertOk();
    }

    public function test_sync_roles_updates_legacy_role_column_with_highest_priority(): void
    {
        $user = User::factory()->withRole(Role::DEVELOPER)->create();

        $user->syncRoles([Role::DEVELOPER, Role::ADMIN, Role::MODERATOR]);

        $this->assertSame(Role::ADMIN, $user->fresh()->role);
        $this->assertTrue($user->fresh()->hasRole(Role::MODERATOR));
        $this->assertTrue($user->fresh()->isAdmin());
    }

    public function test_factory_users_get_default_pivot_role(): void
    {
        $user = User::factory()->create();

        $this->assertTrue($user->fresh()->hasRole(Role::DEVELOPER));
    }
}
