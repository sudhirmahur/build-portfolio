import { useEffect } from 'react';
import AdminIcon from './AdminIcon';

export function Spinner({ size = 20 }) {
  return (
    <span
      role="status"
      aria-label="Loading"
      style={{ width: size, height: size }}
      className="inline-block animate-spin rounded-full border-2 border-[var(--border)] border-t-[var(--accent)]"
    />
  );
}

export function PageHeader({ title, description, actions }) {
  return (
    <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
      <div className="min-w-0">
        <h1 className="font-display text-2xl font-medium">{title}</h1>
        {description && <p className="mt-1 max-w-2xl text-sm text-[var(--text-muted)]">{description}</p>}
      </div>
      {actions && <div className="flex flex-wrap items-center gap-2">{actions}</div>}
    </div>
  );
}

export function Card({ className = '', children }) {
  return (
    <div className={`rounded-lg border border-[var(--border)] bg-[var(--bg-elevated)] ${className}`}>
      {children}
    </div>
  );
}

export function Badge({ children, tone = 'muted' }) {
  const tones = {
    muted: 'border-[var(--border)] text-[var(--text-muted)]',
    accent: 'border-[var(--accent)]/50 text-[var(--accent)]',
    green: 'border-[var(--accent-2)]/50 text-[var(--accent-2-strong)]',
    red: 'border-red-500/50 text-red-400',
  };
  return (
    <span className={`inline-flex items-center rounded-full border px-2 py-0.5 text-[11px] ${tones[tone]}`}>
      {children}
    </span>
  );
}

export function Toggle({ checked, onChange, label, id }) {
  return (
    <label htmlFor={id} className="flex cursor-pointer items-center gap-3 text-sm">
      <span className="relative inline-flex h-6 w-11 shrink-0 items-center">
        <input
          id={id}
          type="checkbox"
          checked={Boolean(checked)}
          onChange={(e) => onChange(e.target.checked)}
          className="peer sr-only"
        />
        <span className="absolute inset-0 rounded-full border border-[var(--border)] bg-[var(--bg-elevated-2)] transition-colors peer-checked:border-[var(--accent)] peer-checked:bg-[var(--accent)] peer-focus-visible:outline peer-focus-visible:outline-2 peer-focus-visible:outline-[var(--accent)]" />
        <span className="absolute left-0.5 h-5 w-5 rounded-full bg-[var(--text-muted)] transition-transform peer-checked:translate-x-5 peer-checked:bg-[var(--color-ink-950)]" />
      </span>
      {label && <span>{label}</span>}
    </label>
  );
}

export function Modal({ title, onClose, children, footer, wide = false }) {
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape') onClose();
    };
    const previous = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = previous;
      window.removeEventListener('keydown', onKey);
    };
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-[90] flex items-end justify-center sm:items-center sm:p-4" role="dialog" aria-modal="true" aria-label={title}>
      <button
        type="button"
        aria-label="Close dialog"
        onClick={onClose}
        className="absolute inset-0 cursor-default bg-black/60 backdrop-blur-sm"
      />
      <div
        className={`relative flex max-h-[100dvh] w-full flex-col overflow-hidden border border-[var(--border)] bg-[var(--bg)] shadow-2xl sm:max-h-[92vh] sm:rounded-xl ${
          wide ? 'sm:max-w-4xl' : 'sm:max-w-2xl'
        } h-[100dvh] sm:h-auto`}
      >
        <div className="flex items-center justify-between gap-3 border-b border-[var(--border)] px-4 py-3 sm:px-6">
          <h2 className="font-display text-lg font-medium">{title}</h2>
          <button type="button" onClick={onClose} aria-label="Close" className="btn btn-outline btn-icon">
            <AdminIcon name="x" size={16} />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto px-4 py-5 sm:px-6">{children}</div>
        {footer && (
          <div className="flex flex-wrap items-center justify-end gap-3 border-t border-[var(--border)] bg-[var(--bg-elevated)] px-4 py-3 sm:px-6">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
}

export function ConfirmDialog({ title = 'Are you sure?', message, confirmLabel = 'Delete', busy, onConfirm, onCancel }) {
  return (
    <Modal
      title={title}
      onClose={onCancel}
      footer={
        <>
          <button type="button" className="btn btn-outline" onClick={onCancel} disabled={busy}>
            Cancel
          </button>
          <button type="button" className="btn btn-danger-solid" onClick={onConfirm} disabled={busy}>
            {busy ? 'Working…' : confirmLabel}
          </button>
        </>
      }
    >
      <p className="text-sm text-[var(--text-muted)]">{message}</p>
    </Modal>
  );
}
