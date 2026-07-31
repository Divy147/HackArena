/**
 * Badge Routes (/api/badges)
 */
const express = require('express');
const router = express.Router();
const BadgeController = require('../controllers/badgeController');
const { protect } = require('../middleware/authMiddleware');

router.get('/', protect, BadgeController.getBadges);

module.exports = router;
