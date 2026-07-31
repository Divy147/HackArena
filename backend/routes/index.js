/**
 * Master API Router
 */
const express = require('express');
const router = express.Router();

const authRoutes = require('./authRoutes');
const userRoutes = require('./userRoutes');
const labRoutes = require('./labRoutes');
const leaderboardRoutes = require('./leaderboardRoutes');
const badgeRoutes = require('./badgeRoutes');
const certificateRoutes = require('./certificateRoutes');
const aiRoutes = require('./aiRoutes');

// Mount sub-routers
router.use('/auth', authRoutes);
router.use('/user', userRoutes);
router.use('/labs', labRoutes);
router.use('/leaderboard', leaderboardRoutes);
router.use('/badges', badgeRoutes);
router.use('/certificate', certificateRoutes);
router.use('/ai', aiRoutes);

// Health check endpoint
router.get('/health', (req, res) => {
  res.status(200).json({
    status: 'UP',
    platform: 'HackArena Cybersecurity Platform Backend',
    timestamp: new Date().toISOString()
  });
});

module.exports = router;
