import { Link } from 'react-router-dom';
import { TrendingUp, Users, ShieldCheck, BarChart2, MessageSquare, PieChart, ArrowRight, Zap, Globe } from 'lucide-react';

const STATS = [
  { value: '190M+', label: 'Credit-invisible adults in India', icon: Users },
  { value: '300–950', label: 'CIBIL-equivalent score scale', icon: TrendingUp },
  { value: '3', label: 'Risk profiles: Conservative, Moderate, Aggressive', icon: ShieldCheck },
  { value: '10', label: 'Live user profiles in dashboard', icon: BarChart2 },
];

const FEATURES = [
  {
    icon: BarChart2,
    title: 'Credit Likelihood Scoring',
    desc: 'Uses mobile recharge frequency, utility payments, and e-commerce patterns — not just traditional credit history.',
    color: 'teal',
    to: '/credit-assessment',
  },
  {
    icon: MessageSquare,
    title: 'Conversational Risk Profiler',
    desc: '7-question chatbot that maps your financial personality to Conservative, Moderate, or Aggressive buckets.',
    color: 'gold',
    to: '/risk-profiler',
  },
  {
    icon: PieChart,
    title: 'AI-Driven Investment Advisor',
    desc: 'Plain-language micro-investment recommendations with simulated 5-year growth projections across 3 scenarios.',
    color: 'emerald',
    to: '/investment-advice',
  },
];

