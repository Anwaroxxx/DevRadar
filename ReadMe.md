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
![PHP](https://img.shields.io/badge/PHP-777BB4?style=for-the-badge&logo=php&logoColor=white)
![Groq](https://img.shields.io/badge/Groq_AI-F55036?style=for-the-badge&logo=groq&logoColor=white)

</div>

---

**DevRadar Morocco** is a full-stack platform for the Moroccan developer community. It provides:

- **Interactive map** of Morocco showing tech events, jobs, communities, coding schools, and hackathons
- **Events & job board** with filtering, saving, and attendance tracking
- **Developer profiles** with XP balance, badges, skills, and activity history
- **Social system** — follow users, send messages, discover the community
- **XP economy** — earn XP by contributing, spend it in the marketplace on AI tools and rewards
- **AI tools** via Groq — chatbot, code reviewer, resume builder, post generator

---

## Stack

```
Frontend  →  React + Vite + TailwindCSS + Framer Motion + React Leaflet
Backend   →  Laravel REST API + Sanctum Auth
Database  →  MySQL
AI        →  Groq API
```

---

## Getting Started

```bash
# Backend
composer install && cp .env.example .env
php artisan key:generate && php artisan migrate --seed
php artisan storage:link && php artisan serve

# Frontend
npm install && cp .env.example .env && npm run dev
```

---

<div align="center">
Built by <a href="https://github.com/Anwaroxxx">Anwar</a> — Casablanca, Morocco
</div>
