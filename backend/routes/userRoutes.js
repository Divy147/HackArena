/**
 * User Routes (/api/user)
 */
const express = require('express');
const router = express.Router();
const UserController = require('../controllers/userController');
const { protect } = require('../middleware/authMiddleware');
const { updateProfileValidation } = require('../middleware/validationMiddleware');

router.get('/profile', protect, UserController.getProfile);
router.put('/update', protect, updateProfileValidation, UserController.updateProfile);

module.exports = router;
