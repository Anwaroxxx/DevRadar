# DevRadar — Master Engineering Prompt

---

## Project Context

You are working on **DevRadar** — a full-stack social hub and marketplace built exclusively for Moroccan developers. The platform is **live and already deployed**. Do not break existing data, routes, or functionality.

**Tech Stack:**
- Backend: Laravel (latest)
- Frontend: React via Inertia.js
- Database: MySQL
- Styling: Tailwind CSS
- Maps: Leaflet.js
- Auth: Laravel Breeze

**Design Aesthetic:** Hacker/terminal theme — dark backgrounds, monospace fonts, green/amber accent colors.

**Rules for all changes:**
- Every database change must use a proper Laravel migration with a working `down()` rollback method.
- Follow MVC architecture: Controllers, Models, Policies, Form Requests, Middleware.
- All new routes must be grouped correctly (guest/auth/admin).
- Use Laravel queues (database driver) for: email notifications, achievement checks, broadcast events.
- Paginate all lists — 15 items per page minimum. Never fetch all records without a limit.
- Add database indexes on `user_id`, `status`, `created_at` on all new tables.
- Write clean, commented code.

---

## PRIORITY 1 — CRITICAL BUG FIXES
> Fix these before touching any new feature.

---

### BUG 1 — Profile Picture Upload Does Nothing

**Current behavior:** The profile picture upload form does nothing. It shows a placeholder icon and returns a "this input is required" error on the name field even though the user is only trying to update their photo.

**Root cause:** The photo and profile info share the same form — the name field validation blocks the whole submission.

**Fix:**
- Separate the photo update into its own dedicated form and route: `PATCH /profile/photo`
- Use `enctype="multipart/form-data"` on the form
- Validate only the photo: `required|image|mimes:jpeg,png,jpg,webp|max:2048`
- Store in `storage/app/public/avatars/{user_id}/`
- Run `php artisan storage:link` if not already done
- Update the `avatar` column on the `users` table with the new public URL
- Return the new URL in the JSON response
- On the React side: use `FileReader` to preview the selected image immediately before submitting (no page reload needed for preview)
- Show a loading spinner on the upload button while the request is in flight

---

### BUG 2 — Chat Requires Manual Page Refresh to See New Messages

**Current behavior:** Users must reload the page to see messages sent by others. Real-time delivery is broken.

**Fix:**
- Implement Laravel Echo + Pusher (or Soketi for self-hosted WebSockets)
- Create a `MessageSent` event that broadcasts on a private channel: `chat.{room_id}`
- The event payload should include: message text, sender id, sender name, sender avatar, timestamp
- On the React side: `window.Echo.private('chat.X').listen('MessageSent', (e) => { append e.message to local state })`
- **Fallback** (if WebSockets are not available): polling every 3 seconds via `GET /chat/{room}/messages?after={last_message_id}` — only fetch new messages, not the full history
- Auto-scroll to the latest message when a new one arrives
- Show a "New message ↓" button if the user has scrolled up and a new message arrives

---

### BUG 3 — Account Deletion Logic Is Incomplete

**Current behavior:** Account deletion behavior is unclear/broken.

**Required behavior:**
- When a user deletes their account:
  - Set `deleted_at` timestamp (soft delete via `SoftDeletes` trait)
  - Set `account_status = 'deleted'` in the `users` table
  - Nullify their `remember_token` immediately
  - Log them out of all sessions
- Login middleware must check `account_status` — if `deleted`, redirect to a static page: "This account has been deactivated."
- The user's content (posts, events, jobs, messages) stays in the database with the `user_id` intact but displayed as `[deleted user]` on the frontend
- Admins can see the full user profile, all past activity, and the deleted badge
- Add a **Reactivate Account** button in the admin panel user management section (resets `account_status` to `active`, restores `deleted_at` to null)

---

## PRIORITY 2 — NEW FEATURES

---

