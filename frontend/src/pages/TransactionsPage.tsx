import { useEffect, useState } from 'react';
import { Download } from 'lucide-react';
import api from '../lib/api';
import AddTransactionModal from '../components/transactions/AddTransactionModal';
import FiltersBar, { Filters } from '../components/transactions/FiltersBar';
import TransactionTable, { Transaction } from '../components/transactions/TransactionTable';
import { exportToCSV, exportToPDF } from '../utils/exportUtils';

const TransactionsPage = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [filters, setFilters] = useState<Filters>({});
  const [loading, setLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [exporting, setExporting] = useState(false);

  const loadTransactions = async () => {
    setLoading(true);
    try {
      const params: Record<string, string> = {};
      if (filters.startDate) params.startDate = filters.startDate;
      if (filters.endDate) params.endDate = filters.endDate;
      if (filters.category) params.category = filters.category;
      if (filters.division) params.division = filters.division;
      const res = await api.get<Transaction[]>('/transactions', { params });
      setTransactions(res.data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTransactions();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters.startDate, filters.endDate, filters.category, filters.division]);

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this transaction?')) return;
    await api.delete(`/transactions/${id}`);
    loadTransactions();
  };

  const handleEdit = async (tx: Transaction) => {
    // For brevity: reuse modal as create-only; edit could be implemented similarly with PATCH.
    alert('Editing is allowed within 12 hours; implement edit modal as an enhancement.');
  };

  const handleExportCSV = () => {
    if (transactions.length === 0) {
      alert('No transactions to export');
      return;
    }
    exportToCSV(transactions, 'transactions');
  };

  const handleExportPDF = async () => {
    if (transactions.length === 0) {
      alert('No transactions to export');
      return;
    }
    setExporting(true);
    try {
      await exportToPDF(transactions, 'transactions');
    } finally {
      setExporting(false);
    }
  };

  return (
    <div className="space-y-4 md:space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
        <div>
          <h1 className="text-xl md:text-2xl font-semibold text-slate-900">
            Transactions
          </h1>
          <p className="text-base text-slate-500">
            Manage your history and filter by date, category and division.
          </p>
        </div>
        <div className="flex items-center gap-3">
          {transactions.length > 0 && (
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleExportCSV}
                className="btn-outline text-base px-4 py-2.5 flex items-center gap-2"
                title="Export as CSV"
              >
                <Download className="h-4 w-4" />
                CSV
              </button>
              <button
                type="button"
                onClick={handleExportPDF}
                disabled={exporting}
                className="btn-outline text-base px-4 py-2.5 flex items-center gap-2 disabled:opacity-70"
                title="Export as PDF"
              >
                <Download className="h-4 w-4" />
                {exporting ? 'Exporting...' : 'PDF'}
              </button>
            </div>
          )}
          <button
            type="button"
            onClick={() => setModalOpen(true)}
            className="btn-primary text-base px-5 py-3"
          >
            Add transaction
          </button>
        </div>
      </div>

      <FiltersBar filters={filters} onChange={setFilters} />

      {loading ? (
        <div className="card p-5 text-base text-slate-500">Loading transactions...</div>
      ) : (
        <TransactionTable items={transactions} onEdit={handleEdit} onDelete={handleDelete} />
      )}

      <AddTransactionModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onCreated={loadTransactions}
      />
    </div>
  );
};

export default TransactionsPage;


