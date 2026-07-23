import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import Navbar from './components/Navbar';
import Landing from './pages/Landing';
import CreditAssessment from './pages/CreditAssessment';
import ScoreResult from './pages/ScoreResult';
import RiskProfiler from './pages/RiskProfiler';
import InvestmentAdvice from './pages/InvestmentAdvice';
import Dashboard from './pages/Dashboard';

export default function App() {
  return (
    <AppProvider>
      <BrowserRouter>
        <div className="min-h-screen hero-bg">
          <Navbar />
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/credit-assessment" element={<CreditAssessment />} />
            <Route path="/score-result" element={<ScoreResult />} />
            <Route path="/risk-profiler" element={<RiskProfiler />} />
            <Route path="/investment-advice" element={<InvestmentAdvice />} />
            <Route path="/dashboard" element={<Dashboard />} />
          </Routes>
        </div>
      </BrowserRouter>
    </AppProvider>
  );
}
