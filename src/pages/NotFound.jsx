import { Link } from "react-router-dom";
import PageShell from "../components/PageShell";

export default function NotFound({
  home = "/",
  title = "Page not found",
  text = "The page you are looking for doesn't exist or has been moved.",
}) {
  return (
    <PageShell width="max-w-xl">
      <div className="flex flex-col items-center gap-4 py-16 text-center">
        <p className="font-mono text-sm text-[var(--accent)]">404</p>
        <h1 className="font-display text-3xl font-medium">{title}</h1>
        <p className="text-sm text-[var(--text-muted)]">{text}</p>
        <Link
          to={home}
          className="mt-2 rounded-md bg-[var(--accent)] px-5 py-2.5 text-sm font-medium text-[var(--color-ink-950)] transition-colors hover:bg-[var(--accent-strong)]"
        >
          Back to home
        </Link>
      </div>
    </PageShell>
  );
}
