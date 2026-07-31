# 🛡️ HackArena Backend - Production-Ready AI-Powered Cybersecurity Learning Platform

HackArena is a high-performance, production-ready Express.js RESTful API designed to power an interactive cybersecurity learning platform and CTF (Capture The Flag) arena. Features include user authentication with JWT, dual-mode Firebase Firestore database layer, Google Gemini AI Mentor integration, simulated lab challenges, dynamic badge unlocking, real-time leaderboard rankings, and downloadable completion certificates.

---

## 📁 Folder Structure (MVC Architecture)

```
backend/
├── config/
│   ├── firebase.js          # Firebase Admin SDK & Firestore database configuration
│   ├── gemini.js            # Google Gemini AI client configuration
│   └── jwt.js               # JWT secret and token expiration settings
├── controllers/
│   ├── authController.js    # User Signup & Login logic
│   ├── userController.js    # Profile retrieval and updating
│   ├── labController.js     # CTF Lab catalog & flag verification
│   ├── leaderboardController.js # Global user leaderboard rankings
│   ├── badgeController.js   # User badges list & unlock statuses
│   ├── certificateController.js # Certificate generation & PDF download
│   └── aiController.js      # Gemini AI Mentor questions & lab hints
├── middleware/
│   ├── authMiddleware.js    # JWT payload verification guard
│   ├── errorMiddleware.js   # 404 router & global error handler
│   ├── rateLimiter.js       # Express rate limiters (Global, Auth, AI)
│   └── validationMiddleware.js # Input sanitizers & validators
├── models/
│   ├── userModel.js         # User schema, level calculation logic
│   ├── progressModel.js     # Lab progress schema
│   ├── leaderboardModel.js  # Leaderboard item schema
│   ├── badgeModel.js        # Badge schema definition
│   └── labModel.js          # Lab schema definition
├── routes/
│   ├── authRoutes.js        # POST /api/auth/signup, POST /api/auth/login
│   ├── userRoutes.js        # GET /api/user/profile, PUT /api/user/update
│   ├── labRoutes.js         # GET /api/labs, GET /api/labs/:id, POST /api/labs/submit-flag
│   ├── leaderboardRoutes.js # GET /api/leaderboard
│   ├── badgeRoutes.js       # GET /api/badges
│   ├── certificateRoutes.js # GET /api/certificate
│   ├── aiRoutes.js          # POST /api/ai/chat
│   └── index.js             # Master Express Router
├── services/
│   ├── firebaseService.js   # Firestore abstraction layer with memory fallback
│   ├── geminiService.js     # Gemini API integration & post-challenge AI explanations
│   ├── labService.js        # Lab flag verification, XP calculation
│   ├── badgeService.js      # Automatic badge evaluation rules
│   └── certificateService.js # Certificate generation & PDF rendering
├── utils/
│   ├── apiResponse.js       # Standardized API JSON response formatter
│   ├── logger.js            # Structured logger utility
│   └── seedData.js          # Default labs and badges dataset
├── app.js                   # Express application setup
├── server.js                # Server entry point
├── test-backend.js          # Automated end-to-end integration test runner
├── package.json             # NPM dependencies & scripts
└── .env.example             # Environment variables blueprint
```

---

## ⚡ Quick Start & Installation Guide

### Prerequisites
- Node.js (v18.x or higher)
- npm or yarn

### 1. Install Dependencies
Navigate into the backend directory and run:
```bash
npm install
```

### 2. Configure Environment Variables
Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```

Edit `.env` to configure your keys (or use defaults for local offline mode):
```env
PORT=5000
NODE_ENV=development
JWT_SECRET=your_super_secret_jwt_key_2026

# Optional: Google Gemini API Key (https://aistudio.google.com/)
GEMINI_API_KEY=your_gemini_api_key

