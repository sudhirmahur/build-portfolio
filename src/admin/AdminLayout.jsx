import { useEffect, useState } from 'react';
import { Link, NavLink, Outlet, useLocation } from 'react-router-dom';
import { api } from '../api/client';
import { useAuth } from '../context/AuthContext';
import ThemeToggle from '../components/ThemeToggle';
import AdminIcon from './components/AdminIcon';

const links = [
  { to: '/admin', label: 'Dashboard', icon: 'dashboard', end: true },
  { to: '/admin/profile', label: 'Profile & content', icon: 'user' },
  { to: '/admin/pages', label: 'Pages & menu', icon: 'pages' },
  { to: '/admin/design', label: 'Design & link', icon: 'eye' },
  { to: '/admin/projects', label: 'Projects', icon: 'folder' },
  { to: '/admin/experience', label: 'Experience', icon: 'briefcase' },
  { to: '/admin/skills', label: 'Skills', icon: 'code' },
  { to: '/admin/education', label: 'Education', icon: 'book' },
  { to: '/admin/messages', label: 'Messages', icon: 'inbox', badge: true },
  { to: '/admin/account', label: 'Account', icon: 'lock' },
];
const superLink = { to: '/admin/users', label: 'Users & portfolios', icon: 'user', superOnly: true };

export default function AdminLayout() {
  const { admin, logout, isSuperAdmin } = useAuth();
  const portfolioPath = admin?.portfolio ? `/p/${admin.portfolio.slug}` : '/';
  const { pathname } = useLocation();
  const [open, setOpen] = useState(false);
  const [unread, setUnread] = useState(0);

  useEffect(() => {
    setOpen(false);
    window.scrollTo(0, 0);
    let cancelled = false;
    api
      .get('/admin/stats')
      .then((res) => {
        if (!cancelled) setUnread(res.data.unread || 0);
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, [pathname]);

  const sidebar = (
    <div className="flex h-full flex-col">
      <div className="border-b border-[var(--border)] px-5 py-4">
        <p className="font-display text-lg font-semibold">
          Admin<span className="text-[var(--accent)]">.</span>
        </p>
        <p className="truncate text-xs text-[var(--text-muted)]">{admin?.email}</p>
      </div>
      <nav className="flex-1 overflow-y-auto p-3" aria-label="Admin">
        <ul className="flex flex-col gap-1">
          {(isSuperAdmin ? [links[0], superLink, ...links.slice(1)] : links).map((link) => (
            <li key={link.to}>
              <NavLink
                to={link.to}
                end={link.end}
                className={({ isActive }) =>
                  `flex items-center gap-3 rounded-md px-3 py-2.5 text-sm transition-colors ${
                    isActive
                      ? 'bg-[var(--bg-elevated-2)] text-[var(--accent)]'
                      : 'text-[var(--text-muted)] hover:bg-[var(--bg-elevated)] hover:text-[var(--text)]'
                  }`
                }
              >
                <AdminIcon name={link.icon} size={17} />
                <span className="flex-1">{link.label}</span>
                {link.badge && unread > 0 && (
                  <span className="rounded-full bg-[var(--accent)] px-2 py-0.5 text-[11px] font-medium text-[var(--color-ink-950)]">
                    {unread}
                  </span>
                )}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
      <div className="flex flex-col gap-2 border-t border-[var(--border)] p-3">
        <Link to={portfolioPath} target="_blank" className="btn btn-outline btn-sm w-full">
          <AdminIcon name="external" size={14} />
          My portfolio
        </Link>
        <button type="button" onClick={logout} className="btn btn-danger btn-sm w-full">
          <AdminIcon name="logout" size={14} />
          Log out
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen lg:pl-64">
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-64 border-r border-[var(--border)] bg-[var(--bg)] lg:block">
        {sidebar}
      </aside>

      {open && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <button
            type="button"
            aria-label="Close menu"
            onClick={() => setOpen(false)}
            className="absolute inset-0 cursor-default bg-black/60"
          />
          <aside className="absolute inset-y-0 left-0 w-72 max-w-[85vw] border-r border-[var(--border)] bg-[var(--bg)]">
            {sidebar}
          </aside>
        </div>
      )}

      <header className="sticky top-0 z-30 flex items-center justify-between gap-3 border-b border-[var(--border)] bg-[var(--bg)]/90 px-4 py-3 backdrop-blur lg:hidden">
        <button type="button" onClick={() => setOpen(true)} aria-label="Open menu" className="btn btn-outline btn-icon">
          <AdminIcon name="menu" size={18} />
        </button>
        <p className="font-display font-semibold">
          Admin<span className="text-[var(--accent)]">.</span>
        </p>
        <ThemeToggle />
      </header>

      <div className="hidden items-center justify-end gap-3 px-8 pt-5 lg:flex">
        <ThemeToggle />
      </div>

      <main className="mx-auto max-w-5xl px-4 py-6 sm:px-6 lg:px-8">
        <Outlet />
      </main>
    </div>
  );
}
