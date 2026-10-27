import { Link } from 'react-router-dom';
import { Download } from 'lucide-react';
import SocialLinks from '../components/SocialLinks';
import { useSite } from '../context/SiteContext';
import { optimizeImage } from '../utils/image';

/* shared helpers --------------------------------------------------------- */
function useP() {
  const { profile, isVisible, link } = useSite();
  const stats = (profile.aboutStats || []).filter((s) => s.label);
  return {
    profile,
    isVisible,
    link,
    stats,
    resume: profile.resume?.url,
    photo: profile.avatar?.url ? optimizeImage(profile.avatar.url, 800) : null,
    first: (profile.name || '').split(' ')[0],
  };
}

function Pic({ photo, name, className = '', imgClass = '' }) {
  if (photo) return <img src={photo} alt={name} className={`${className} ${imgClass} object-cover`} />;
  return (
    <div className={`${className} flex items-center justify-center bg-[var(--accent)] text-6xl font-bold text-[var(--color-ink-950)]`}>
      {(name || '?')[0]}
    </div>
  );
}

const stat = (s) => `${s.target ?? ''}${s.suffix ?? ''}`;

/* 1. Brooklyn — white, purple, gradient glow, photo card ------------------- */
export function BrooklynHero() {
  const { profile, isVisible, link, photo } = useP();
  return (
    <section
      className="relative overflow-hidden pt-24"
      style={{
        background:
          'radial-gradient(60% 55% at 100% 0%, #efc6fa 0%, transparent 70%), radial-gradient(50% 50% at 100% 100%, #d4f7ea 0%, transparent 70%), #ffffff',
      }}
    >
      <div className="mx-auto grid min-h-[calc(100vh-6rem)] max-w-7xl items-center gap-10 px-4 sm:px-6 lg:grid-cols-2">
        <div className="pt-8 pb-4 lg:pb-0">
          <h1 className="text-5xl font-bold leading-[1.1] sm:text-6xl">
            Hello, I’m
            <br />
            {profile.name}
          </h1>
          {profile.role && <p className="mt-4 text-xl font-semibold text-[var(--accent)]">{profile.role}</p>}
          {profile.heroDescription && <p className="mt-6 max-w-xl text-lg leading-relaxed">{profile.heroDescription}</p>}
          {isVisible('contact') && (
            <Link
              to={link('/contact')}
              className="mt-8 inline-block rounded-sm bg-[var(--accent)] px-7 py-4 text-base font-semibold text-white shadow-lg shadow-[var(--accent)]/30 transition hover:brightness-110"
            >
              Say Hello!
            </Link>
          )}
        </div>
        <div className="flex justify-center lg:justify-end lg:self-end">
          <div className="w-full max-w-md rounded-t-[2rem] bg-white p-5 pb-0 shadow-xl">
            <Pic photo={photo} name={profile.name} className="h-[26rem] w-full rounded-t-2xl" imgClass="object-top" />
          </div>
        </div>
      </div>
    </section>
  );
}

