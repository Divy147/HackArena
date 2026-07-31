# 🛡️ HackArena - AI-Powered Cybersecurity Learning Platform

[![License: MIT](https://img.shields.io/badge/License-MIT-cyan.svg)](LICENSE)
[![React](https://img.shields.io/badge/React-18-blue.svg)](https://reactjs.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-v4-06B6D4.svg)](https://tailwindcss.com/)
[![Google Gemini](https://img.shields.io/badge/Google_Gemini-API-green.svg)](https://ai.google.dev/)
[![Firebase](https://img.shields.io/badge/Firebase-Auth%20%26%20Firestore-orange.svg)](https://firebase.google.com/)

**HackArena** is a modern, full-stack, AI-powered cybersecurity learning platform engineered with a dark cyberpunk aesthetic, interactive vulnerability sandboxes, Google Gemini AI mentorship, gamified XP progression, and automated certificate generation.

---

## ✨ Key Features

- **🎨 Dark Cyberpunk UI System**: Obsidian black background (`#030712`), neon blue (`#00f0ff`) and emerald green (`#00ff66`) accents, glassmorphic backdrop panels (`glass-panel`), scanline CRT overlay, and smooth micro-animations.
- **📄 8 Core Pages**:
  1. **Landing Page**: Hero section (*"Learn. Hack. Defend."*), live SQLi terminal preview, features grid, testimonials, and CTA.
  2. **Login / Signup**: Firebase Authentication (Email/Password), password reset modal, and **1-Click Instant Demo Login**.
  3. **Dashboard**: User rank banner, XP & Level progress bar, completed lab matrix, badge showcase, recent activity stream, and quick lab launchers.
  4. **Interactive Labs**:
     - **SQL Injection (Beginner)**: Live vulnerable login form & SQL query log inspector. Flag: `FLAG{sql_master}` (+250 XP).
     - **Cross-Site Scripting (XSS) (Beginner)**: Live public comment wall & unescaped DOM reflector. Flag: `FLAG{xss_hunter}` (+250 XP).
     - **Broken Authentication (Intermediate)**: Live JWT session token claim editor (`role: "user"` → `"admin"`). Flag: `FLAG{auth_breaker}` (+500 XP).
  5. **AI CyberSentinel Mentor**: Google Gemini API chatbot (`gemini-2.5-flash`) providing non-spoiling hints, concept explanations, and secure coding remediation.
  6. **Global Leaderboard**: Podium ranks (Gold, Silver, Bronze), real-time search, and current user position highlighting.
  7. **User Profile**: Avatar selector, completed lab checklist, unlocked badges gallery, and certificate eligibility tracker.
  8. **Certificate Generator**: Dynamic HTML5 canvas generator with recipient name, verified ID, issue date, official seal, and 1-click PNG download.

---

## 🏗️ Project Folder Structure

```
hackarena/
├── README.md                  # Project documentation & GitHub guide
├── .gitignore                 # Git ignore configuration
├── package.json               # Frontend dependencies & scripts
├── vite.config.js             # Vite configuration with Tailwind CSS
├── index.html                 # Main HTML entrypoint & SEO metadata
├── .env.example               # Frontend environment variables example
├── server/                    # Node.js + Express Backend
│   ├── index.js               # Express API endpoints (/api/ai/mentor, /api/labs/submit)
│   ├── services/
│   │   └── gemini.js          # Google Gemini AI service & fallback handler
│   ├── .env.example           # Backend environment variables
│   └── package.json           # Backend package configuration
└── src/                       # React Frontend Source
    ├── components/            # Reusable Cyberpunk UI components
    │   ├── Navbar.jsx         # Responsive glassmorphism navigation header
    │   ├── Footer.jsx         # Cyberpunk system status footer
    │   ├── GlassCard.jsx      # Reusable glassmorphic card container
    │   ├── BadgeModal.jsx     # Confetti celebration modal
    │   └── AIMentorWidget.jsx # Floating AI Assistant bubble
    ├── pages/                 # Main Application Pages
    │   ├── LandingPage.jsx
    │   ├── AuthPage.jsx
    │   ├── DashboardPage.jsx
    │   ├── LabsPage.jsx
    │   ├── AIMentorPage.jsx
    │   ├── LeaderboardPage.jsx
    │   ├── ProfilePage.jsx
    │   └── CertificatePage.jsx
    ├── context/               # Authentication & State Management
    │   └── AuthContext.jsx    # Firebase Auth & Local demo state sync
    ├── data/                  # Lab metadata, hints, flags & sample leaderboard
    │   └── labsData.js
    ├── firebase/              # Firebase Client SDK setup
    │   └── config.js
    ├── index.css              # Global styles, Tailwind directives & glowing utilities
    ├── App.jsx                # Main router & layout state
    └── main.jsx               # React DOM entrypoint
```

---

## ⚡ Getting Started (Local Setup)

### Prerequisites
- Node.js (v18+ recommended)
- npm or yarn

### Installation Steps

1. **Clone the repository**:
   ```bash
   git clone https://github.com/YOUR_USERNAME/hackarena.git
   cd hackarena
   ```

2. **Install Frontend Dependencies**:
   ```bash
   npm install
   ```

3. **Install Backend Dependencies**:
   ```bash
   cd server
   npm install
   cd ..
   ```

4. **Environment Configuration**:
   - Copy `.env.example` to `.env` in the root folder for frontend Firebase keys.
   - Copy `server/.env.example` to `server/.env` for backend Google Gemini API key:
     ```env
     PORT=5000
     GEMINI_API_KEY=your_google_gemini_api_key
     ```

5. **Run Development Servers**:
   - Launch Backend Server (Port 5000):
     ```bash
     npm --prefix server run dev
     ```
   - Launch Frontend Vite Server (Port 3000):
     ```bash
     npm run dev
     ```
   - Open your browser at `http://localhost:3000`.

---

## 📤 How to Push to GitHub

If you want to host this project on your GitHub profile:

1. **Initialize Git in the project root**:
   ```bash
   git init
   ```

2. **Add and Commit all files**:
   ```bash
   git add .
   git commit -m "Initial commit: HackArena cybersecurity platform MVP"
   ```

3. **Link to your GitHub Repository**:
   - Create a new repository on [GitHub](https://github.com/new) named `hackarena`.
   - Run the remote command:
     ```bash
     git remote add origin https://github.com/YOUR_USERNAME/hackarena.git
     git branch -M main
     git push -u origin main
     ```

---

## 📄 License
This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
