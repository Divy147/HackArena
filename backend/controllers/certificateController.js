/**
 * Certificate Controller - Certificate issuance and PDF download
 */
const CertificateService = require('../services/certificateService');
const ApiResponse = require('../utils/apiResponse');

class CertificateController {
  /**
   * GET /api/certificate
   * Return certificate details or stream PDF download if ?download=true
   */
  static async getCertificate(req, res, next) {
    try {
      const user = req.user;

      if (req.query.download === 'true') {
        return CertificateService.generateCertificatePdf(user, res);
      }

      const certData = CertificateService.getCertificateData(user);
      if (!certData.eligible) {
        return ApiResponse.error(res, certData.message, 400, { eligibility: certData.eligibility });
      }

      return ApiResponse.success(res, 'Completion certificate retrieved successfully.', certData);
    } catch (error) {
      next(error);
    }
  }
}

module.exports = CertificateController;
