<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class HandleRole
{
    /**
     * Usage: ->middleware('role:admin,moderator')
     * Grants access if the user has ANY of the listed roles (pivot-based).
     */
    public function handle(Request $request, Closure $next, string ...$roles): Response
    {
        $user = $request->user();

        if (! $user || empty($roles) || ! $user->hasRole($roles)) {
            abort(403, 'UNAUTHORIZED: Insufficient role.');
        }

        return $next($request);
    }
}
