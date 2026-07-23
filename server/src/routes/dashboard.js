const express = require('express');
const router = express.Router();
const sampleProfiles = require('../data/sampleProfiles');

/**
 * GET /api/dashboard/profiles
 * Returns all 10 synthetic user profiles
 * Query params: ?bucket=Low|Medium|High for filtering
 */
router.get('/profiles', (req, res) => {
  const { bucket, search } = req.query;

  let profiles = [...sampleProfiles];

  if (bucket && ['Low', 'Medium', 'High'].includes(bucket)) {
    profiles = profiles.filter((p) => p.riskBucket === bucket);
  }

  if (search) {
    const q = search.toLowerCase();
    profiles = profiles.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.city.toLowerCase().includes(q) ||
        p.occupation.toLowerCase().includes(q)
    );
  }

  res.json({
    total: profiles.length,
    profiles,
    bucketSummary: {
      Low: sampleProfiles.filter((p) => p.riskBucket === 'Low').length,
      Medium: sampleProfiles.filter((p) => p.riskBucket === 'Medium').length,
      High: sampleProfiles.filter((p) => p.riskBucket === 'High').length,
    },
  });
});

/**
 * GET /api/dashboard/profiles/:id
 * Returns a single profile by ID
 */
router.get('/profiles/:id', (req, res) => {
  const id = Number(req.params.id);
  const profile = sampleProfiles.find((p) => p.id === id);

  if (!profile) {
    return res.status(404).json({ error: `Profile with id ${id} not found` });
  }

  res.json(profile);
});

/**
 * GET /api/dashboard/stats
 * Returns aggregate statistics across all profiles
 */
router.get('/stats', (req, res) => {
  const avgScore = Math.round(
    sampleProfiles.reduce((sum, p) => sum + p.creditScore, 0) / sampleProfiles.length
  );

  const avgIncome = Math.round(
    sampleProfiles.reduce((sum, p) => sum + p.monthlyIncome, 0) / sampleProfiles.length
  );

  res.json({
    totalProfiles: sampleProfiles.length,
    averageCreditScore: avgScore,
    averageMonthlyIncome: avgIncome,
    bucketDistribution: {
      Low: sampleProfiles.filter((p) => p.riskBucket === 'Low').length,
      Medium: sampleProfiles.filter((p) => p.riskBucket === 'Medium').length,
      High: sampleProfiles.filter((p) => p.riskBucket === 'High').length,
    },
    cityTierDistribution: {
      'Tier-2': sampleProfiles.filter((p) => p.cityTier === 'Tier-2').length,
      'Tier-3': sampleProfiles.filter((p) => p.cityTier === 'Tier-3').length,
    },
  });
});

module.exports = router;
