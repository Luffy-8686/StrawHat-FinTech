import { TrendingUp, Shield, Percent } from 'lucide-react';

const RISK_COLORS = {
  'Very Low':    'text-emerald-400 bg-emerald-400/10 border-emerald-400/20',
  'Low':         'text-teal-400   bg-teal-400/10   border-teal-400/20',
  'Medium':      'text-amber-400  bg-amber-400/10  border-amber-400/20',
  'Medium-High': 'text-orange-400 bg-orange-400/10 border-orange-400/20',
  'High':        'text-rose-400   bg-rose-400/10   border-rose-400/20',
  'Very High':   'text-red-400    bg-red-400/10    border-red-400/20',
};

export default function InstrumentCard({ instrument, index }) {
  const riskClass = RISK_COLORS[instrument.risk] || RISK_COLORS['Medium'];

  return (
    <div
      className="glass rounded-2xl p-5 border border-white/5 hover:border-teal-400/20 transition-all duration-300 hover:scale-[1.02] animate-fade-in-up"
      style={{ animationDelay: `${index * 0.1}s` }}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3">
          <span className="text-2xl">{instrument.icon}</span>
          <div>
            <h3 className="font-display font-semibold text-white text-sm leading-tight">
              {instrument.name}
            </h3>
            <span className={`text-xs font-medium px-2 py-0.5 rounded-full border mt-1 inline-block ${riskClass}`}>
              {instrument.risk} Risk
            </span>
          </div>
        </div>
      </div>

      {/* Description */}
      <p className="text-slate-400 text-xs leading-relaxed mb-4">{instrument.description}</p>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-3">
        <div className="glass rounded-xl p-2.5 text-center">
          <div className="flex items-center justify-center gap-1 mb-0.5">
            <Percent size={12} className="text-teal-400" />
            <span className="text-xs text-slate-400">Allocation</span>
          </div>
          <p className="font-bold text-teal-400 text-lg">{instrument.allocation}%</p>
        </div>
        <div className="glass rounded-xl p-2.5 text-center">
          <div className="flex items-center justify-center gap-1 mb-0.5">
            <TrendingUp size={12} className="text-emerald-400" />
            <span className="text-xs text-slate-400">Monthly</span>
          </div>
          <p className="font-bold text-emerald-400 text-lg">₹{instrument.monthlyAmount}</p>
        </div>
      </div>

      {/* Expected return bar */}
      <div className="mt-3">
        <div className="flex justify-between text-xs text-slate-500 mb-1">
          <span>Expected Return</span>
          <span className="text-emerald-400 font-medium">{instrument.expectedReturn}% p.a.</span>
        </div>
        <div className="h-1.5 rounded-full bg-white/5">
          <div
            className="h-full rounded-full bg-gradient-to-r from-teal-500 to-emerald-400"
            style={{ width: `${(instrument.expectedReturn / 20) * 100}%` }}
          />
        </div>
      </div>
    </div>
  );
}
