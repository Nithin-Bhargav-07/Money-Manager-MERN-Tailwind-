import { TransactionType } from './AddTransactionModal';

export type Transaction = {
  _id: string;
  type: TransactionType;
  amount: number;
  category: string;
  division?: string;
  description?: string;
  date: string;
  relatedAccount?: string;
  createdAt: string;
};

type Props = {
  items: Transaction[];
  onEdit: (transaction: Transaction) => void;
  onDelete: (id: string) => void;
};

const canEdit = (createdAt: string) => {
  const created = new Date(createdAt).getTime();
  const now = Date.now();
  const twelveHours = 12 * 60 * 60 * 1000;
  return now - created <= twelveHours;
};

const TransactionTable = ({ items, onEdit, onDelete }: Props) => {
  return (
    <div className="card overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead className="bg-slate-50 border-b border-slate-100">
            <tr>
              <th className="px-5 py-3 text-left font-semibold text-slate-600 text-base">Date</th>
              <th className="px-5 py-3 text-left font-semibold text-slate-600 text-base">Description</th>
              <th className="px-5 py-3 text-left font-semibold text-slate-600 text-base">Category</th>
              <th className="px-5 py-3 text-left font-semibold text-slate-600 text-base">Division</th>
              <th className="px-5 py-3 text-right font-semibold text-slate-600 text-base">Amount</th>
              <th className="px-5 py-3 text-right font-semibold text-slate-600 text-base">Actions</th>
            </tr>
          </thead>
          <tbody>
            {items.length === 0 ? (
              <tr>
                <td
                  colSpan={6}
                  className="px-5 py-10 text-center text-slate-400 text-base"
                >
                  No transactions found. Use &quot;Add&quot; to create your first one.
                </td>
              </tr>
            ) : (
              items.map((tx) => {
                const editable = canEdit(tx.createdAt);
                return (
                  <tr key={tx._id} className="border-b border-slate-50 hover:bg-slate-50/60">
                    <td className="px-5 py-3 text-slate-700 text-base">
                      {new Date(tx.date).toLocaleDateString()}
                    </td>
                    <td className="px-5 py-3 text-slate-700 max-w-xs">
                      <div className="truncate text-base">{tx.description || '-'}</div>
                      <div className="text-xs text-slate-400 capitalize mt-1">
                        {tx.type}
                        {tx.relatedAccount ? ` • ${tx.relatedAccount}` : ''}
                      </div>
                    </td>
                    <td className="px-5 py-3 text-slate-700 text-base">{tx.category}</td>
                    <td className="px-5 py-3 text-slate-700 text-base">
                      {tx.division || (tx.type === 'expense' ? '-' : '—')}
                    </td>
                    <td className="px-5 py-3 text-right">
                      <span
                        className={`font-semibold text-base ${
                          tx.type === 'income'
                            ? 'text-income'
                            : tx.type === 'expense'
                            ? 'text-expense'
                            : 'text-accent'
                        }`}
                      >
                        {tx.type === 'expense' ? '-' : tx.type === 'income' ? '+' : ''}
                        ₹{tx.amount.toLocaleString()}
                      </span>
                    </td>
                    <td className="px-5 py-3 text-right">
                      <div className="flex justify-end gap-3">
                        {editable ? (
                          <button
                            type="button"
                            onClick={() => onEdit(tx)}
                            className="text-sm font-medium text-accent hover:underline"
                          >
                            Edit
                          </button>
                        ) : (
                          <span className="text-xs text-slate-400 italic">
                            Locked (12h passed)
                          </span>
                        )}
                        <button
                          type="button"
                          onClick={() => onDelete(tx._id)}
                          className="text-sm font-medium text-slate-400 hover:text-expense"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TransactionTable;


