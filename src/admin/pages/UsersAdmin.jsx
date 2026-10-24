import { useCallback, useEffect, useState } from 'react';
import { api } from '../../api/client';
import { useToast } from '../../context/ToastContext';
import { optimizeImage, initials } from '../../utils/image';
import AdminIcon from '../components/AdminIcon';
import { Badge, Card, ConfirmDialog, Modal, PageHeader, Spinner } from '../components/ui';

const fmt = (value) => (value ? new Date(value).toLocaleDateString(undefined, { dateStyle: 'medium' }) : '—');

function Row({ label, value }) {
  return (
    <div className="grid grid-cols-[7rem_1fr] gap-2 py-1.5 text-sm">
      <dt className="text-[var(--text-muted)]">{label}</dt>
      <dd className="min-w-0 break-words">{value || '—'}</dd>
    </div>
  );
}

export default function UsersAdmin() {
  const toast = useToast();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [query, setQuery] = useState('');
  const [selected, setSelected] = useState(null);
  const [deleting, setDeleting] = useState(null);
  const [busy, setBusy] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const res = await api.get('/superadmin/users');
      setUsers(res.data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const portfolioUrl = (user) => (user.portfolio ? `${window.location.origin}/p/${user.portfolio.slug}` : '');

  const toggleBlock = async (user) => {
    try {
      await api.patch(`/superadmin/users/${user.id}`, { blocked: !user.blocked });
      setUsers((list) => list.map((u) => (u.id === user.id ? { ...u, blocked: !u.blocked } : u)));
      setSelected((s) => (s && s.id === user.id ? { ...s, blocked: !s.blocked } : s));
      toast.success(user.blocked ? 'User unblocked' : 'User blocked — their portfolio is hidden');
    } catch (err) {
      toast.error(err.message);
    }
  };

  const remove = async () => {
    setBusy(true);
    try {
      await api.del(`/superadmin/users/${deleting.id}`);
      setUsers((list) => list.filter((u) => u.id !== deleting.id));
      setDeleting(null);
      setSelected(null);
      toast.success('User and portfolio deleted');
    } catch (err) {
      toast.error(err.message);
    } finally {
      setBusy(false);
    }
  };

  const q = query.trim().toLowerCase();
  const shown = users.filter(
    (u) =>
      !q ||
      [u.name, u.email, u.portfolio?.slug, u.profile?.title].some((v) => v && v.toLowerCase().includes(q))
  );

  return (
    <div>
      <PageHeader
        title="Users & portfolios"
        description={`${users.length} registered admin${users.length === 1 ? '' : 's'}. You can see each person's details and public link, block or delete them. Their portfolio content can only be edited by them.`}
      />

      <input
        className="field-input mb-4"
        placeholder="Search by name, email, URL or title…"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        aria-label="Search users"
      />

      {loading ? (
        <div className="flex justify-center py-20">
          <Spinner size={28} />
        </div>
      ) : error ? (
        <Card className="p-6 text-center">
          <p className="text-sm text-red-400">{error}</p>
          <button type="button" className="btn btn-outline mt-4" onClick={load}>Try again</button>
        </Card>
      ) : shown.length === 0 ? (
        <Card className="p-10 text-center text-sm text-[var(--text-muted)]">No users found.</Card>
      ) : (
        <ul className="flex flex-col gap-3">
          {shown.map((user) => (
            <li key={user.id}>
              <Card className={`flex flex-col gap-3 p-3 sm:flex-row sm:items-center sm:p-4 ${user.blocked ? 'opacity-70' : ''}`}>
                <div className="flex min-w-0 flex-1 items-center gap-3">
                  {user.profile?.avatar ? (
                    <img src={optimizeImage(user.profile.avatar, 120)} alt="" className="h-12 w-12 shrink-0 rounded-full object-cover" />
                  ) : (
                    <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[var(--bg-elevated-2)] font-display text-[var(--accent)]">
                      {initials(user.name)}
                    </span>
                  )}
                  <div className="min-w-0 flex-1">
                    <p className="flex flex-wrap items-center gap-2 font-medium">
                      <span className="truncate">{user.name}</span>
                      {user.role === 'superadmin' && <Badge tone="accent">Super admin</Badge>}
                      {user.blocked && <Badge tone="red">Blocked</Badge>}
                      {user.portfolio && !user.portfolio.published && <Badge>Unpublished</Badge>}
                    </p>
                    <p className="truncate text-sm text-[var(--text-muted)]">{user.email}</p>
                    {user.portfolio && (
                      <a
                        href={portfolioUrl(user)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block truncate font-mono text-xs text-[var(--accent)] hover:underline"
                      >
                        {portfolioUrl(user)}
                      </a>
                    )}
                  </div>
                </div>
                <div className="flex shrink-0 flex-wrap items-center gap-1.5">
                  <button type="button" className="btn btn-outline btn-sm" onClick={() => setSelected(user)}>
                    <AdminIcon name="user" size={14} />
                    Profile
                  </button>
                  {user.role !== 'superadmin' && (
                    <>
                      <button type="button" className="btn btn-outline btn-sm" onClick={() => toggleBlock(user)}>
                        {user.blocked ? 'Unblock' : 'Block'}
                      </button>
                      <button type="button" className="btn btn-danger btn-icon" onClick={() => setDeleting(user)} aria-label="Delete user" title="Delete user">
                        <AdminIcon name="trash" size={15} />
                      </button>
                    </>
                  )}
                </div>
              </Card>
            </li>
          ))}
        </ul>
      )}

      {selected && (
        <Modal title={selected.name} onClose={() => setSelected(null)}>
          <div className="mb-4 flex items-center gap-4">
            {selected.profile?.avatar ? (
              <img src={optimizeImage(selected.profile.avatar, 200)} alt="" className="h-20 w-20 rounded-full object-cover" />
            ) : (
              <span className="flex h-20 w-20 items-center justify-center rounded-full bg-[var(--bg-elevated-2)] font-display text-2xl text-[var(--accent)]">
                {initials(selected.name)}
              </span>
            )}
            <div className="min-w-0">
              <p className="font-display text-lg">{selected.name}</p>
              <p className="text-sm text-[var(--text-muted)]">{selected.profile?.title || 'No title yet'}</p>
            </div>
          </div>
          <dl className="divide-y divide-[var(--border)]">
            <Row label="Email" value={selected.email} />
            <Row label="Phone" value={selected.profile?.phone} />
            <Row label="Location" value={selected.profile?.location} />
            <Row label="Current job" value={selected.profile?.job} />
            <Row label="Education" value={selected.profile?.education} />
            <Row label="Portfolio" value={selected.portfolio ? portfolioUrl(selected) : 'None'} />
            <Row label="Projects" value={selected.portfolio ? String(selected.portfolio.projects) : ''} />
            <Row label="Status" value={selected.blocked ? 'Blocked' : selected.portfolio?.published ? 'Published' : 'Unpublished'} />
            <Row label="Joined" value={fmt(selected.createdAt)} />
            <Row label="Last login" value={fmt(selected.lastLoginAt)} />
          </dl>
          {selected.portfolio && (
            <a
              href={portfolioUrl(selected)}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-primary mt-5"
            >
              <AdminIcon name="external" size={14} />
              Open portfolio
            </a>
          )}
        </Modal>
      )}

      {deleting && (
        <ConfirmDialog
          title="Delete user?"
          message={`${deleting.name} (${deleting.email}) and their whole portfolio, including uploaded images, will be permanently deleted.`}
          confirmLabel="Delete user"
          busy={busy}
          onConfirm={remove}
          onCancel={() => (busy ? undefined : setDeleting(null))}
        />
      )}
    </div>
  );
}
