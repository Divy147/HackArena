/**
 * AI Controller - Gemini AI Mentor interaction
 */
const GeminiService = require('../services/geminiService');
const ApiResponse = require('../utils/apiResponse');

class AiController {
  /**
   * POST /api/ai/chat
   * Ask AI mentor a question or request lab hints
   */
  static async chat(req, res, next) {
    try {
      const { prompt, labId } = req.body;

      const mentorReply = await GeminiService.askMentor(prompt, labId);

      return ApiResponse.success(res, 'AI Mentor response generated.', {
        reply: mentorReply,
        labId: labId || null
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = AiController;
