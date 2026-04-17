import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Trash2, TrendingUp, TrendingDown, DollarSign, PieChart, Calendar } from 'lucide-react';
import { toast } from 'react-hot-toast';

const BudgetTracker = () => {
  const [transactions, setTransactions] = useState([]);
  const [amount, setAmount] = useState('');
  const [type, setType] = useState('expense');
  const [category, setCategory] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(true);

  const fetchTransactions = async () => {
    try {
      const { data } = await axios.get('/api/transactions');
      setTransactions(data);
    } catch (error) {
      toast.error('Failed to fetch transactions');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!amount || !category) return;

    try {
      const { data } = await axios.post('/api/transactions', {
        amount: Number(amount),
        type,
        category,
        description
      });
      setTransactions([data, ...transactions]);
      setAmount('');
      setCategory('');
      setDescription('');
      toast.success('Transaction added');
    } catch (error) {
      toast.error('Failed to add transaction');
    }
  };

  const deleteTransaction = async (id) => {
    try {
      await axios.delete(`/api/transactions/${id}`);
      setTransactions(transactions.filter(t => t._id !== id));
      toast.success('Transaction deleted');
    } catch (error) {
      toast.error('Failed to delete transaction');
    }
  };

  const totals = transactions.reduce((acc, t) => {
    if (t.type === 'income') acc.income += t.amount;
    else acc.expense += t.amount;
    return acc;
  }, { income: 0, expense: 0 });

  const balance = totals.income - totals.expense;

  return (
    <div className="space-y-6">
      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="card-premium p-6 bg-gradient-to-br from-brand-600 to-brand-700 text-white">
          <div className="flex justify-between items-center mb-2">
            <span className="text-xs font-bold uppercase tracking-wider opacity-80">Total Balance</span>
            <DollarSign className="w-4 h-4" />
          </div>
          <div className="text-3xl font-bold">${balance.toLocaleString()}</div>
        </div>
        <div className="card-premium p-6 bg-white dark:bg-slate-900">
          <div className="flex justify-between items-center mb-2">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Income</span>
            <TrendingUp className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="text-2xl font-bold text-emerald-500">${totals.income.toLocaleString()}</div>
        </div>
        <div className="card-premium p-6 bg-white dark:bg-slate-900">
          <div className="flex justify-between items-center mb-2">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Expenses</span>
            <TrendingDown className="w-4 h-4 text-rose-500" />
          </div>
          <div className="text-2xl font-bold text-rose-500">${totals.expense.toLocaleString()}</div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Transaction Form */}
        <div className="card-premium p-6">
          <h3 className="text-lg font-bold mb-6 flex items-center dark:text-white">
            <Plus className="w-5 h-5 mr-2 text-brand-600" />
            Add Transaction
          </h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-500 uppercase">Amount</label>
                <input
                  required
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="0.00"
                  className="input-premium w-full text-sm py-2 px-3 rounded-lg dark:text-white dark:bg-slate-800 border-slate-200 dark:border-slate-700"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-500 uppercase">Type</label>
                <select
                  value={type}
                  onChange={(e) => setType(e.target.value)}
                  className="input-premium w-full text-sm py-2 px-3 rounded-lg dark:text-white dark:bg-slate-800 border-slate-200 dark:border-slate-700"
                >
                  <option value="income">Income</option>
                  <option value="expense">Expense</option>
                </select>
              </div>
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-500 uppercase">Category</label>
              <input
                required
                type="text"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                placeholder="e.g. Salary, Rent, Food"
                className="input-premium w-full text-sm py-2 px-3 rounded-lg dark:text-white dark:bg-slate-800 border-slate-200 dark:border-slate-700"
              />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-500 uppercase">Description (Optional)</label>
              <input
                type="text"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Details..."
                className="input-premium w-full text-sm py-2 px-3 rounded-lg dark:text-white dark:bg-slate-800 border-slate-200 dark:border-slate-700"
              />
            </div>
            <button type="submit" className="btn-primary w-full py-2.5 text-sm">
              Process Transaction
            </button>
          </form>
        </div>

        {/* Transaction History */}
        <div className="card-premium p-6">
          <h3 className="text-lg font-bold mb-6 flex items-center dark:text-white">
            <PieChart className="w-5 h-5 mr-2 text-brand-600" />
            Recent Activity
          </h3>
          <div className="space-y-3 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
            {loading ? (
              <p className="text-center text-slate-500 text-sm py-10">Loading transactions...</p>
            ) : transactions.length === 0 ? (
              <p className="text-center text-slate-500 text-sm py-10 italic">No transactions found.</p>
            ) : (
              <AnimatePresence initial={false}>
                {transactions.map((t) => (
                  <motion.div
                    key={t._id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 10 }}
                    className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-100 dark:border-slate-800"
                  >
                    <div className="flex items-center space-x-3">
                      <div className={`p-2 rounded-lg ${t.type === 'income' ? 'bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30' : 'bg-rose-100 text-rose-600 dark:bg-rose-900/30'}`}>
                        {t.type === 'income' ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
                      </div>
                      <div>
                        <div className="text-sm font-bold dark:text-white">{t.category}</div>
                        <div className="text-[10px] text-slate-500 flex items-center">
                          <Calendar className="w-3 h-3 mr-1" />
                          {new Date(t.date).toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      <div className={`text-sm font-bold ${t.type === 'income' ? 'text-emerald-500' : 'text-rose-500'}`}>
                        {t.type === 'income' ? '+' : '-'}${t.amount}
                      </div>
                      <button 
                        onClick={() => deleteTransaction(t._id)}
                        className="p-1.5 text-slate-400 hover:text-rose-500 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BudgetTracker;
