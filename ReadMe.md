<div align="center">

```
██████╗ ███████╗██╗   ██╗██████╗  █████╗ ██████╗  █████╗ ██████╗
██╔══██╗██╔════╝██║   ██║██╔══██╗██╔══██╗██╔══██╗██╔══██╗██╔══██╗
██║  ██║█████╗  ██║   ██║██████╔╝███████║██║  ██║███████║██████╔╝
██║  ██║██╔══╝  ╚██╗ ██╔╝██╔══██╗██╔══██║██║  ██║██╔══██║██╔══██╗
██████╔╝███████╗ ╚████╔╝ ██║  ██║██║  ██║██████╔╝██║  ██║██║  ██║
╚═════╝ ╚══════╝  ╚═══╝  ╚═╝  ╚═╝╚═╝  ╚═╝╚═════╝ ╚═╝  ╚═╝╚═╝  ╚═╝
```

### Morocco's Developer Ecosystem — Mapped, Gamified, AI-Powered.

![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Vite](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-0F172A?style=for-the-badge&logo=tailwind-css&logoColor=38BDF8)
![Framer](https://img.shields.io/badge/Framer_Motion-0055FF?style=for-the-badge&logo=framer&logoColor=white)
![Laravel](https://img.shields.io/badge/Laravel-FF2D20?style=for-the-badge&logo=laravel&logoColor=white)
![MySQL](https://img.shields.io/badge/MySQL-00758F?style=for-the-badge&logo=mysql&logoColor=white)
![Leaflet](https://img.shields.io/badge/Leaflet-199900?style=for-the-badge&logo=leaflet&logoColor=white)
![Axios](https://img.shields.io/badge/Axios-5A29E4?style=for-the-badge&logo=axios&logoColor=white)
![PHP](https://img.shields.io/badge/PHP-777BB4?style=for-the-badge&logo=php&logoColor=white)
![Groq](https://img.shields.io/badge/Groq_AI-F55036?style=for-the-badge&logo=groq&logoColor=white)

</div>

---

## Overview

**DevRadar Morocco** is a full-stack AI-powered developer platform built for the Moroccan tech community. It combines an interactive city map, a tech event board, job listings, developer profiles, a social system, and an XP-based economy — all wrapped in a dark hacker aesthetic with ASCII animations and glassmorphism UI.

---

## Features

### Interactive Developer Map
An interactive Leaflet map of Morocco lets users explore and contribute developer activity.

- Browse markers by category: Events, Jobs, Communities, Coding Schools, Hackathons, Coworking Spaces
- Click any marker to view full details
- Submit events by clicking directly on the map — marker appears instantly after

### Tech Events
- Discover upcoming developer events across Moroccan cities
- Save, share, and mark attendance
- Event cards show title, city, date, tech tags, organizer, and attendee count

### Job Board
- Browse internships and junior dev positions
- Filter by technology, city, or remote/on-site

### Developer Communities
- Explore Discord servers, Meetup groups, and local dev clubs
- Follow communities, view member counts and platform info

### Developer Profiles
- Avatar, bio, skills, GitHub link, city, XP balance
- Earned badges, saved events, and full activity history
- Follow/message any user from their profile

### Social & Chat System
- Real-time messaging between users
- Premium hacker-themed chat UI
- Follow system with followers/following tracking
- User search for social discovery

### XP Economy & Marketplace

| Action | XP |
|---|---|
| Daily login | +5 |
| Save an event | +10 |
| Join a community | +20 |
| Submit an event | +30 |
| Share an event | +40 |
| Post a job | +50 |

XP can be redeemed in the **Marketplace** for AI subscriptions, premium tools, and platform rewards.

### AI Tools (Groq-Powered)

| Tool | Cost |
|---|---|
| Developer Chatbot | 10 XP |
| Code Reviewer | 30 XP |
| Resume Builder | 40 XP |
| Event Assistant | — |
| Post Generator | — |

AI access is managed via subscription (`ai_access_until`) — no per-use deductions after unlock.

### Leaderboard
- Top Contributors, Event Creators, Community Builders
- Ranked by XP and platform activity

### Dev Activity Feed
- Live feed of new events, jobs, trending tech, and community updates

---

## Architecture

```
┌─────────────────────────────────────────┐
│              React (Vite)               │
│  UI · Routing · Map · AI Chat · Auth   │
└───────────────────┬─────────────────────┘
                    │ Axios (REST)
┌───────────────────▼─────────────────────┐
│             Laravel REST API            │
│  Auth · CRUD · XP Logic · AI Routing   │
└───────────────────┬─────────────────────┘
                    │
        ┌───────────▼───────────┐
        │     MySQL Database    │
        └───────────────────────┘
```

### Database Relationships

**One-to-Many**
- User → Events, Jobs, Communities
- Company → Jobs

**Many-to-Many** (with pivot tables)
- Users ↔ Events (`event_user`)
- Users ↔ Communities (`community_user`)
- Users ↔ Skills (`skill_user`)
- Events ↔ Tags (`event_tag`)
- Users ↔ Followers (`follows`)

---

## Development Phases

| Phase | Status | Scope |
|---|---|---|
| 1 — Planning & Strategy | Done | XP logic, profile security, social architecture |
| 2 — Core Refactor | Done | Marketplace, XP subscriptions, avatar & bio, account management |
| 3 — Content Hub | Done | Activity dashboard, saved modules, user search |
| 4 — Social Shell | Done | Messaging system, AI chat SPA, chat UI |
| 5 — Aesthetic Polish | Done | ASCII waterfall, dark-lock, tech icons |
| 6 — Performance | Done | `requestAnimationFrame`, frame throttling, canvas optimization |
| 7 — Social Mastery | In Progress | Follow system, profile actions, hacker chat overhaul |
| 8 — Verification & Launch | Planned | End-to-end testing, production build |

---

## Getting Started

### Backend
```bash
git clone https://github.com/Anwaroxxx/devradar-morocco
cd backend
composer install
cp .env.example .env
php artisan key:generate
php artisan migrate --seed
php artisan storage:link
php artisan serve
```

### Frontend
```bash
cd frontend
npm install
cp .env.example .env
npm run dev
```

---

## Environment Variables

```env
# Backend
DB_DATABASE=devradar
DB_USERNAME=root
DB_PASSWORD=

GROQ_API_KEY=your_groq_key

# Frontend
VITE_API_URL=http://localhost:8000
```

---

<div align="center">

Built by [Anwar](https://github.com/Anwaroxxx) — Casablanca, Morocco

![GitHub](https://img.shields.io/badge/GitHub-181717?style=flat-square&logo=github&logoColor=white)

</div>