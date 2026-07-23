import { useEffect, useState } from 'react';

// CIBIL range: 300–950
const CIBIL_MIN = 300;
const CIBIL_MAX = 950;

const BUCKET_CONFIG = {
  Low:    { color: '#2ed573', label: 'Low Risk',    glow: 'rgba(46, 213, 115, 0.4)'  },
  Medium: { color: '#ffa502', label: 'Medium Risk', glow: 'rgba(255, 165, 2, 0.4)'   },
  High:   { color: '#ff4757', label: 'High Risk',   glow: 'rgba(255, 71, 87, 0.4)'   },
};

const BAND_CONFIG = {
  Excellent: { color: '#2ed573', label: 'Excellent' },
  Good:      { color: '#00d4ff', label: 'Good'      },
  Fair:      { color: '#ffa502', label: 'Fair'      },
  Poor:      { color: '#ff4757', label: 'Poor'      },
};

export default function ScoreGauge({ score = 300, bucket = 'High', cibilBand = '', size = 200, animated = true }) {
  const [displayScore, setDisplayScore] = useState(CIBIL_MIN);
  const [strokeDashoffset, setStrokeDashoffset] = useState(0);

  const config = BUCKET_CONFIG[bucket] || BUCKET_CONFIG.High;
  const bandConfig = BAND_CONFIG[cibilBand] || config;

  const radius = (size / 2) - 20;
  const circumference = 2 * Math.PI * radius;
  const strokeWidth = 12;

  // Normalise CIBIL score (300–950) to 0–1 for ring fill
  const fillRatio = (score - CIBIL_MIN) / (CIBIL_MAX - CIBIL_MIN);

  useEffect(() => {
    if (!animated) {
      setDisplayScore(score);
      setStrokeDashoffset(circumference - fillRatio * circumference);
      return;
    }

    let start = null;
    const duration = 1600;

    const animate = (timestamp) => {
      if (!start) start = timestamp;
      const progress = Math.min((timestamp - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplayScore(Math.round(CIBIL_MIN + eased * (score - CIBIL_MIN)));
      setStrokeDashoffset(circumference - eased * fillRatio * circumference);
      if (progress < 1) requestAnimationFrame(animate);
    };

    const timer = setTimeout(() => requestAnimationFrame(animate), 300);
    return () => clearTimeout(timer);
  }, [score, circumference, fillRatio, animated]);

  return (
    <div className="flex flex-col items-center gap-3">
      <div className="relative" style={{ width: size, height: size }}>
        {/* Glow backdrop */}
        <div
          className="absolute inset-0 rounded-full opacity-20 blur-xl"
          style={{ background: config.color }}
        />

        <svg width={size} height={size} className="relative z-10 -rotate-90">
          {/* Track marks for 300 / 550 / 650 / 750 / 950 */}
          {[300, 550, 650, 750, 950].map((mark) => {
            const ratio = (mark - CIBIL_MIN) / (CIBIL_MAX - CIBIL_MIN);
            const angle = ratio * 2 * Math.PI - Math.PI / 2;
            const cx = size / 2 + (radius + 14) * Math.cos(angle);
            const cy = size / 2 + (radius + 14) * Math.sin(angle);
            return (
              <circle key={mark} cx={cx} cy={cy} r={2} fill="rgba(255,255,255,0.2)" />
            );
          })}

          {/* Background ring */}
          <circle
            cx={size / 2} cy={size / 2} r={radius}
            fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth={strokeWidth}
          />
          {/* Score ring */}
          <circle
            cx={size / 2} cy={size / 2} r={radius}
            fill="none"
            stroke={config.color}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            className="score-ring"
            style={{ filter: `drop-shadow(0 0 8px ${config.glow})` }}
          />
        </svg>

        {/* Score text */}
        <div className="absolute inset-0 flex flex-col items-center justify-center z-20">
          <span className="text-slate-400 text-xs font-medium mb-0.5">CIBIL</span>
          <span className="font-display font-bold" style={{ color: config.color, fontSize: size > 150 ? '2.4rem' : '1.5rem' }}>
            {displayScore}
          </span>
          <span className="text-slate-400 text-xs font-medium">/ 950</span>
        </div>
      </div>

      {/* Bucket + Band badges */}
      <div className="flex flex-col items-center gap-1.5">
        <span
          className="px-4 py-1.5 rounded-full text-sm font-semibold border"
          style={{ color: config.color, borderColor: `${config.color}40`, background: `${config.color}10` }}
        >
          {config.label}
        </span>
        {cibilBand && (
          <span
            className="px-3 py-1 rounded-full text-xs font-medium border"
            style={{ color: bandConfig.color, borderColor: `${bandConfig.color}30`, background: `${bandConfig.color}08` }}
          >
            CIBIL Band: {cibilBand}
          </span>
        )}
      </div>
    </div>
  );
}
