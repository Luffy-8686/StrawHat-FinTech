const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const errorHandler = require('./middleware/errorHandler');

const creditScoreRoutes = require('./routes/creditScore');
const riskProfileRoutes = require('./routes/riskProfile');
const investmentRoutes = require('./routes/investment');
const dashboardRoutes = require('./routes/dashboard');

const app = express();
const PORT = process.env.PORT || 5000;

// Allow origins: local dev + Vercel production domain
const ALLOWED_ORIGINS = [
  'http://localhost:5173',
  'http://localhost:3000',
  'https://straw-hat-fin-tech.vercel.app',   // Production Vercel frontend
  process.env.CLIENT_URL,                     // Optional override via env var
].filter(Boolean);

// Middleware
app.use(helmet());
app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (curl, Postman) or from allowed origins
    if (!origin || ALLOWED_ORIGINS.includes(origin) || (process.env.CLIENT_URL && origin.endsWith('.vercel.app'))) {
      callback(null, true);
    } else {
      callback(new Error(`CORS: origin ${origin} not allowed`));
    }
  },
  credentials: true,
}));
app.use(morgan('dev'));
app.use(express.json());

// Root route — shows API info instead of 404
app.get('/', (req, res) => {
  res.json({
    name: 'CreditVision FinTech API',
    status: '✅ Running',
    version: '1.0.0',
    description: 'Credit Scoring & Micro-Investment Advisor — TetraTHON 2026',
    endpoints: {
      health:      'GET  /api/health',
      creditScore: 'POST /api/credit-score',
      questions:   'GET  /api/risk-profile/questions',
      riskProfile: 'POST /api/risk-profile',
      investment:  'POST /api/investment-advice',
      profiles:    'GET  /api/dashboard/profiles',
      stats:       'GET  /api/dashboard/stats',
    },
    timestamp: new Date().toISOString(),
  });
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    message: 'FinTech API is running',
    timestamp: new Date().toISOString(),
    version: '1.0.0',
  });
});

// Routes
app.use('/api/credit-score', creditScoreRoutes);
app.use('/api/risk-profile', riskProfileRoutes);
app.use('/api/investment-advice', investmentRoutes);
app.use('/api/dashboard', dashboardRoutes);

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Error handler
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`\n🚀 FinTech API Server running on http://localhost:${PORT}`);
  console.log(`📊 Health check: http://localhost:${PORT}/api/health\n`);
});

module.exports = app;
