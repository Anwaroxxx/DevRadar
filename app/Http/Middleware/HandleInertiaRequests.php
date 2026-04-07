<?php

namespace App\Http\Middleware;

use Illuminate\Http\Request;
use Inertia\Middleware;
use App\Models\Message;

class HandleInertiaRequests extends Middleware
{
    /**
     * The root template that's loaded on the first page visit.
     *
     * @see https://inertiajs.com/server-side-setup#root-template
     *
     * @var string
     */
    protected $rootView = 'app';

    /**
     * Determines the current asset version.
     *
     * @see https://inertiajs.com/asset-versioning
     */
    public function version(Request $request): ?string
    {
        return parent::version($request);
    }

    /**
     * Define the props that are shared by default.
     *
     * @see https://inertiajs.com/shared-data
     *
     * @return array<string, mixed>
     */
    public function share(Request $request): array
    {
        $user = $request->user();
        $unreadDmCount = $user
            ? Message::where('receiver_id', $user->id)->whereNull('read_at')->count()
            : 0;

        return [
            ...parent::share($request),
            'name' => config('app.name'),
            'auth' => [
                'user' => $user ? array_merge($user->toArray(), [
                    'is_admin'        => $user->isAdmin(),
                    'has_ai_access'   => $user->has_ai_access,
                    'unread_dm_count' => $unreadDmCount,
                ]) : null,
            ],
            'flash' => [
                'success'      => $request->session()->get('success'),
                'error'        => $request->session()->get('error'),
                'info'         => $request->session()->get('info'),
                'user_message' => $request->session()->get('user_message'),
            ],
            'csrf_token' => csrf_token(),
            'sidebarOpen' => ! $request->hasCookie('sidebar_state') || $request->cookie('sidebar_state') === 'true',
        ];
    }
}
