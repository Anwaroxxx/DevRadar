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

    public function chatPage()
    {
        return Inertia::render('Ai/Chat');
    }

    public function codePage()
    {
        return Inertia::render('Ai/Code');
    }

    public function resumePage()
    {
        return Inertia::render('Ai/Resume');
    }

    public function postPage()
    {
        return Inertia::render('Ai/PostGenerator');
    }

    // ───────── AI actions ─────────

    public function chat(Request $request)
    {
        $request->validate(['message' => 'required|string|max:4000']);

        $reply = $this->askGroq([
            ['role' => 'system', 'content' => 'You are DevRadar AI — a helpful assistant specialized in helping Moroccan developers with coding questions, career advice, tech events in Morocco, and software development best practices. Be concise, friendly, and technical.'],
            ['role' => 'user',   'content' => $request->message],
        ]);

        return back()->with('info', $reply)->with('user_message', $request->message);
    }

    public function reviewCode(Request $request)
    {
        $request->validate(['code' => 'required|string', 'language' => 'nullable|string']);

        $lang = $request->language ?? 'unknown';
        $reply = $this->askGroq([
            ['role' => 'system', 'content' => "You are an expert code reviewer. Review the following {$lang} code and provide: 1) Issues found 2) Improvements suggested 3) Best practices. Format with clear sections. Be direct and technical."],
            ['role' => 'user',   'content' => $request->code],
        ]);

        return back()->with('info', $reply);
    }

    public function buildResume(Request $request)
    {
        $request->validate([
            'name' => 'required|string',
            'target_role' => 'required|string',
            'skills' => 'nullable|string',
            'experience' => 'nullable|string',
            'education' => 'nullable|string',
            'type' => 'required|in:cv,linkedin,portfolio',
        ]);

        $prompt = match ($request->type) {
            'cv' => "Generate a professional developer CV for {$request->name} targeting a {$request->target_role} role.\nSkills: {$request->skills}\nExperience: {$request->experience}\nEducation: {$request->education}\nFormat as a clean, professional CV with sections.",
            'linkedin' => "Write a compelling LinkedIn summary/About section for a developer named {$request->name} targeting {$request->target_role}.\nSkills: {$request->skills}\nExperience: {$request->experience}\nMake it engaging, professional, and personal.",
            'portfolio' => "Write a portfolio bio/introduction for developer {$request->name} targeting {$request->target_role}.\nSkills: {$request->skills}\nExperience: {$request->experience}\nMake it stand out.",
        };

        $reply = $this->askGroq([
            ['role' => 'system', 'content' => 'You are a professional career coach and technical writer specializing in developer CVs, LinkedIn profiles, and portfolio content. Create polished, ATS-friendly professional content.'],
            ['role' => 'user',   'content' => $prompt],
        ]);

        return back()->with('info', $reply);
    }

    public function generatePost(Request $request)
    {
        $request->validate([
            'topic' => 'required|string',
            'type' => 'required|in:event,announcement,community',
            'details' => 'nullable|string',
        ]);

        $reply = $this->askGroq([
            ['role' => 'system', 'content' => "Generate an engaging {$request->type} post for the Moroccan tech community. Keep it professional, exciting, and in English. Use emojis where appropriate. Format for social media."],
            ['role' => 'user',   'content' => "Topic: {$request->topic}\nDetails: {$request->details}"],
        ]);

        return back()->with('info', $reply);
    }

    public function suggestEvents(Request $request)
    {
        $request->validate(['interests' => 'required|string']);

        $reply = $this->askGroq([
            ['role' => 'system', 'content' => 'You suggest tech events, meetups, hackathons and communities for developers in Morocco based on their interests. Be specific, helpful and practical. Mention real Moroccan tech communities if relevant.'],
            ['role' => 'user',   'content' => "My tech interests: {$request->interests}. What events or activities should I look for in Morocco?"],
        ]);

        return back()->with('info', $reply);
    }

    // ───────── Groq helper ─────────

    private function askGroq(array $messages): string
    {
        if (! $this->apiKey) {
            return 'AI service not configured. Please set the GROQ_API_KEY in your .env file.';
        }

        try {
            $response = Http::timeout(30)->withHeaders([
                'Authorization' => "Bearer {$this->apiKey}",
                'Content-Type' => 'application/json',
            ])->post('https://api.groq.com/openai/v1/chat/completions', [
                'model' => $this->model,
                'messages' => $messages,
                'max_tokens' => 2048,
                'temperature' => 0.7,
            ]);

            if ($response->failed()) {
                $error = $response->json('error.message', 'Unknown error');

                return "AI service error: {$error}";
            }

            return $response->json('choices.0.message.content', 'No response generated.');
        } catch (\Exception $e) {
            return 'AI service temporarily unavailable. Please try again in a moment.';
        }
    }
}
