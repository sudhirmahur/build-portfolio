import { NavLink } from 'react-router-dom';
import { Download } from 'lucide-react';
import SocialLinks from '../components/SocialLinks';
import ThemeToggle from '../components/ThemeToggle';
import { useSite } from '../context/SiteContext';
import { optimizeImage } from '../utils/image';

/** Fixed profile sidebar for the "Sidebar" portfolio template (desktop only). */
export default function SidebarNav() {
  const { profile, navPages, customTheme, base } = useSite();
  const resumeUrl = profile.resume?.url;
  return (
    <aside className="fixed inset-y-0 left-0 z-40 hidden w-72 flex-col overflow-y-auto border-r border-[var(--border)] bg-[var(--bg-elevated)] px-6 py-8 lg:flex">
      <NavLink to={base} className="flex flex-col items-center gap-3 text-center">
        {profile.avatar?.url && (
          <img
            src={optimizeImage(profile.avatar.url, 300)}
            alt={profile.name}
            className="h-24 w-24 rounded-full border-2 border-[var(--accent)] object-cover"
          />
        )}
        <span className="font-display text-lg font-semibold">{profile.name}</span>
        {profile.role && <span className="text-xs text-[var(--text-muted)]">{profile.role}</span>}
      </NavLink>

      <nav className="mt-8 flex flex-1 flex-col gap-1" aria-label="Primary">
        {navPages.map((item) => (
          <NavLink
            key={item.slug}
            to={item.path}
            end={item.slug === 'home'}
            className={({ isActive }) =>
              `rounded-md px-3 py-2 text-sm transition-colors ${
                isActive
                  ? 'bg-[var(--bg-elevated-2)] text-[var(--accent)]'
                  : 'text-[var(--text-muted)] hover:bg-[var(--bg-elevated-2)] hover:text-[var(--text)]'
              }`
            }
          >
            {item.label}
          </NavLink>
        ))}
      </nav>

      <div className="mt-6 flex flex-col items-center gap-4">
        <SocialLinks className="justify-center" />
        {resumeUrl && (
          <a
            href={resumeUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-sm text-[var(--accent)] hover:underline"
          >
            <Download size={15} /> Resume
          </a>
        )}
        {!customTheme && <ThemeToggle />}
      </div>
    </aside>
  );
}