/* 2. Amber profile — banner, arch photo, pill headings --------------------- */
export function BrandonHero() {
  const { profile, photo, isVisible, link } = useP();
  const facts = [
    ['Role', profile.role],
    ['Education', profile.education],
    ['Occupation', profile.currentJob],
    ['Location', profile.location],
    ['Status', profile.availability],
  ].filter(([, v]) => v);
  const dark = '#2b1d00';
  return (
    <section>
      <div className="bg-[var(--accent)] pt-20" style={{ color: dark }}>
        <div className="mx-auto grid max-w-6xl items-start gap-8 px-4 sm:px-6 md:grid-cols-[18rem_1fr_1fr]">
          <div className="mx-auto -mb-16 h-80 w-64 overflow-hidden rounded-b-[8rem] bg-white shadow-lg md:mx-0">
            <Pic photo={photo} name={profile.name} className="h-full w-full" />
          </div>
          <div className="pb-10 pt-4">
            <h1 className="text-3xl font-bold sm:text-4xl">{profile.name}</h1>
            <ul className="mt-4 space-y-1.5 text-base">
              {facts.map(([k, v]) => (
                <li key={k}>
                  <strong className="text-white [text-shadow:0_1px_0_rgba(0,0,0,0.15)]">{k}:</strong> {v}
                </li>
              ))}
            </ul>
          </div>
          <div className="pb-10 pt-4">
            {profile.heroDescription && <p className="text-lg font-medium leading-relaxed text-white [text-shadow:0_1px_0_rgba(0,0,0,0.12)]">{profile.heroDescription}</p>}
            {isVisible('contact') && (
              <Link to={link('/contact')} className="mt-6 inline-block rounded-full px-6 py-2.5 text-sm font-bold text-[var(--accent)]" style={{ background: dark }}>
                Contact me
              </Link>
            )}
          </div>
        </div>
      </div>
      <div className="flex h-3">
        <div className="flex-1 bg-black/25" />
        <div className="flex-1 bg-[var(--accent)]" />
        <div className="flex-1 bg-[var(--accent)]/50" />
      </div>
      <div className="mx-auto max-w-6xl px-4 pb-2 pt-10 sm:px-6 md:pl-[20rem]">
        <span className="inline-block rounded-r-full bg-[var(--accent)] py-2 pl-4 pr-10 text-xl font-bold" style={{ color: dark }}>
          {profile.heroLine1 ? `${profile.heroLine1} ${profile.heroHighlight || ''}` : 'Bio'}
        </span>
        {profile.heroLine3 && <p className="mt-3 text-lg">{profile.heroLine3}</p>}
      </div>
    </section>
  );
}

/* 3. Blue sidebar — centered name (the rail holds photo + menu) ------------- */
export function HowardHero() {
  const { profile, isVisible, link, resume } = useP();
  return (
    <section className="px-4 pb-6 pt-28 text-center sm:px-6 lg:pt-16">
      <h1 className="text-4xl font-bold uppercase tracking-wide text-[var(--accent)] sm:text-5xl">{profile.name}</h1>
      {profile.role && <p className="mt-2 text-xl font-semibold">{profile.role}</p>}
      {profile.heroDescription && <p className="mx-auto mt-5 max-w-2xl leading-relaxed text-[var(--text-muted)]">{profile.heroDescription}</p>}
      <div className="mt-7 flex flex-wrap justify-center gap-3">
        {isVisible('contact') && (
          <Link to={link('/contact')} className="rounded-md bg-[var(--accent)] px-6 py-3 text-sm font-semibold text-white">Contact me</Link>
        )}
        {resume && (
          <a href={resume} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 rounded-md border border-[var(--accent)] px-6 py-3 text-sm font-semibold text-[var(--accent)]">
            <Download size={15} /> Resume
          </a>
        )}
      </div>
    </section>
  );
}

/* 4. Black & gold — big heading, serif italic word, stat card ---------------- */
export function TejasHero() {
  const { profile, photo, stats, resume, first } = useP();
  const s0 = stats[0];
  const ring = 'repeating-radial-gradient(circle at 65% 70%, #181818 0 7px, #0d0d0d 7px 14px)';
  const mask = 'radial-gradient(circle at 65% 70%, black 8%, transparent 62%)';
  return (
    <section className="relative min-h-screen overflow-hidden pt-24">
      <div className="absolute inset-0" style={{ background: ring, maskImage: mask, WebkitMaskImage: mask }} />
      <div
        className="absolute left-3 top-1/2 hidden -translate-y-1/2 gap-10 text-xs tracking-widest text-[var(--text)]/80 2xl:flex"
        style={{ writingMode: 'vertical-rl', transform: 'translateY(-50%) rotate(180deg)' }}
      >
        {profile.phone && <span>{profile.phone}</span>}
        {profile.email && <span>{profile.email}</span>}
      </div>
      <div className="relative mx-auto grid max-w-7xl items-center gap-8 px-4 py-12 sm:px-6 lg:grid-cols-[1.15fr_0.85fr] lg:py-20">
        <div>
          <p className="text-lg text-[var(--text-muted)]">
            Hi there! 👋 I’m <span className="text-[var(--text)]">{profile.name}</span>
          </p>
          <h1 className="mt-4 text-6xl font-extrabold leading-none sm:text-8xl">{profile.heroLine1 || first}</h1>
          <p className="-mt-1 pl-8 text-6xl italic leading-none text-[var(--text)] sm:pl-24 sm:text-8xl" style={{ fontFamily: '"Playfair Display", Georgia, serif', fontWeight: 700 }}>
            {profile.heroHighlight}
          </p>
          <div className="mt-8 h-px w-40 bg-[var(--text)]/70" />
          <p className="mt-4 flex items-center gap-2 text-xs uppercase tracking-wider">
            <span className="h-1.5 w-1.5 rounded-full bg-[var(--accent)]" />
            {profile.location ? `Based in ${profile.location}` : profile.heroLine3}
          </p>
          {profile.heroDescription && <p className="mt-6 max-w-lg text-sm leading-relaxed text-[var(--text-muted)]">{profile.heroDescription}</p>}
          {resume && (
            <a href={resume} target="_blank" rel="noopener noreferrer" className="mt-8 inline-flex items-center gap-2 rounded-full bg-[var(--bg-elevated-2)] px-7 py-4 text-sm">
              Download Resume ↗
            </a>
          )}
        </div>
        <div className="relative lg:pr-14">
          <Pic photo={photo} name={profile.name} className="h-[30rem] w-full sm:h-[36rem]" imgClass="object-top [mask-image:linear-gradient(to_bottom,black_80%,transparent)]" />
          {s0 && (
            <div className="absolute right-0 top-4 flex items-center gap-4 bg-[var(--bg-elevated-2)] px-6 py-5 lg:right-14">
              <span className="text-5xl font-semibold text-[var(--accent)]">{stat(s0)}</span>
              <span className="max-w-[7rem] text-xs uppercase leading-snug">{s0.label}</span>
            </div>
          )}
          <div className="absolute right-0 top-1/2 hidden -translate-y-1/2 lg:block">
            <SocialLinks className="flex-col" />
          </div>
        </div>
      </div>
    </section>
  );
}

