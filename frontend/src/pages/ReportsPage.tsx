import { useEffect, useState } from 'react';
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import api from '../lib/api';

type CategoryData = {
  category: string;
  type: 'income' | 'expense' | 'transfer';
  totalAmount: number;
  count: number;
};

type DivisionData = {
  division: string;
  totalAmount: number;
  count: number;
};

const COLORS = {
  income: '#10b981',
  expense: '#f43f5e',
  transfer: '#6366f1',
};

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

const ReportsPage = () => {
  const [categoryData, setCategoryData] = useState<CategoryData[]>([]);
  const [divisionData, setDivisionData] = useState<DivisionData[]>([]);
  const [summaryData, setSummaryData] = useState<AnalyticsResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [dateRange, setDateRange] = useState<{ start?: string; end?: string }>({});

  useEffect(() => {
    fetchReports();
  }, [dateRange]);

  const fetchReports = async () => {
    setLoading(true);
    try {
      const params: any = {};
      if (dateRange.start) params.startDate = dateRange.start;
      if (dateRange.end) params.endDate = dateRange.end;

      const [categoriesRes, divisionsRes, summaryRes] = await Promise.all([
        api.get<CategoryData[]>('/analytics/categories', { params }),
        api.get<DivisionData[]>('/analytics/divisions', { params }),
        api.get<AnalyticsResponse>('/analytics/summary', { params }),
      ]);

      setCategoryData(categoriesRes.data);
      setDivisionData(divisionsRes.data);
      setSummaryData(summaryRes.data);
    } catch (err) {
      console.error('Failed to fetch reports:', err);
    } finally {
      setLoading(false);
    }
  };

  const incomeByCategory = categoryData
    .filter((item) => item.type === 'income')
    .map((item) => ({ name: item.category, value: item.totalAmount }))
    .slice(0, 10);

  const expenseByCategory = categoryData
    .filter((item) => item.type === 'expense')
    .map((item) => ({ name: item.category, value: item.totalAmount }))
    .slice(0, 10);

  const divisionChartData = divisionData.map((item) => ({
    name: item.division,
    value: item.totalAmount,
  }));

  // Calculate totals from summary data - use all available data (yearly, monthly, or weekly)
  // If summary data is empty, fall back to category data
  const totals = (() => {
    if (summaryData && summaryData.yearly.length > 0) {
      // Use yearly aggregation (most accurate for totals)
      return summaryData.yearly.reduce(
        (acc, item) => {
          if (item.type === 'income') acc.income += item.totalAmount;
          if (item.type === 'expense') acc.expense += item.totalAmount;
          return acc;
        },
        { income: 0, expense: 0 }
      );
    } else if (summaryData && summaryData.monthly.length > 0) {
      // Fallback to monthly if yearly is empty
      return summaryData.monthly.reduce(
        (acc, item) => {
          if (item.type === 'income') acc.income += item.totalAmount;
          if (item.type === 'expense') acc.expense += item.totalAmount;
          return acc;
        },
        { income: 0, expense: 0 }
      );
    } else if (categoryData.length > 0) {
      // Final fallback: calculate from category data
      return categoryData.reduce(
        (acc, item) => {
          if (item.type === 'income') acc.income += item.totalAmount;
          if (item.type === 'expense') acc.expense += item.totalAmount;
          return acc;
        },
        { income: 0, expense: 0 }
      );
    }
    return { income: 0, expense: 0 };
  })();

  const totalIncome = totals.income;
  const totalExpense = totals.expense;

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-xl md:text-2xl font-semibold text-slate-900">Reports & Analytics</h1>
          <p className="text-base text-slate-500 mt-1">
            Detailed breakdowns of your income, expenses, and spending patterns.
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-2">
          <input
            type="date"
            className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-base focus:outline-none focus:ring-2 focus:ring-accent/60"
            value={dateRange.start || ''}
            onChange={(e) => setDateRange({ ...dateRange, start: e.target.value })}
            placeholder="Start Date"
          />
          <input
            type="date"
            className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-base focus:outline-none focus:ring-2 focus:ring-accent/60"
            value={dateRange.end || ''}
            onChange={(e) => setDateRange({ ...dateRange, end: e.target.value })}
            placeholder="End Date"
          />
          {(dateRange.start || dateRange.end) && (
            <button
              onClick={() => setDateRange({})}
              className="btn-outline text-base px-4 py-2"
            >
              Clear
            </button>
          )}
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
        <div className="card p-5">
          <p className="text-sm font-medium text-slate-500 mb-2">Total Income</p>
          <p className="text-3xl font-semibold text-income">
            ₹{totalIncome.toLocaleString()}
          </p>
        </div>
        <div className="card p-5">
          <p className="text-sm font-medium text-slate-500 mb-2">Total Expense</p>
          <p className="text-3xl font-semibold text-expense">
            ₹{totalExpense.toLocaleString()}
          </p>
        </div>
      </div>

      {/* Category Breakdown - Income */}
      {incomeByCategory.length > 0 && (
        <div className="card p-5">
          <h2 className="text-lg font-semibold text-slate-900 mb-4">Income by Category</h2>
          <div className="h-80">
            {loading ? (
              <div className="h-full flex items-center justify-center text-base text-slate-500">
                Loading...
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={incomeByCategory}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                  <YAxis tick={{ fontSize: 12 }} />
                  <Tooltip />
                  <Bar dataKey="value" fill={COLORS.income} radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>
      )}

      {/* Category Breakdown - Expenses */}
      {expenseByCategory.length > 0 && (
        <div className="card p-5">
          <h2 className="text-lg font-semibold text-slate-900 mb-4">Expenses by Category</h2>
          <div className="h-80">
            {loading ? (
              <div className="h-full flex items-center justify-center text-base text-slate-500">
                Loading...
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={expenseByCategory}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                  <YAxis tick={{ fontSize: 12 }} />
                  <Tooltip />
                  <Bar dataKey="value" fill={COLORS.expense} radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>
      )}

      {/* Division Breakdown */}
      {divisionChartData.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
          <div className="card p-5">
            <h2 className="text-lg font-semibold text-slate-900 mb-4">Expenses by Division</h2>
            <div className="h-64">
              {loading ? (
                <div className="h-full flex items-center justify-center text-base text-slate-500">
                  Loading...
                </div>
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={divisionChartData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {divisionChartData.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={index === 0 ? '#6366f1' : '#8b5cf6'}
                        />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              )}
            </div>
          </div>
          <div className="card p-5">
            <h2 className="text-lg font-semibold text-slate-900 mb-4">Division Summary</h2>
            <div className="space-y-4">
              {divisionData.map((item) => (
                <div key={item.division} className="flex items-center justify-between">
                  <div>
                    <p className="text-base font-medium text-slate-900">{item.division}</p>
                    <p className="text-sm text-slate-500">{item.count} transactions</p>
                  </div>
                  <p className="text-xl font-semibold text-expense">
                    ₹{item.totalAmount.toLocaleString()}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {!loading && categoryData.length === 0 && divisionData.length === 0 && summaryData && summaryData.yearly.length === 0 && (
        <div className="card p-8 text-center">
          <p className="text-base text-slate-500">
            No data available. Add some transactions to see your reports.
          </p>
        </div>
      )}

    </div>
  );
};

export default ReportsPage;


