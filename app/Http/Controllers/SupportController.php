<?php

namespace App\Http\Controllers;

use App\Models\SupportTicket;
use App\Models\User;
use App\Notifications\AdminActionRequired;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Notification;
use Inertia\Inertia;

class SupportController extends Controller
{
    /**
     * Store a new support ticket submitted from the public form.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'email' => 'required|email|max:255',
            'type' => 'required|string|max:100',
            'message' => 'required|string|min:20|max:2000',
        ]);

        $ticket = SupportTicket::create([
            'user_id' => auth()->id(), // null if guest
            'email' => $validated['email'],
            'type' => $validated['type'],
            'message' => $validated['message'],
            'status' => 'open',
        ]);

        $admins = User::where('role', 'admin')->get();
        if ($admins->isNotEmpty()) {
            Notification::send($admins, new AdminActionRequired(
                'Support Ticket',
                "New Ticket ({$validated['type']})",
                "A new support ticket was submitted by {$validated['email']}.",
                '/admin/support'
            ));
        }

        return back()->with('success', 'Your ticket has been submitted. Our team will respond within 24 hours.');
    }

    /**
     * Admin: list all support tickets.
     */
    public function adminIndex(Request $request)
    {
        $query = SupportTicket::with(['user', 'resolver'])->latest();

        if ($request->status) {
            $query->where('status', $request->status);
        }
        if ($request->type) {
            $query->where('type', $request->type);
        }

        return Inertia::render('Admin/SupportTickets', [
            'tickets' => $query->paginate(20)->withQueryString(),
            'filters' => $request->only(['status', 'type']),
            'counts' => [
                'open' => SupportTicket::where('status', 'open')->count(),
                'resolved' => SupportTicket::where('status', 'resolved')->count(),
            ],
        ]);
    }

    /**
     * Admin: resolve a support ticket.
     */
    public function adminResolve(Request $request, SupportTicket $ticket)
    {
        $validated = $request->validate([
            'admin_notes' => 'nullable|string|max:1000',
        ]);

        $ticket->update([
            'status' => 'resolved',
            'admin_notes' => $validated['admin_notes'] ?? null,
            'resolved_by' => auth()->id(),
            'resolved_at' => now(),
        ]);

        return back()->with('success', 'Ticket marked as resolved.');
    }
}
