/**
 * Investment Engine
 * Rule-based allocation engine mapping risk buckets to instrument portfolios.
 * Generates simulated 5-year monthly compounding growth for 3 scenarios.
 *
 * DISCLAIMER: All projections are simulated for educational purposes only
 * and do not constitute regulated financial advice.
 */

const ALLOCATIONS = {
  Conservative: [
    { name: 'Public Provident Fund (PPF)', allocation: 40, expectedReturn: 7.1, risk: 'Very Low', icon: '🏛️', description: 'Government-backed 15-year savings scheme with tax benefits. Safe and stable.' },
    { name: 'Fixed Deposit (FD)', allocation: 30, expectedReturn: 6.5, risk: 'Very Low', icon: '🏦', description: 'Bank FD with guaranteed returns. Ideal for capital preservation.' },
    { name: 'Debt Mutual Fund', allocation: 20, expectedReturn: 7.5, risk: 'Low', icon: '📊', description: 'Invests in bonds and government securities. Better than FD post-tax.' },
    { name: 'Gold ETF', allocation: 10, expectedReturn: 8.0, risk: 'Low', icon: '🥇', description: 'Digital gold investment — hedge against inflation.' },
  ],
  Moderate: [
    { name: 'Balanced Hybrid Fund', allocation: 35, expectedReturn: 10.0, risk: 'Medium', icon: '⚖️', description: 'Mix of equity and debt — growth with managed risk.' },
    { name: 'ELSS (Tax Saving Fund)', allocation: 25, expectedReturn: 12.0, risk: 'Medium-High', icon: '💼', description: 'Equity fund with 3-year lock-in and ₹1.5L tax deduction under 80C.' },
    { name: 'NPS (National Pension Scheme)', allocation: 20, expectedReturn: 10.5, risk: 'Medium', icon: '🏗️', description: 'Long-term retirement fund — tax benefits + market-linked returns.' },
    { name: 'Recurring Deposit (RD)', allocation: 20, expectedReturn: 6.5, risk: 'Very Low', icon: '📅', description: 'Monthly savings with guaranteed bank returns — low-risk component.' },
  ],
  Aggressive: [
    { name: 'Large-cap Equity Fund', allocation: 30, expectedReturn: 13.0, risk: 'High', icon: '📈', description: 'Top 100 company stocks — strong long-term growth.' },
    { name: 'Mid-cap SIP', allocation: 25, expectedReturn: 16.0, risk: 'Very High', icon: '🚀', description: 'Higher growth potential from mid-size companies over 5+ years.' },
    { name: 'ELSS (Tax Saving Fund)', allocation: 25, expectedReturn: 14.0, risk: 'High', icon: '💼', description: 'Tax saving + high equity returns. Best for 3+ year horizon.' },
    { name: 'Index Fund (Nifty 50)', allocation: 20, expectedReturn: 12.0, risk: 'Medium-High', icon: '🔢', description: 'Tracks Nifty 50 — low-cost, diversified market exposure.' },
  ],
};

const GROWTH_SCENARIOS = {
  Conservative: { pessimistic: 0.04, moderate: 0.07, optimistic: 0.10 },
  Moderate:     { pessimistic: 0.06, moderate: 0.10, optimistic: 0.14 },
  Aggressive:   { pessimistic: 0.08, moderate: 0.13, optimistic: 0.18 },
};

/**
 * Simulate 5-year monthly compounding growth for 3 scenarios.
 *
 * @param {number} monthlyAmount - Monthly investment in ₹
 * @param {Object} rates - { pessimistic, moderate, optimistic } annual rates
 * @returns {Array} - 60 data points per scenario
 */
function simulateGrowth(monthlyAmount, rates) {
  const months = 60;
  const data = [];

  for (let m = 1; m <= months; m++) {
    const year = parseFloat((m / 12).toFixed(2));

    const calc = (annualRate) => {
      const r = annualRate / 12;
      // Future value of SIP: FV = P * [((1+r)^n - 1) / r] * (1+r)
      return Math.round(monthlyAmount * (((Math.pow(1 + r, m) - 1) / r) * (1 + r)));
    };

    data.push({
      month: m,
      year,
      label: `Month ${m}`,
      invested: monthlyAmount * m,
      pessimistic: calc(rates.pessimistic),
      moderate: calc(rates.moderate),
      optimistic: calc(rates.optimistic),
    });
  }

  return data;
}

/**
 * Generate investment advice for a given risk bucket and monthly amount.
 *
 * @param {string} riskBucket - 'Conservative' | 'Moderate' | 'Aggressive'
 * @param {number} monthlyAmount - Monthly investment amount in ₹
 * @returns {Object} - allocation, growthData, summary
 */
function generateInvestmentAdvice(riskBucket, monthlyAmount) {
  const allocation = ALLOCATIONS[riskBucket] || ALLOCATIONS.Moderate;
  const rates = GROWTH_SCENARIOS[riskBucket] || GROWTH_SCENARIOS.Moderate;
  const growthData = simulateGrowth(monthlyAmount, rates);

  // Compute per-instrument monthly amounts
  const breakdown = allocation.map((inst) => ({
    ...inst,
    monthlyAmount: Math.round((inst.allocation / 100) * monthlyAmount),
  }));

  // 5-year summary
  const finalPoint = growthData[growthData.length - 1];
  const summary = {
    totalInvested: finalPoint.invested,
    pessimisticValue: finalPoint.pessimistic,
    moderateValue: finalPoint.moderate,
    optimisticValue: finalPoint.optimistic,
    pessimisticReturn: Math.round(((finalPoint.pessimistic - finalPoint.invested) / finalPoint.invested) * 100),
    moderateReturn: Math.round(((finalPoint.moderate - finalPoint.invested) / finalPoint.invested) * 100),
    optimisticReturn: Math.round(((finalPoint.optimistic - finalPoint.invested) / finalPoint.invested) * 100),
  };

  // Sample yearly milestones (month 12, 24, 36, 48, 60)
  const milestones = [12, 24, 36, 48, 60].map((m) => growthData[m - 1]);

  return { allocation: breakdown, growthData: milestones, fullGrowthData: growthData, summary, rates };
}

module.exports = { generateInvestmentAdvice, ALLOCATIONS };
