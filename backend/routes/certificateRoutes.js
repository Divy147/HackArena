/**
 * Certificate Routes (/api/certificate)
 */
const express = require('express');
const router = express.Router();
const CertificateController = require('../controllers/certificateController');
const { protect } = require('../middleware/authMiddleware');

router.get('/', protect, CertificateController.getCertificate);

module.exports = router;