/* 5. Midnight green — tilted photo + huge heading ----------------------------- */
export function AlejandroHero() {
  const { profile, photo } = useP();
  return (
    <section className="relative min-h-screen overflow-hidden pt-20">
      <div className="relative mx-auto grid min-h-[calc(100vh-5rem)] max-w-7xl grid-rows-[1fr_auto] px-4 sm:px-6">
        <div className="grid items-center gap-8 lg:grid-cols-2">
          <div className="mx-auto mt-6 h-[22rem] w-[18rem] -rotate-[8deg] overflow-hidden border border-white/10 shadow-2xl sm:h-[28rem] sm:w-[24rem] lg:mx-0">
            <Pic photo={photo} name={profile.name} className="h-full w-full" imgClass="grayscale" />
          </div>
          <div className="relative self-center lg:ml-auto">
            {/* <span className="absolute -top-16 left-1/3 hidden h-16 w-16 rounded-full bg-[var(--accent)]/80 lg:block" /> */}
            <p className="text-4xl leading-relaxed text-[var(--text)]/90">
              Hello, I’m <span className="font-semibold text-[var(--accent)]">{profile.name}</span>
              {profile.role ? `, ${profile.role}` : ''}
              {profile.location ? ` based in ${profile.location}.` : '.'}
            </p>
            {profile.heroDescription && <p className="mt-3 text-lg leading-relaxed text-[var(--text-muted)]">{profile.heroDescription}</p>}
          </div>
        </div>
        <div className="relative pb-8 pt-6">
          <div className="mb-3 space-y-0.5 text-xs text-[var(--text-muted)]">
            {profile.email && <p>E: {profile.email}</p>}
            {profile.phone && <p>T: {profile.phone}</p>}
          </div>
          <h1 className="text-5xl font-bold leading-[1.05] sm:text-7xl lg:text-8xl">
            {profile.heroLine1} <span className="text-[var(--accent)]">{profile.heroHighlight}</span>
          </h1>
          {profile.heroLine3 && <p className="mt-2 text-lg text-[var(--text-muted)]">{profile.heroLine3}</p>}
        </div>
        <div className="absolute right-2 top-1/2 hidden -translate-y-1/2 flex-col items-center gap-3 xl:flex">
          <span className="text-[10px] tracking-widest text-[var(--text-muted)]" style={{ writingMode: 'vertical-rl' }}>Follow Me</span>
          <span className="h-10 w-px bg-[var(--text-muted)]/50" />
          <SocialLinks className="flex-col" />
        </div>
      </div>
    </section>
  );
}

