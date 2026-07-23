/**
 * Credit Scoring Engine — CIBIL Scale (300–950)
 * Uses weighted multi-factor model on non-traditional digital signals
 * to produce a CIBIL-comparable Credit Likelihood Score (300–950).
 *
 * Methodology:
 *   Raw weighted percentage (0–100) → mapped to CIBIL band (300–950)
 *   Formula: cibilScore = 300 + (rawPercent / 100) * 650
 *
 * Features & Weights:
 *   - Mobile Recharge Frequency   : 20%
 *   - Utility Payment Regularity  : 25%
 *   - E-commerce Volume           : 15%
 *   - E-commerce Consistency      : 20%
 *   - Monthly Income (self-rep.)  : 10%
 *   - EMI Burden Ratio            : 10%
 *
 * CIBIL Bands (aligned with standard bank benchmarks):
 *   750–950  → Excellent  (Low Risk)    — loan approval likely
 *   650–749  → Good       (Medium Risk) — loan possible with conditions
 *   550–649  → Fair       (Medium Risk) — limited credit access
 *   300–549  → Poor       (High Risk)   — credit typically denied
 */

const CIBIL_MIN = 300;
const CIBIL_MAX = 950;
const CIBIL_RANGE = CIBIL_MAX - CIBIL_MIN; // 650

const FEATURE_WEIGHTS = {
  rechargeFrequency:    0.20,
  utilityPaymentScore:  0.25,
  ecommerceVolume:      0.15,
  ecommerceConsistency: 0.20,
  incomeScore:          0.10,
  emiBurdenScore:       0.10,
};

/** Normalize recharge frequency (0–8/month → 0–100) */
function normalizeRechargeFrequency(freq) {
  return (Math.min(Math.max(freq, 0), 8) / 8) * 100;
}

/** Normalize monthly income (₹5,000–₹50,000 → 0–100) */
function normalizeIncome(income) {
  const min = 5000, max = 50000;
  return ((Math.min(Math.max(income, min), max) - min) / (max - min)) * 100;
}

/**
 * EMI burden score — lower EMI/income ratio = higher score.
 * 0% ratio → 100 pts | 50%+ ratio → 0 pts
 */
function computeEmiBurdenScore(monthlyIncome, existingEMI) {
  if (monthlyIncome <= 0) return 0;
  const ratio = existingEMI / monthlyIncome;
  if (ratio >= 0.5) return 0;
  return (1 - ratio / 0.5) * 100;
}

/** Normalize e-commerce volume (₹0–₹10,000/month → 0–100) */
function normalizeEcommerceVolume(volume) {
  return (Math.min(Math.max(volume, 0), 10000) / 10000) * 100;
}

/**
 * Compute CIBIL-scale credit score and risk bucket.
 * @param {Object} signals - Digital signal inputs
 * @returns {{ cibilScore, rawPercent, bucket, cibilBand, featureScores }}
 */
function computeCreditScore(signals) {
  const {
    rechargeFrequency    = 0,
    utilityPaymentScore  = 0,
    ecommerceVolume      = 0,
    ecommerceConsistency = 0,
    monthlyIncome        = 0,
    existingEMI          = 0,
  } = signals;

  const featureScores = {
    rechargeFrequency:    normalizeRechargeFrequency(rechargeFrequency),
    utilityPaymentScore:  Math.min(Math.max(utilityPaymentScore, 0), 100),
    ecommerceVolume:      normalizeEcommerceVolume(ecommerceVolume),
    ecommerceConsistency: Math.min(Math.max(ecommerceConsistency, 0), 100),
    incomeScore:          normalizeIncome(monthlyIncome),
    emiBurdenScore:       computeEmiBurdenScore(monthlyIncome, existingEMI),
  };

  // Weighted raw percentage (0–100)
  let rawPercent = 0;
  for (const [feature, weight] of Object.entries(FEATURE_WEIGHTS)) {
    rawPercent += featureScores[feature] * weight;
  }
  rawPercent = Math.round(rawPercent);

  // Map to CIBIL range 300–950
  const cibilScore = Math.round(CIBIL_MIN + (rawPercent / 100) * CIBIL_RANGE);

  // CIBIL band & risk bucket
  let bucket, cibilBand;
  if (cibilScore >= 750) {
    bucket = 'Low';
    cibilBand = 'Excellent';
  } else if (cibilScore >= 650) {
    bucket = 'Medium';
    cibilBand = 'Good';
  } else if (cibilScore >= 550) {
    bucket = 'Medium';
    cibilBand = 'Fair';
  } else {
    bucket = 'High';
    cibilBand = 'Poor';
  }

  return { score: cibilScore, cibilScore, rawPercent, bucket, cibilBand, featureScores };
}

module.exports = { computeCreditScore, FEATURE_WEIGHTS, CIBIL_MIN, CIBIL_MAX };
