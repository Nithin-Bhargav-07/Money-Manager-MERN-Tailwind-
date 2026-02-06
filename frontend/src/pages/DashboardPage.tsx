import { useEffect, useMemo, useState } from 'react';
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from 'recharts';
import api from '../lib/api';
import { Transaction } from '../components/transactions/TransactionTable';

type AnalyticsRecord = {
  year: number;
  month?: number;
  week?: number;
  type: 'income' | 'expense' | 'transfer';
  totalAmount: number;
};

type AnalyticsResponse = {
  monthly: AnalyticsRecord[];
  weekly: AnalyticsRecord[];
  yearly: AnalyticsRecord[];
};

type Period = 'month' | 'week' | 'year';

const DashboardPage = () => {
  const [period, setPeriod] = useState<Period>('month');
  const [analytics, setAnalytics] = useState<AnalyticsResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [latestTransactions, setLatestTransactions] = useState<Transaction[]>([]);
  const [transactionsLoading, setTransactionsLoading] = useState(false);

  useEffect(() => {
    const fetchAnalytics = async () => {
      setLoading(true);
      try {
        const res = await api.get<AnalyticsResponse>('/analytics/summary');
        setAnalytics(res.data);
      } finally {
        setLoading(false);
      }
    };
    fetchAnalytics();
  }, []);

  useEffect(() => {
    const fetchLatestTransactions = async () => {
      setTransactionsLoading(true);
      try {
        const res = await api.get<Transaction[]>('/transactions');
        // Sort by date descending and limit
        const sorted = res.data.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
        setLatestTransactions(sorted);
      } finally {
        setTransactionsLoading(false);
      }
    };
    fetchLatestTransactions();
  }, []);

  const latestExpenses = useMemo(() => {
    return latestTransactions
      .filter((tx) => tx.type === 'expense')
      .slice(0, 10);
  }, [latestTransactions]);

  const latestIncome = useMemo(() => {
    return latestTransactions
      .filter((tx) => tx.type === 'income')
      .slice(0, 10);
  }, [latestTransactions]);

  const chartData = useMemo(() => {
    if (!analytics) return [];
    const source =
      period === 'month'
        ? analytics.monthly
        : period === 'week'
        ? analytics.weekly
        : analytics.yearly;

    const grouped = new Map<string, { label: string; income: number; expense: number }>();

    source.forEach((item) => {
      const label =
        period === 'year'
          ? `${item.year}`
          : period === 'month'
          ? `${item.month}/${item.year}`
          : `W${item.week} ${item.year}`;

      if (!grouped.has(label)) {
        grouped.set(label, { label, income: 0, expense: 0 });
      }
      const entry = grouped.get(label)!;
      if (item.type === 'income') entry.income += item.totalAmount;
      if (item.type === 'expense') entry.expense += item.totalAmount;
    });

    return Array.from(grouped.values());
  }, [analytics, period]);

  const totals = useMemo(() => {
    if (!analytics) return { income: 0, expense: 0, balance: 0 };
    let income = 0;
    let expense = 0;
    analytics.yearly.forEach((item) => {
      if (item.type === 'income') income += item.totalAmount;
      if (item.type === 'expense') expense += item.totalAmount;
    });
    return { income, expense, balance: income - expense };
  }, [analytics]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-xl md:text-2xl font-semibold text-slate-900">
            Overview
          </h1>
          <p className="text-base text-slate-500">
            Track your income, expenses and balance at a glance.
          </p>
        </div>
        <div className="flex items-center gap-2 bg-white rounded-xl border border-slate-100 p-1 shadow-soft">
          {(['month', 'week', 'year'] as Period[]).map((p) => (
            <button
              key={p}
              onClick={() => setPeriod(p)}
              className={`px-4 py-2 rounded-lg text-sm font-medium capitalize ${
                period === p
                  ? 'bg-slate-900 text-white'
                  : 'text-slate-600 hover:bg-slate-50'
              }`}
            >
              {p === 'month' ? 'Month' : p === 'week' ? 'Week' : 'Year'}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
        <div className="card p-5 md:p-6">
          <p className="text-sm font-medium text-slate-500 mb-2">Total Income</p>
          <p className="text-3xl font-semibold text-income">
            ₹{totals.income.toLocaleString()}
          </p>
        </div>
        <div className="card p-5 md:p-6">
          <p className="text-sm font-medium text-slate-500 mb-2">Total Expense</p>
          <p className="text-3xl font-semibold text-expense">
            ₹{totals.expense.toLocaleString()}
          </p>
        </div>
        <div className="card p-5 md:p-6">
          <p className="text-sm font-medium text-slate-500 mb-2">Balance</p>
          <p
            className={`text-3xl font-semibold ${
              totals.balance >= 0 ? 'text-income' : 'text-expense'
            }`}
          >
            ₹{totals.balance.toLocaleString()}
          </p>
        </div>
      </div>

      <div className="card p-5 md:p-6">
        <div className="flex items-center justify-between mb-5">
          <div>
            <p className="text-base font-medium text-slate-900">Income vs Expense</p>
            <p className="text-sm text-slate-500">
              Aggregated by {period === 'month' ? 'month' : period === 'week' ? 'week' : 'year'}
            </p>
          </div>
        </div>
        <div className="h-64 md:h-80">
          {loading ? (
            <div className="h-full flex items-center justify-center text-base text-slate-500">
              Loading chart...
            </div>
          ) : chartData.length === 0 ? (
            <div className="h-full flex items-center justify-center text-base text-slate-500">
              Add a few transactions to see your analytics.
            </div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="label" tick={{ fontSize: 13 }} />
                <YAxis tick={{ fontSize: 13 }} />
                <Tooltip />
                <Legend />
                <Bar dataKey="income" fill="#10b981" name="Income" radius={[4, 4, 0, 0]} />
                <Bar dataKey="expense" fill="#f43f5e" name="Expense" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>

      {/* Latest Transactions Tables */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
        {/* Latest Expenses - Left */}
        <div className="card p-5">
          <h2 className="text-lg font-semibold text-slate-900 mb-4">Latest Expenses</h2>
          {transactionsLoading ? (
            <div className="text-center py-8 text-base text-slate-500">Loading...</div>
          ) : latestExpenses.length === 0 ? (
            <div className="text-center py-8 text-base text-slate-500">No expenses yet</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm">
                <thead className="bg-slate-50 border-b border-slate-100">
                  <tr>
                    <th className="px-3 py-2 text-left font-semibold text-slate-600 text-sm">Date</th>
                    <th className="px-3 py-2 text-left font-semibold text-slate-600 text-sm">Description</th>
                    <th className="px-3 py-2 text-left font-semibold text-slate-600 text-sm">Category</th>
                    <th className="px-3 py-2 text-left font-semibold text-slate-600 text-sm">Division</th>
                    <th className="px-3 py-2 text-right font-semibold text-slate-600 text-sm">Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {latestExpenses.map((tx) => (
                    <tr key={tx._id} className="border-b border-slate-50 hover:bg-slate-50/60">
                      <td className="px-3 py-2 text-slate-700 text-sm">
                        {new Date(tx.date).toLocaleDateString()}
                      </td>
                      <td className="px-3 py-2 text-slate-700 text-sm max-w-[150px] truncate">
                        {tx.description || '-'}
                      </td>
                      <td className="px-3 py-2 text-slate-700 text-sm">{tx.category}</td>
                      <td className="px-3 py-2 text-slate-700 text-sm">{tx.division || '-'}</td>
                      <td className="px-3 py-2 text-right">
                        <span className="font-semibold text-sm text-expense">
                          -₹{tx.amount.toLocaleString()}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Latest Income - Right */}
        <div className="card p-5">
          <h2 className="text-lg font-semibold text-slate-900 mb-4">Latest Income</h2>
          {transactionsLoading ? (
            <div className="text-center py-8 text-base text-slate-500">Loading...</div>
          ) : latestIncome.length === 0 ? (
            <div className="text-center py-8 text-base text-slate-500">No income yet</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm">
                <thead className="bg-slate-50 border-b border-slate-100">
                  <tr>
                    <th className="px-3 py-2 text-left font-semibold text-slate-600 text-sm">Date</th>
                    <th className="px-3 py-2 text-left font-semibold text-slate-600 text-sm">Description</th>
                    <th className="px-3 py-2 text-left font-semibold text-slate-600 text-sm">Category</th>
                    <th className="px-3 py-2 text-right font-semibold text-slate-600 text-sm">Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {latestIncome.map((tx) => (
                    <tr key={tx._id} className="border-b border-slate-50 hover:bg-slate-50/60">
                      <td className="px-3 py-2 text-slate-700 text-sm">
                        {new Date(tx.date).toLocaleDateString()}
                      </td>
                      <td className="px-3 py-2 text-slate-700 text-sm max-w-[150px] truncate">
                        {tx.description || '-'}
                      </td>
                      <td className="px-3 py-2 text-slate-700 text-sm">{tx.category}</td>
                      <td className="px-3 py-2 text-right">
                        <span className="font-semibold text-sm text-income">
                          +₹{tx.amount.toLocaleString()}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;


