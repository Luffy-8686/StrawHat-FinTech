import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import apiClient from '../api/client';
import { Bot, User, Loader2, ArrowRight } from 'lucide-react';

export default function RiskProfiler() {
  const [questions, setQuestions] = useState([]);
  const [currentQ, setCurrentQ] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const { setRiskData } = useApp();
  const navigate = useNavigate();
  const chatEndRef = useRef(null);

  // Load questions
  useEffect(() => {
    apiClient.getQuestions()
      .then((data) => {
        setQuestions(data.questions);
        setLoading(false);
        // First bot message
        setTimeout(() => {
          setMessages([{
            type: 'bot',
            text: "👋 Hello! I'm your FinAdvisor AI. I'll ask you 7 practical questions based on your real financial situation — income, savings, insurance, and goals. This helps map you to the right investment instruments. There are no right or wrong answers — just be honest!",
          }]);
          setTimeout(() => {
            setMessages((prev) => [...prev, {
              type: 'question',
              text: data.questions[0].question,
              context: data.questions[0].context,
              options: data.questions[0].options,
              qIndex: 0,
            }]);
          }, 800);
        }, 400);
      })
      .catch(() => setError('Could not load questions. Is the server running?'));
  }, []);

  // Auto-scroll chat
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleAnswer = async (qIndex, optionIndex, optionLabel) => {
    const question = questions[qIndex];
    const newAnswers = [...answers, { questionId: question.id, optionIndex }];
    setAnswers(newAnswers);

    // Show user choice
    setMessages((prev) => [...prev, { type: 'user', text: optionLabel }]);

    const nextIndex = qIndex + 1;

    if (nextIndex < questions.length) {
      // Next question
      setTimeout(() => {
        setMessages((prev) => [...prev, {
          type: 'question',
          text: questions[nextIndex].question,
          context: questions[nextIndex].context,
          options: questions[nextIndex].options,
          qIndex: nextIndex,
        }]);
        setCurrentQ(nextIndex);
      }, 600);
    } else {
      // Submit
      setSubmitting(true);
      setMessages((prev) => [...prev, { type: 'bot', text: '🔄 Analysing your responses…' }]);

      try {
        const result = await apiClient.submitRiskProfile(newAnswers);
        setRiskData(result);
        setMessages((prev) => [...prev, {
          type: 'bot',
          text: `✅ Your risk profile is: **${result.riskBucket}** investor (${result.percentage}% score). ${result.profile.description}`,
        }, { type: 'done', riskBucket: result.riskBucket, profile: result.profile }]);
      } catch (e) {
        setError(e.message);
      } finally {
        setSubmitting(false);
      }
    }
  };

  const PROFILE_COLORS = {
    Conservative: 'text-blue-400 border-blue-400/30 bg-blue-400/10',
    Moderate:     'text-amber-400 border-amber-400/30 bg-amber-400/10',
    Aggressive:   'text-emerald-400 border-emerald-400/30 bg-emerald-400/10',
  };

  return (
    <main className="min-h-screen pt-24 pb-16 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="font-display font-black text-3xl text-white mb-2">Risk Profiler</h1>
          <p className="text-slate-400 text-sm">7 questions to discover your investor personality</p>

          {/* Progress dots */}
          {questions.length > 0 && (
            <div className="flex justify-center gap-2 mt-4">
              {questions.map((_, i) => (
                <div
                  key={i}
                  className={`w-2 h-2 rounded-full transition-all duration-300 ${
                    i < answers.length
                      ? 'bg-teal-400'
                      : i === currentQ
                        ? 'bg-teal-400/60 scale-125'
                        : 'bg-white/15'
                  }`}
                />
              ))}
            </div>
          )}
        </div>

        {/* Chat window */}
        <div className="glass-strong rounded-2xl border border-white/8 overflow-hidden">
          {/* Chat header */}
          <div className="flex items-center gap-3 px-5 py-4 border-b border-white/5">
            <div className="w-8 h-8 rounded-full bg-teal-400/20 flex items-center justify-center">
              <Bot size={16} className="text-teal-400" />
            </div>
            <div>
              <p className="text-white text-sm font-semibold">FinAdvisor AI</p>
              <p className="text-xs text-emerald-400">● Online</p>
            </div>
          </div>

          {/* Messages */}
          <div className="h-96 overflow-y-auto p-5 space-y-4">
            {loading && (
              <div className="flex items-center gap-2 text-slate-400 text-sm">
                <Loader2 size={16} className="animate-spin text-teal-400" />
                Loading questions…
              </div>
            )}

            {error && (
              <div className="p-3 rounded-xl bg-rose-400/10 border border-rose-400/20 text-rose-400 text-sm">
                {error}
              </div>
            )}

            {messages.map((msg, i) => {
              if (msg.type === 'bot') {
                return (
                  <div key={i} className="flex items-start gap-3 chat-bubble-enter">
                    <div className="w-7 h-7 rounded-full bg-teal-400/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Bot size={13} className="text-teal-400" />
                    </div>
                    <div className="glass rounded-2xl rounded-tl-sm px-4 py-2.5 max-w-xs">
                      <p className="text-slate-300 text-sm leading-relaxed">{msg.text}</p>
                    </div>
                  </div>
                );
              }

              if (msg.type === 'user') {
                return (
                  <div key={i} className="flex items-start gap-3 justify-end chat-bubble-bot-enter">
                    <div className="bg-teal-400/20 border border-teal-400/30 rounded-2xl rounded-tr-sm px-4 py-2.5 max-w-xs">
                      <p className="text-teal-300 text-sm">{msg.text}</p>
                    </div>
                    <div className="w-7 h-7 rounded-full bg-slate-600 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <User size={13} className="text-slate-300" />
                    </div>
                  </div>
                );
              }

              if (msg.type === 'question') {
                return (
                  <div key={i} className="space-y-3 animate-fade-in">
                    <div className="flex items-start gap-3">
                      <div className="w-7 h-7 rounded-full bg-teal-400/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <Bot size={13} className="text-teal-400" />
                      </div>
                      <div className="glass rounded-2xl rounded-tl-sm px-4 py-3 max-w-sm">
                        <p className="text-white text-sm font-medium leading-relaxed">{msg.text}</p>
                        {msg.context && (
                          <p className="text-slate-500 text-xs mt-2 leading-relaxed border-t border-white/5 pt-2">
                            💡 {msg.context}
                          </p>
                        )}
                      </div>
                    </div>
                    {/* Only show options for the latest unanswered question */}
                    {msg.qIndex === currentQ && answers.length === msg.qIndex && (
                      <div className="ml-10 grid grid-cols-1 gap-2">
                        {msg.options.map((opt, j) => (
                          <button
                            key={j}
                            onClick={() => handleAnswer(msg.qIndex, j, opt.label)}
                            disabled={submitting}
                            className="text-left px-4 py-2.5 rounded-xl border border-white/10 text-slate-300 text-sm hover:border-teal-400/40 hover:bg-teal-400/5 hover:text-white transition-all"
                          >
                            {opt.label}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                );
              }

              if (msg.type === 'done') {
                const colorClass = PROFILE_COLORS[msg.riskBucket] || PROFILE_COLORS.Moderate;
                return (
                  <div key={i} className="animate-fade-in-up">
                    <div className={`rounded-2xl border p-5 ${colorClass}`}>
                      <p className="font-display font-bold text-lg mb-1">{msg.profile.label}</p>
                      <p className="text-sm opacity-80 mb-4 leading-relaxed">{msg.profile.description}</p>

                      {/* Recommended instruments */}
                      <p className="text-xs font-semibold opacity-70 mb-2">✅ Recommended Instruments:</p>
                      <div className="flex flex-wrap gap-2 mb-4">
                        {msg.profile.instruments.map((inst) => (
                          <span key={inst} className="text-xs px-2 py-0.5 rounded-full bg-white/10">
                            {inst}
                          </span>
                        ))}
                      </div>

                      {/* Dos */}
                      {msg.profile.dos?.length > 0 && (
                        <div className="mb-3">
                          <p className="text-xs font-semibold opacity-70 mb-1.5">👍 Do:</p>
                          <div className="space-y-1">
                            {msg.profile.dos.map((d, idx) => (
                              <p key={idx} className="text-xs opacity-80 flex items-start gap-1.5">
                                <span className="opacity-60 flex-shrink-0">→</span>{d}
                              </p>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Don'ts */}
                      {msg.profile.donts?.length > 0 && (
                        <div className="mb-4">
                          <p className="text-xs font-semibold opacity-70 mb-1.5">🚫 Don't:</p>
                          <div className="space-y-1">
                            {msg.profile.donts.map((d, idx) => (
                              <p key={idx} className="text-xs opacity-80 flex items-start gap-1.5">
                                <span className="opacity-60 flex-shrink-0">✕</span>{d}
                              </p>
                            ))}
                          </div>
                        </div>
                      )}

                      <button
                        onClick={() => navigate('/investment-advice')}
                        className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-teal-500 to-teal-400 text-navy-900 font-bold text-sm hover:shadow-lg transition-all hover:scale-105"
                      >
                        Get Investment Plan <ArrowRight size={15} />
                      </button>
                    </div>
                  </div>
                );
              }

              return null;
            })}

            {submitting && (
              <div className="flex items-center gap-2 text-slate-400 text-sm pl-10">
                <Loader2 size={14} className="animate-spin text-teal-400" />
                Analysing…
              </div>
            )}
            <div ref={chatEndRef} />
          </div>
        </div>
      </div>
    </main>
  );
}
