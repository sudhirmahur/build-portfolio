import { Link } from "react-router-dom";
import SocialLinks from "./SocialLinks";
import { useSite } from "../context/SiteContext";

export default function Footer() {
  const { profile, footerPages } = useSite();
  const year = new Date().getFullYear();

  return (
    <footer className="relative border-t border-[var(--border)]">
      <div
        className="pointer-events-none absolute inset-x-0 -top-px h-px bg-gradient-to-r from-transparent via-[var(--accent)]/60 to-transparent"
        aria-hidden="true"
      />
      <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6">
        <div className="flex flex-col gap-10 sm:flex-row sm:justify-between">
          <div className="max-w-xs">
            <p className="font-display text-base font-semibold">
              {profile?.name}
              <span className="text-[var(--accent)]">.</span>
            </p>
            {profile?.footerText && (
              <p className="mt-3 text-xs leading-relaxed text-[var(--text-muted)] sm:text-sm">
                {profile.footerText}
              </p>
            )}
          </div>

          {footerPages.length > 0 && (
            <nav aria-label="Footer">
              <p className="mb-3 text-sm font-medium">Navigate</p>
              <ul className="grid grid-cols-2 gap-x-8 gap-y-2 text-sm text-[var(--text-muted)]">
                {footerPages.map((item) => (
                  <li key={item.slug}>
                    <Link to={item.path} className="transition-colors hover:text-[var(--accent)]">
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          )}

          <div>
            <p className="mb-3 text-sm font-medium">Connect</p>
            <SocialLinks />
          </div>
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-[var(--border)] pt-6 text-center text-sm text-[var(--text-muted)] sm:flex-row sm:text-left">
          <p>
            © {year} {profile?.name}. All rights reserved.
          </p>
          {profile?.footerNote && <p>{profile.footerNote}</p>}
        </div>
      </div>
    </footer>
  );
}
