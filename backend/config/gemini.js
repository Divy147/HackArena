/**
 * Google Gemini API Client Configuration
 */
const { GoogleGenerativeAI } = require('@google/generative-ai');
const dotenv = require('dotenv');
const logger = require('../utils/logger');

dotenv.config();

const apiKey = process.env.GEMINI_API_KEY;
let aiClient = null;
let isGeminiAvailable = false;

if (apiKey && apiKey.trim() !== '' && apiKey !== 'your_google_gemini_api_key_here') {
  try {
    aiClient = new GoogleGenerativeAI(apiKey);
    isGeminiAvailable = true;
    logger.info('Google Gemini API client initialized successfully.');
  } catch (error) {
    logger.error('Failed to initialize Google Gemini API:', error.message);
  }
} else {
  logger.warn('GEMINI_API_KEY is missing or default in .env. AI mentor will operate with intelligent cybersecurity fallback responses.');
}

module.exports = {
  aiClient,
  isGeminiAvailable
};
