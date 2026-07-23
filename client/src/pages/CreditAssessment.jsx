import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import apiClient from '../api/client';
import { ChevronRight, ChevronLeft, Loader2, Phone, Zap, ShoppingCart, Wallet, Building } from 'lucide-react';

const STEPS = [
  {
    id: 1,
    title: 'Personal Information',
    subtitle: 'Tell us a bit about yourself',
    icon: Wallet,
    fields: [
      { key: 'name',       label: 'Full Name',          type: 'text',   placeholder: 'e.g. Priya Sharma' },
      { key: 'age',        label: 'Age',                 type: 'number', placeholder: 'e.g. 28', min: 18, max: 80 },
      { key: 'city',       label: 'City',                type: 'text',   placeholder: 'e.g. Surat' },
      { key: 'occupation', label: 'Occupation',          type: 'text',   placeholder: 'e.g. Textile Worker' },
    ],
  },
  {
    id: 2,
    title: 'Digital Signal Data',
    subtitle: 'Based on your last 6 months of digital activity',
    icon: Phone,
    fields: [
      {
        key: 'rechargeFrequency',
        label: 'Mobile Recharges per Month',
        type: 'slider',
        min: 0, max: 8, step: 1,
        hint: 'How many times do you recharge your mobile monthly?',
        unit: 'recharges/month',
        weight: '20% weight',
      },
      {
        key: 'utilityPaymentScore',
        label: 'Utility Payment Regularity',
        type: 'slider',
        min: 0, max: 100, step: 5,
        hint: 'How consistently do you pay electricity, water, gas bills? (0 = never, 100 = always on time)',
        unit: '/ 100',
        weight: '25% weight — highest impact',
      },
    ],
  },
  {
    id: 3,
    title: 'E-commerce Activity',
    subtitle: 'Your online shopping behaviour in the past 6 months',
    icon: ShoppingCart,
    fields: [
      {
        key: 'ecommerceVolume',
        label: 'Monthly E-commerce Spend (₹)',
        type: 'slider',
        min: 0, max: 10000, step: 100,
        hint: 'Average monthly spend on Amazon, Flipkart, Meesho etc.',
        unit: '₹/month',
        weight: '15% weight',
      },
      {
        key: 'ecommerceConsistency',
        label: 'E-commerce Payment Consistency',
        type: 'slider',
        min: 0, max: 100, step: 5,
        hint: 'How consistent are your online payments? (0 = irregular, 100 = very consistent)',
        unit: '/ 100',
        weight: '20% weight',
      },
    ],
  },
  {
    id: 4,
    title: 'Financial Information',
    subtitle: 'Your current financial situation',
    icon: Building,
    fields: [
      {
        key: 'monthlyIncome',
        label: 'Monthly Income (₹)',
        type: 'slider',
        min: 5000, max: 50000, step: 500,
        hint: 'Your approximate monthly take-home income',
        unit: '₹/month',
        weight: '10% weight',
      },
      {
        key: 'existingEMI',
        label: 'Existing Monthly EMI / Loan Repayments (₹)',
        type: 'slider',
        min: 0, max: 20000, step: 100,
        hint: 'Total of all monthly EMI payments (0 if none)',
        unit: '₹/month',
        weight: '10% weight',
      },
    ],
  },
];

const DEFAULT_VALUES = {
  name: '',
  age: '',
  city: '',
  occupation: '',
  rechargeFrequency: 3,
  utilityPaymentScore: 60,
  ecommerceVolume: 2000,
  ecommerceConsistency: 60,
  monthlyIncome: 18000,
  existingEMI: 0,
};

