/**
 * Explainability Engine
 * Provides SHAP-inspired feature attribution:
 *   - Computes each feature's weighted contribution to the final score
 *   - Returns top-3 positive contributors
 *   - Generates actionable improvement steps per feature
 */

const { FEATURE_WEIGHTS } = require('./creditScoringEngine');

const FEATURE_LABELS = {
  rechargeFrequency: 'Mobile Recharge Frequency',
  utilityPaymentScore: 'Utility Payment Regularity',
  ecommerceVolume: 'E-commerce Transaction Volume',
  ecommerceConsistency: 'E-commerce Payment Consistency',
  incomeScore: 'Monthly Income Level',
  emiBurdenScore: 'Debt Burden (EMI Ratio)',
};

const FEATURE_ICONS = {
  rechargeFrequency: '📱',
  utilityPaymentScore: '💡',
  ecommerceVolume: '🛒',
  ecommerceConsistency: '✅',
  incomeScore: '💰',
  emiBurdenScore: '🏦',
};

const IMPROVEMENT_TIPS = {
  rechargeFrequency: [
    'Recharge your mobile at least 4 times per month on a consistent schedule.',
    'Switch to a monthly prepaid plan to establish regular recharge patterns.',
    'Enable auto-recharge to avoid gaps that reduce your digital footprint.',
  ],
  utilityPaymentScore: [
    'Set up auto-debit for electricity, water, and gas bills — this boosts your score significantly.',
    'Pay utility bills digitally via UPI or BBPS for better transaction traceability.',
    'Avoid late payments; even one missed utility bill reduces your score by ~8 points.',
  ],
  ecommerceVolume: [
    'Gradually increase monthly online purchases to ₹2,000–₹5,000 range.',
    'Use e-commerce platforms (Amazon, Flipkart, Meesho) regularly for household purchases.',
    'Consolidate offline purchases to online for a stronger digital transaction trail.',
  ],
  ecommerceConsistency: [
    'Make at least 2–3 online transactions every month — consistency matters more than volume.',
    'Use UPI for daily small purchases (₹50–₹500) to build consistent digital history.',
    'Avoid long gaps of 2+ months without any online transaction.',
  ],
  incomeScore: [
    'Register additional income sources (freelance, rental) on your digital payment profile.',
    'Use formal banking channels for income receipt to build a verifiable income trail.',
    'Apply for PM-SVANidhi or MUDRA loans to establish formal financial relationship.',
  ],
  emiBurdenScore: [
    'Aim to keep total EMIs below 30% of monthly income for a healthy credit profile.',
    'Prepay or close any high-interest informal loans first.',
    'Consolidate multiple small loans into a single structured repayment plan.',
  ],
};

/**
 * Compute feature contributions and return top-3 explanations.
 *
 * @param {Object} featureScores - Normalised scores per feature (0–100)
 * @returns {Array} - Top-3 feature explanation objects
 */
function explainScore(featureScores) {
  const contributions = Object.entries(FEATURE_WEIGHTS).map(([feature, weight]) => ({
    feature,
    label: FEATURE_LABELS[feature],
    icon: FEATURE_ICONS[feature],
    score: Math.round(featureScores[feature]),
    contribution: Math.round(featureScores[feature] * weight),
    weight: Math.round(weight * 100),
    tips: IMPROVEMENT_TIPS[feature],
  }));

  // Sort by score ascending to show weakest points first for improvement
  const sorted = [...contributions].sort((a, b) => a.score - b.score);

  // Top 3 lowest (most impactful improvement areas)
  const weakest = sorted.slice(0, 3);

  // Top 3 strongest (positive contributors)
  const strongest = [...contributions].sort((a, b) => b.contribution - a.contribution).slice(0, 3);

  return { weakest, strongest, all: contributions };
}

/**
 * Generate improvement pathway based on weakest features.
 *
 * @param {Array} weakFeatures - Weakest feature objects
 * @returns {Array} - Structured improvement steps
 */
function generateImprovementPathway(weakFeatures) {
  return weakFeatures.map((feat, idx) => ({
    priority: idx + 1,
    feature: feat.label,
    icon: feat.icon,
    currentScore: feat.score,
    potentialGain: Math.round((100 - feat.score) * feat.weight / 100 * 2),
    steps: feat.tips,
  }));
}

module.exports = { explainScore, generateImprovementPathway };
