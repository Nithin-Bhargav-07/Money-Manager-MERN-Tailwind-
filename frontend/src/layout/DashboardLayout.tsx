import { Outlet, NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';

const DashboardLayout = () => {
  const { user, logout } = useAuth();

  return (
    <div className="min-h-screen bg-slate-50 flex">
      <aside className="hidden md:flex w-64 flex-col border-r border-slate-200 bg-white/80 backdrop-blur">
        <div className="px-6 py-5 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-accent/10 flex items-center justify-center text-accent font-bold text-lg">
              MM
            </div>
            <div>
              <p className="font-semibold text-slate-900 text-base">Money Manager</p>
              <p className="text-xs text-slate-500">Soft finance dashboard</p>
            </div>
          </div>
        </div>
        <nav className="flex-1 px-3 py-4 space-y-1">
          <NavLink
            to="/"
            end
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-lg text-base font-medium ${
                isActive
                  ? 'bg-slate-100 text-slate-900'
                  : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
              }`
            }
          >
            <span className="h-2 w-2 rounded-full bg-accent" />
            Dashboard
          </NavLink>
          <NavLink
            to="/transactions"
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-lg text-base font-medium ${
                isActive
                  ? 'bg-slate-100 text-slate-900'
                  : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
              }`
            }
          >
            <span className="h-2 w-2 rounded-full bg-income" />
            Transactions
          </NavLink>
          <NavLink
            to="/reports"
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-lg text-base font-medium ${
                isActive
                  ? 'bg-slate-100 text-slate-900'
                  : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
              }`
            }
          >
            <span className="h-2 w-2 rounded-full bg-expense" />
            Reports
          </NavLink>
        </nav>
        <div className="px-4 py-5 border-t border-slate-100">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-slate-100 flex items-center justify-center text-sm font-semibold text-slate-700">
                {user?.name?.[0]?.toUpperCase()}
              </div>
              <div>
                <p className="text-base font-medium text-slate-900">{user?.name}</p>
                <p className="text-xs text-slate-500">{user?.email}</p>
              </div>
            </div>
            <button
              onClick={logout}
              className="text-sm font-medium text-slate-500 hover:text-slate-900"
            >
              Logout
            </button>
          </div>
        </div>
      </aside>

      <div className="flex-1 flex flex-col">
        <header className="h-18 border-b border-slate-200 bg-white/70 backdrop-blur flex items-center justify-between px-4 md:px-8">
          <div>
            <p className="text-base font-medium text-slate-500">Welcome back</p>
            <p className="text-xl font-semibold text-slate-900">
              {user?.name ? `${user.name}'s Money Space` : 'Money Manager'}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <div className="hidden sm:flex flex-col text-right">
              <span className="text-base font-medium text-slate-900">{user?.name}</span>
              <span className="text-sm text-slate-500">{user?.email}</span>
            </div>
            <button
              onClick={logout}
              className="btn-outline text-sm px-4 py-2"
            >
              Logout
            </button>
          </div>
        </header>
        <motion.main
          className="flex-1 px-4 md:px-8 py-6 md:py-8"
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}
        >
          <Outlet />
        </motion.main>
      </div>
    </div>
  );
};

export default DashboardLayout;


