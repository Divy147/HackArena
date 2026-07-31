/**
 * Auth Controller - User Registration & Login
 */
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const jwtConfig = require('../config/jwt');
const FirebaseService = require('../services/firebaseService');
const UserModel = require('../models/userModel');
const ApiResponse = require('../utils/apiResponse');
const logger = require('../utils/logger');

class AuthController {
  /**
   * Register a new user
   * POST /api/auth/signup
   */
  static async signup(req, res, next) {
    try {
      const { name, email, password } = req.body;

      // Check if user already exists
      const existingUser = await FirebaseService.getUserByEmail(email);
      if (existingUser) {
        return ApiResponse.error(res, 'User with this email already exists.', 400);
      }

      // Hash password
      const salt = await bcrypt.genSalt(10);
      const passwordHash = await bcrypt.hash(password, salt);

      // Generate unique UID
      const uid = 'usr_' + Date.now() + '_' + Math.random().toString(36).substr(2, 5);

      const newUserSchema = UserModel.createSchema({
        uid,
        name,
        email,
        passwordHash,
        xp: 0,
        level: 1,
        completedLabs: [],
        badges: [],
        createdAt: new Date().toISOString()
      });

      // Save user to Firestore / DB
      const savedUser = await FirebaseService.saveUser(uid, newUserSchema);

      // Also create initial Leaderboard entry
      await FirebaseService.saveLeaderboardEntry(uid, {
        userId: uid,
        username: name,
        xp: 0,
        rank: 999
      });

      // Generate JWT Token
      const token = jwt.sign({ uid: savedUser.uid, email: savedUser.email }, jwtConfig.secret, {
        expiresIn: jwtConfig.expiresIn
      });

      logger.info(`New user registered: ${savedUser.email} (UID: ${savedUser.uid})`);

      return ApiResponse.success(
        res,
        'User registration successful.',
        {
          token,
          user: UserModel.toPublicProfile(savedUser)
        },
        201
      );
    } catch (error) {
      next(error);
    }
  }

  /**
   * User login
   * POST /api/auth/login
   */
  static async login(req, res, next) {
    try {
      const { email, password } = req.body;

      const user = await FirebaseService.getUserByEmail(email);
      if (!user || !user.passwordHash) {
        return ApiResponse.error(res, 'Invalid credentials. User not found.', 401);
      }

      const isMatch = await bcrypt.compare(password, user.passwordHash);
      if (!isMatch) {
        return ApiResponse.error(res, 'Invalid credentials. Password incorrect.', 401);
      }

      // Generate JWT Token
      const token = jwt.sign({ uid: user.uid, email: user.email }, jwtConfig.secret, {
        expiresIn: jwtConfig.expiresIn
      });

      logger.info(`User logged in: ${user.email} (UID: ${user.uid})`);

      return ApiResponse.success(res, 'Login successful.', {
        token,
        user: UserModel.toPublicProfile(user)
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = AuthController;