/* 6. Neon developer — network background, typing cursor ----------------------- */
export function RotonHero() {
  const { profile, photo, isVisible, link } = useP();
  const dots = [[8, 20], [22, 60], [35, 25], [48, 70], [60, 18], [72, 55], [85, 30], [92, 75], [15, 85], [40, 90]];
  return (
    <section className="relative min-h-screen overflow-hidden pt-24">
      <svg className="pointer-events-none absolute inset-0 h-full w-full opacity-40" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
        <polyline points={dots.map((d) => d.join(',')).join(' ')} fill="none" stroke="var(--accent)" strokeWidth="0.12" />
        {dots.map(([x, y], i) => (
          <circle key={i} cx={x} cy={y} r="0.5" fill="var(--accent)" />
        ))}
      </svg>
      <div className="relative mx-auto grid max-w-7xl items-center gap-10 px-4 py-12 sm:px-6 lg:grid-cols-2 lg:py-24">
        <div>
          <p className="text-lg font-semibold uppercase tracking-widest text-[var(--accent)]">Hi there,</p>
          <h1 className="mt-3 text-4xl font-bold leading-tight sm:text-6xl">
            I Am {profile.role || profile.name}
            <span className="tpl-cursor ml-1 font-light text-[var(--text)]">|</span>
          </h1>
          {profile.heroDescription && <p className="mt-5 max-w-lg text-sm leading-relaxed text-[var(--text-muted)]">{profile.heroDescription}</p>}
          {isVisible('contact') && (
            <Link to={link('/contact')} className="mt-8 inline-block rounded-full bg-[var(--accent)] px-8 py-3 text-sm font-semibold text-[var(--color-ink-950)] shadow-[0_0_24px_var(--accent)]">
              Hire Me
            </Link>
          )}
        </div>
        <div className="flex justify-center lg:justify-end">
          {photo ? (
            <img
              src={photo}
              alt={profile.name}
              className="h-auto max-h-[34rem] w-auto max-w-full rounded-2xl object-contain shadow-[0_0_60px_-10px_var(--accent)]"
            />
          ) : (
            <Pic photo={null} name={profile.name} className="h-[26rem] w-full max-w-sm rounded-2xl" />
          )}
        </div>
      </div>
    </section>
  );
}

