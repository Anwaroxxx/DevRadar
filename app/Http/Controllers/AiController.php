<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use Inertia\Inertia;

class AiController extends Controller
{
    private string $apiKey;
    private string $model = 'llama-3.3-70b-versatile';

    public function __construct()
    {
        $this->apiKey = config('services.groq.key');
    }

    // ───────── Pages ─────────

    public function chatPage()   { return Inertia::render('Ai/Chat'); }
    public function codePage()   { return Inertia::render('Ai/Code'); }
    public function resumePage() { return Inertia::render('Ai/Resume'); }
    public function postPage()   { return Inertia::render('Ai/PostGenerator'); }

    // ───────── AI actions ─────────

    public function chat(Request $request)
    {
        $request->validate(['message' => 'required|string|max:2000']);

        if (!$request->user()->has_ai_access) {
            return back()->with('error', 'AI Access Expired. Visit Marketplace to renew.');
        }

        $reply = $this->askGroq([
            ['role' => 'system', 'content' => 'You are a helpful Moroccan developer assistant. Answer coding questions concisely and clearly.'],
            ['role' => 'user',   'content' => $request->message],
        ]);

        return back()->with('info', $reply);
    }

    public function reviewCode(Request $request)
    {
        $request->validate(['code' => 'required|string', 'language' => 'nullable|string']);

        if (!$request->user()->has_ai_access) {
            return back()->with('error', 'AI Access Expired. Visit Marketplace to renew.');
        }

        $lang = $request->language ?? 'unknown';
        $reply = $this->askGroq([
            ['role' => 'system', 'content' => "You are an expert code reviewer. Review the following $lang code and provide: 1) Issues found 2) Improvements 3) Optimizations. Be concise."],
            ['role' => 'user',   'content' => $request->code],
        ]);

        return back()->with('info', $reply);
    }

    public function buildResume(Request $request)
    {
        $request->validate([
            'name'       => 'required|string',
            'skills'     => 'required|string',
            'experience' => 'nullable|string',
            'education'  => 'nullable|string',
            'type'       => 'required|in:cv,linkedin,portfolio',
        ]);

        if (!$request->user()->has_ai_access) {
            return back()->with('error', 'AI Access Expired. Visit Marketplace to renew.');
        }

        $prompt = match ($request->type) {
            'cv'        => "Generate a professional developer CV for {$request->name}. Skills: {$request->skills}. Experience: {$request->experience}. Education: {$request->education}.",
            'linkedin'  => "Write a compelling LinkedIn summary for a developer named {$request->name}. Skills: {$request->skills}.",
            'portfolio' => "Write a portfolio bio/description for developer {$request->name}. Skills: {$request->skills}.",
        };

        $reply = $this->askGroq([
            ['role' => 'system', 'content' => 'You are a professional career coach specializing in tech industry CVs and LinkedIn profiles.'],
            ['role' => 'user',   'content' => $prompt],
        ]);

        return back()->with('info', $reply);
    }

    public function generatePost(Request $request)
    {
        $request->validate([
            'topic'   => 'required|string',
            'type'    => 'required|in:event,announcement,community',
            'details' => 'nullable|string',
        ]);

        if (!$request->user()->has_ai_access) {
            return back()->with('error', 'AI Access Expired. Visit Marketplace to renew.');
        }

        $reply = $this->askGroq([
            ['role' => 'system', 'content' => "Generate an engaging {$request->type} post for the Moroccan tech community. Keep it professional and exciting."],
            ['role' => 'user',   'content' => "Topic: {$request->topic}\nDetails: {$request->details}"],
        ]);

        return back()->with('info', $reply);
    }

    public function suggestEvents(Request $request)
    {
        $request->validate(['interests' => 'required|string']);

        $reply = $this->askGroq([
            ['role' => 'system', 'content' => 'You suggest tech events and activities for developers in Morocco based on their interests. Be helpful and practical.'],
            ['role' => 'user',   'content' => "My tech interests: {$request->interests}. What events or activities should I look for in Morocco?"],
        ]);

        return back()->with('info', $reply);
    }

    // ───────── Groq helper ─────────

    private function askGroq(array $messages): string
    {
        $response = Http::withoutVerifying()->withHeaders([
            'Authorization' => "Bearer {$this->apiKey}",
            'Content-Type'  => 'application/json',
        ])->post('https://api.groq.com/openai/v1/chat/completions', [
            'model'       => $this->model,
            'messages'    => $messages,
            'max_tokens'  => 1024,
            'temperature' => 0.7,
        ]);

        if ($response->failed()) {
            return 'AI service temporarily unavailable. Please try again.';
        }

        return $response->json('choices.0.message.content', 'No response generated.');
    }
}
