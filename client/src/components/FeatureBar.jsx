import { useEffect, useRef, useState } from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';

export default function FeatureBar({ feature, delay = 0 }) {
  const [width, setWidth] = useState(0);
  const ref = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTimeout(() => setWidth(feature.score), delay);
          observer.disconnect();
        }
      },
      { threshold: 0.3 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [feature.score, delay]);

  const isStrong = feature.score >= 60;
  const barColor = feature.score >= 70
    ? '#2ed573'
    : feature.score >= 45
      ? '#ffa502'
      : '#ff4757';

  return (
    <div ref={ref} className="space-y-1.5">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-lg">{feature.icon}</span>
          <span className="text-sm font-medium text-slate-300">{feature.label}</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm font-bold" style={{ color: barColor }}>
            {feature.score}/100
          </span>
          {isStrong
            ? <TrendingUp size={14} className="text-emerald-400" />
            : <TrendingDown size={14} className="text-rose-400" />
          }
        </div>
      </div>

      {/* Bar */}
      <div className="h-2 rounded-full bg-white/5 overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-1000 ease-out"
          style={{
            width: `${width}%`,
            background: `linear-gradient(90deg, ${barColor}88, ${barColor})`,
            boxShadow: `0 0 8px ${barColor}60`,
          }}
        />
      </div>

      {/* Weight label */}
      <p className="text-xs text-slate-500">
        Weight: {feature.weight}% of total score
      </p>
    </div>
  );
}
