import ScoreGauge from './ScoreGauge';
import { MapPin, Briefcase, IndianRupee, TrendingUp } from 'lucide-react';

const BUCKET_COLORS = {
  Low:    { bg: 'bg-emerald-400/10', border: 'border-emerald-400/20', text: 'text-emerald-400' },
  Medium: { bg: 'bg-amber-400/10',   border: 'border-amber-400/20',   text: 'text-amber-400'   },
  High:   { bg: 'bg-rose-400/10',    border: 'border-rose-400/20',    text: 'text-rose-400'    },
};

export default function ProfileCard({ profile, onClick }) {
  const colors = BUCKET_COLORS[profile.riskBucket] || BUCKET_COLORS.High;

  return (
    <button
      onClick={() => onClick?.(profile)}
      className="glass rounded-2xl p-5 text-left w-full hover:bg-white/6 border border-white/5 hover:border-teal-400/20 transition-all duration-300 hover:scale-[1.02] hover:shadow-lg hover:shadow-teal-500/10 group"
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="font-display font-semibold text-white group-hover:text-teal-400 transition-colors">
            {profile.name}
          </h3>
          <div className="flex items-center gap-1 text-slate-400 text-xs mt-1">
            <MapPin size={11} />
            {profile.city} · {profile.cityTier}
          </div>
        </div>
        <span className={`text-xs font-semibold px-2.5 py-1 rounded-full border ${colors.bg} ${colors.border} ${colors.text}`}>
          {profile.riskBucket} Risk
        </span>
      </div>

      {/* Score gauge (mini) */}
      <div className="flex items-center gap-4 mb-4">
        <ScoreGauge score={profile.creditScore} bucket={profile.riskBucket} cibilBand={profile.cibilBand} size={80} animated={false} />
        <div className="flex-1 space-y-2">
          <div className="flex items-center gap-1.5 text-xs text-slate-400">
            <Briefcase size={12} />
            {profile.occupation}
          </div>
          <div className="flex items-center gap-1.5 text-xs text-slate-400">
            <IndianRupee size={12} />
            ₹{profile.monthlyIncome.toLocaleString('en-IN')}/month
          </div>
          <div className="flex items-center gap-1.5 text-xs text-teal-400">
            <TrendingUp size={12} />
            Investing ₹{profile.investmentAmount}/month
          </div>
        </div>
      </div>

      {/* Top feature chips */}
      <div className="flex flex-wrap gap-1.5">
        {profile.topFeatures.slice(0, 2).map((f) => (
          <span key={f} className="text-xs bg-white/5 text-slate-400 px-2 py-0.5 rounded-full">
            {f}
          </span>
        ))}
      </div>
    </button>
  );
}