### FEATURE 1 — Achievements System

**New tables:**

```sql
achievements:
  id, name, slug, description, icon (string/emoji), xp_reward (int),
  trigger_type (enum: count_based, milestone, one_time),
  trigger_value (int), created_at

user_achievements:
  user_id (FK), achievement_id (FK), unlocked_at (timestamp)
  UNIQUE(user_id, achievement_id)
```

**Logic:**
- Create an `AchievementService` class
- Call it after every key user action (inside the relevant Controller or Observer)
- Trigger types:
  - `count_based`: user has done X of something (e.g. created 5 jobs)
  - `milestone`: user reached X XP
  - `one_time`: user did something for the first time (first post, first follow, profile completed)

**Seed at least 20 achievements. Examples:**

| Name | Trigger | XP Reward |
|------|---------|-----------|
| First Blood | First post created | 10 |
| Networker | First follow | 5 |
| Community Builder | Create 3 events | 30 |
| Recruiter | Post 5 jobs | 25 |
| Loyal Dev | 30-day login streak | 50 |
| Top Gun | Reach #1 on leaderboard | 100 |
| Profile Master | Complete all profile fields | 20 |
| Marketplace Pioneer | List first item on marketplace | 15 |
| Helping Hand | First report resolved by admin | 10 |
| Power User | 500 XP milestone | 0 (cosmetic) |

**Frontend:**
- Show unlocked achievements on the user profile page as icon badges with name and unlock date (tooltip on hover)
- Trigger an in-app toast notification when an achievement is unlocked: "🏆 Achievement Unlocked: Community Builder (+30 XP)"

---

### FEATURE 2 — Leaderboard Overhaul

**Replace the current single leaderboard with 3 competitive tabs:**

1. **XP Leaders** — ranked by total XP
2. **Top Event Creators** — ranked by approved events created
3. **Top Cluster Creators** — ranked by online/hybrid events created

**Each tab shows:** rank number, avatar, username, score, "View Profile" button

**Add filters per tab:** Weekly / Monthly / All-time

**Remove the leaderboard from the admin panel entirely.** Admins manage — they don't compete.

**Add a personal rank widget on the user dashboard:**
> "You are currently #12 this month — 45 XP away from #11."

---

### FEATURE 3 — Marketplace

**New tables:**

```sql
marketplace_items:
  id, user_id (FK), title, description (text),
  price_xp (int, nullable), price_mad (decimal 10,2, nullable),
  item_type (enum: template, service, resource, tool),
  preview_url (string, nullable),
  status (enum: pending, approved, rejected),
  created_at, updated_at

marketplace_purchases:
  id, buyer_id (FK users), seller_id (FK users),
  item_id (FK marketplace_items),
  price_paid_xp (int, nullable), price_paid_mad (decimal 10,2, nullable),
  purchased_at (timestamp)

xp_transactions:
  id, user_id (FK), type (enum: earned, spent, awarded, deducted),
  amount (int), reason (string), reference_type (string, nullable),
  reference_id (int, nullable), created_at
```

**Logic:**
- Items require admin approval before being visible to others
- XP purchases: deduct from buyer's XP, add to seller's XP, log both in `xp_transactions`
- Real money (MAD) payments: add a placeholder integration point for CMI/PayDunya — just store the intent and show "Payment gateway coming soon" for now
- Add a **"My Shop"** tab on every user's public profile showing their listed items
- Add a **"My Purchases"** section in the user dashboard

---

### FEATURE 4 — Follow System + Notification Center

**Ensure follows table exists:**
```sql
follows: follower_id (FK), following_id (FK), created_at
UNIQUE(follower_id, following_id)
```

**Notifications table:**
```sql
notifications:
  id, user_id (FK), type (string), notifiable_type (string),
  notifiable_id (int), data (JSON), read_at (timestamp nullable), created_at
```

