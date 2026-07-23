import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { TrendingUp, Menu, X, BarChart2, MessageSquare, PieChart, LayoutDashboard, Home } from 'lucide-react';

const NAV_LINKS = [
  { to: '/',                   label: 'Home',       icon: Home },
  { to: '/credit-assessment',  label: 'Credit Score', icon: BarChart2 },
  { to: '/risk-profiler',      label: 'Risk Profile', icon: MessageSquare },
  { to: '/investment-advice',  label: 'Invest',     icon: PieChart },
  { to: '/dashboard',          label: 'Dashboard',  icon: LayoutDashboard },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      scrolled ? 'glass shadow-lg shadow-black/20' : 'bg-transparent'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-teal-400 to-teal-600 flex items-center justify-center glow-teal">
              <TrendingUp size={18} className="text-white" />
            </div>
            <span className="font-display font-bold text-lg gradient-text">CreditVision</span>
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-1">
            {NAV_LINKS.map(({ to, label, icon: Icon }) => {
              const active = location.pathname === to;
              return (
                <Link
                  key={to}
                  to={to}
                  className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                    active
                      ? 'bg-teal-400/10 text-teal-400 border border-teal-400/20'
                      : 'text-slate-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <Icon size={15} />
                  {label}
                </Link>
              );
            })}
          </div>

          {/* CTA button */}
          <div className="hidden md:flex">
            <Link
              to="/credit-assessment"
              className="px-5 py-2 rounded-lg bg-gradient-to-r from-teal-500 to-teal-400 text-navy-900 font-semibold text-sm hover:shadow-lg hover:shadow-teal-500/30 transition-all duration-200 hover:scale-105"
            >
              Get Started
            </Link>
          </div>

          {/* Mobile menu button */}
          <button
            className="md:hidden p-2 rounded-lg glass text-slate-400 hover:text-white"
            onClick={() => setOpen(!open)}
          >
            {open ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden glass border-t border-white/5">
          <div className="px-4 py-3 space-y-1">
            {NAV_LINKS.map(({ to, label, icon: Icon }) => {
              const active = location.pathname === to;
              return (
                <Link
                  key={to}
                  to={to}
                  onClick={() => setOpen(false)}
                  className={`flex items-center gap-2 px-4 py-3 rounded-lg text-sm font-medium transition-all ${
                    active
                      ? 'bg-teal-400/10 text-teal-400'
                      : 'text-slate-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <Icon size={16} />
                  {label}
                </Link>
              );
            })}
          </div>
        </div>
      )}
    </nav>
  );
}
