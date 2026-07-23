import { useState, useEffect } from 'react';
import apiClient from '../api/client';
import ProfileCard from '../components/ProfileCard';
import ScoreGauge from '../components/ScoreGauge';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Loader2, Search, Filter, X, MapPin, Briefcase, TrendingUp, ChevronRight, Users } from 'lucide-react';

const BUCKETS = ['All', 'Low', 'Medium', 'High'];

export default function Dashboard() {
  const [profiles, setProfiles] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [bucket, setBucket] = useState('All');
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    Promise.all([apiClient.getProfiles(), apiClient.getStats()])
      .then(([profilesRes, statsRes]) => {
        setProfiles(profilesRes.profiles);
        setStats(statsRes);
      })
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  // Client-side filter (on top of server-side)
  const filtered = profiles.filter((p) => {
    const matchBucket = bucket === 'All' || p.riskBucket === bucket;
    const q = search.toLowerCase();
    const matchSearch =
      !q ||
      p.name.toLowerCase().includes(q) ||
      p.city.toLowerCase().includes(q) ||
      p.occupation.toLowerCase().includes(q);
    return matchBucket && matchSearch;
  });

  const scoreDistData = [
    { range: '300–450', count: profiles.filter((p) => p.creditScore <= 450).length },
    { range: '451–550', count: profiles.filter((p) => p.creditScore > 450 && p.creditScore <= 550).length },
    { range: '551–650', count: profiles.filter((p) => p.creditScore > 550 && p.creditScore <= 650).length },
    { range: '651–750', count: profiles.filter((p) => p.creditScore > 650 && p.creditScore <= 750).length },
    { range: '751–950', count: profiles.filter((p) => p.creditScore > 750).length },
  ];

  const BUCKET_STYLE = {
    Low:    'bg-emerald-400/10 border-emerald-400/20 text-emerald-400',
    Medium: 'bg-amber-400/10 border-amber-400/20 text-amber-400',
    High:   'bg-rose-400/10 border-rose-400/20 text-rose-400',
  };

  return (
    <main className="min-h-screen pt-24 pb-16 px-4">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div>
          <h1 className="font-display font-black text-3xl text-white mb-2">User Dashboard</h1>
          <p className="text-slate-400 text-sm">
            <span className="text-white font-medium">10 synthetic profiles</span> across Tier-2 & Tier-3 cities — all 3 risk buckets represented
          </p>
        </div>

        {/* Stats row */}
        {stats && (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { label: 'Total Profiles',     value: stats.totalProfiles,                                                       icon: Users,     color: 'text-teal-400'    },
              { label: 'Avg. CIBIL Score',   value: stats.averageCreditScore,                                                   icon: TrendingUp, color: 'text-amber-400'  },
              { label: 'Avg. Monthly Income', value: `₹${stats.averageMonthlyIncome.toLocaleString('en-IN')}`,                  icon: Briefcase,  color: 'text-emerald-400' },
              { label: 'Tier-2 / Tier-3',   value: `${stats.cityTierDistribution?.['Tier-2']} / ${stats.cityTierDistribution?.['Tier-3']}`, icon: MapPin, color: 'text-blue-400' },
            ].map(({ label, value, icon: Icon, color }) => (
              <div key={label} className="glass rounded-2xl p-5 border border-white/5">
                <Icon size={18} className={`${color} mb-3`} />
                <p className={`font-display font-bold text-2xl ${color}`}>{value}</p>
                <p className="text-slate-400 text-xs mt-1">{label}</p>
              </div>
            ))}
          </div>
        )}

        {/* Charts row */}
        {!loading && profiles.length > 0 && (
          <div className="grid lg:grid-cols-3 gap-6">
            {/* Risk bucket distribution */}
            <div className="glass rounded-2xl p-5 border border-white/8">
              <h3 className="font-semibold text-white mb-4 text-sm">Risk Bucket Distribution</h3>
              <div className="flex justify-around">
                {['Low', 'Medium', 'High'].map((b) => {
                  const count = profiles.filter((p) => p.riskBucket === b).length;
                  const pct = Math.round((count / profiles.length) * 100);
                  const colors = { Low: '#2ed573', Medium: '#ffa502', High: '#ff4757' };
                  return (
                    <div key={b} className="text-center">
                      <div className="w-16 h-16 rounded-full border-4 flex items-center justify-center mx-auto mb-2" style={{ borderColor: colors[b] }}>
                        <span className="font-bold text-lg" style={{ color: colors[b] }}>{count}</span>
                      </div>
                      <p className="text-xs font-semibold" style={{ color: colors[b] }}>{b}</p>
                      <p className="text-xs text-slate-500">{pct}%</p>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Score distribution */}
            <div className="glass rounded-2xl p-5 border border-white/8 lg:col-span-2">
              <h3 className="font-semibold text-white mb-4 text-sm">Score Distribution</h3>
              <ResponsiveContainer width="100%" height={120}>
                <BarChart data={scoreDistData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
                  <XAxis dataKey="range" tick={{ fill: '#64748b', fontSize: 10 }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fill: '#64748b', fontSize: 10 }} axisLine={false} tickLine={false} width={20} />
                  <Tooltip
                    contentStyle={{ background: '#111d36', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 8, fontSize: 11 }}
                    formatter={(val) => [val, 'Profiles']}
                  />
                  <Bar dataKey="count" fill="#00d4ff" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        {/* Search and filter */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="flex-1 relative">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by name, city, or occupation…"
              className="w-full bg-white/5 border border-white/10 rounded-xl pl-9 pr-4 py-2.5 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-teal-400/40 transition-all"
            />
            {search && (
              <button onClick={() => setSearch('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white">
                <X size={14} />
              </button>
            )}
          </div>
          <div className="flex gap-2">
            <Filter size={16} className="text-slate-500 self-center" />
            {BUCKETS.map((b) => (
              <button
                key={b}
                onClick={() => setBucket(b)}
                className={`px-4 py-2 rounded-xl text-sm font-medium transition-all border ${
                  bucket === b
                    ? b === 'All'
                      ? 'bg-teal-400/10 border-teal-400/30 text-teal-400'
                      : BUCKET_STYLE[b]
                    : 'border-white/10 text-slate-400 hover:text-white hover:border-white/20'
                }`}
              >
                {b}
              </button>
            ))}
          </div>
        </div>

        {/* Profiles grid */}
        {loading ? (
          <div className="flex items-center justify-center py-20 gap-3 text-teal-400">
            <Loader2 size={24} className="animate-spin" />
            Loading profiles…
          </div>
        ) : error ? (
          <div className="p-4 rounded-xl bg-rose-400/10 border border-rose-400/20 text-rose-400 text-sm">
            {error}
          </div>
        ) : (
          <>
            <p className="text-slate-500 text-xs">{filtered.length} profile{filtered.length !== 1 ? 's' : ''} shown</p>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {filtered.map((profile) => (
                <ProfileCard key={profile.id} profile={profile} onClick={setSelected} />
              ))}
            </div>
          </>
        )}

        {/* Profile detail modal */}
        {selected && (
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setSelected(null)}
          >
            <div
              className="glass-strong rounded-2xl border border-white/10 p-7 max-w-md w-full max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Modal header */}
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h2 className="font-display font-bold text-white text-xl">{selected.name}</h2>
                  <p className="text-slate-400 text-sm">{selected.occupation} · {selected.city} ({selected.cityTier})</p>
                </div>
                <button onClick={() => setSelected(null)} className="text-slate-500 hover:text-white">
                  <X size={20} />
                </button>
              </div>

              {/* Score */}
              <div className="flex justify-center mb-6">
                <ScoreGauge score={selected.creditScore} bucket={selected.riskBucket} cibilBand={selected.cibilBand} size={160} animated={true} />
              </div>

              {/* Details grid */}
              <div className="grid grid-cols-2 gap-3 mb-5">
                {[
                  { label: 'Age', value: `${selected.age} years` },
                  { label: 'Income', value: `₹${selected.monthlyIncome.toLocaleString('en-IN')}/mo` },
                  { label: 'EMI', value: selected.existingEMI ? `₹${selected.existingEMI.toLocaleString('en-IN')}/mo` : 'None' },
                  { label: 'Investing', value: `₹${selected.investmentAmount}/mo` },
                  { label: 'Recharge Freq.', value: `${selected.rechargeFrequency}x/month` },
                  { label: 'Utility Score', value: `${selected.utilityPaymentScore}/100` },
                ].map(({ label, value }) => (
                  <div key={label} className="glass rounded-xl p-3">
                    <p className="text-slate-500 text-xs mb-0.5">{label}</p>
                    <p className="text-white text-sm font-semibold">{value}</p>
                  </div>
                ))}
              </div>

              {/* Top features */}
              <div className="mb-4">
                <p className="text-slate-400 text-xs font-medium mb-2">Top Contributing Features</p>
                <div className="space-y-1.5">
                  {selected.topFeatures.map((f) => (
                    <div key={f} className="flex items-center gap-2 text-xs text-slate-300">
                      <ChevronRight size={12} className="text-teal-400" /> {f}
                    </div>
                  ))}
                </div>
              </div>

              {/* Improvements */}
              <div>
                <p className="text-slate-400 text-xs font-medium mb-2">Improvement Tips</p>
                <div className="space-y-1.5">
                  {selected.improvements.map((imp, i) => (
                    <div key={i} className="flex items-start gap-2 text-xs text-slate-400">
                      <span className="text-amber-400 mt-0.5 flex-shrink-0">→</span> {imp}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