# Optional: Firebase Service Account Credentials
FIREBASE_PROJECT_ID=your_firebase_project_id
FIREBASE_CLIENT_EMAIL=your_client_email
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n..."
```

> 💡 **Zero-Config Local Mode**: If Firebase credentials or Gemini API keys are omitted, the backend automatically runs in **Local Fallback Mode**, utilizing an in-memory database and curated cybersecurity mentor responses so you can build and test immediately out-of-the-box!

### 3. Run the Server
- **Production Mode**:
  ```bash
  npm start
  ```
- **Development Watch Mode**:
  ```bash
  npm run dev
  ```
- **Run Automated Integration Tests**:
  ```bash
  npm test
  ```

---

## 📡 Complete REST API Documentation

### 1. Authentication Endpoints (`/api/auth`)

#### `POST /api/auth/signup`
Registers a new user account.
- **Request Body**:
  ```json
  {
    "name": "Alice Cyber",
    "email": "alice@hackarena.io",
    "password": "Password123!"
  }
  ```
- **Response (201 Created)**:
  ```json
  {
    "success": true,
    "message": "User registration successful.",
    "data": {
      "token": "eyJhbGciOiJIUzI1Ni...",
      "user": {
        "uid": "usr_1772412891_x9a2",
        "name": "Alice Cyber",
        "email": "alice@hackarena.io",
        "xp": 0,
        "level": 1,
        "completedLabs": [],
        "badges": [],
        "createdAt": "2026-07-30T21:56:00.000Z"
      }
    }
  }
  ```

#### `POST /api/auth/login`
Authenticates existing credentials.
- **Request Body**:
  ```json
  {
    "email": "alice@hackarena.io",
    "password": "Password123!"
  }
  ```
- **Response (200 OK)**:
  ```json
  {
    "success": true,
    "message": "Login successful.",
    "data": {
      "token": "eyJhbGciOiJIUzI1Ni...",
      "user": { ... }
    }
  }
  ```

---

### 2. User Profile Endpoints (`/api/user`)

#### `GET /api/user/profile` (Protected)
Headers: `Authorization: Bearer <token>`
- **Response (200 OK)**:
  ```json
  {
    "success": true,
    "message": "User profile retrieved successfully.",
    "data": {
      "uid": "usr_1772412891_x9a2",
      "name": "Alice Cyber",
      "email": "alice@hackarena.io",
      "xp": 350,
      "level": 4,
      "completedLabs": ["sql-injection", "xss", "broken-authentication"],
      "badges": ["cyber-rookie", "sql-beginner", "xss-hunter", "auth-expert"],
      "rank": 1
    }
  }
  ```

#### `PUT /api/user/update` (Protected)
Headers: `Authorization: Bearer <token>`
- **Request Body**:
  ```json
  {
    "name": "Alice Elite Hacker"
  }
  ```

---

### 3. CTF Lab Endpoints (`/api/labs`)

#### `GET /api/labs`
Returns list of available beginner labs.
- **Response (200 OK)**:
  ```json
  {
    "success": true,
    "data": [
      {
        "id": "sql-injection",
        "title": "SQL Injection",
        "category": "Web Security",
        "difficulty": "Beginner",
        "xp": 100
      },
      {
        "id": "xss",
        "title": "Cross-Site Scripting (XSS)",
        "category": "Web Security",
        "difficulty": "Beginner",
        "xp": 100
      },
      {
        "id": "broken-authentication",
        "title": "Broken Authentication",
        "category": "Identity & Access",
        "difficulty": "Intermediate",
        "xp": 150
      }
    ]
  }
  ```

#### `POST /api/labs/submit-flag` (Protected)
Headers: `Authorization: Bearer <token>`
- **Request Body**:
  ```json
  {
    "labId": "sql-injection",
    "flag": "FLAG{sql_master}"
  }
  ```
- **Response (200 OK)**:
  ```json
  {
    "success": true,
    "message": "Flag Verified! Excellent work! You earned +100 XP!",
    "data": {
      "labId": "sql-injection",
      "xpGained": 100,
      "totalXp": 100,
      "level": 2,
      "newBadges": [
        { "id": "cyber-rookie", "name": "Cyber Rookie", "icon": "🛡️" },
        { "id": "sql-beginner", "name": "SQL Beginner", "icon": "💉" }
      ],
      "aiExplanation": {
        "source": "Gemini AI",
        "explanation": "### 🛡️ Post-Challenge Educational Breakdown: SQL Injection\n..."
      }
    }
  }
  ```

---

### 4. AI Mentor Endpoints (`/api/ai`)

#### `POST /api/ai/chat` (Protected)
Headers: `Authorization: Bearer <token>`
- **Request Body**:
  ```json
  {
    "prompt": "How do I test for SQL injection without breaking the database?",
    "labId": "sql-injection"
  }
  ```
- **Response (200 OK)**:
  ```json
  {
    "success": true,
    "data": {
      "reply": "To test safely, use single quotes `'` or non-destructive boolean payloads like `' AND '1'='1`. Never attempt drop table commands in production environments!"
    }
  }
  ```

---

### 5. Leaderboard & Badges Endpoints

#### `GET /api/leaderboard`
- Returns global XP rankings.

#### `GET /api/badges` (Protected)
- Returns catalog of badges and current user's unlock statuses (`unlocked: true/false`).

---

### 6. Certificate Endpoint (`/api/certificate`)

#### `GET /api/certificate` (Protected)
- Evaluates if user completed all 3 beginner labs.
- To download PDF directly: pass `?download=true` query parameter.
- **Response (JSON)**:
  ```json
  {
    "success": true,
    "data": {
      "eligible": true,
      "certificateId": "HA-CERT-USR_1772-L9X",
      "recipientName": "ALICE CYBER",
      "courseName": "HackArena Beginner CTF & Vulnerability Exploitation Program",
      "downloadUrl": "/api/certificate?download=true"
    }
  }
  ```

---

## 🔒 Security Implementations

- **Helmet.js**: Sets security HTTP headers (HSTS, Content-Security-Policy, X-Frame-Options, X-Content-Type-Options).
- **CORS Configuration**: Restricts API invocation to authorized domain origins.
- **Express Rate Limiting**: Protects authentication (`/auth/*`) and AI endpoints against brute force and DDoS attempts.
- **Strict Input Validation**: Uses `express-validator` to sanitize input strings and prevent parameter tampering.
- **Flag Safety**: System prompt and AI output sanitization filters strictly prevent Gemini from outputting flag strings.

---

## 📜 License & Author

- **Author**: HackArena Development Team
- **License**: MIT
