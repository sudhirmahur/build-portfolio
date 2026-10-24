import { useState } from 'react';
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import AdminIcon from '../components/AdminIcon';
import { Spinner } from '../components/ui';

export default function Login() {
  const { admin, loading, login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [form, setForm] = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Spinner size={28} />
      </div>
    );
  }
  if (admin) return <Navigate to="/admin" replace />;

  const from = location.state?.from && location.state.from !== '/admin/login' ? location.state.from : '/admin';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setBusy(true);
    try {
      await login(form.email, form.password);
      navigate(from, { replace: true });
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center px-4 py-10">
      <div className="w-full max-w-sm">
        <div className="mb-6 text-center">
          <span className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-[var(--bg-elevated-2)] text-[var(--accent)]">
            <AdminIcon name="lock" size={22} />
          </span>
          <h1 className="font-display text-2xl font-medium">Admin login</h1>
          <p className="mt-1 text-sm text-[var(--text-muted)]">Sign in to manage your portfolio.</p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4 rounded-lg border border-[var(--border)] bg-[var(--bg-elevated)] p-5 sm:p-6">
          <div>
            <label htmlFor="login-email" className="mb-1.5 block text-sm font-medium">Email</label>
            <input
              id="login-email"
              type="email"
              required
              autoComplete="username"
              className="field-input"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
            />
          </div>
          <div>
            <label htmlFor="login-password" className="mb-1.5 block text-sm font-medium">Password</label>
            <div className="relative">
              <input
                id="login-password"
                type={showPassword ? 'text' : 'password'}
                required
                autoComplete="current-password"
                className="field-input pr-10"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
              />
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
                className="absolute right-2 top-1/2 -translate-y-1/2 p-1 text-[var(--text-muted)] hover:text-[var(--text)]"
              >
                <AdminIcon name={showPassword ? 'eye-off' : 'eye'} size={16} />
              </button>
            </div>
          </div>

          {error && (
            <p role="alert" className="rounded-md border border-red-500/40 bg-red-500/10 px-3 py-2 text-sm text-red-400">
              {error}
            </p>
          )}

          <button type="submit" className="btn btn-primary w-full" disabled={busy}>
            {busy ? 'Signing in…' : 'Sign in'}
          </button>
        </form>

        <p className="mt-5 text-center text-sm text-[var(--text-muted)]">
          New here?{' '}
          <Link to="/admin/register" className="text-[var(--accent)] hover:underline">
            Create your portfolio
          </Link>
        </p>
        <p className="mt-2 text-center text-sm">
          <Link to="/" className="text-[var(--text-muted)] hover:text-[var(--accent)]">
            ← Back to home
          </Link>
        </p>
      </div>
    </div>
  );
}
