import { AlertTriangleIcon } from "./icons/StatusIcons";

export function Spinner({ className = "" }) {
  return (
    <span
      role="status"
      aria-label="Loading"
      className={`inline-block h-6 w-6 animate-spin rounded-full border-2 border-[var(--border)] border-t-[var(--accent)] ${className}`}
    />
  );
}

/**
 * Renders loading / error / empty states, otherwise its children.
 *   <DataState loading={loading} error={error} onRetry={reload} empty={!items.length} emptyText="Nothing yet">
 */
export default function DataState({ loading, error, onRetry, empty, emptyText = "Nothing to show yet.", children }) {
  if (loading) {
    return (
      <div className="flex justify-center py-24">
        <Spinner />
      </div>
    );
  }
  if (error) {
    return (
      <div className="mx-auto mt-14 flex max-w-md flex-col items-center gap-3 rounded-lg border border-[var(--border)] bg-[var(--bg-elevated)] p-8 text-center">
        <AlertTriangleIcon size={28} className="text-red-400" />
        <p className="text-sm text-[var(--text-muted)]">{error.message || "Something went wrong."}</p>
        {onRetry && (
          <button
            type="button"
            onClick={onRetry}
            className="rounded-md border border-[var(--border)] px-4 py-2 text-sm transition-colors hover:border-[var(--accent)] hover:text-[var(--accent)]"
          >
            Try again
          </button>
        )}
      </div>
    );
  }
  if (empty) {
    return <p className="mt-14 text-center text-sm text-[var(--text-muted)]">{emptyText}</p>;
  }
  return children;
}
