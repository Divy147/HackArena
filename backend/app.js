/**
 * Express Application Setup
 */
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const dotenv = require('dotenv');

dotenv.config();

const apiRoutes = require('./routes');
const { globalRateLimiter } = require('./middleware/rateLimiter');
const { notFoundHandler, errorHandler } = require('./middleware/errorMiddleware');

const app = express();

// Security HTTP headers
app.use(helmet());

// CORS configuration
const allowedOrigins = process.env.CLIENT_URL ? [process.env.CLIENT_URL, 'http://localhost:5173', 'http://localhost:3000'] : '*';
app.use(cors({
  origin: allowedOrigins,
  credentials: true
}));

// Body Parsers
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Global Rate Limiting
app.use('/api', globalRateLimiter);

// Mount API Routes
app.use('/api', apiRoutes);

// Root Welcome Endpoint
app.get('/', (req, res) => {
  res.status(200).json({
    message: 'Welcome to HackArena Production Backend API 🛡️⚡',
    version: '1.0.0',
    documentation: '/api/health',
    endpoints: {
      auth: '/api/auth',
      user: '/api/user',
      labs: '/api/labs',
      leaderboard: '/api/leaderboard',
      badges: '/api/badges',
      certificate: '/api/certificate',
      ai: '/api/ai'
    }
  });
});

// 404 & Error Handling
app.use(notFoundHandler);
app.use(errorHandler);

module.exports = app;
