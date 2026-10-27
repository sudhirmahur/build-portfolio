import { Link, NavLink } from 'react-router-dom';
import { Download, Mail } from 'lucide-react';
import SocialLinks from '../components/SocialLinks';
import { useSite } from '../context/SiteContext';
import { optimizeImage } from '../utils/image';

function Photo({ className, round }) {
  const { profile } = useSite();
  if (!profile.avatar?.url) {
    return (
      <div className={`flex items-center justify-center bg-[var(--accent)] text-4xl font-bold text-[var(--color-ink-950)] ${className} ${round ? 'rounded-full' : ''}`}>
        {(profile.name || '?')[0]}
      </div>
    );
  }
  return <img src={optimizeImage(profile.avatar.url, 500)} alt={profile.name} className={`${className} ${round ? 'rounded-full' : ''} object-cover`} />;
}

/** Blue strip + white arch card with photo, menu and contact (desktop only). */
export function HowardRail() {
  const { profile, navPages, base } = useSite();
  const band = 'mb-2 bg-[var(--bg-elevated-2)] py-1.5 text-center text-sm font-bold';
  return (
    <aside className="fixed inset-y-0 left-0 z-40 hidden w-72 bg-[var(--accent)] lg:block">
      <div className="absolute bottom-0 left-5 right-0 top-6 overflow-y-auto rounded-t-[7.75rem] bg-[var(--bg)] pt-8 shadow-xl">
        <Link to={base} className="flex flex-col items-center px-4 text-center">
          <Photo className="h-36 w-36 border-4 border-[var(--bg-elevated-2)]" round />
          <span className="mt-3 text-lg font-bold leading-tight">{profile.name}</span>
          {profile.role && <span className="text-xs text-[var(--text-muted)]">{profile.role}</span>}
        </Link>

        <div className="mt-5">
          <p className={band}>Menu</p>
          <nav className="flex flex-col px-3" aria-label="Primary">
            {navPages.map((item) => (
              <NavLink
                key={item.slug}
                to={item.path}
                end={item.slug === 'home'}
                className={({ isActive }) =>
                  `flex items-center gap-2 rounded-md px-3 py-1.5 text-sm ${isActive ? 'font-semibold text-[var(--accent)]' : 'text-[var(--text-muted)] hover:text-[var(--text)]'}`
                }
              >
                <span className="h-1.5 w-1.5 rounded-full bg-[var(--accent)]" />
                {item.label}
              </NavLink>
            ))}
          </nav>
        </div>

        <div className="mt-4 pb-6">
          <p className={band}>Contact</p>
          <div className="space-y-1.5 px-5 text-xs text-[var(--text-muted)]">
            {profile.email && <p className="break-all">{profile.email}</p>}
            {profile.phone && <p>{profile.phone}</p>}
            {profile.location && <p>{profile.location}</p>}
          </div>
          <SocialLinks className="mt-4 justify-center px-3" />
        </div>
      </div>
    </aside>
  );
}

/** Sticky rounded profile card (desktop only). */
export function JohnRail() {
  const { profile, isVisible, link, base } = useSite();
  const resume = profile.resume?.url;
  return (
    <aside className="hidden self-start lg:sticky lg:top-8 lg:block">
      <div className="rounded-3xl border border-[var(--border)] bg-[var(--bg-elevated)] p-4">
        <Link to={base}>
          <Photo className="aspect-[4/5] w-full rounded-2xl" />
        </Link>
        {profile.availability && (
          <p className="mx-auto -mt-4 relative flex w-fit items-center gap-2 rounded-full border border-[var(--border)] bg-[var(--bg)] px-4 py-1.5 text-xs">
            <span className="h-2 w-2 rounded-full bg-[var(--accent)]" />
            {profile.availability}
          </p>
        )}
        <h2 className="mt-4 text-center text-xl font-semibold">{profile.name}</h2>
        {profile.role && <p className="text-center text-xs text-[var(--text-muted)]">{profile.role}</p>}
        <SocialLinks className="mt-4 justify-center" />
        <div className="mt-5 grid grid-cols-2 gap-2">
          {resume ? (
            <a href={resume} target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center gap-2 rounded-lg border border-[var(--border)] px-3 py-2.5 text-sm hover:border-[var(--accent)]">
              <Download size={15} /> CV
            </a>
          ) : (
            <span />
          )}
          {isVisible('contact') && (
            <Link to={link('/contact')} className={`inline-flex items-center justify-center gap-2 rounded-lg bg-[var(--accent)] px-3 py-2.5 text-sm font-semibold text-[var(--color-ink-950)] ${resume ? '' : 'col-span-2'}`}>
              <Mail size={15} /> Contact Me
            </Link>
          )}
        </div>
      </div>
    </aside>
  );
}
