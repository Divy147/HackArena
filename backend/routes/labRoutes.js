/**
 * Lab Routes (/api/labs)
 */
const express = require('express');
const router = express.Router();
const LabController = require('../controllers/labController');
const { protect } = require('../middleware/authMiddleware');
const { submitFlagValidation } = require('../middleware/validationMiddleware');

router.get('/', LabController.getLabs);
router.get('/:id', LabController.getLabById);
router.post('/submit-flag', protect, submitFlagValidation, LabController.submitFlag);

module.exports = router;
