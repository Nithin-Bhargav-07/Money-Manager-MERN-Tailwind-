import { FormEvent, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';

const RegisterPage = () => {
  const { register } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!name || !email || !password) {
      setError('Please fill in all fields');
      return;
    }
    try {
      setLoading(true);
      await register(name, email, password);
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Failed to sign up');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4" style={{ zoom: '1.1' }}>
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.25 }}
        className="card w-full max-w-lg px-10 py-10"
      >
        <div className="flex flex-col items-center mb-8">
          <div className="h-16 w-16 rounded-2xl bg-income/10 flex items-center justify-center text-income font-bold text-xl mb-3">
            MM
          </div>
          <h1 className="text-2xl font-semibold text-slate-900">Create your account</h1>
          <p className="text-base text-slate-500 mt-2">
            Start tracking your income, expenses, and transfers.
          </p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-slate-600 mb-2">Name</label>
            <input
              type="text"
              className="w-full rounded-lg border border-slate-200 bg-slate-50/60 px-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-income/60 focus:border-income/40"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-600 mb-2">Email</label>
            <input
              type="email"
              className="w-full rounded-lg border border-slate-200 bg-slate-50/60 px-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-income/60 focus:border-income/40"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-600 mb-2">Password</label>
            <input
              type="password"
              className="w-full rounded-lg border border-slate-200 bg-slate-50/60 px-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-income/60 focus:border-income/40"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
            />
          </div>
          {error && (
            <p className="text-sm text-expense bg-rose-50 border border-rose-100 rounded-md px-4 py-3">
              {error}
            </p>
          )}
          <button
            type="submit"
            disabled={loading}
            className="btn-primary w-full justify-center py-3 mt-3 disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {loading ? 'Creating your space...' : 'Sign up'}
          </button>
        </form>
        <p className="mt-6 text-sm text-center text-slate-500">
          Already have an account?{' '}
          <Link to="/login" className="text-accent font-medium hover:underline">
            Sign in
          </Link>
        </p>
      </motion.div>
    </div>
  );
};

export default RegisterPage;


