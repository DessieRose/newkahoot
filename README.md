# newkahoot

A real-time quiz.

newKahoot is a competitive, multiplayer trivia platform. Built with a Node.js/Socket.io backbone, it features a seamless "no-refresh" experience, an administrative control center, and a dynamic leaderboard.

## ✨ Features

- Real-time Interaction: Powered by WebSockets for instant question delivery and scoring.

- Smart Lobby: Intelligent nickname validation with feedback for taken names.

- Live Admin Dashboard: Full control over game starts, resets, and live status monitoring.

- Dynamic Leaderboard: Automated winner calculation and podium display once all questions are answered.

- Optimized Performance: Utilizes eiows for high-efficiency WebSocket handling.


## 🛠️ Tech 

**Category:**       **Technology:** 

Backend         Node.js & Express
Real-time       Socket.io & eiows
Frontend        Vanilla JS, HTML5 & CSS3
Session Mgmt    Express-Session
Logic           ES Modules (ESM)


## 🚀 Getting Started

**Prerequisites**
- Node.js (v18 or higher recommended)

- npm (installed with Node)

**Installation**

1. **Clone the repository:**

```Bash
git clone https://github.com/amin/newkahoot.git
```

2. **Install dependencies:**

```Bash
npm install
```

3. **Start the arena:**

```Bash
npm run dev
```

4. **Join the game:** Open `http://localhost:3000` in your browser. To access the admin panel, navigate to `http://localhost:3000/admin`.

## 📁 Project Structure
The project is organized into distinct modules for routing, real-time logic and specific views:

```Plaintext
├── routes/
│   └── adminRouter.js      # Handles admin authentication & session security
│
├── views/                  # Frontend assets and templates
│   │
│   ├── admin/              # Admin Suite
│   │   ├── admin.css       # Dashboard styling
│   │   ├── admin.js        # Admin-side WebSocket logic
│   │   ├── dashboard.html  # Live game control panel
│   │   ├── login.css       # Secure login interface styles
│   │   └── login.html      # Administrator entry point
│   │
│   ├── game/               
│   │   ├── game.css        # Game design (lobby, game & winner)
│   │   ├── game.html       # Active gameplay screen
│   │   └── game.js         # Countdown timers & answer submission
│   │
│   ├── index.css           # Landing page aesthetic
│   └── index.html          # Landing page & Nickname entry
│
├── websockets/             # The Real-Time Engine
│   ├── data/
│   │   └── questions.js    # Source of questions, answers & time limits
│   │
│   ├── models/
│   │   ├── Game.js         # Core game state & leaderboard logic
│   │   └── Player.js       # Player profiles and scoring tracking
│   └── index.js            # Main Socket.io
│
└── index.js                # Server entry point & Express configuration
```

## 🎨 Aesthetic Guidelines
The project uses a unified design system defined in `:root`:

- Primary Background: #1a1a2e
- Secondary Surface: #16213e
- Accent Glow: #e94560
- Accent color: #0f3460


## 🛠️ Upcoming Features

[ ] Fastest Finger Bonus: Multiplier points based on response time.

[ ] Audio Integration: music to emers the player