**Notification triggers:**
- Someone follows you
- Someone likes or comments on your post
- Your event was approved or rejected (with admin note)
- Your job post was approved or rejected
- You unlocked an achievement
- Someone joins your event
- Your marketplace item was approved or rejected
- A new message in a chat room you're in (when not on the chat page)

**Frontend:**
- Notification bell icon in the navbar with a red unread count badge
- Clicking the bell opens a dropdown showing the 10 latest notifications with type icon, message, and timestamp
- "Mark all as read" button
- Clicking a notification navigates to the relevant content and marks it as read

---

### FEATURE 5 — User Blocking + Reporting

**New tables:**
```sql
user_blocks:
  blocker_id (FK), blocked_id (FK), created_at
  UNIQUE(blocker_id, blocked_id)

reports:
  id, reporter_id (FK), reported_type (enum: user, post, event, job, message),
  reported_id (int), reason (enum: spam, harassment, fake, inappropriate, other),
  description (text, nullable), status (enum: pending, resolved, dismissed),
  admin_note (text, nullable), created_at, resolved_at (nullable),
  resolved_by (FK users, nullable)
```

**Blocking logic:**
- Blocked users cannot view your profile
- Blocked users cannot send you direct messages
- Blocked users do not appear in your activity feed
- Block is one-directional (A blocks B → B can't see A, but A can still see B unless B also blocks A)

**Reporting:**
- Report button on: every user profile, every post, every message, every event listing, every job listing
- Reports go into the admin panel Reports section (see Admin section below)
- Rate limit: max 5 reports per hour per user

---

### FEATURE 6 — Profile Customization

**Editable fields (each in their own form section):**
- `display_name` (string, max 50)
- `bio` (text, max 200 characters — show live character counter)
- `github_url` (url, nullable)
- `linkedin_url` (url, nullable)
- `portfolio_url` (url, nullable)
- `city` (Morocco cities dropdown)
- `tech_stack` (multi-tag input — user types and presses Enter to add, stored as JSON array)
- `avatar` (image upload — see Bug Fix #1)
- `banner_image` (image upload, stored in `storage/app/public/banners/{user_id}/`, display as a wide header on the profile page)

**Add to users table:**
- `profile_views` (int, default 0) — increment on each unique visit, do not count self-views. Use a `profile_views` session key to prevent duplicate counts in the same session.

**Add a "Profile Completion %" widget on the user dashboard:**
- Calculate based on filled fields: avatar, bio, github_url, linkedin_url, city, tech_stack
- Show as a progress bar: "Your profile is 60% complete. Add your GitHub link to level up."

**Settings page tabs:**
1. **Profile** — all the fields above
2. **Security** — change password, active sessions list, logout all sessions
3. **Danger Zone** — delete account

**Account deletion modal:**
- Show a confirmation modal with the text: *"This action is permanent. Your account will be deactivated and inaccessible. Your data will be kept for administrative purposes only."*
- Require the user to type their username to enable the confirm button
- On confirm: trigger the soft delete logic from Bug Fix #3

---

### FEATURE 7 — Cluster Zone (Online Meetings Integration)

**Add to the events table:**
```sql
type ENUM('in_person', 'online', 'hybrid') DEFAULT 'in_person'
category ENUM('frontend', 'backend', 'devops', 'cybersecurity', 'ai_ml', 'software_dev', 'open_source', 'other')
platform ENUM('Discord', 'Zoom', 'Google Meet', 'Other') NULLABLE
meeting_url VARCHAR(500) NULLABLE
stream_description TEXT NULLABLE
```

**Logic:**
- If `type = online`: `meeting_url` is required, map location fields are hidden
- If `type = in_person`: map location is required, meeting_url is hidden
- If `type = hybrid`: both are shown and both are required

**Frontend:**
- Event cards must show a type badge (`ONLINE`, `IN PERSON`, `HYBRID`) and a category badge (`FRONTEND`, `AI/ML`, etc.)
- Filter events by type and category on the explore/events page

---

### FEATURE 8 — Chat System Improvements

**Message editing:**
- Users can edit their own messages within 15 minutes of sending
- Add `edited_at` timestamp column to messages table
- Show a small "edited" label next to the timestamp after editing

**Message deletion:**
- Soft delete: set `deleted_at` on the message
- Display as: *"This message was deleted."* in italic/muted style

**Reactions:**
- Add a `message_reactions` table: `message_id, user_id, emoji (string), created_at`
- Limit to 6 emoji: 👍 ❤️ 😂 😮 😢 🔥
- Show reaction counts below each message
- Clicking a reaction toggles it (add if not reacted, remove if already reacted)

**Reply-to:**
- Add `reply_to_id` (FK messages, nullable) column to messages table
- When replying, show the original message quoted above the reply input
- Display the quoted context above the reply in the chat thread

**Minimize chat:**
- When the user navigates away from the chat page while in a room, show a floating bubble in the bottom-right corner (fixed position, 56px circle)
- Bubble shows: room name + unread count badge
- Clicking the bubble opens a mini chat panel: 300px wide, 400px tall, fixed bottom-right
- The mini panel has the full message list + input field
- Mark messages as read when the user is actively viewing the room (either full page or mini panel)

**Safety:**
- If user A blocks user B: remove them from shared chat rooms, prevent DMs
- Reported messages get flagged in the admin Reports section automatically

---

## PRIORITY 3 — ADMIN PANEL OVERHAUL

---

### ADMIN 1 — Approval Workflow (Core Logic)

**Add `status` column to these tables:**
- `events`: `enum('pending', 'approved', 'rejected')` default `pending`
- `jobs`: same
- `posts` (community posts): same
- `marketplace_items`: same (already in marketplace spec above)

**Visibility rules:**
- Content with `status != 'approved'` is NOT visible to other users
- The content creator can see their own pending content with an **"Awaiting Admin Approval"** badge
- Rejected content shows to the creator with the rejection reason + a **"Edit & Resubmit"** button

**Workflow:**
1. User creates content → status = `pending`
2. Admin approves → status = `approved` → creator gets a notification
3. Admin rejects (with optional note) → status = `rejected` → creator gets a notification with the note
4. User edits rejected content and resubmits → status resets to `pending`
5. Users can delete their own `pending` or `rejected` content at any time from their dashboard

---

### ADMIN 2 — Dashboard Redesign

**Remove from the dashboard:**
- Leaderboard widget
- Recent Jobs widget
- Recent Events widget

**Keep/Add stat cards at the top:**
- Total Users (with delta: +X this week)
- Pending Approvals (urgent badge if > 10)
- Open Reports (urgent badge if > 5)
- Total XP Awarded
- Active Events (approved + date in the future)
- Active Jobs (approved + expiry in the future)

**Add a Unified Content Queue below the stat cards:**
- A single table showing ALL pending items across types
- Columns: Type badge, Title/Preview, Creator (username + avatar), Submitted date, Actions (Approve / Reject / Preview)
- Filters: Content Type (All / Events / Jobs / Posts / Marketplace), Date Range, Status (Pending / Approved / Rejected), Creator search
- Bulk actions: Select multiple → Approve All Selected / Reject All Selected
- Pagination: 20 items per page

---

### ADMIN 3 — User Management

**Full users table with columns:**
avatar | username | email | role | XP | status (active/deleted/banned) | join date | last active

**Actions per user row:**
- **View Profile** — opens the user's public profile in a new tab
- **Change Role** — dropdown: user / admin
- **Ban / Unban** — banned users see "Your account has been suspended. Contact support@devradar.ma" on login
- **View All Content** — filtered view of all their posts/events/jobs
- **View Audit Trail** — all logged actions for this specific user
- **Impersonate** (read-only mode) — admin can browse the site as that user to debug issues. Mark the session clearly with a "IMPERSONATING: @username" banner. No write actions allowed during impersonation.

**Deleted users:** Show with a "Deleted" badge. Full history visible. "Reactivate Account" button available.

**Banned users:** Show with a "Banned" badge. "Unban" button available.

---

### ADMIN 4 — Reports Section

**Layout:** Full table with columns:
Reporter | Reported Item (type + short preview) | Reason | Date Submitted | Status

**Status badges:** Pending (amber) / Resolved (green) / Dismissed (gray)

**Clicking a report opens a full detail modal containing:**
- Reporter info (username, avatar, account age)
- Full reported content (message text, post body, event title, etc.)
- Reason and description written by the reporter
- Action history (who did what and when)
- Admin actions: **Resolve** (with optional note), **Dismiss**, **Escalate** (mark as high priority)
- Quick action on the reported user: **Warn**, **Ban**, **Delete Content**

**Resolved reports:** Show resolver name + timestamp. Never delete resolved reports.

---

### ADMIN 5 — Audit Log

**New table:**
```sql
admin_audit_logs:
  id, admin_id (FK users), action_type (string), target_type (string),
  target_id (int), metadata (JSON), ip_address (string), created_at
```

**Log these actions:**
- User ban / unban
- Role change
- Content approve / reject (with content type + ID)
- Report resolve / dismiss
- Account deletion (admin-triggered)
- Marketplace item approve / reject
- XP award / deduction
- Impersonation start/end

**Admin Audit Log page:**
- Searchable by admin username, action type, target, date range
- Paginated, 25 per page
- Export to CSV button (optional, add as a placeholder if too complex)

---

### ADMIN 6 — XP Management (Replaces Gifts Section)

**Replace the current gifts section with an XP Management panel with 3 sub-tabs:**

**Tab 1 — Award / Deduct XP:**
- Search for a user
- Input: amount (positive = award, negative = deduct)
- Input: reason (required, string)
- Submit → logs to `xp_transactions` table → updates user's XP balance

**Tab 2 — XP Transaction History:**
- Full searchable/filterable log of all XP transactions
- Columns: user, type, amount, reason, date
- Filter by user, type (earned/spent/awarded/deducted), date range

**Tab 3 — XP Rules Configuration:**
- Store XP reward amounts in a `settings` table: `key (string), value (string), group (string)`
- Admin can edit the XP value for each action directly from this tab — no code changes needed
- Actions to configure: create_event, create_job, create_post, send_message, complete_profile, follow_user, daily_login, marketplace_sale, etc.
- Changes take effect immediately (no cache invalidation needed unless you add caching later)

---

## PRIORITY 4 — EVENT & JOB CREATION FORMS

---

### Form 1 — Event Creation (Full Overhaul)

**Fields:**

| Field | Type | Rules |
|-------|------|-------|
| event_title | text | required, max:100 |
| organizer_name | text (read-only) | auto-filled from `auth()->user()->name`, not editable |
| description | textarea | required, max:1000 |
| event_link | url | nullable, must be valid URL |
| event_type | radio | required: in_person / online / hybrid |
| category | select | required: frontend / backend / devops / cybersecurity / ai_ml / software_dev / open_source / other |
| tags | multi-tag input | nullable, stored as JSON array, user types + Enter/comma to add |
| event_date | datetime picker | required, must be in the future |
| platform | select | required if type = online or hybrid: Discord / Zoom / Google Meet / Other |
| meeting_url | url | required if type = online or hybrid |
| city | select | required if type = in_person or hybrid (Morocco cities) |
| latitude | hidden | required if type = in_person or hybrid |
| longitude | hidden | required if type = in_person or hybrid |
| location_label | hidden | required if type = in_person or hybrid |

**Map Location Picker (for in_person / hybrid events):**

1. Show a two-level dropdown: Region (12 Moroccan regions) → City (all cities in that region)
2. When a city is selected, the Leaflet map animates (`flyTo`) to that city's coordinates
3. The user clicks anywhere on the map to place a pin
4. On click: store `latitude` and `longitude` in hidden inputs
5. Immediately fire a reverse geocoding request to Nominatim (free, no API key):
   `GET https://nominatim.openstreetmap.org/reverse?lat={lat}&lon={lon}&format=json`
6. Store the returned `display_name` in the `location_label` hidden input
7. Show a draggable marker — the user can drag it to adjust
8. Show a preview text below the map:
   `"Selected: Casablanca — Quartier Maarif (33.5731, -7.5898)"`
9. If the user changes the city dropdown, reset the pin and fly to the new city

**Database columns to add to `events` table:**
```sql
city VARCHAR(100) NULLABLE
latitude DECIMAL(10, 7) NULLABLE
longitude DECIMAL(10, 7) NULLABLE
location_label VARCHAR(500) NULLABLE
type ENUM('in_person', 'online', 'hybrid') DEFAULT 'in_person'
category ENUM('frontend', 'backend', 'devops', 'cybersecurity', 'ai_ml', 'software_dev', 'open_source', 'other')
platform ENUM('Discord', 'Zoom', 'Google Meet', 'Other') NULLABLE
meeting_url VARCHAR(500) NULLABLE
stream_description TEXT NULLABLE
tags JSON NULLABLE
status ENUM('pending', 'approved', 'rejected') DEFAULT 'pending'
```

---

### Form 2 — Job Creation (Full Overhaul)

**Fields:**

| Field | Type | Rules |
|-------|------|-------|
| job_title | text | required, max:100 |
| company_name | text | required, max:100 |
| contract_type | select | required: CDI / CDD / Freelance / Internship / Part-time |
| city | select | required: Morocco cities dropdown |
| application_url | url | required, must be valid URL |
| tech_stack | multi-tag input | required, stored as JSON array |
| description | textarea | required, max:2000 |
| is_remote | toggle | boolean, default false |
| salary_range | text | nullable, e.g. "8000–12000 MAD" |
| expiry_date | date picker | nullable — job auto-hides after this date (add a scheduled command to check daily) |

**Database columns to add/ensure on `jobs` table:**
```sql
contract_type ENUM('CDI', 'CDD', 'Freelance', 'Internship', 'Part-time')
application_url VARCHAR(500)
tech_stack JSON
is_remote BOOLEAN DEFAULT false
salary_range VARCHAR(100) NULLABLE
expiry_date DATE NULLABLE
status ENUM('pending', 'approved', 'rejected') DEFAULT 'pending'
```

**Add a Laravel scheduled command** (`app/Console/Commands/ExpireJobs.php`) that runs daily and sets `status = 'expired'` on jobs past their `expiry_date`. Register it in `app/Console/Kernel.php` with `->daily()`.

---

## PRIORITY 5 — PUBLIC PAGES & LANDING PAGE

---

### Landing Page ( / )

**Route behavior:**
- Unauthenticated users → see this landing page
- Authenticated users → redirect to `/dashboard`

**Design:** Terminal/hacker aesthetic. Dark background, green/amber accents, monospace font for headings. Tailwind CSS.

**Page Sections (in order):**

**1. Hero Section**
- Animated typewriter effect: `> DevRadar_` (cursor blink)
- Tagline: *"The social hub for Moroccan developers."*
- Sub-tagline: *"Find jobs, attend events, connect with devs across Morocco."*
- Two CTA buttons: `[ Join the Network → /register ]` and `[ Explore → /explore ]`
- Optional background: subtle binary rain or grid pattern (CSS only, no heavy JS)

**2. Features Section**
- 6 feature cards in a 3x2 grid:
  - 🌐 Live Chat — *Real-time messaging with Moroccan devs*
  - 💼 Job Board — *Find local and remote tech jobs*
  - 📅 Events & Hackathons — *Join meetups and online sessions*
  - 🏆 XP Leaderboard — *Compete with the best in the community*
  - 🤖 AI Tools — *Code review, CV maker, and AI assistant*
  - 🛒 Marketplace — *Buy and sell dev resources with XP*

**3. Live Stats Bar**
- Pull live numbers from a public API endpoint: `GET /api/stats` (no auth required, cached 5 minutes)
- Stats to show: Total Developers, Events Hosted, Jobs Posted, Total XP Awarded
- Display as large animated counters

**4. Recent Events (3 cards)**
- Fetch the 3 most recent approved events
- Each card shows: title, date, city, category badge, type badge (ONLINE/IN PERSON)
- Guests can see the cards but clicking "Join" prompts a login modal

**5. Recent Jobs (3 cards)**
- Fetch the 3 most recent approved job posts
- Each card shows: job title, company, contract type badge, city, tech stack tags
- "Apply" button triggers login modal for guests

**6. Leaderboard Teaser**
- Top 5 XP leaders: rank, avatar, username, XP
- A "See Full Leaderboard →" link at the bottom

**7. Community / Social Proof Section**
- 3 developer profile cards (use real users with permission, or create a realistic placeholder)
- Reference Moroccan cities: Casablanca, Rabat, Marrakech, Agadir
- Each card: avatar, name, city, role (Frontend Dev / Backend Dev / etc.), XP, number of events attended

**8. Footer**
- Logo + tagline
- Links: About / Support / GitHub / /src_code
- Social icons: GitHub, LinkedIn, Twitter/X
- Copyright: `© 2026 DevRadar Morocco // ALL_SYSTEMS_GO // BUILD: 2026.04`

---

### Public Explore Page ( /explore )

- Accessible to unauthenticated users (add to guest routes)
- Shows: approved events, approved jobs, top users by XP, recent community posts
- Search bar: searches across all content types
- Filters: Category, City (Morocco cities), Type (event/job/post), Date range
- All interactive actions (join event, apply to job, follow user, comment) require login — show a modal: *"Join DevRadar to interact with the community. [Login] [Register]"*

---

### About Page Overhaul

**Sections:**
1. **Mission** — Why DevRadar was built: *"Built by a Moroccan developer, for Moroccan developers."*
2. **Story** — Short narrative about the project's origin
3. **Tech Stack** — Display the stack used: Laravel, React, Inertia.js, MySQL, Tailwind CSS, Leaflet.js, etc. (terminal-style tech badge list)
4. **Team** — Even if solo, show the founder card with a real avatar, GitHub link, LinkedIn
5. **Open Source** — GitHub repository link, contribution guidelines
6. **Contact** — Email: `support@devradar.ma` (placeholder)

**Design:** Use ASCII-art style horizontal dividers between sections. Keep the terminal aesthetic.

---

### Support Page Overhaul

**FAQ Section (at least 8 questions):**
1. How does the XP system work?
2. How do I create an event?
3. How do I post a job listing?
4. Why is my content showing "Awaiting Approval"?
5. How do I report a user or content?
6. How do I delete my account?
7. I found a bug. How do I report it?
8. How do I contact the admin?

**Contact Form:**
- Fields: name, email, subject (dropdown: Bug Report / Feature Request / Account Issue / Other), message (textarea)
- On submit: store in a `support_tickets` table and send an email notification to the admin
- Rate limit: 3 submissions per hour per IP

```sql
support_tickets:
  id, name, email, subject, message (text), status (enum: open, in_progress, closed),
  ip_address, created_at
```

**Platform Status:**
- Static green badge: `● OPERATIONAL`
- Note in code: *"TODO: Replace with actual status page integration (e.g. Statuspage.io)"*

---

## PRIORITY 6 — INFRASTRUCTURE, PERMISSIONS, SECURITY

---

### Route Permissions

**Guest-accessible routes (no auth middleware):**
```
GET /
GET /login
POST /login
GET /register
POST /register
GET /explore
GET /about
GET /support
POST /support/contact
GET /api/stats
```

**All other routes:** `auth` middleware required.

**Admin routes:** Custom `AdminMiddleware` that checks `auth()->user()->role === 'admin'`. Return 403 or redirect to `/dashboard` if not admin.

---

### Rate Limiting

Add to `app/Http/Kernel.php` or route definitions:

| Route | Limit |
|-------|-------|
| POST /login | 5 requests / minute / IP |
| POST /register | 3 requests / minute / IP |
| POST /chat/{room}/messages | 30 requests / minute / user |
| POST /reports | 5 requests / hour / user |
| POST /support/contact | 3 requests / hour / IP |

---

### Performance & Scalability

- Add database indexes on `user_id`, `status`, `created_at` for all new tables
- Use `->paginate(15)` on all list queries — never `->get()` on large tables
- Cache `/api/stats` for 5 minutes: `Cache::remember('public_stats', 300, fn() => [...])`
- Use Laravel queues for: sending emails, checking achievements, broadcasting events
- Add eager loading (`->with([...])`) to avoid N+1 queries on all index pages

---

### SEO & Meta Tags

**Landing page meta tags:**
```html
<title>DevRadar | The Social Hub for Moroccan Developers</title>
<meta name="description" content="Find jobs, join events, connect with developers across Morocco.">
<meta property="og:title" content="DevRadar">
<meta property="og:description" content="The social hub for Moroccan developers.">
<meta property="og:image" content="/og-image.png">
<meta property="og:url" content="https://devradar.ma">
```

**Page title pattern:** `DevRadar | {Page Name}` (implement via Inertia's `<Head>` component)

**robots.txt:**
```
User-agent: *
Allow: /
Allow: /explore
Allow: /about
Allow: /support
Disallow: /admin
Disallow: /dashboard
Disallow: /chat
Disallow: /profile/settings
```

---

## SUMMARY CHECKLIST

### Bugs
- [ ] Profile picture upload — isolated form + FileReader preview
- [ ] Real-time chat — Laravel Echo + Pusher or polling fallback
- [ ] Account deletion — soft delete + status block + admin visibility

### New Features
- [ ] Achievements system + 20 seeds + profile display + toast
- [ ] Leaderboard overhaul — 3 tabs + personal rank widget
- [ ] Marketplace — items, purchases, XP transactions
- [ ] Notifications center — bell icon + dropdown + read logic
- [ ] Blocking + reporting system
- [ ] Full profile customization + completion %
- [ ] Cluster zone — event type + category + meeting_url
- [ ] Chat improvements — edit, delete, reactions, reply, minimize

### Admin Panel
- [ ] Approval workflow across all content types
- [ ] Dashboard redesign — unified queue + smart filters
- [ ] User management — ban, impersonate, reactivate
- [ ] Reports section — full detail modal + resolution actions
- [ ] Audit log table + searchable log page
- [ ] XP management — award/deduct + rules config

### Forms
- [ ] Event creation — full overhaul + map picker + Nominatim geocoding
- [ ] Job creation — full overhaul + expiry command

### Public Pages
- [ ] Landing page — all 8 sections + typewriter animation
- [ ] Explore page — public read-only + login modal
- [ ] About page — mission, story, stack, team
- [ ] Support page — FAQ + contact form + support_tickets table

### Infrastructure
- [ ] Guest/auth/admin route groups + AdminMiddleware
- [ ] Rate limiting on key routes
- [ ] DB indexes on all new tables
- [ ] Pagination everywhere
- [ ] Cache /api/stats
- [ ] Queue setup for emails + achievements + broadcasts
- [ ] SEO meta tags + robots.txt

---

*DevRadar — Built in Morocco, for Morocco. ALL_SYSTEMS_GO.*