export default function Landing() {
  return (
    <main className="relative overflow-hidden">
      {/* Animated grid background */}
      <div className="fixed inset-0 grid-pattern opacity-40 pointer-events-none" />

      {/* ===== HERO ===== */}
      <section className="relative min-h-screen flex items-center pt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Left: Content */}
            <div className="space-y-8">
              {/* Badge */}
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass border border-teal-400/20 text-teal-400 text-sm font-medium animate-fade-in-up">
                <Zap size={14} className="animate-pulse" />
                FinTech for Underserved India · TetraTHON 2026
              </div>

              {/* Headline */}
              <h1 className="font-display font-black text-5xl lg:text-6xl leading-tight animate-fade-in-up delay-100">
                <span className="text-white">Credit Scoring</span>
                <br />
                <span className="gradient-text">for Everyone</span>
              </h1>

              {/* Subhead */}
              <p className="text-slate-400 text-lg leading-relaxed max-w-xl animate-fade-in-up delay-200">
                Over <span className="text-white font-semibold">190 million adults</span> in India lack formal credit history.
                We use <span className="text-teal-400 font-semibold">non-traditional digital signals</span> — recharge patterns,
                utility payments, and e-commerce behaviour — to build transparent credit scores and
                personalised micro-investment plans for Tier-2 and Tier-3 cities.
              </p>

              {/* CTAs */}
              <div className="flex flex-col sm:flex-row gap-4 animate-fade-in-up delay-300">
                <Link
                  to="/credit-assessment"
                  className="flex items-center justify-center gap-2 px-7 py-3.5 rounded-xl bg-gradient-to-r from-teal-500 to-teal-400 text-navy-900 font-bold text-base hover:shadow-lg hover:shadow-teal-500/30 transition-all hover:scale-105"
                >
                  Check Your Score
                  <ArrowRight size={18} />
                </Link>
                <Link
                  to="/dashboard"
                  className="flex items-center justify-center gap-2 px-7 py-3.5 rounded-xl glass border border-white/10 text-white font-semibold text-base hover:border-teal-400/30 transition-all hover:bg-white/5"
                >
                  View Dashboard
                </Link>
              </div>

              {/* Disclaimer note */}
              <p className="text-xs text-slate-600 animate-fade-in-up delay-400">
                ⚠️ Educational purposes only. Not regulated financial advice.
              </p>
            </div>

            {/* Right: Floating cards */}
            <div className="relative hidden lg:block">
              <div className="relative w-full h-96">
                {/* Main card */}
                <div className="absolute top-0 right-0 w-72 glass-strong rounded-2xl p-6 glow-teal animate-float border border-teal-400/20">
                  <p className="text-xs text-slate-400 mb-3">Credit Score · Priya Sharma</p>
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-16 h-16 rounded-full border-4 border-amber-400 flex items-center justify-center">
                      <span className="font-display font-black text-2xl text-amber-400">72</span>
                    </div>
                    <div>
                      <span className="text-amber-400 font-semibold text-sm">Medium Risk</span>
                      <p className="text-slate-400 text-xs">Score out of 100</p>
                    </div>
                  </div>
                  <div className="space-y-2">
                    {['Utility Payments', 'Recharge Freq.', 'E-commerce'].map((f, i) => (
                      <div key={f} className="flex items-center gap-2">
                        <div className="h-1.5 flex-1 bg-white/5 rounded-full">
                          <div className="h-full rounded-full bg-amber-400" style={{ width: `${[85, 70, 60][i]}%` }} />
                        </div>
                        <span className="text-xs text-slate-500 w-16">{f}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Investment mini card */}
                <div className="absolute bottom-0 left-0 w-56 glass rounded-xl p-4 border border-emerald-400/20 animate-float delay-500">
                  <p className="text-xs text-slate-400 mb-1">5-Year Growth</p>
                  <p className="font-display font-bold text-2xl text-emerald-400">₹1.85L</p>
                  <p className="text-xs text-slate-500">from ₹1,000/month SIP</p>
                  <div className="flex gap-1 mt-2">
                    {[20, 35, 45, 60, 72, 85, 90].map((h, i) => (
                      <div key={i} className="flex-1 bg-emerald-400 rounded-sm opacity-60" style={{ height: `${h * 0.4}px`, alignSelf: 'flex-end' }} />
                    ))}
                  </div>
                </div>

                {/* Pulse dot */}
                <div className="absolute top-1/2 right-1/3 w-3 h-3 rounded-full bg-teal-400 animate-ping opacity-60" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== STATS ===== */}
      <section className="py-16 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {STATS.map(({ value, label, icon: Icon }, i) => (
              <div key={i} className="glass rounded-2xl p-6 text-center border border-white/5 hover:border-teal-400/20 transition-all">
                <Icon size={22} className="text-teal-400 mx-auto mb-3" />
                <p className="font-display font-black text-3xl gradient-text mb-1">{value}</p>
                <p className="text-slate-400 text-xs leading-tight">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== FEATURES ===== */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <h2 className="font-display font-bold text-3xl lg:text-4xl text-white mb-4">
              Three Engines. One Mission.
            </h2>
            <p className="text-slate-400 max-w-xl mx-auto">
              An integrated platform that brings financial transparency and personalised guidance to the underserved.
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-6">
            {FEATURES.map(({ icon: Icon, title, desc, color, to }, i) => {
              const colorMap = {
                teal: { border: 'hover:border-teal-400/30', icon: 'text-teal-400', glow: 'group-hover:glow-teal' },
                gold: { border: 'hover:border-amber-400/30', icon: 'text-amber-400', glow: 'group-hover:glow-gold' },
                emerald: { border: 'hover:border-emerald-400/30', icon: 'text-emerald-400', glow: '' },
              }[color];

              return (
                <Link
                  key={i}
                  to={to}
                  className={`group glass rounded-2xl p-7 border border-white/5 ${colorMap.border} hover:bg-white/4 transition-all duration-300 hover:scale-[1.02] hover:-translate-y-1`}
                >
                  <div className={`w-12 h-12 rounded-xl glass mb-5 flex items-center justify-center border border-white/10 ${colorMap.glow} transition-all`}>
                    <Icon size={22} className={colorMap.icon} />
                  </div>
                  <h3 className="font-display font-bold text-white text-xl mb-3 group-hover:text-teal-400 transition-colors">
                    {title}
                  </h3>
                  <p className="text-slate-400 text-sm leading-relaxed mb-5">{desc}</p>
                  <span className="flex items-center gap-1.5 text-sm text-teal-400 font-medium">
                    Get Started <ArrowRight size={15} className="group-hover:translate-x-1 transition-transform" />
                  </span>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* ===== HOW IT WORKS ===== */}
      <section className="py-20">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <h2 className="font-display font-bold text-3xl text-white mb-4">How It Works</h2>
            <p className="text-slate-400">Four simple steps to financial clarity</p>
          </div>

          <div className="relative">
            {/* Connector line */}
            <div className="absolute top-8 left-8 right-8 h-0.5 bg-gradient-to-r from-teal-400/20 via-teal-400/60 to-emerald-400/20 hidden lg:block" />

            <div className="grid lg:grid-cols-4 gap-8">
              {[
                { step: '01', title: 'Submit Digital Signals', desc: 'Enter your recharge, utility, and e-commerce data', icon: '📱' },
                { step: '02', title: 'Get Credit Score', desc: 'Receive your score with top-3 feature explanations', icon: '📊' },
                { step: '03', title: 'Profile Your Risk', desc: 'Chat with our AI to discover your investor personality', icon: '💬' },
                { step: '04', title: 'Start Investing', desc: 'Get a personalised plan with ₹500–₹5,000/month', icon: '📈' },
              ].map(({ step, title, desc, icon }, i) => (
                <div key={i} className="flex flex-col items-center text-center relative">
                  <div className="w-16 h-16 rounded-2xl glass border border-teal-400/20 flex items-center justify-center text-2xl mb-4 relative z-10 bg-navy-900">
                    {icon}
                  </div>
                  <span className="text-teal-400 font-bold text-xs mb-1">{step}</span>
                  <h3 className="font-display font-semibold text-white text-sm mb-2">{title}</h3>
                  <p className="text-slate-500 text-xs leading-relaxed">{desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ===== CTA BANNER ===== */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="gradient-border">
            <div className="glass-strong rounded-2xl p-10 text-center">
              <Globe size={40} className="text-teal-400 mx-auto mb-5 animate-spin-slow" />
              <h2 className="font-display font-black text-3xl text-white mb-4">
                Ready to know your score?
              </h2>
              <p className="text-slate-400 mb-8 max-w-lg mx-auto">
                Start your financial journey today. No formal credit history required.
              </p>
              <Link
                to="/credit-assessment"
                className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-gradient-to-r from-teal-500 to-teal-400 text-navy-900 font-bold text-lg hover:shadow-xl hover:shadow-teal-500/30 transition-all hover:scale-105"
              >
                Check My Credit Score
                <ArrowRight size={20} />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
