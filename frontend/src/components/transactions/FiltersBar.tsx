type Filters = {
  startDate?: string;
  endDate?: string;
  category?: string;
  division?: string;
};

type Props = {
  filters: Filters;
  onChange: (next: Filters) => void;
};

const FiltersBar = ({ filters, onChange }: Props) => {
  return (
    <div className="card p-4 md:p-5 flex flex-col md:flex-row md:items-end gap-4 md:gap-5">
      <div className="flex-1 grid grid-cols-2 md:grid-cols-4 gap-4">
        <div>
          <label className="block text-sm font-medium text-slate-600 mb-2">
            Start date
          </label>
          <input
            type="date"
            value={filters.startDate || ''}
            onChange={(e) => onChange({ ...filters, startDate: e.target.value })}
            className="w-full rounded-lg border border-slate-200 bg-slate-50/60 px-4 py-2.5 text-base focus:outline-none focus:ring-2 focus:ring-accent/60 focus:border-accent/40"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-600 mb-2">
            End date
          </label>
          <input
            type="date"
            value={filters.endDate || ''}
            onChange={(e) => onChange({ ...filters, endDate: e.target.value })}
            className="w-full rounded-lg border border-slate-200 bg-slate-50/60 px-4 py-2.5 text-base focus:outline-none focus:ring-2 focus:ring-accent/60 focus:border-accent/40"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-600 mb-2">
            Category
          </label>
          <input
            type="text"
            placeholder="Any"
            value={filters.category || ''}
            onChange={(e) => onChange({ ...filters, category: e.target.value })}
            className="w-full rounded-lg border border-slate-200 bg-slate-50/60 px-4 py-2.5 text-base focus:outline-none focus:ring-2 focus:ring-accent/60 focus:border-accent/40"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-600 mb-2">
            Division
          </label>
          <select
            value={filters.division || ''}
            onChange={(e) => onChange({ ...filters, division: e.target.value || undefined })}
            className="w-full rounded-lg border border-slate-200 bg-slate-50/60 px-4 py-2.5 text-base focus:outline-none focus:ring-2 focus:ring-accent/60 focus:border-accent/40"
          >
            <option value="">Any</option>
            <option value="Personal">Personal</option>
            <option value="Office">Office</option>
          </select>
        </div>
      </div>
      <button
        type="button"
        onClick={() => onChange({ startDate: undefined, endDate: undefined, category: '', division: '' })}
        className="btn-outline text-base px-5 py-2.5 self-end"
      >
        Clear filters
      </button>
    </div>
  );
};

export type { Filters };
export default FiltersBar;


