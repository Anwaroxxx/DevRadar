<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}" class="dark">
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <title>403 — Access Denied | {{ config('app.name', 'DevRadar') }}</title>
        <style>
            * { margin: 0; padding: 0; box-sizing: border-box; }
            html, body {
                height: 100%;
                background-color: #050505;
                color: #22c55e;
                font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
                display: flex;
                align-items: center;
                justify-content: center;
            }
            .terminal {
                border: 1px solid rgba(34, 197, 94, 0.25);
                background: rgba(0, 0, 0, 0.6);
                padding: 2.5rem 3rem;
                max-width: 560px;
                width: calc(100% - 2rem);
                box-shadow: 0 0 40px rgba(34, 197, 94, 0.08);
            }
            .title { font-size: 1rem; font-weight: 800; letter-spacing: -0.03em; text-transform: uppercase; }
            .title span { color: #eab308; }
            .line { margin-top: 1rem; font-size: 0.85rem; color: rgba(34, 197, 94, 0.75); line-height: 1.6; word-break: break-word; }
            .cursor { display: inline-block; width: 8px; animation: blink 1s step-end infinite; }
            a { color: #eab308; text-decoration: none; border-bottom: 1px solid rgba(234, 179, 8, 0.4); }
            a:hover { border-bottom-color: #eab308; }
            @keyframes blink { 50% { opacity: 0; } }
        </style>
    </head>
    <body>
        <div class="terminal">
            <div class="title">ERROR <span>403</span>_ ACCESS_DENIED</div>
            <div class="line">&gt; permission level insufficient for this operation.</div>
            @if(config('app.debug'))
                <div class="line">&gt; {{ $exception->getMessage() }}</div>
            @endif
            <div class="line">&gt; <a href="{{ url('/dashboard') }}">return_to_dashboard</a><span class="cursor">▊</span></div>
        </div>
    </body>
</html>
