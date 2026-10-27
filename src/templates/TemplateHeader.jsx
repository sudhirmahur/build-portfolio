import { useEffect, useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { Menu, X, Download } from 'lucide-react';
import { useSite } from '../context/SiteContext';

const ACTIVE_ACCENT = ['alejandro', 'roton', 'agency', 'crimson', 'plain'];

function Logo({ variant }) {
  const { profile, base } = useSite();
  const name = profile?.name || 'Portfolio';
  const [first, ...rest] = name.split(' ');
  const tail = rest.join(' ');
  const cls = 'shrink-0';
  switch (variant) {
    case 'brooklyn':
      return (
        <Link to={base} className={`${cls} flex items-center gap-3`}>
          <span className="flex h-11 w-11 items-center justify-center rounded-full bg-[var(--accent)] text-lg font-bold text-white">{name[0]}</span>
          <span className="text-2xl font-bold">{first}</span>
        </Link>
      );
    case 'tejas':
      return <Link to={base} className={`${cls} text-2xl italic`} style={{ fontFamily: '"Playfair Display", Georgia, serif' }}>{name}</Link>;
    case 'roton':
      return <Link to={base} className={`${cls} text-xl font-bold uppercase tracking-wider text-[var(--accent)]`}>{first}</Link>;
    case 'crimson':
      return (
        <Link to={base} className={`${cls} text-lg font-extrabold`}>
          {first}
          {tail && <span className="text-[var(--accent)]"> {tail}</span>}
          <span className="text-[var(--accent)]">.</span>
        </Link>
      );
    default:
      return (
        <Link to={base} className={`${cls} text-sm`}>
          <span className="font-light">{first} </span>
          <span className="font-bold">{tail}</span>
        </Link>
      );
  }
}

function navClass(variant, item, isActive) {
  switch (variant) {
    case 'brooklyn':
      return `rounded-sm px-5 py-3 text-sm font-medium transition-colors ${
        isActive || item.slug === 'contact' ? 'bg-[var(--accent)] text-white shadow-md' : 'hover:text-[var(--accent)]'
      }`;
    case 'tejas':
      return `px-4 py-2 text-xs transition-colors ${isActive ? 'text-[var(--text)]' : 'text-[var(--text-muted)] hover:text-[var(--text)]'}`;
    case 'roton':
      return `px-3 py-2 text-xs font-semibold uppercase tracking-wide transition-colors ${isActive ? 'text-[var(--accent)]' : 'text-[var(--text-muted)] hover:text-[var(--text)]'}`;
    case 'agency':
      return `rounded-full px-4 py-1.5 text-sm transition-colors ${
        isActive ? 'bg-[var(--accent)] text-[var(--color-ink-950)]' : 'text-[var(--text-muted)] hover:text-[var(--text)]'
      }`;
    default:
      return `px-3 py-2 text-sm transition-colors ${
        isActive ? (ACTIVE_ACCENT.includes(variant) ? 'text-[var(--accent)] font-semibold' : 'text-[var(--text)] font-semibold') : 'text-[var(--text-muted)] hover:text-[var(--text)]'
      }`;
  }
}

function Cta({ variant, onClick }) {
  const { profile, isVisible, link } = useSite();
  const resume = profile?.resume?.url;
  const cls = 'inline-flex items-center gap-2 text-sm font-semibold transition-all hover:brightness-110';
  if (variant === 'tejas' && isVisible('contact')) {
    return <Link onClick={onClick} to={link('/contact')} className={`${cls} rounded-full bg-[var(--accent)] px-6 py-3 text-[var(--color-ink-950)]`}>Let’s Talk ↗</Link>;
  }
  if (variant === 'agency' && isVisible('contact')) {
    return <Link onClick={onClick} to={link('/contact')} className={`${cls} rounded-full bg-[var(--accent)] px-5 py-2.5 text-[var(--color-ink-950)]`}>Contact</Link>;
  }
  if (variant === 'crimson') {
    if (resume) {
      return (
        <a onClick={onClick} href={resume} target="_blank" rel="noopener noreferrer" className={`${cls} rounded-full bg-[var(--accent)] px-5 py-2.5 text-white`}>
          <Download size={15} /> Download CV
        </a>
      );
    }
    if (isVisible('contact')) return <Link onClick={onClick} to={link('/contact')} className={`${cls} rounded-full bg-[var(--accent)] px-5 py-2.5 text-white`}>Hire me</Link>;
  }
  return null;
}

/** Fixed top bar used by the non-classic portfolio templates. */
export default function TemplateHeader({ variant = 'plain' }) {
  const { navPages } = useSite();
  const { pathname } = useLocation();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);
  useEffect(() => setOpen(false), [pathname]);

  const nav = (
    <nav
      className={`hidden items-center gap-1 xl:flex ${variant === 'agency' ? 'rounded-full border border-[var(--border)] bg-[var(--bg-elevated)] p-1' : ''}`}
      aria-label="Primary"
    >
      {navPages.map((item) => (
        <NavLink key={item.slug} to={item.path} end={item.slug === 'home'} className={({ isActive }) => navClass(variant, item, isActive)}>
          {item.label}
        </NavLink>
      ))}
    </nav>
  );

  return (
    <header
      className={`fixed top-0 z-50 w-full border-b transition-colors duration-300 ${
        scrolled || open ? 'border-[var(--border)] bg-[var(--bg)]/90 backdrop-blur-lg' : 'border-transparent bg-transparent'
      }`}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-4 sm:px-6">
        <Logo variant={variant} />
        {variant === 'brooklyn' || variant === 'roton' || variant === 'alejandro' || variant === 'plain' || variant === 'crimson' || variant === 'tejas' || variant === 'agency' ? nav : null}
        <div className="hidden xl:block">
          <Cta variant={variant} />
        </div>
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-label={open ? 'Close menu' : 'Open menu'}
          aria-expanded={open}
          className="flex h-10 w-10 items-center justify-center rounded-md border border-[var(--border)] xl:hidden"
        >
          {open ? <X size={18} /> : <Menu size={18} />}
        </button>
      </div>
      {open && (
        <nav className="max-h-[80vh] overflow-y-auto border-t border-[var(--border)] bg-[var(--bg)] xl:hidden" aria-label="Mobile">
          <div className="flex flex-col gap-1 px-4 py-4 sm:px-6">
            {navPages.map((item) => (
              <NavLink
                key={item.slug}
                to={item.path}
                end={item.slug === 'home'}
                className={({ isActive }) =>
                  `rounded-md px-3 py-2.5 text-sm ${isActive ? 'bg-[var(--bg-elevated)] text-[var(--accent)]' : 'text-[var(--text-muted)]'}`
                }
              >
                {item.label}
              </NavLink>
            ))}
            <div className="mt-2">
              <Cta variant={variant} onClick={() => setOpen(false)} />
            </div>
          </div>
        </nav>
      )}
    </header>
  );
}
