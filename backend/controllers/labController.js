/**
 * Lab Controller - CTF Labs and Flag Submissions
 */
const LabService = require('../services/labService');
const ApiResponse = require('../utils/apiResponse');

class LabController {
  /**
   * GET /api/labs
   * Retrieve list of all cybersecurity labs
   */
  static async getLabs(req, res, next) {
    try {
      const labs = LabService.getLabs();
      return ApiResponse.success(res, 'Labs retrieved successfully.', labs);
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/labs/:id
   * Retrieve details for a specific lab by ID
   */
  static async getLabById(req, res, next) {
    try {
      const { id } = req.params;
      const lab = LabService.getLabById(id);

      if (!lab) {
        return ApiResponse.error(res, `Lab with ID '${id}' not found.`, 404);
      }

      return ApiResponse.success(res, 'Lab details retrieved successfully.', lab);
    } catch (error) {
      next(error);
    }
  }

  /**
   * POST /api/labs/submit-flag
   * Submit and validate flag for a lab
   */
  static async submitFlag(req, res, next) {
    try {
      const user = req.user;
      const { labId, flag } = req.body;

      const result = await LabService.submitFlag(user, labId, flag);

      if (!result.success) {
        return ApiResponse.error(res, result.message, result.status || 400);
      }

      return ApiResponse.success(res, result.message, result.data, result.status || 200);
    } catch (error) {
      next(error);
    }
  }
}

module.exports = LabController;