export default function CreditAssessment() {
  const [step, setStep] = useState(0);
  const [values, setValues] = useState(DEFAULT_VALUES);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { setCreditData } = useApp();
  const navigate = useNavigate();

  const current = STEPS[step];
  const StepIcon = current.icon;
  const isLast = step === STEPS.length - 1;

  const handleChange = (key, val) => setValues((v) => ({ ...v, [key]: val }));

  const handleNext = async () => {
    if (!isLast) {
      setStep((s) => s + 1);
      return;
    }

    // Submit
    setLoading(true);
    setError('');
    try {
      const payload = {
        rechargeFrequency:    Number(values.rechargeFrequency),
        utilityPaymentScore:  Number(values.utilityPaymentScore),
        ecommerceVolume:      Number(values.ecommerceVolume),
        ecommerceConsistency: Number(values.ecommerceConsistency),
        monthlyIncome:        Number(values.monthlyIncome),
        existingEMI:          Number(values.existingEMI),
      };
      const result = await apiClient.submitCreditScore(payload);
      setCreditData({ ...result, name: values.name, city: values.city, occupation: values.occupation });
      navigate('/score-result');
    } catch (e) {
      setError(e.message || 'Failed to calculate score. Is the server running?');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen pt-24 pb-16 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-10">
          <h1 className="font-display font-black text-3xl text-white mb-2">Credit Assessment</h1>
          <p className="text-slate-400 text-sm">Enter your digital signal data to get your Credit Likelihood Score</p>
        </div>

        {/* Progress bar */}
        <div className="flex gap-2 mb-8">
          {STEPS.map((s, i) => (
            <div
              key={i}
              className={`flex-1 h-1.5 rounded-full transition-all duration-500 ${
                i <= step ? 'bg-teal-400' : 'bg-white/10'
              }`}
            />
          ))}
        </div>

        {/* Card */}
        <div className="glass-strong rounded-2xl p-8 border border-white/8">
          {/* Step header */}
          <div className="flex items-center gap-4 mb-8">
            <div className="w-12 h-12 rounded-xl bg-teal-400/10 border border-teal-400/20 flex items-center justify-center">
              <StepIcon size={22} className="text-teal-400" />
            </div>
            <div>
              <p className="text-xs text-teal-400 font-medium mb-0.5">Step {step + 1} of {STEPS.length}</p>
              <h2 className="font-display font-bold text-white text-xl">{current.title}</h2>
              <p className="text-slate-400 text-sm">{current.subtitle}</p>
            </div>
          </div>

          {/* Fields */}
          <div className="space-y-7">
            {current.fields.map((field) => (
              <div key={field.key}>
                <div className="flex justify-between items-center mb-2">
                  <label className="text-sm font-medium text-slate-300">{field.label}</label>
                  {field.weight && (
                    <span className="text-xs text-teal-400/70 bg-teal-400/10 px-2 py-0.5 rounded-full">{field.weight}</span>
                  )}
                </div>

                {field.type === 'slider' ? (
                  <div className="space-y-2">
                    <div className="flex justify-between text-xs text-slate-400">
                      <span>{field.min}{field.unit?.includes('₹') ? '' : ''}</span>
                      <span className="font-bold text-teal-400 text-base">
                        {field.unit?.includes('₹') ? `₹${Number(values[field.key]).toLocaleString('en-IN')}` : values[field.key]}{field.unit?.includes('/') ? ` ${field.unit}` : ''}
                      </span>
                      <span>{field.unit?.includes('₹') ? `₹${field.max.toLocaleString('en-IN')}` : field.max}</span>
                    </div>
                    <input
                      type="range"
                      min={field.min}
                      max={field.max}
                      step={field.step}
                      value={values[field.key]}
                      onChange={(e) => handleChange(field.key, e.target.value)}
                      className="w-full"
                    />
                    {field.hint && <p className="text-xs text-slate-500">{field.hint}</p>}
                  </div>
                ) : (
                  <input
                    type={field.type}
                    value={values[field.key]}
                    placeholder={field.placeholder}
                    min={field.min}
                    max={field.max}
                    onChange={(e) => handleChange(field.key, e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-teal-400/50 focus:bg-white/8 transition-all"
                  />
                )}
              </div>
            ))}
          </div>

          {/* Error */}
          {error && (
            <div className="mt-6 p-3 rounded-xl bg-rose-400/10 border border-rose-400/20 text-rose-400 text-sm">
              {error}
            </div>
          )}

          {/* Navigation */}
          <div className="flex gap-3 mt-8">
            {step > 0 && (
              <button
                onClick={() => setStep((s) => s - 1)}
                className="flex items-center gap-2 px-5 py-3 rounded-xl glass border border-white/10 text-slate-300 hover:text-white hover:border-white/20 transition-all text-sm font-medium"
              >
                <ChevronLeft size={16} /> Back
              </button>
            )}
            <button
              onClick={handleNext}
              disabled={loading}
              className="flex-1 flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-teal-500 to-teal-400 text-navy-900 font-bold text-sm hover:shadow-lg hover:shadow-teal-500/30 transition-all hover:scale-[1.02] disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loading ? (
                <><Loader2 size={18} className="animate-spin" /> Calculating Score…</>
              ) : isLast ? (
                <><Zap size={18} /> Calculate My Score</>
              ) : (
                <>Next <ChevronRight size={16} /></>
              )}
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}
