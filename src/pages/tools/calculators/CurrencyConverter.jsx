import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { DollarSign, ArrowLeft, RefreshCw } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import FinorToolInsight from '../../../components/shared/FinorToolInsight';

// Popular currency pairs
const CURRENCIES = [
  { code: 'USD', name: 'US Dollar', symbol: '$', flag: '🇺🇸' },
  { code: 'EUR', name: 'Euro', symbol: '€', flag: '🇪🇺' },
  { code: 'GBP', name: 'British Pound', symbol: '£', flag: '🇬🇧' },
  { code: 'JPY', name: 'Japanese Yen', symbol: '¥', flag: '🇯🇵' },
  { code: 'INR', name: 'Indian Rupee', symbol: '₹', flag: '🇮🇳' },
  { code: 'CAD', name: 'Canadian Dollar', symbol: 'C$', flag: '🇨🇦' },
  { code: 'AUD', name: 'Australian Dollar', symbol: 'A$', flag: '🇦🇺' },
  { code: 'CHF', name: 'Swiss Franc', symbol: 'Fr', flag: '🇨🇭' },
  { code: 'SGD', name: 'Singapore Dollar', symbol: 'S$', flag: '🇸🇬' },
  { code: 'AED', name: 'UAE Dirham', symbol: 'د.إ', flag: '🇦🇪' },
];

const CurrencyConverter = () => {
  const navigate = useNavigate();
  const [amount, setAmount] = useState(1000);
  const [from, setFrom] = useState('USD');
  const [to, setTo] = useState('INR');
  const [rates, setRates] = useState(null);
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchRates();
  }, []);

  const fetchRates = async () => {
    setLoading(true);
    setError(null);
    try {
      // Using free open-source exchangerate API
      const res = await fetch(`https://api.frankfurter.app/latest?from=USD`);
      if (!res.ok) throw new Error('Failed to fetch');
      const data = await res.json();
      // Frankfurter doesn't include USD->USD (1.0), add it
      setRates({ ...data.rates, USD: 1 });
      setLastUpdated(data.date);
    } catch (err) {
      setError('Could not load live rates. Showing fallback data.');
      // Fallback approximate rates (relative to USD)
      setRates({ USD: 1, EUR: 0.92, GBP: 0.79, JPY: 149.5, INR: 83.5, CAD: 1.36, AUD: 1.53, CHF: 0.88, SGD: 1.34, AED: 3.67 });
    } finally {
      setLoading(false);
    }
  };

  const convert = () => {
    if (!rates) return 0;
    // Convert via USD as base
    const fromRate = rates[from];
    const toRate = rates[to];
    return (amount / fromRate) * toRate;
  };

  const swap = () => {
    setFrom(to);
    setTo(from);
  };

  const convertedAmount = convert();
  const exchangeRate = rates ? (1 / (rates[from] || 1)) * (rates[to] || 1) : 0;

  const fadeInUp = { initial: { opacity: 0, y: 15 }, animate: { opacity: 1, y: 0 } };

  const fromCurrency = CURRENCIES.find(c => c.code === from);
  const toCurrency = CURRENCIES.find(c => c.code === to);

  const insights = [
    { type: 'insight', text: `1 ${from} = ${exchangeRate.toFixed(4)} ${to}` },
    { type: 'tip', text: 'Bank and broker exchange rates may include a margin of 1–3% on top of the mid-market rate shown here.' }
  ];

  return (
    <div className="py-20 bg-[#F9FAFB] dark:bg-[#080C10] min-h-screen font-sans selection:bg-brand-500/20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <button onClick={() => navigate('/tools')} className="mb-8 flex items-center text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-teal-500 transition-colors">
          <ArrowLeft className="w-4 h-4 mr-2" /> Back to Tools
        </button>

        <motion.div {...fadeInUp} className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-black dark:text-white tracking-tighter">Currency Converter</h1>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">Live FX Rates</p>
          </div>
          <button onClick={fetchRates} className="flex items-center space-x-2 px-5 py-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl text-[10px] font-black uppercase tracking-widest text-slate-500 hover:text-teal-600 transition-colors">
            <RefreshCw className="w-3 h-3" />
            <span>Refresh</span>
          </button>
        </motion.div>

        {error && (
          <div className="mb-6 px-6 py-4 bg-amber-50 dark:bg-amber-900/10 border border-amber-200 dark:border-amber-800 rounded-2xl text-xs font-bold text-amber-700 dark:text-amber-400">
            ⚠️ {error}
          </div>
        )}

        <motion.div {...fadeInUp} transition={{ delay: 0.1 }} className="bg-white dark:bg-slate-900 rounded-[2.5rem] p-8 md:p-12 border border-slate-200 dark:border-slate-800 shadow-xl mb-8 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-teal-500 rounded-full blur-[120px] opacity-10 -mr-32 -mt-32 pointer-events-none" />
          
          {/* Amount Input */}
          <div className="mb-10">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-3">Amount</label>
            <input 
              type="number" 
              value={amount}
              onChange={(e) => setAmount(Number(e.target.value))}
              className="w-full text-3xl md:text-5xl font-black bg-transparent dark:text-white focus:outline-none placeholder:text-slate-200"
              placeholder="0"
            />
          </div>

          {/* Currency Selectors */}
          <div className="grid grid-cols-1 md:grid-cols-[1fr_auto_1fr] gap-6 items-center">
            <div className="bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl p-4">
              <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest block mb-2">From</label>
              <div className="flex items-center space-x-3">
                <span className="text-2xl">{fromCurrency?.flag}</span>
                <select value={from} onChange={(e) => setFrom(e.target.value)} className="flex-1 bg-transparent font-black text-lg dark:text-white focus:outline-none cursor-pointer">
                  {CURRENCIES.map(c => <option key={c.code} value={c.code}>{c.code} — {c.name}</option>)}
                </select>
              </div>
            </div>

            <button onClick={swap} className="mx-auto w-12 h-12 flex items-center justify-center bg-teal-600 text-white rounded-2xl hover:scale-110 active:scale-95 transition-transform shadow-lg shadow-teal-500/20">
              <RefreshCw className="w-5 h-5" />
            </button>

            <div className="bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl p-4">
              <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest block mb-2">To</label>
              <div className="flex items-center space-x-3">
                <span className="text-2xl">{toCurrency?.flag}</span>
                <select value={to} onChange={(e) => setTo(e.target.value)} className="flex-1 bg-transparent font-black text-lg dark:text-white focus:outline-none cursor-pointer">
                  {CURRENCIES.map(c => <option key={c.code} value={c.code}>{c.code} — {c.name}</option>)}
                </select>
              </div>
            </div>
          </div>

          {/* Result */}
          <div className="mt-10 pt-10 border-t border-slate-100 dark:border-slate-800">
            {loading ? (
              <div className="h-16 bg-slate-100 dark:bg-slate-800 rounded-2xl animate-pulse" />
            ) : (
              <div>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Converted Amount</p>
                <p className="text-4xl md:text-6xl font-black dark:text-white tracking-tighter">
                  {toCurrency?.symbol}{convertedAmount.toLocaleString(undefined, { maximumFractionDigits: 2 })}
                </p>
                <p className="text-xs font-bold text-slate-400 mt-3">
                  1 {from} = {exchangeRate.toFixed(4)} {to}
                  {lastUpdated && <span className="ml-3 opacity-50">• Rate as of {lastUpdated}</span>}
                </p>
              </div>
            )}
          </div>
        </motion.div>

        <FinorToolInsight insights={insights} isLoading={loading} />
      </div>
    </div>
  );
};

export default CurrencyConverter;
