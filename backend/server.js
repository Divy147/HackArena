/**
 * HackArena Backend Server Entry Point
 */
const dotenv = require('dotenv');
dotenv.config();

const app = require('./app');
const logger = require('./utils/logger');

const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () => {
  logger.info(`===================================================`);
  logger.info(`🛡️  HackArena Cybersecurity Backend is Running!`);
  logger.info(`⚡ Server listening on port: ${PORT}`);
  logger.info(`🌐 Environment: ${process.env.NODE_ENV || 'development'}`);
  logger.info(`🔗 Base URL: http://localhost:${PORT}/api`);
  logger.info(`===================================================`);
});

// Unhandled Rejections & Exceptions Safeguard
process.on('unhandledRejection', (err) => {
  logger.error('UNHANDLED REJECTION! Shutting down server gracefully...', err);
  server.close(() => {
    process.exit(1);
  });
});

process.on('uncaughtException', (err) => {
  logger.error('UNCAUGHT EXCEPTION! Shutting down server gracefully...', err);
  process.exit(1);
});
