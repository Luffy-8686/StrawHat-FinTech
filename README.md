# CreditVision — Transparent Credit Scoring & AI-Driven Micro-Investment Advisor

> **TetraTHON 2026 — FinTech Track Submission**  
> ⚠️ All outputs are for educational purposes only and do not constitute regulated financial advice.

---

## 🚀 Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 18 + Vite + Tailwind CSS v4 |
| Backend | Node.js + Express.js |
| Charts | Recharts |
| HTTP Client | Axios |
| API Style | REST API |

---

## 📁 Project Structure

```
Tetrathon/
├── client/          # React frontend (port 5173)
│   └── src/
│       ├── pages/   # Landing, CreditAssessment, ScoreResult, RiskProfiler, InvestmentAdvice, Dashboard
│       ├── components/  # Navbar, ScoreGauge, FeatureBar, ChatBot, GrowthChart, etc.
│       ├── api/     # Axios client
│       └── context/ # Global state
├── server/          # Express REST API (port 5000)
│   └── src/
│       ├── engines/  # creditScoringEngine, explainabilityEngine, riskProfileEngine, investmentEngine
│       ├── routes/   # /api/credit-score, /api/risk-profile, /api/investment-advice, /api/dashboard
│       └── data/     # 10 synthetic user profiles
└── README.md
```

---

## 🔌 REST API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/health` | Health check |
| POST | `/api/credit-score` | Submit digital signals → score + explanations |
| GET | `/api/risk-profile/questions` | Get 7 profiling questions |
| POST | `/api/risk-profile` | Submit answers → risk bucket |
| POST | `/api/investment-advice` | Get allocation + 5-year growth data |
| GET | `/api/dashboard/profiles` | All 10 sample profiles |
| GET | `/api/dashboard/profiles/:id` | Single profile |
| GET | `/api/dashboard/stats` | Aggregate statistics |

---

## 🏃 Running the App

### Step 1 — Start the Backend Server

```bash
cd server
npm install
npm run dev     # starts on http://localhost:5000
```

### Step 2 — Start the Frontend

```bash
cd client
npm install
npm run dev     # starts on http://localhost:5173
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

---

## ✨ Features

### 1. Credit Likelihood Scoring Engine
- 6 non-traditional digital signals: mobile recharge frequency, utility payment regularity, e-commerce volume, e-commerce consistency, monthly income, EMI burden
- Weighted multi-factor model → Credit Likelihood Score (0–100)
- Risk bucket classification: Low / Medium / High
- SHAP-inspired explainability: top-3 feature contributions with improvement roadmap

### 2. Conversational Risk Profiler
- 7-question chatbot-style assessment
- State machine maps answers to Conservative / Moderate / Aggressive investor profile
- Animated chat bubbles with sequential question delivery

### 3. AI-Driven Micro-Investment Advisor
- Rule-based instrument allocation by risk bucket
- 5-year SIP growth simulation across 3 scenarios (Conservative / Moderate / Optimistic)
- Recharts interactive growth chart
- Portfolio allocation donut chart
- Monthly amount slider (₹500 – ₹5,000)

### 4. Dashboard
- 10 synthetic user profiles across Tier-2/3 cities
- Score distribution bar chart
- Risk bucket distribution visualisation
- Search and filter by name, city, occupation, or risk bucket
- Profile detail modal with mini score gauge

---

## ⚠️ Disclaimer

All credit scores, investment projections, and financial recommendations are generated using simulated mathematical models **for educational purposes only**. They do **not** constitute regulated financial advice, solicitation, or official credit assessment. Please consult a SEBI-registered financial advisor before making any investment decisions. Past performance does not guarantee future results.
