import { AlertTriangle } from 'lucide-react';

export default function Disclaimer({ compact = false }) {
  if (compact) {
    return (
      <p className="text-xs text-amber-400/80 flex items-center gap-1">
        <AlertTriangle size={12} />
        Educational purposes only — not regulated financial advice.
      </p>
    );
  }

  return (
    <div className="w-full rounded-xl border border-amber-400/30 bg-amber-400/5 p-4 flex gap-3">
      <AlertTriangle size={20} className="text-amber-400 flex-shrink-0 mt-0.5" />
      <div>
        <p className="text-amber-400 font-semibold text-sm mb-1">⚠️ Important Disclaimer</p>
        <p className="text-amber-300/80 text-xs leading-relaxed">
          All credit scores, investment projections, and financial recommendations displayed on this platform
          are generated using simulated mathematical models for <strong>educational purposes only</strong>.
          They do <strong>not</strong> constitute regulated financial advice, solicitation, or official credit assessment.
          Please consult a SEBI-registered financial advisor before making any investment decisions.
          Past performance does not guarantee future results.
        </p>
      </div>
    </div>
  );
}
