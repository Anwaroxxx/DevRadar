<?php

namespace App\Http\Controllers;

use App\Mail\ContentStatusMail;
use App\Models\JobListing;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Mail;

class JobController extends Controller
{
    public function index(Request $request)
    {
        $query = JobListing::with('user')
            ->where('is_active', true)
            ->where('approval_status', 'approved')
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
            'latitude'    => 'nullable|numeric',
            'longitude'   => 'nullable|numeric',
        ]);

        $job = $request->user()->jobListings()->create(array_merge($data, [
            'approval_status' => $request->user()->role === 'admin' ? 'approved' : 'pending',
        ]));

        if (!empty($request->user()->email)) {
            Mail::to($request->user()->email)->queue(
                new ContentStatusMail('job', $job->title, 'pending')
            );
        }

        return redirect()->route('jobs.index')->with('success', 'Post submitted for approval!');
    }

    public function edit(JobListing $job)
    {
        $this->authorize('update', $job);
        return Inertia::render('Jobs/Edit', ['job' => $job]);
    }

    public function update(Request $request, JobListing $job)
    {
        $this->authorize('update', $job);
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
            'latitude'    => 'nullable|numeric',
            'longitude'   => 'nullable|numeric',
        ]);

        $job->update($data);
        return redirect()->route('jobs.index')->with('success', 'Post updated successfully.');
    }

    public function destroy(JobListing $job)
    {
        $this->authorize('delete', $job);
        $job->delete();
        return redirect()->route('jobs.index')->with('success', 'Post removed successfully.');
    }
}
