# DevRadar Morocco 🇲🇦

![DevRadar Header](https://via.placeholder.com/1200x400/09090b/4ade80?text=DevRadar+Morocco)

**DevRadar Morocco** is a premium, feature-rich social hub and marketplace specifically tailored for the Moroccan developer community. Built to connect, empower, and support tech professionals, it features a unique "Hacker" aesthetic, integrated AI assistance, and robust community tools.

## 🚀 Features

* **Community Hub**: Follow, post, and engage with other developers in the Moroccan tech scene.
* **AI Shell Terminal**: Integrated AI tools powered by Groq (LLaMA 3.3) for coding assistance, code reviews, and automatic CV/Resume generation directly via a hacker-styled terminal UI.
* **Dynamic Real-Time Chat**: Live peer-to-peer messaging system.
* **Job Listings & Events**: Discover local tech events, hackathons, and job opportunities across Moroccan cities.
* **Marketplace**: Gamified ecosystem where users can spend earned XP on profile upgrades, premium badges, and AI access extensions.
* **Premium Hacker Aesthetic**: High-quality dark mode design with scanlines, monospace typographies, and dynamic UI elements built with React, Tailwind CSS, and Framer Motion.

## 💻 Tech Stack

* **Backend:** [Laravel](https://laravel.com/) (PHP) 
* **Frontend:** [React](https://reactjs.org/) with [Inertia.js](https://inertiajs.com/)
* **Styling:** [Tailwind CSS](https://tailwindcss.com/) + custom CSS utility animations
* **Database:** SQLite / MySQL / PostgreSQL (Configurable via `.env`)
* **AI Integration:** [Groq API](https://groq.com/)

## 🛠️ Installation & Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/DevRadar_Morocco.git
   cd DevRadar_Morocco
   ```

2. **Install PHP and Node dependencies**
   ```bash
   composer install
   npm install
   ```

3. **Environment Setup**
   ```bash
   cp .env.example .env
   php artisan key:generate
   ```
   *Make sure to configure your database settings in the `.env` file.*
   *You must also provide your Groq API key in `.env` for the AI tools to function:*
   ```env
   GROQ_API_KEY=your_groq_api_key_here
   ```

4. **Run Migrations & Seeders**
   ```bash
   php artisan migrate --seed
   ```

5. **Start the Development Servers**
   In terminal 1:
   ```bash
   php artisan serve
   ```
   In terminal 2:
   ```bash
   npm run dev
   ```

## 📜 License

This project is open-source and available under the [MIT License](LICENSE).
