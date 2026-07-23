import { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import ScoreGauge from '../components/ScoreGauge';
import FeatureBar from '../components/FeatureBar';
import Disclaimer from '../components/Disclaimer';
import { ArrowRight, ChevronDown, Lightbulb, TrendingUp, Info, Building2 } from 'lucide-react';

const CIBIL_BANDS = [
  { range: '300–549', label: 'Poor',      color: '#ff4757', desc: 'Loan applications typically rejected. Credit access very limited.', bucket: 'High' },
  { range: '550–649', label: 'Fair',      color: '#ffa502', desc: 'Some loans possible at higher interest rates. Improvement needed.', bucket: 'Medium' },
  { range: '650–749', label: 'Good',      color: '#00d4ff', desc: 'Most banks approve loans. Interest rates are reasonable.', bucket: 'Medium' },
  { range: '750–950', label: 'Excellent', color: '#2ed573', desc: 'Best loan rates, highest approval chance. Creditworthy.', bucket: 'Low' },
];

export default function ScoreResult() {
  const { creditData } = useApp();
  const navigate = useNavigate();
  const [openAccordion, setOpenAccordion] = useState(null);

  useEffect(() => {
    if (!creditData) navigate('/credit-assessment');
  }, [creditData, navigate]);

  if (!creditData) return null;

  const { score, cibilBand, bucket, allFeatures, improvements, name, city } = creditData;

  const bucketColors = {
    Low:    { text: 'text-emerald-400', bg: 'bg-emerald-400/10', border: 'border-emerald-400/20' },
    Medium: { text: 'text-amber-400',   bg: 'bg-amber-400/10',   border: 'border-amber-400/20'   },
    High:   { text: 'text-rose-400',    bg: 'bg-rose-400/10',    border: 'border-rose-400/20'    },
  };
  const bc = bucketColors[bucket] || bucketColors.High;

  return (
    <main className="min-h-screen pt-24 pb-16 px-4">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center">
          <h1 className="font-display font-black text-3xl text-white mb-2">Your CIBIL-Equivalent Score</h1>
          {name && <p className="text-slate-400">Results for <span className="text-white font-semibold">{name}</span>{city ? ` · ${city}` : ''}</p>}
          <p className="text-xs text-slate-500 mt-1">Score range: 300 (lowest) → 950 (highest) — same scale as official CIBIL TransUnion</p>
        </div>

        {/* Score hero card */}
        <div className="glass-strong rounded-2xl p-8 border border-white/8 text-center">
          <ScoreGauge score={score} bucket={bucket} cibilBand={cibilBand} size={220} animated={true} />

          <div className="mt-6">
            <p className="text-slate-400 text-sm">
              Based on <span className="text-white font-medium">6 non-traditional digital signals</span> — no formal credit history required
            </p>
          </div>

          {/* CIBIL comparison band table */}
          <div className="mt-8">
            <p className="text-xs text-slate-500 mb-3 flex items-center justify-center gap-1.5">
              <Building2 size={13} /> How banks interpret CIBIL scores
            </p>
            <div className="grid grid-cols-4 gap-2">
              {CIBIL_BANDS.map(({ range, label, color, desc }) => {
                const isActive = label === cibilBand;
                return (
                  <div
                    key={label}
                    className={`rounded-xl p-3 text-center border transition-all ${
                      isActive ? 'scale-105 shadow-lg' : 'opacity-40'
                    }`}
                    style={isActive ? { borderColor: color, background: `${color}10`, boxShadow: `0 0 20px ${color}20` } : { borderColor: 'rgba(255,255,255,0.05)' }}
                  >
                    <p className="text-xs font-bold mb-0.5" style={{ color: isActive ? color : '#64748b' }}>{label}</p>
                    <p className="text-slate-500 text-xs">{range}</p>
                    {isActive && <p className="text-xs mt-1.5 leading-tight" style={{ color }}>{desc}</p>}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Bank comparison info */}
        <div className="glass rounded-2xl p-5 border border-teal-400/15 flex gap-4">
          <Info size={20} className="text-teal-400 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-white text-sm font-semibold mb-1">How does this compare to your real CIBIL score?</p>
            <p className="text-slate-400 text-xs leading-relaxed">
              Official CIBIL scores are issued by TransUnion CIBIL Ltd. and are based on your formal credit history (loans, credit cards, repayments).
              Our score uses <strong className="text-white">non-traditional digital signals</strong> and is computed on the same 300–950 scale so you can directly compare.
              If your official CIBIL score is <strong className="text-teal-400">{score > 0 ? score - 30 : '—'} – {score + 30}</strong>, your credit profile is likely similar.
              You can check your official CIBIL score for free once a year at <span className="text-teal-400">cibil.com</span>.
            </p>
          </div>
        </div>

        {/* Feature explanations */}
        <div className="glass rounded-2xl p-6 border border-white/8">
          <h2 className="font-display font-bold text-white text-xl mb-6 flex items-center gap-2">
            <TrendingUp size={20} className="text-teal-400" />
            What's Driving Your Score (All 6 Signals)
          </h2>
          <div className="space-y-5">
            {(allFeatures || []).sort((a, b) => b.contribution - a.contribution).map((feat, i) => (
              <FeatureBar key={feat.feature} feature={feat} delay={i * 100} />
            ))}
          </div>
        </div>

        {/* Improvement pathway */}
        {improvements?.length > 0 && (
          <div className="glass rounded-2xl p-6 border border-white/8">
            <h2 className="font-display font-bold text-white text-xl mb-6 flex items-center gap-2">
              <Lightbulb size={20} className="text-amber-400" />
              Your Personalised Score Improvement Roadmap
            </h2>
            <p className="text-slate-400 text-xs mb-5">
              Following these steps could improve your CIBIL-equivalent score by
              <span className="text-teal-400 font-bold"> 30–80 points</span> over 3–6 months.
            </p>
            <div className="space-y-3">
              {improvements.map((imp, i) => (
                <div key={i} className="border border-white/5 rounded-xl overflow-hidden">
                  <button
                    className="w-full flex items-center justify-between p-4 text-left hover:bg-white/3 transition-colors"
                    onClick={() => setOpenAccordion(openAccordion === i ? null : i)}
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-xl">{imp.icon}</span>
                      <div>
                        <p className="font-medium text-white text-sm">
                          Priority {imp.priority}: {imp.feature}
                        </p>
                        <p className="text-xs text-teal-400">
                          Current: {imp.currentScore}/100 · Potential CIBIL gain: +{imp.potentialGain * 6} pts
                        </p>
                      </div>
                    </div>
                    <ChevronDown
                      size={16}
                      className={`text-slate-400 transition-transform ${openAccordion === i ? 'rotate-180' : ''}`}
                    />
                  </button>
                  {openAccordion === i && (
                    <div className="px-4 pb-4 space-y-2">
                      {imp.steps.map((step, j) => (
                        <div key={j} className="flex items-start gap-2.5 text-sm text-slate-400">
                          <span className="text-teal-400 mt-0.5 flex-shrink-0">→</span>
                          {step}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Disclaimer */}
        <Disclaimer />

        {/* Next step CTA */}
        <div className="glass rounded-2xl p-6 border border-teal-400/20 text-center">
          <h3 className="font-display font-bold text-white text-lg mb-2">Ready for investment advice?</h3>
          <p className="text-slate-400 text-sm mb-5">
            Complete your risk profile to get personalised micro-investment recommendations.
          </p>
          <Link
            to="/risk-profiler"
            className="inline-flex items-center gap-2 px-7 py-3 rounded-xl bg-gradient-to-r from-teal-500 to-teal-400 text-navy-900 font-bold hover:shadow-lg hover:shadow-teal-500/30 transition-all hover:scale-105"
          >
            Profile My Risk Appetite <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    </main>
  );
}
