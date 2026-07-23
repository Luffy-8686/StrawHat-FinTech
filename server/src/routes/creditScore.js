const express = require('express');
const router = express.Router();
const { computeCreditScore } = require('../engines/creditScoringEngine');
const { explainScore, generateImprovementPathway } = require('../engines/explainabilityEngine');

/**
 * POST /api/credit-score
 * Body: { rechargeFrequency, utilityPaymentScore, ecommerceVolume,
 *         ecommerceConsistency, monthlyIncome, existingEMI }
 * Returns: { score, bucket, featureScores, topFeatures, improvements }
 */
router.post('/', (req, res, next) => {
  try {
    const {
      rechargeFrequency,
      utilityPaymentScore,
      ecommerceVolume,
      ecommerceConsistency,
      monthlyIncome,
      existingEMI,
    } = req.body;

    // Basic validation
    const required = { rechargeFrequency, utilityPaymentScore, ecommerceVolume, ecommerceConsistency, monthlyIncome };
    for (const [key, val] of Object.entries(required)) {
      if (val === undefined || val === null || isNaN(Number(val))) {
        return res.status(400).json({ error: `Missing or invalid field: ${key}` });
      }
    }

    const signals = {
      rechargeFrequency: Number(rechargeFrequency),
      utilityPaymentScore: Number(utilityPaymentScore),
      ecommerceVolume: Number(ecommerceVolume),
      ecommerceConsistency: Number(ecommerceConsistency),
      monthlyIncome: Number(monthlyIncome),
      existingEMI: Number(existingEMI || 0),
    };

    const { score, cibilScore, rawPercent, bucket, cibilBand, featureScores } = computeCreditScore(signals);
    const { weakest, strongest, all } = explainScore(featureScores);
    const improvements = generateImprovementPathway(weakest);

    res.json({
      score,
      cibilScore,
      rawPercent,
      bucket,
      cibilBand,
      featureScores,
      topPositiveFeatures: strongest,
      topImprovementAreas: weakest,
      allFeatures: all,
      improvements,
      disclaimer: 'This score is generated using a simulated model for educational purposes only. It does not constitute an official credit assessment.',
    });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
