import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ReferenceLine } from 'recharts';

const SCENARIOS = [
  { key: 'pessimistic', color: '#60a5fa', label: 'Conservative Scenario' },
  { key: 'moderate',    color: '#00d4ff', label: 'Moderate Scenario'     },
  { key: 'optimistic',  color: '#2ed573', label: 'Optimistic Scenario'   },
];

function formatINR(value) {
  if (value >= 100000) return `₹${(value / 100000).toFixed(1)}L`;
  if (value >= 1000)   return `₹${(value / 1000).toFixed(1)}K`;
  return `₹${value}`;
}

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="glass-strong rounded-xl p-3 border border-white/10 shadow-xl">
      <p className="text-slate-400 text-xs mb-2">Month {label}</p>
      {payload.map((p) => (
        <div key={p.dataKey} className="flex items-center gap-2 text-xs">
          <div className="w-2 h-2 rounded-full" style={{ background: p.color }} />
          <span className="text-slate-300">{p.name}:</span>
          <span className="font-bold" style={{ color: p.color }}>{formatINR(p.value)}</span>
        </div>
      ))}
      <div className="mt-1 pt-1 border-t border-white/10">
        <span className="text-slate-500 text-xs">Invested: {formatINR(payload[0]?.payload?.invested)}</span>
      </div>
    </div>
  );
};

export default function GrowthChart({ data = [], monthlyAmount = 1000 }) {
  // Show only every 6th month for cleaner x-axis
  const displayData = data.filter((_, i) => i % 6 === 5 || i === 0);

  return (
    <div className="w-full">
      <ResponsiveContainer width="100%" height={320}>
        <LineChart data={displayData} margin={{ top: 10, right: 20, bottom: 10, left: 10 }}>
          <defs>
            {SCENARIOS.map(({ key, color }) => (
              <linearGradient key={key} id={`gradient-${key}`} x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor={color} stopOpacity={0.6} />
                <stop offset="100%" stopColor={color} stopOpacity={1} />
              </linearGradient>
            ))}
          </defs>

          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />

          <XAxis
            dataKey="month"
            tick={{ fill: '#64748b', fontSize: 11 }}
            tickFormatter={(v) => `M${v}`}
            axisLine={{ stroke: 'rgba(255,255,255,0.08)' }}
            tickLine={false}
          />
          <YAxis
            tick={{ fill: '#64748b', fontSize: 11 }}
            tickFormatter={formatINR}
            axisLine={false}
            tickLine={false}
            width={55}
          />

          <Tooltip content={<CustomTooltip />} />

          <Legend
            wrapperStyle={{ paddingTop: '16px' }}
            formatter={(value) => <span style={{ color: '#94a3b8', fontSize: 12 }}>{value}</span>}
          />

          {/* Invested line */}
          <Line
            type="monotone"
            dataKey="invested"
            stroke="rgba(255,255,255,0.15)"
            strokeDasharray="4 4"
            dot={false}
            strokeWidth={1.5}
            name="Amount Invested"
          />

          {SCENARIOS.map(({ key, color, label }) => (
            <Line
              key={key}
              type="monotone"
              dataKey={key}
              stroke={color}
              strokeWidth={2.5}
              dot={false}
              activeDot={{ r: 5, fill: color, stroke: '#0a0f1e', strokeWidth: 2 }}
              name={label}
              style={{ filter: `drop-shadow(0 0 4px ${color}60)` }}
            />
          ))}
        </LineChart>
      </ResponsiveContainer>

      {/* Scenario labels */}
      <div className="grid grid-cols-3 gap-3 mt-4">
        {SCENARIOS.map(({ key, color, label }) => {
          const last = data[data.length - 1];
          const val = last?.[key];
          const invested = last?.invested;
          const pct = val && invested ? Math.round(((val - invested) / invested) * 100) : 0;
          return (
            <div key={key} className="glass rounded-xl p-3 text-center border border-white/5">
              <div className="w-3 h-3 rounded-full mx-auto mb-1" style={{ background: color }} />
              <p className="text-xs text-slate-400 mb-1">{label}</p>
              <p className="font-bold text-sm" style={{ color }}>{formatINR(val || 0)}</p>
              <p className="text-xs text-slate-500">+{pct}% return</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
