const express = require('express');
const router = express.Router();
const { QUESTIONS, computeRiskProfile } = require('../engines/riskProfileEngine');

/**
 * GET /api/risk-profile/questions
 * Returns all 7 profiling questions
 */
router.get('/questions', (req, res) => {
  res.json({ questions: QUESTIONS });
});

/**
 * POST /api/risk-profile
 * Body: { answers: [{ questionId, optionIndex }] }
 * Returns: { riskBucket, percentage, profile }
 */
router.post('/', (req, res, next) => {
  try {
    const { answers } = req.body;

    if (!answers || !Array.isArray(answers) || answers.length === 0) {
      return res.status(400).json({ error: 'answers array is required' });
    }
    if (answers.length !== QUESTIONS.length) {
      return res.status(400).json({
        error: `Expected ${QUESTIONS.length} answers, received ${answers.length}`,
      });
    }

    const result = computeRiskProfile(answers);

    res.json({
      ...result,
      disclaimer: 'This risk assessment is for educational purposes only and does not constitute regulated financial advice.',
    });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
