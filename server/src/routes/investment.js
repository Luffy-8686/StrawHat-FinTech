const express = require('express');
const router = express.Router();
const { generateInvestmentAdvice } = require('../engines/investmentEngine');

const VALID_BUCKETS = ['Conservative', 'Moderate', 'Aggressive'];
const MIN_AMOUNT = 500;
const MAX_AMOUNT = 5000;

/**
 * POST /api/investment-advice
 * Body: { riskBucket, monthlyAmount }
 * Returns: { allocation, growthData, fullGrowthData, summary, disclaimer }
 */
router.post('/', (req, res, next) => {
  try {
    const { riskBucket, monthlyAmount } = req.body;

    if (!riskBucket || !VALID_BUCKETS.includes(riskBucket)) {
      return res.status(400).json({
        error: `riskBucket must be one of: ${VALID_BUCKETS.join(', ')}`,
      });
    }

    const amount = Number(monthlyAmount);
    if (isNaN(amount) || amount < MIN_AMOUNT || amount > MAX_AMOUNT) {
      return res.status(400).json({
        error: `monthlyAmount must be between ₹${MIN_AMOUNT} and ₹${MAX_AMOUNT}`,
      });
    }

    const advice = generateInvestmentAdvice(riskBucket, amount);

    res.json({
      riskBucket,
      monthlyAmount: amount,
      ...advice,
      disclaimer:
        '⚠️ IMPORTANT DISCLAIMER: All investment projections shown here are simulated using mathematical models for educational purposes only. They do not constitute regulated financial advice, solicitation, or recommendation. Past returns do not guarantee future performance. Please consult a SEBI-registered financial advisor before making any investment decisions.',
    });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
