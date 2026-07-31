/**
 * Firebase Admin SDK & Firestore database configuration
 * Supports both live Firestore and in-memory fallback for local development/testing.
 */
const admin = require('firebase-admin');
const dotenv = require('dotenv');
const logger = require('../utils/logger');

dotenv.config();

let db = null;
let isLocalFallback = false;

const projectId = process.env.FIREBASE_PROJECT_ID;
const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
let privateKey = process.env.FIREBASE_PRIVATE_KEY;

if (privateKey) {
  // Replace escaped newlines if passed as string
  privateKey = privateKey.replace(/\\n/g, '\n');
}

if (projectId && clientEmail && privateKey) {
  try {
    if (!admin.apps.length) {
      admin.initializeApp({
        credential: admin.credential.cert({
          projectId,
          clientEmail,
          privateKey
        }),
        databaseURL: process.env.FIREBASE_DATABASE_URL
      });
    }
    db = admin.firestore();
    logger.info('Firebase Admin SDK initialized successfully with Firestore database.');
  } catch (error) {
    logger.error('Failed to initialize Firebase Admin SDK:', error.message);
    isLocalFallback = true;
  }
} else {
  logger.warn('Firebase credentials not complete in .env. Falling back to local transactional database mode for out-of-the-box local operation.');
  isLocalFallback = true;
}

module.exports = {
  admin,
  db,
  isLocalFallback
};
