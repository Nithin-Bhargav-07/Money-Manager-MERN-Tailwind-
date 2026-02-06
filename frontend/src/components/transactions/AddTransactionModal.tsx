import { FormEvent, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../../lib/api';

export type TransactionType = 'income' | 'expense' | 'transfer';

type Props = {
  open: boolean;
  onClose: () => void;
  onCreated: () => void;
};

const defaultForm = {
  amount: '',
  category: '',
  division: 'Personal',
  description: '',
  date: new Date().toISOString().slice(0, 10),
  relatedAccount: ''
};

const AddTransactionModal = ({ open, onClose, onCreated }: Props) => {
  const [activeTab, setActiveTab] = useState<TransactionType>('income');
  const [form, setForm] = useState(defaultForm);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!form.amount || !form.category || !form.date) {
      setError('Amount, category and date are required');
      return;
    }
    try {
      setLoading(true);
      await api.post('/transactions', {
        type: activeTab,
        amount: Number(form.amount),
        category: form.category,
        division: activeTab === 'expense' ? form.division : undefined,
        description: form.description,
        date: new Date(form.date),
        relatedAccount: form.relatedAccount || undefined
      });
      setForm(defaultForm);
      onCreated();
      onClose();
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Failed to create transaction');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-30 flex items-center justify-center bg-slate-900/20 backdrop-blur-sm px-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            initial={{ y: 12, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 12, opacity: 0 }}
            transition={{ duration: 0.18 }}
            className="card w-full max-w-2xl p-6"
          >
            <div className="flex items-center justify-between mb-5">
              <div>
                <p className="text-lg font-semibold text-slate-900">Add transaction</p>
                <p className="text-sm text-slate-500">Capture income, expenses or transfers.</p>
              </div>
              <button
                onClick={onClose}
                className="text-base text-slate-500 hover:text-slate-900"
              >
                Close
              </button>
            </div>
            <div className="flex mb-5 rounded-full bg-slate-50 p-1 text-sm font-medium">
              {(['income', 'expense', 'transfer'] as TransactionType[]).map((tab) => (
                <button
                  key={tab}
                  type="button"
                  onClick={() => setActiveTab(tab)}
                  className={`flex-1 py-2 rounded-full capitalize ${
                    activeTab === tab
                      ? tab === 'income'
                        ? 'bg-income text-white'
                        : tab === 'expense'
                        ? 'bg-expense text-white'
                        : 'bg-accent text-white'
                      : 'text-slate-600'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-600 mb-2">
                    Amount
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    className="w-full rounded-lg border border-slate-200 bg-slate-50/60 px-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-accent/60 focus:border-accent/40"
                    value={form.amount}
                    onChange={(e) => setForm((f) => ({ ...f, amount: e.target.value }))}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-600 mb-2">
                    Category
                  </label>
                  <input
                    type="text"
                    placeholder="Food, Salary, Fuel..."
                    className="w-full rounded-lg border border-slate-200 bg-slate-50/60 px-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-accent/60 focus:border-accent/40"
                    value={form.category}
                    onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))}
                    required
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-600 mb-2">
                    Date
                  </label>
                  <input
                    type="date"
                    className="w-full rounded-lg border border-slate-200 bg-slate-50/60 px-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-accent/60 focus:border-accent/40"
                    value={form.date}
                    onChange={(e) => setForm((f) => ({ ...f, date: e.target.value }))}
                    required
                  />
                </div>
                {activeTab === 'expense' && (
                  <div>
                    <label className="block text-sm font-medium text-slate-600 mb-2">
                      Division
                    </label>
                    <select
                      className="w-full rounded-lg border border-slate-200 bg-slate-50/60 px-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-accent/60 focus:border-accent/40"
                      value={form.division}
                      onChange={(e) => setForm((f) => ({ ...f, division: e.target.value }))}
                      required
                    >
                      <option value="Personal">Personal</option>
                      <option value="Office">Office</option>
                    </select>
                  </div>
                )}
                {activeTab === 'transfer' && (
                  <div>
                    <label className="block text-sm font-medium text-slate-600 mb-2">
                      Related account
                    </label>
                    <input
                      type="text"
                      placeholder="Bank, Wallet..."
                      className="w-full rounded-lg border border-slate-200 bg-slate-50/60 px-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-accent/60 focus:border-accent/40"
                      value={form.relatedAccount}
                      onChange={(e) =>
                        setForm((f) => ({ ...f, relatedAccount: e.target.value }))
                      }
                    />
                  </div>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-600 mb-2">
                  Description
                </label>
                <textarea
                  maxLength={100}
                  rows={3}
                  className="w-full rounded-lg border border-slate-200 bg-slate-50/60 px-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-accent/60 focus:border-accent/40"
                  value={form.description}
                  onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
                  placeholder="Optional (max 100 characters)"
                />
                <p className="mt-1 text-xs text-slate-400 text-right">
                  {form.description.length}/100
                </p>
              </div>
              {error && (
                <p className="text-sm text-expense bg-rose-50 border border-rose-100 rounded-md px-4 py-3">
                  {error}
                </p>
              )}
              <div className="flex justify-end gap-3 pt-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="btn-outline px-5 py-3 text-base"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="btn-primary px-6 py-3 text-base disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {loading ? 'Saving...' : 'Save transaction'}
                </button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default AddTransactionModal;


