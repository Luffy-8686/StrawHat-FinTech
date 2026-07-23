import { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { useNavigate } from 'react-router-dom';
import apiClient from '../api/client';
import Disclaimer from '../components/Disclaimer';
import InstrumentCard from '../components/InstrumentCard';
import GrowthChart from '../components/GrowthChart';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';
import { Loader2, IndianRupee, TrendingUp, Info } from 'lucide-react';

const PROFILE_COLORS_MAP = {
  Conservative: { text: 'text-blue-400',    border: 'border-blue-400/20',    bg: 'bg-blue-400/10',    dot: '#60a5fa' },
  Moderate:     { text: 'text-amber-400',   border: 'border-amber-400/20',   bg: 'bg-amber-400/10',   dot: '#fbbf24' },
  Aggressive:   { text: 'text-emerald-400', border: 'border-emerald-400/20', bg: 'bg-emerald-400/10', dot: '#34d399' },
};

const PIE_COLORS = ['#00d4ff', '#2ed573', '#ffb800', '#ff6b6b', '#a29bfe'];

function formatINR(val) {
  if (val >= 100000) return `₹${(val / 100000).toFixed(2)}L`;
  if (val >= 1000)   return `₹${(val / 1000).toFixed(1)}K`;
  return `₹${val}`;
}

export default function InvestmentAdvice() {
  const { riskData } = useApp();
  const navigate = useNavigate();

  const [monthlyAmount, setMonthlyAmount] = useState(1000);
  const [adviceData, setAdviceData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const riskBucket = riskData?.riskBucket || 'Moderate';
  const profile = riskData?.profile;
  const colors = PROFILE_COLORS_MAP[riskBucket] || PROFILE_COLORS_MAP.Moderate;

  const fetchAdvice = async (amount) => {
    setLoading(true);
    setError('');
    try {
      const data = await apiClient.getInvestmentAdvice(riskBucket, amount);
      setAdviceData(data);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdvice(monthlyAmount);
  }, [riskBucket]);

  const handleAmountChange = (e) => {
    const val = Number(e.target.value);
    setMonthlyAmount(val);
    fetchAdvice(val);
  };

  const pieData = adviceData?.allocation?.map((a) => ({
    name: a.name.split('(')[0].trim(),
    value: a.allocation,
    monthly: a.monthlyAmount,
  }));

  return (
    <main className="min-h-screen pt-24 pb-16 px-4">
      <div className="max-w-5xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center">
          <h1 className="font-display font-black text-3xl text-white mb-2">Your Investment Plan</h1>
          <div className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full border text-sm font-semibold ${colors.text} ${colors.border} ${colors.bg}`}>
            {riskBucket} Investor Profile
          </div>
          {profile && <p className="text-slate-400 text-sm mt-3 max-w-lg mx-auto">{profile.description}</p>}
        </div>

        {/* Disclaimer — PROMINENT at top */}
        <Disclaimer />

        {/* Monthly amount slider */}
        <div className="glass-strong rounded-2xl p-6 border border-white/8">
          <div className="flex items-center gap-2 mb-4">
            <IndianRupee size={18} className="text-teal-400" />
            <h2 className="font-display font-semibold text-white">Monthly Investment Amount</h2>
          </div>
          <div className="flex justify-between text-xs text-slate-400 mb-2">
            <span>₹500</span>
            <span className="font-bold text-teal-400 text-2xl">₹{monthlyAmount.toLocaleString('en-IN')}/month</span>
            <span>₹5,000</span>
          </div>
          <input
            type="range"
            min={500}
            max={5000}
            step={100}
            value={monthlyAmount}
            onChange={handleAmountChange}
            className="w-full"
          />
          <p className="text-xs text-slate-500 mt-2">
            Slide to adjust your monthly SIP amount (₹500 – ₹5,000 as per project scope)
          </p>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-20 gap-3 text-teal-400">
            <Loader2 size={24} className="animate-spin" />
            <span>Generating your personalised plan…</span>
          </div>
        ) : error ? (
          <div className="p-4 rounded-xl bg-rose-400/10 border border-rose-400/20 text-rose-400">
            {error} — Please make sure the server is running.
          </div>
        ) : adviceData && (
          <>
            {/* Portfolio allocation */}
            <div className="grid lg:grid-cols-2 gap-8 items-center">
              {/* Donut chart */}
              <div className="glass rounded-2xl p-6 border border-white/8">
                <h2 className="font-display font-semibold text-white mb-4 flex items-center gap-2">
                  <TrendingUp size={18} className="text-teal-400" />
                  Portfolio Allocation
                </h2>
                <ResponsiveContainer width="100%" height={220}>
                  <PieChart>
                    <Pie
                      data={pieData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={90}
                      paddingAngle={3}
                      dataKey="value"
                    >
                      {pieData?.map((_, i) => (
                        <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} stroke="transparent" />
                      ))}
                    </Pie>
                    <Tooltip
                      formatter={(val, name, props) => [
                        `${val}% (₹${props.payload.monthly}/mo)`, name
                      ]}
                      contentStyle={{ background: '#111d36', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 12, fontSize: 12 }}
                    />
                  </PieChart>
                </ResponsiveContainer>
                {/* Legend */}
                <div className="space-y-2 mt-2">
                  {pieData?.map((item, i) => (
                    <div key={i} className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2">
                        <div className="w-2.5 h-2.5 rounded-full" style={{ background: PIE_COLORS[i % PIE_COLORS.length] }} />
                        <span className="text-slate-400">{item.name}</span>
                      </div>
                      <span className="font-semibold text-white">{item.value}%</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Summary stats */}
              <div className="space-y-4">
                <h2 className="font-display font-semibold text-white flex items-center gap-2">
                  <Info size={18} className="text-teal-400" />
                  5-Year Projection Summary
                </h2>
                {adviceData.summary && (
                  <div className="space-y-3">
                    {[
                      { label: 'Total Invested', value: formatINR(adviceData.summary.totalInvested), color: 'text-white' },
                      { label: 'Conservative Scenario', value: `${formatINR(adviceData.summary.pessimisticValue)} (+${adviceData.summary.pessimisticReturn}%)`, color: 'text-blue-400' },
                      { label: 'Moderate Scenario', value: `${formatINR(adviceData.summary.moderateValue)} (+${adviceData.summary.moderateReturn}%)`, color: 'text-teal-400' },
                      { label: 'Optimistic Scenario', value: `${formatINR(adviceData.summary.optimisticValue)} (+${adviceData.summary.optimisticReturn}%)`, color: 'text-emerald-400' },
                    ].map(({ label, value, color }) => (
                      <div key={label} className="glass rounded-xl p-4 flex justify-between items-center border border-white/5">
                        <span className="text-slate-400 text-sm">{label}</span>
                        <span className={`font-bold text-sm ${color}`}>{value}</span>
                      </div>
                    ))}
                  </div>
                )}
                <p className="text-xs text-slate-500 flex items-start gap-1.5">
                  <Info size={12} className="flex-shrink-0 mt-0.5" />
                  Projections based on SIP compounding at{' '}
                  {Math.round(adviceData.rates?.pessimistic * 100)}%–{Math.round(adviceData.rates?.optimistic * 100)}% CAGR.
                  For illustrative purposes only.
                </p>
              </div>
            </div>

            {/* Growth chart */}
            <div className="glass rounded-2xl p-6 border border-white/8">
              <h2 className="font-display font-semibold text-white mb-6 flex items-center gap-2">
                <TrendingUp size={18} className="text-emerald-400" />
                5-Year Growth Projection — 3 Scenarios
              </h2>
              <GrowthChart data={adviceData.fullGrowthData} monthlyAmount={monthlyAmount} />
            </div>

            {/* Instrument cards */}
            <div>
              <h2 className="font-display font-semibold text-white mb-5 flex items-center gap-2">
                <IndianRupee size={18} className="text-gold-400" />
                Recommended Instruments
              </h2>
              <div className="grid sm:grid-cols-2 gap-4">
                {adviceData.allocation?.map((inst, i) => (
                  <InstrumentCard key={i} instrument={inst} index={i} />
                ))}
              </div>
            </div>

            {/* Disclaimer — repeated at bottom per requirement */}
            <Disclaimer />
          </>
        )}
      </div>
    </main>
  );
}