/* 7. Profile card — "Say Hello" + stats (the card itself is the rail) --------- */
export function JohnHero() {
  const { profile, stats } = useP();
  return (
    <section className="px-1 pb-3 pt-24 lg:pt-0">
      <div className="rounded-3xl border border-[var(--border)] bg-[var(--bg-elevated)] p-6 sm:p-9">
        <p className="inline-flex items-center gap-2 text-sm">👋 Say Hello</p>
        <h1 className="mt-4 text-4xl font-medium leading-tight sm:text-5xl">
          I’m {profile.name},
          <br />
          <span className="text-[var(--accent)]">{profile.role || profile.heroHighlight}</span>
          <br />
          {profile.location ? `Based in ${profile.location}.` : profile.heroLine3}
        </h1>
        {profile.heroDescription && <p className="mt-5 max-w-2xl text-sm leading-relaxed text-[var(--text-muted)]">{profile.heroDescription}</p>}
        {stats.length > 0 && (
          <div className="mt-8 grid grid-cols-2 gap-5 sm:grid-cols-4">
            {stats.slice(0, 4).map((s, i) => (
              <div key={i}>
                <p className="text-3xl font-semibold">{stat(s)}</p>
                <p className="mt-1 text-xs text-[var(--text-muted)]">{s.label}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

/* 8. Cyan studio — centered headline, glass card --------------------------------- */
export function AgencyHero() {
  const { profile, stats, isVisible, link, resume } = useP();
  return (
    <section className="relative flex min-h-screen items-center overflow-hidden pt-24">
      <div className="pointer-events-none absolute left-1/2 top-1/3 h-[34rem] w-[34rem] -translate-x-1/2 rounded-full bg-[var(--accent)]/15 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-24 -left-24 h-72 w-72 rounded-full bg-[var(--accent)]/10 blur-3xl" />
      <div className="relative mx-auto w-full max-w-5xl px-4 py-14 text-center sm:px-6">
        <div className="relative rounded-3xl border border-[var(--accent)]/30 bg-white/[0.03] px-6 py-16 shadow-[0_0_80px_-30px_var(--accent)] backdrop-blur sm:px-12 sm:py-20">
          {profile.availability && <p className="mb-5 text-xs uppercase tracking-[0.3em] text-[var(--accent)]">{profile.availability}</p>}
          <h1 className="text-4xl font-medium leading-tight sm:text-6xl">
            {profile.heroLine1}
            <br />
            <span className="text-[var(--accent)]">{profile.heroHighlight}</span>
            {profile.heroLine3 && <span className="block text-2xl text-[var(--text-muted)] sm:text-3xl">{profile.heroLine3}</span>}
          </h1>
          {profile.heroDescription && <p className="mx-auto mt-6 max-w-xl text-sm leading-relaxed text-[var(--text-muted)]">{profile.heroDescription}</p>}
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            {isVisible('projects') && (
              <Link to={link('/projects')} className="rounded-full bg-[var(--accent)] px-6 py-2.5 text-sm font-semibold text-[var(--color-ink-950)]">View Work</Link>
            )}
            {resume ? (
              <a href={resume} target="_blank" rel="noopener noreferrer" className="rounded-full border border-[var(--border)] px-6 py-2.5 text-sm">Resume</a>
            ) : (
              isVisible('contact') && <Link to={link('/contact')} className="rounded-full border border-[var(--border)] px-6 py-2.5 text-sm">Contact</Link>
            )}
          </div>
        </div>
        {stats.length > 0 && (
          <div className="mx-auto mt-8 grid max-w-3xl grid-cols-2 gap-4 rounded-2xl border border-[var(--border)] bg-[var(--bg-elevated)] p-5 shadow-xl sm:grid-cols-4">
            {stats.slice(0, 4).map((s, i) => (
              <div key={i}>
                <p className="text-2xl font-semibold text-[var(--accent)]">{stat(s)}</p>
                <p className="text-xs text-[var(--text-muted)]">{s.label}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

/* 9. Crimson dark — uppercase heading, red circle, floating cards ----------------- */
export function CrimsonHero() {
  const { profile, photo, stats, isVisible, link } = useP();
  const [s0, s1] = stats;
  return (
    <section className="relative min-h-screen overflow-hidden pt-24" style={{ background: 'radial-gradient(60% 60% at 80% 55%, #3a0d08 0%, transparent 70%)' }}>
      <div className="relative mx-auto grid max-w-7xl items-center gap-10 px-4 py-12 sm:px-6 lg:grid-cols-2 lg:py-20">
        <div>
          <h1 className="text-5xl font-extrabold uppercase leading-tight sm:text-7xl">Hello I am</h1>
          <p className="mt-2 text-4xl font-extrabold text-[var(--accent)] sm:text-6xl">
            {profile.role || profile.name}.<span className="tpl-cursor text-[var(--text)]">|</span>
          </p>
          {profile.heroDescription && <p className="mt-6 max-w-md text-sm leading-relaxed text-[var(--text)]/90">{profile.heroDescription}</p>}
          <div className="mt-8 flex flex-wrap items-center gap-4">
            {isVisible('contact') && (
              <Link to={link('/contact')} className="rounded-full bg-[var(--accent)] px-7 py-3 text-sm font-semibold text-white">Start Consulting</Link>
            )}
            {profile.availability && <span className="text-xs text-[var(--text-muted)]">{profile.availability}</span>}
          </div>
        </div>
        <div className="relative mx-auto w-full max-w-md">
          <div className="absolute inset-x-6 bottom-0 top-10 rounded-full bg-[var(--accent)]/90" />
          <Pic photo={photo} name={profile.name} className="relative h-[28rem] w-full" imgClass="object-top" />
          {s0 && (
            <div className="absolute right-0 top-6 flex items-center gap-3 rounded-xl bg-white px-4 py-3 text-neutral-900 shadow-xl">
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[var(--accent)] text-sm font-bold text-white">★</span>
              <span className="text-sm font-semibold leading-tight">{stat(s0)}<br /><span className="text-xs font-normal text-neutral-500">{s0.label}</span></span>
            </div>
          )}
          {s1 && (
            <div className="absolute bottom-8 left-0 rounded-xl bg-white px-5 py-3 text-neutral-900 shadow-xl">
              <p className="text-2xl font-extrabold">{stat(s1)}</p>
              <p className="text-xs text-neutral-500">{s1.label}</p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
