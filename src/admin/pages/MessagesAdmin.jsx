import { useCallback, useEffect, useState } from 'react';
import { api } from '../../api/client';
import { useToast } from '../../context/ToastContext';
import AdminIcon from '../components/AdminIcon';
import { Badge, Card, ConfirmDialog, PageHeader, Spinner } from '../components/ui';

const formatDate = (value) =>
  new Date(value).toLocaleString(undefined, { dateStyle: 'medium', timeStyle: 'short' });

export default function MessagesAdmin() {
  const toast = useToast();
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [openId, setOpenId] = useState(null);
  const [deleting, setDeleting] = useState(null);
  const [busy, setBusy] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const res = await api.get('/admin/messages');
      setMessages(res.data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const setRead = async (message, read) => {
    try {
      const res = await api.patch(`/admin/messages/${message._id}`, { read });
      setMessages((list) => list.map((m) => (m._id === message._id ? res.data : m)));
    } catch (err) {
      toast.error(err.message);
    }
  };

  const toggleOpen = (message) => {
    const next = openId === message._id ? null : message._id;
    setOpenId(next);
    if (next && !message.read) setRead(message, true);
  };

  const handleDelete = async () => {
    setBusy(true);
    try {
      await api.del(`/admin/messages/${deleting._id}`);
      setMessages((list) => list.filter((m) => m._id !== deleting._id));
      toast.success('Message deleted');
      setDeleting(null);
    } catch (err) {
      toast.error(err.message);
    } finally {
      setBusy(false);
    }
  };

  const unread = messages.filter((m) => !m.read).length;

  return (
    <div>
      <PageHeader
        title="Messages"
        description={`Messages sent through the contact form. ${unread} unread.`}
      />

      {loading ? (
        <div className="flex justify-center py-20">
          <Spinner size={28} />
        </div>
      ) : error ? (
        <Card className="p-6 text-center">
          <p className="text-sm text-red-400">{error}</p>
          <button type="button" className="btn btn-outline mt-4" onClick={load}>
            Try again
          </button>
        </Card>
      ) : messages.length === 0 ? (
        <Card className="p-10 text-center">
          <p className="text-sm text-[var(--text-muted)]">No messages yet.</p>
        </Card>
      ) : (
        <ul className="flex flex-col gap-3">
          {messages.map((message) => {
            const open = openId === message._id;
            return (
              <li key={message._id}>
                <Card className={message.read ? '' : 'border-[var(--accent)]/60'}>
                  <button
                    type="button"
                    onClick={() => toggleOpen(message)}
                    aria-expanded={open}
                    className="flex w-full items-start gap-3 p-3 text-left sm:p-4"
                  >
                    <span
                      className={`mt-1.5 h-2.5 w-2.5 shrink-0 rounded-full ${message.read ? 'bg-[var(--border)]' : 'bg-[var(--accent)]'}`}
                      aria-hidden="true"
                    />
                    <span className="min-w-0 flex-1">
                      <span className="flex flex-wrap items-center gap-x-3 gap-y-1">
                        <span className="font-medium">{message.name}</span>
                        <span className="break-all text-sm text-[var(--text-muted)]">{message.email}</span>
                        {!message.read && <Badge tone="accent">New</Badge>}
                      </span>
                      <span className={`mt-1 block text-sm text-[var(--text-muted)] ${open ? '' : 'truncate'}`}>
                        {open ? '' : message.message}
                      </span>
                      <span className="mt-1 block text-xs text-[var(--text-muted)]">{formatDate(message.createdAt)}</span>
                    </span>
                    <AdminIcon name={open ? 'up' : 'down'} size={16} className="mt-1 text-[var(--text-muted)]" />
                  </button>

                  {open && (
                    <div className="border-t border-[var(--border)] p-3 sm:p-4">
                      <p className="whitespace-pre-wrap break-words text-sm leading-relaxed">{message.message}</p>
                      <div className="mt-4 flex flex-wrap gap-2">
                        <a
                          className="btn btn-primary btn-sm"
                          href={`mailto:${message.email}?subject=${encodeURIComponent('Re: your message')}`}
                        >
                          <AdminIcon name="mail" size={14} />
                          Reply
                        </a>
                        <button type="button" className="btn btn-outline btn-sm" onClick={() => setRead(message, !message.read)}>
                          Mark as {message.read ? 'unread' : 'read'}
                        </button>
                        <button type="button" className="btn btn-danger btn-sm" onClick={() => setDeleting(message)}>
                          <AdminIcon name="trash" size={14} />
                          Delete
                        </button>
                      </div>
                    </div>
                  )}
                </Card>
              </li>
            );
          })}
        </ul>
      )}

      {deleting && (
        <ConfirmDialog
          title="Delete message?"
          message={`The message from ${deleting.name} will be permanently deleted.`}
          busy={busy}
          onConfirm={handleDelete}
          onCancel={() => (busy ? undefined : setDeleting(null))}
        />
      )}
    </div>
  );
}
