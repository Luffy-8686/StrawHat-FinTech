/**
 * Risk Profile Engine — Realistic SEBI/AMFI-aligned Questions
 * Maps 7 practical financial profiling questions to a risk bucket.
 * Questions are designed to reflect real-world investor situations
 * in Tier-2/3 Indian cities. Scoring → Conservative / Moderate / Aggressive.
 */

const QUESTIONS = [
  {
    id: 1,
    question: "What is your current age? (Your investment horizon directly affects how much risk you can take.)",
    context: "Younger investors can typically afford more risk as they have time to recover from market downturns.",
    options: [
      { label: 'Above 55 years — near or at retirement', score: 0 },
      { label: '45–55 years — planning for retirement soon', score: 1 },
      { label: '35–44 years — mid-career, stable income', score: 2 },
      { label: 'Below 35 years — early career, long horizon', score: 3 },
    ],
    weight: 2.0,
  },
  {
    id: 2,
    question: "How stable is your monthly income source?",
    context: "Income stability determines how much volatility your finances can absorb without stress.",
    options: [
      { label: 'Very irregular — daily wages or seasonal work', score: 0 },
      { label: 'Somewhat irregular — gig/freelance, varies each month', score: 1 },
      { label: 'Mostly stable — self-employed with regular clients', score: 2 },
      { label: 'Very stable — salaried job or govt. employment', score: 3 },
    ],
    weight: 2.0,
  },
  {
    id: 3,
    question: "After paying all monthly expenses and EMIs, how much can you genuinely save?",
    context: "This is your actual investable surplus — not your income, but what remains after all obligations.",
    options: [
      { label: 'Less than ₹500 — barely any surplus', score: 0 },
      { label: '₹500 – ₹1,500 — small but consistent savings', score: 1 },
      { label: '₹1,500 – ₹3,000 — moderate savings', score: 2 },
      { label: 'More than ₹3,000 — comfortable surplus each month', score: 3 },
    ],
    weight: 1.5,
  },
  {
    id: 4,
    question: "You invested ₹10,000 and in 3 months it dropped to ₹7,500 (a 25% loss). What do you do?",
    context: "This tests your actual emotional response to market loss, not what you think you should do.",
    options: [
      { label: 'Withdraw everything — I cannot sleep with this loss', score: 0 },
      { label: 'Withdraw half and keep the rest as a lesson', score: 1 },
      { label: 'Hold and wait — markets usually recover', score: 2 },
      { label: 'Invest ₹5,000 more — lower prices are a good opportunity', score: 3 },
    ],
    weight: 2.5,
  },
  {
    id: 5,
    question: "Do you have an emergency fund to cover your household expenses?",
    context: "Without an emergency fund, any financial shock forces you to break investments early — a major risk.",
    options: [
      { label: 'No savings at all — I live month to month', score: 0 },
      { label: 'Can manage for about 1 month if income stops', score: 1 },
      { label: 'Have savings for 2–3 months of expenses', score: 2 },
      { label: 'Have at least 3–6 months of expenses saved', score: 3 },
    ],
    weight: 2.0,
  },
  {
    id: 6,
    question: "Do you or your family have active health insurance or life insurance coverage?",
    context: "Insurance protects your investments from being broken during emergencies like illness or accidents.",
    options: [
      { label: 'No insurance of any kind', score: 0 },
      { label: 'Only employer-provided health insurance (no LIC/personal policy)', score: 1 },
      { label: 'Have health insurance or LIC policy, but not both', score: 2 },
      { label: 'Have both health and life insurance with adequate coverage', score: 3 },
    ],
    weight: 1.5,
  },
  {
    id: 7,
    question: "What is your main financial goal for this investment?",
    context: "Your goal determines the right investment horizon and instrument type for you.",
    options: [
      { label: 'Survive next year — I need money within 12 months', score: 0 },
      { label: 'Buy something in 2–3 years (bike, household goods, marriage)', score: 1 },
      { label: 'Children\'s education or own home in 5–7 years', score: 2 },
      { label: 'Long-term wealth building or retirement (10+ years)', score: 3 },
    ],
    weight: 2.5,
  },
];

/**
 * Compute risk profile from 7 answers.
 * @param {Array} answers - Array of { questionId, optionIndex } objects
 * @returns {{ riskBucket, totalScore, maxScore, percentage, profile }}
 */
function computeRiskProfile(answers) {
  let totalScore = 0;
  let maxScore = 0;

  for (const question of QUESTIONS) {
    const answer = answers.find((a) => a.questionId === question.id);
    if (answer) {
      const option = question.options[answer.optionIndex];
      if (option) {
        totalScore += option.score * question.weight;
      }
    }
    maxScore += 3 * question.weight;
  }

  const percentage = (totalScore / maxScore) * 100;

  let riskBucket, profile;

  if (percentage >= 65) {
    riskBucket = 'Aggressive';
    profile = {
      label: 'Aggressive Growth Investor',
      description:
        'You have a stable income, strong financial safety nets (insurance + emergency fund), a long investment horizon, and high emotional tolerance for market downturns. You are well-positioned to take equity-heavy risks for maximum long-term wealth creation.',
      color: 'emerald',
      instruments: ['Large-cap Equity Mutual Funds', 'ELSS (Tax Saving + Growth)', 'Mid-cap SIP', 'Nifty 50 Index Fund'],
      dos: ['Start a SIP of at least ₹2,000–₹5,000/month', 'Stay invested for minimum 5–7 years', 'Review portfolio every 6 months'],
      donts: ['Do not panic-sell during market corrections', 'Do not invest money you may need within 2 years'],
    };
  } else if (percentage >= 38) {
    riskBucket = 'Moderate';
    profile = {
      label: 'Balanced / Moderate Investor',
      description:
        'You have some financial stability but are not fully insulated from shocks. You are open to measured growth but need some capital protection. A balanced mix of equity and debt instruments suits your current life stage and goals.',
      color: 'amber',
      instruments: ['Balanced Hybrid Mutual Funds', 'ELSS (80C tax benefit)', 'NPS (National Pension Scheme)', 'Recurring Deposit (RD)'],
      dos: ['Start with ₹1,000–₹2,000/month SIP in hybrid funds', 'Build emergency fund alongside investing', 'Consider NPS for retirement if you have stable income'],
      donts: ['Avoid putting all money in a single instrument', 'Do not stop SIP during minor market dips'],
    };
  } else {
    riskBucket = 'Conservative';
    profile = {
      label: 'Conservative / Capital Protection Investor',
      description:
        'Your current financial situation — irregular income, limited savings buffer, or high dependents — means protecting your principal is the top priority. Government-backed, guaranteed-return instruments are most suitable right now. Build your financial foundation first.',
      color: 'blue',
      instruments: ['Post Office RD / MIS', 'Fixed Deposit (FD) — small bank or post office', 'Public Provident Fund (PPF)', 'Gold (Sovereign Gold Bond)'],
      dos: ['Start with just ₹500/month — consistency matters more than amount', 'Open PPF account for tax-free, guaranteed returns', 'Build at least 1 month emergency fund before investing'],
      donts: ['Do not invest in stocks or equity funds right now', 'Avoid chit funds and unregulated schemes'],
    };
  }

  return {
    riskBucket,
    totalScore: Math.round(totalScore * 10) / 10,
    maxScore: Math.round(maxScore * 10) / 10,
    percentage: Math.round(percentage),
    profile,
  };
}

module.exports = { QUESTIONS, computeRiskProfile };
