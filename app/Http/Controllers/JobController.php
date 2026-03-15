<?php

namespace App\Http\Controllers;

use App\Models\JobListing;
use Illuminate\Http\Request;
use Inertia\Inertia;

class JobController extends Controller
{
    public function index(Request $request)
    {
        $query = JobListing::with('user')
            ->where('is_active', true)
            ->orderByDesc('created_at');

        if ($request->city) $query->where('city', $request->city);
        if ($request->type) $query->where('type', $request->type);
        if ($request->remote) $query->where('is_remote', true);
        if ($request->tech) {
            $query->whereJsonContains('tech_stack', $request->tech);
        }

        $jobs = $query->paginate(12)->withQueryString();

        return Inertia::render('Jobs/Index', [
            'jobs'    => $jobs,
            'filters' => $request->only(['city', 'type', 'remote', 'tech']),
        ]);
    }

    public function create()
    {
        return Inertia::render('Jobs/Create');
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'title'       => 'required|string|max:255',
            'company'     => 'required|string',
            'city'        => 'required|string',
            'type'        => 'required|in:full-time,internship,freelance',
            'is_remote'   => 'boolean',
            'description' => 'required|string',
            'apply_link'  => 'required|url',
            'tech_stack'  => 'nullable|array',
            'salary_range'=> 'nullable|string',
        ]);

        $job = $request->user()->jobListings()->create($data);
        $request->user()->awardXp(50, 'posted_job', "Posted job: {$job->title}", $job);

        return redirect()->route('jobs.index')->with('success', '+50 XP earned for posting a job!');
    }
}
