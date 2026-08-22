# AGENTS.md

## What this is

DevRadar Morocco — social hub + marketplace for Moroccan developers. Laravel 12 backend, React 19 via Inertia v2 (**plain JSX, no TypeScript sources**), Tailwind CSS v4, Laravel Reverb for websockets, Groq API for AI features. Auth is **Fortify** (`routes/auth.php`, `app/Actions/Fortify/`) — some docs say "Breeze" or "Sanctum REST"; trust the code over the READMEs.

`prompt.md` (~800 lines) is the master spec/roadmap for current work (bug fixes, achievements system, AI tools). Consult it before adding features; when it and the code disagree, prefer the code.

## Commands

```bash
composer dev                  # artisan serve + queue:listen + pail + vite, all concurrent
composer test                 # config:clear + pint check + php artisan test
php artisan test --filter=X   # single test/class
composer ci:check             # full gate: eslint + prettier + tsc + tests

npm run lint          # eslint --fix
npm run format        # prettier --write resources/
npm run types:check   # tsc --noEmit
composer lint         # pint --parallel (fixes)
```

CI order is lint -> format -> types -> tests; run `composer ci:check` before finishing any change.

## Wayfinder generated routes (critical)

`resources/js/routes/`, `resources/js/actions/`, `resources/js/wayfinder/` are **generated** by `@laravel/vite-plugin-wayfinder` whenever the Vite dev server or build runs — they are gitignored. Pages import route helpers from them, e.g. `import { store } from '@/routes/login'`. After changing Laravel routes, run `npm run dev` (or build) once to regenerate, or frontend imports won't resolve. Never hand-edit these files.

## Frontend conventions

- Inertia pages are `.jsx` files resolved by exact path: `Inertia::render('Ai/Chat')` -> `resources/js/pages/Ai/Chat.jsx`. Directory casing must match.
- React Compiler is enabled (`babel-plugin-react-compiler` in `vite.config.ts`) — don't add manual memoization that fights it.
- `resources/js/components/ui/*` are shadcn/Radix primitives (eslint-ignored); build app components outside that dir.
- `@/*` maps to `resources/js/*`. Ambient types live as `.d.js` files in `resources/js/types/`.
- Prettier uses 4-space indent and sorts Tailwind classes (`prettier-plugin-tailwindcss`). ESLint enforces blank lines around control statements and sorted imports — run `npm run lint` rather than hand-fixing.

## Env gotchas

`.env.example` is **incomplete** relative to implemented features:

- `GROQ_API_KEY` — required for every AI endpoint (`config/services.php` `services.groq.key`, used by `AiController`; model `llama-3.3-70b-versatile` hardcoded there). Missing key degrades to an error string, not an exception.
- Reverb vars (`REVERB_*` / `VITE_REVERB_*`) — needed for real-time chat. `resources/js/echo.js` deliberately skips Echo init when `VITE_REVERB_APP_KEY` is unset (production-crash guard) — keep that behavior.
- Default DB is SQLite (`DB_CONNECTION=sqlite`); MySQL in production. Tests always use in-memory SQLite via `phpunit.xml`.
- Seeded admin user comes from `ADMIN_EMAIL` / `ADMIN_PASSWORD` env vars (`DatabaseSeeder`).
- A migrated-but-unseeded DB looks broken (empty marketplace, no badges/achievements). Run `php artisan db:seed` after `migrate`.

## Backend conventions

- RBAC: roles live in the `roles` + `role_user` pivot (admin > moderator > developer). Guard routes with `middleware('role:admin,moderator')` (`App\Http\Middleware\HandleRole`, aborts 403). The `admin` alias still works (delegates to HandleRole).
- `users.role` is a denormalized cache of the highest-priority role — never edit it directly; use `User::syncRoles()` or factory `withRole()`. `isAdmin()` reads the column for cheap serialization.
- Admin routes are split by concern in `routes/admin/*.php` (dashboard/moderation/content = moderator+admin; users/systems/content-delete = admin only). Keep new admin endpoints there.
- Frontend gating uses `<RoleGuard allow={[...]}>` (`resources/js/components/role-guard.jsx`) — UX-only; backend middleware remains the source of truth.
- Broadcast events implement `ShouldBroadcastNow`; chat channels are `PrivateChannel('chat.' . receiver_id)` authorized in `routes/channels.php`.
- Migrations/seeders follow idempotent "safe production" patterns (`firstOrCreate`, guarded alters) because prod data must survive deploys — never write destructive migrations.
- XP economy: `users.xp` balance + `xp_transactions` ledger; marketplace purchases grant `ai_access_until` on users. Use existing services (`AchievementService`, `LevelCalculator`, `AchievementSync`) instead of duplicating XP/level logic inline.
- AI access schema is ahead of the runtime: users have `ai_tier` + monthly token quota columns (`ai_monthly_tokens`, `ai_tokens_used_this_month`, `ai_reset_date`) and there's an `AiUsageLog` model + admin AI-access panel (`Admin/SystemsController`, pages/Admin/AiAccess.jsx), but `AiController` doesn't enforce quotas or write usage logs yet. Wire new Groq features into that schema rather than inventing parallel tracking.
