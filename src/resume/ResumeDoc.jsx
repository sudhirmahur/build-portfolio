import { getResumeTemplate } from './templates';

/* A4 page = 794 x 1123 css px. Everything is in px and explicit colours so it
   looks identical in the preview, the thumbnails and the printed PDF. */
export const PAGE_W = 794;
export const PAGE_H = 1123;

const arr = (v) => (Array.isArray(v) ? v : []);
const contactItems = (d) =>
  [d.email, d.phone, d.location, d.website, d.linkedin, d.github].filter((x) => x && String(x).trim());

function Heading({ t, children, light, style }) {
  const kind = t.headingStyle;
  const base = { margin: '0 0 8px', fontSize: 12.5, fontWeight: 700, letterSpacing: 1.6, textTransform: 'uppercase' };
  let look;
  if (kind === 'band') {
    look = { background: '#eceff3', color: t.text, textAlign: 'center', padding: '6px 0', letterSpacing: 1.2, fontSize: 13, margin: '0 0 10px' };
  } else if (kind === 'pill') {
    look = { background: t.accent, color: t.pillText || '#fff', display: 'inline-block', padding: '4px 24px 4px 12px', borderRadius: '0 999px 999px 0', textTransform: 'none', letterSpacing: 0.3, fontSize: 13.5 };
  } else if (kind === 'bar') {
    look = { color: t.text, borderLeft: `5px solid ${t.accent}`, paddingLeft: 9, fontSize: 13 };
  } else if (kind === 'center') {
    look = { color: t.accent, textAlign: 'center', letterSpacing: 3, fontSize: 12, borderTop: `1px solid ${t.accent}66`, borderBottom: `1px solid ${t.accent}66`, padding: '4px 0', margin: '0 0 10px' };
  } else if (kind === 'thick') {
    look = { color: t.text, display: 'inline-block', borderBottom: `3px solid ${t.accent}`, paddingBottom: 2, fontSize: 13, letterSpacing: 1.4 };
  } else if (kind === 'plain') {
    look = { color: t.text, borderBottom: '1px solid #000', paddingBottom: 2, letterSpacing: 1 };
  } else {
    look = {
      color: light ? 'inherit' : t.accent,
      borderBottom: light ? '1px solid rgba(255,255,255,0.3)' : `1.5px solid ${t.accent}`,
      paddingBottom: 3,
    };
  }
  return <h2 style={{ ...base, ...look, ...style }}>{children}</h2>;
}

function Bullets({ items, t }) {
  const list = arr(items).filter(Boolean);
  if (!list.length) return null;
  return (
    <ul style={{ margin: '4px 0 0', paddingLeft: 16, color: t.text, fontSize: 12, lineHeight: 1.5 }}>
      {list.map((b, i) => (
        <li key={i} style={{ marginBottom: 2 }}>{b}</li>
      ))}
    </ul>
  );
}

function Experience({ d, t, timeline, noHead }) {
  const items = arr(d.experience);
  if (!items.length) return null;
  return (
    <section style={{ marginBottom: 16 }}>
      {!noHead && <Heading t={t}>Experience</Heading>}
      {items.map((e, i) => (
        <div
          key={i}
          style={{
            marginBottom: 10,
            ...(timeline ? { position: 'relative', paddingLeft: 16, borderLeft: `2px solid ${t.accent}` } : {}),
          }}
        >
          {timeline && (
            <span style={{ position: 'absolute', left: -6, top: 3, width: 10, height: 10, borderRadius: 10, background: t.accent }} />
          )}
          <div style={{ display: 'flex', justifyContent: 'space-between', gap: 8 }}>
            <strong style={{ fontSize: 13, color: t.text }}>{e.role}</strong>
            <span style={{ fontSize: 11, color: t.muted, whiteSpace: 'nowrap' }}>{e.period}</span>
          </div>
          <div style={{ fontSize: 12, color: t.accent, fontWeight: 600 }}>
            {[e.company, e.location].filter(Boolean).join(' · ')}
          </div>
          <Bullets items={e.bullets} t={t} />
        </div>
      ))}
    </section>
  );
}

function Education({ d, t, noHead }) {
  const items = arr(d.education);
  if (!items.length) return null;
  return (
    <section style={{ marginBottom: 16 }}>
      {!noHead && <Heading t={t}>Education</Heading>}
      {items.map((e, i) => (
        <div key={i} style={{ marginBottom: 7 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', gap: 8 }}>
            <strong style={{ fontSize: 12.5, color: t.text }}>{e.degree}</strong>
            <span style={{ fontSize: 11, color: t.muted, whiteSpace: 'nowrap' }}>{e.period}</span>
          </div>
          <div style={{ fontSize: 12, color: t.muted }}>{[e.school, e.grade].filter(Boolean).join(' · ')}</div>
        </div>
      ))}
    </section>
  );
}

function Projects({ d, t, noHead }) {
  const items = arr(d.projects);
  if (!items.length) return null;
  return (
    <section style={{ marginBottom: 16 }}>
      {!noHead && <Heading t={t}>Projects</Heading>}
      {items.map((p, i) => (
        <div key={i} style={{ marginBottom: 8 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', gap: 8 }}>
            <strong style={{ fontSize: 12.5, color: t.text }}>{p.name}</strong>
            <span style={{ fontSize: 11, color: t.muted }}>{p.link}</span>
          </div>
          {arr(p.tech).length > 0 && <div style={{ fontSize: 11, color: t.accent }}>{arr(p.tech).join(' · ')}</div>}
          {p.description && <div style={{ fontSize: 12, color: t.text, lineHeight: 1.5 }}>{p.description}</div>}
        </div>
      ))}
    </section>
  );
}

function Certs({ d, t, noHead }) {
  const items = arr(d.certifications);
  if (!items.length) return null;
  return (
    <section style={{ marginBottom: 16 }}>
      {!noHead && <Heading t={t}>Certifications</Heading>}
      {items.map((c, i) => (
        <div key={i} style={{ fontSize: 12, color: t.text, marginBottom: 3 }}>
          <strong>{c.name}</strong>
          <span style={{ color: t.muted }}>{[c.issuer, c.year].filter(Boolean).length ? ` — ${[c.issuer, c.year].filter(Boolean).join(', ')}` : ''}</span>
        </div>
      ))}
    </section>
  );
}

function Skills({ d, t, chips = true, noHead }) {
  const items = arr(d.skills);
  if (!items.length) return null;
  return (
    <section style={{ marginBottom: 16 }}>
      {!noHead && <Heading t={t}>Skills</Heading>}
      {chips ? (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5 }}>
          {items.map((s, i) => (
            <span key={i} style={{ fontSize: 11, padding: '2px 8px', borderRadius: 3, background: `${t.accent}18`, color: t.accent, fontWeight: 600 }}>
              {s}
            </span>
          ))}
        </div>
      ) : (
        <div style={{ fontSize: 12, color: t.text, lineHeight: 1.6 }}>{items.join(' · ')}</div>
      )}
    </section>
  );
}

function Languages({ d, t, noHead }) {
  const items = arr(d.languages);
  if (!items.length) return null;
  return (
    <section style={{ marginBottom: 16 }}>
      {!noHead && <Heading t={t}>Languages</Heading>}
      <div style={{ fontSize: 12, color: t.text }}>{items.join(' · ')}</div>
    </section>
  );
}

function Summary({ d, t, noHead }) {
  if (!d.summary) return null;
  return (
    <section style={{ marginBottom: 16 }}>
      {!noHead && <Heading t={t}>Profile</Heading>}
      <p style={{ margin: 0, fontSize: 12, lineHeight: 1.6, color: t.text }}>{d.summary}</p>
    </section>
  );
}

function Photo({ d, size, border = 'transparent' }) {
  if (!d.photo?.url) return null;
  return (
    <img
      src={d.photo.url}
      alt=""
      crossOrigin="anonymous"
      style={{ width: size, height: size, borderRadius: size, objectFit: 'cover', border: `3px solid ${border}`, display: 'block' }}
    />
  );
}

/* ---------------- layouts ---------------- */
function Single({ d, t }) {
  const center = t.variant === 'center';
  const elegant = t.variant === 'elegant';
  const contacts = contactItems(d);
  return (
    <div style={{ padding: '48px 54px' }}>
      <header style={{ textAlign: center || elegant ? 'center' : 'left', marginBottom: 18, borderBottom: elegant ? `3px double ${t.accent}` : 'none', paddingBottom: elegant ? 14 : 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 18, justifyContent: center || elegant ? 'center' : 'flex-start' }}>
          <Photo d={d} size={84} border={t.accent} />
          <div>
            <h1 style={{ margin: 0, fontSize: elegant ? 34 : 30, color: elegant ? t.accent : t.text, letterSpacing: elegant ? 1 : 0 }}>{d.fullName}</h1>
            <div style={{ fontSize: 14, color: t.accent, fontWeight: 600, marginTop: 2 }}>{d.title}</div>
          </div>
        </div>
        <div style={{ marginTop: 8, fontSize: 11.5, color: t.muted }}>{contacts.join('   |   ')}</div>
      </header>
      <Summary d={d} t={t} />
      <Experience d={d} t={t} />
      <Projects d={d} t={t} />
      <Education d={d} t={t} />
      <Skills d={d} t={t} chips={false} />
      <Certs d={d} t={t} />
      <Languages d={d} t={t} />
    </div>
  );
}

function SideBlock({ title, children, t }) {
  return (
    <div style={{ marginBottom: 18 }}>
      <h3 style={{ margin: '0 0 7px', fontSize: 11.5, letterSpacing: 1.6, textTransform: 'uppercase', fontWeight: 700, color: t.sidebarText, opacity: 0.95, borderBottom: `1px solid ${t.sidebarText}44`, paddingBottom: 3 }}>{title}</h3>
      {children}
    </div>
  );
}

function Sidebar({ d, t }) {
  const side = (
    <aside style={{ width: 262, background: t.sidebarBg, color: t.sidebarText, padding: '44px 22px', boxSizing: 'border-box', flexShrink: 0 }}>
      <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 14 }}>
        <Photo d={d} size={112} border={t.accent} />
      </div>
      <SideBlock title="Contact" t={t}>
        {contactItems(d).map((c, i) => (
          <div key={i} style={{ fontSize: 11.5, marginBottom: 5, wordBreak: 'break-word' }}>{c}</div>
        ))}
      </SideBlock>
      {arr(d.skills).length > 0 && (
        <SideBlock title="Skills" t={t}>
          {arr(d.skills).map((s, i) => (
            <div key={i} style={{ fontSize: 11.5, marginBottom: 4 }}>• {s}</div>
          ))}
        </SideBlock>
      )}
      {arr(d.languages).length > 0 && (
        <SideBlock title="Languages" t={t}>
          {arr(d.languages).map((s, i) => (
            <div key={i} style={{ fontSize: 11.5, marginBottom: 4 }}>{s}</div>
          ))}
        </SideBlock>
      )}
    </aside>
  );
  const main = (
    <main style={{ flex: 1, padding: '44px 34px', boxSizing: 'border-box', minWidth: 0 }}>
      <h1 style={{ margin: 0, fontSize: 31, color: t.accent, lineHeight: 1.1 }}>{d.fullName}</h1>
      <div style={{ fontSize: 14, color: t.muted, fontWeight: 600, margin: '4px 0 18px' }}>{d.title}</div>
      <Summary d={d} t={t} />
      <Experience d={d} t={t} />
      <Projects d={d} t={t} />
      <Education d={d} t={t} />
      <Certs d={d} t={t} />
    </main>
  );
  return (
    <div style={{ display: 'flex', minHeight: PAGE_H }}>
      {t.side === 'right' ? <>{main}{side}</> : <>{side}{main}</>}
    </div>
  );
}

function Banner({ d, t }) {
  return (
    <div>
      <header style={{ background: t.bannerBg, color: t.bannerText, padding: '36px 46px', display: 'flex', alignItems: 'center', gap: 22 }}>
        <Photo d={d} size={96} border={t.bannerText} />
        <div style={{ flex: 1 }}>
          <h1 style={{ margin: 0, fontSize: 32, lineHeight: 1.1 }}>{d.fullName}</h1>
          <div style={{ fontSize: 14.5, opacity: 0.92, marginTop: 3 }}>{d.title}</div>
          <div style={{ fontSize: 11, opacity: 0.85, marginTop: 10, lineHeight: 1.6 }}>{contactItems(d).join('   •   ')}</div>
        </div>
      </header>
      <div style={{ display: 'flex', gap: 28, padding: '26px 46px 40px' }}>
        <div style={{ flex: 1.7, minWidth: 0 }}>
          <Summary d={d} t={t} />
          <Experience d={d} t={t} />
          <Projects d={d} t={t} />
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <Skills d={d} t={t} />
          <Education d={d} t={t} />
          <Certs d={d} t={t} />
          <Languages d={d} t={t} />
        </div>
      </div>
    </div>
  );
}

function Timeline({ d, t }) {
  return (
    <div style={{ padding: '44px 52px' }}>
      <header style={{ display: 'flex', alignItems: 'center', gap: 20, marginBottom: 20 }}>
        <Photo d={d} size={92} border={t.accent} />
        <div>
          <h1 style={{ margin: 0, fontSize: 32, color: t.text, lineHeight: 1.1 }}>
            {d.fullName}
            <span style={{ color: t.accent }}>.</span>
          </h1>
          <div style={{ fontSize: 14, color: t.accent, fontWeight: 700, marginTop: 3 }}>{d.title}</div>
          <div style={{ fontSize: 11.5, color: t.muted, marginTop: 7 }}>{contactItems(d).join('  ·  ')}</div>
        </div>
      </header>
      <Summary d={d} t={t} />
      <Experience d={d} t={t} timeline />
      <Projects d={d} t={t} />
      <Education d={d} t={t} />
      <Skills d={d} t={t} />
      <Certs d={d} t={t} />
      <Languages d={d} t={t} />
    </div>
  );
}


/* ---------------- new layouts ---------------- */
function Band({ children, t }) {
  return (
    <div style={{ background: '#eceff3', color: t.text, textAlign: 'center', padding: '6px 0', fontSize: 13, fontWeight: 700, letterSpacing: 1.2, textTransform: 'uppercase', margin: '0 0 10px' }}>
      {children}
    </div>
  );
}

/* blue arch sidebar + grey section bands */
function Howard({ d, t }) {
  return (
    <div style={{ display: 'flex', minHeight: PAGE_H }}>
      <div style={{ width: 252, flexShrink: 0, background: `linear-gradient(to right, ${t.accent} 0 58px, #fff 58px)`, boxSizing: 'border-box', paddingTop: 30 }}>
        <div style={{ marginLeft: 26, width: 204, background: '#fff', borderRadius: '102px 102px 0 0', boxShadow: '0 0 14px rgba(0,0,0,0.12)', paddingTop: 22, minHeight: PAGE_H - 30, boxSizing: 'border-box' }}>
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 14 }}>
            {d.photo?.url ? <Photo d={d} size={150} border="#e5e7eb" /> : (
              <div style={{ width: 150, height: 150, borderRadius: 150, background: t.accent, color: '#fff', fontSize: 52, fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{(d.fullName || '?')[0]}</div>
            )}
          </div>
          {arr(d.skills).length > 0 && (
            <div style={{ marginBottom: 16 }}>
              <Band t={t}>Skills</Band>
              <div style={{ padding: '0 16px' }}>
                {arr(d.skills).map((sk, i) => (
                  <div key={i} style={{ fontSize: 11.5, color: t.text, marginBottom: 4, display: 'flex', alignItems: 'center', gap: 6 }}>
                    <span style={{ width: 6, height: 6, borderRadius: 6, background: t.accent, flexShrink: 0 }} />{sk}
                  </div>
                ))}
              </div>
            </div>
          )}
          <Band t={t}>Contact</Band>
          <div style={{ padding: '0 16px' }}>
            {contactItems(d).map((c, i) => (
              <div key={i} style={{ fontSize: 11, color: t.text, marginBottom: 6, wordBreak: 'break-word' }}>{c}</div>
            ))}
          </div>
          {arr(d.languages).length > 0 && (
            <div style={{ marginTop: 16 }}>
              <Band t={t}>Languages</Band>
              <div style={{ padding: '0 16px', fontSize: 11.5, color: t.text }}>{arr(d.languages).join(' · ')}</div>
            </div>
          )}
        </div>
      </div>
      <div style={{ flex: 1, minWidth: 0, padding: '40px 36px 40px 10px' }}>
        <h1 style={{ margin: 0, textAlign: 'center', fontSize: 34, color: t.accent, textTransform: 'uppercase', letterSpacing: 1.5, lineHeight: 1.1 }}>{d.fullName}</h1>
        <div style={{ textAlign: 'center', fontSize: 15, fontWeight: 600, color: t.text, margin: '6px 0 22px' }}>{d.title}</div>
        <Summary d={d} t={t} />
        <Experience d={d} t={t} />
        <Education d={d} t={t} />
        <Projects d={d} t={t} />
        <Certs d={d} t={t} />
      </div>
    </div>
  );
}

/* amber / violet infographic profile */
function Infographic({ d, t }) {
  const facts = [['Email', d.email], ['Phone', d.phone], ['Location', d.location], ['Web', d.website || d.linkedin || d.github]].filter(([, v]) => v);
  return (
    <div>
      <div style={{ background: t.bannerBg, color: t.bannerText, height: 232, display: 'flex', alignItems: 'flex-start', gap: 28, padding: '0 46px 0 46px', boxSizing: 'border-box', position: 'relative' }}>
        <div style={{ width: 188, height: 252, background: '#fff', borderRadius: '0 0 94px 94px', overflow: 'hidden', boxShadow: '0 4px 14px rgba(0,0,0,0.18)', flexShrink: 0, zIndex: 2 }}>
          {d.photo?.url ? (
            <img src={d.photo.url} alt="" crossOrigin="anonymous" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          ) : (
            <div style={{ width: '100%', height: '100%', background: '#f3f4f6', color: t.accent, fontSize: 64, fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{(d.fullName || '?')[0]}</div>
          )}
        </div>
        <div style={{ paddingTop: 34, flex: 1, minWidth: 0 }}>
          <h1 style={{ margin: 0, fontSize: 30, lineHeight: 1.1 }}>{d.fullName}</h1>
          <div style={{ fontSize: 14.5, fontWeight: 600, marginTop: 3, opacity: 0.92 }}>{d.title}</div>
          <div style={{ marginTop: 12 }}>
            {facts.map(([k, v]) => (
              <div key={k} style={{ fontSize: 11.5, marginBottom: 3 }}><strong>{k}: </strong>{v}</div>
            ))}
          </div>
        </div>
      </div>
      <div style={{ display: 'flex', height: 12 }}>
        <div style={{ flex: 1, background: '#00000030' }} /><div style={{ flex: 1, background: `${t.accent}` }} /><div style={{ flex: 1, background: `${t.accent}88` }} />
      </div>
      <div style={{ display: 'flex', gap: 28, padding: '26px 46px 40px' }}>
        <div style={{ width: 232, flexShrink: 0, paddingTop: 40 }}>
          <Summary d={d} t={t} />
          <Skills d={d} t={t} />
          <Languages d={d} t={t} />
          <Certs d={d} t={t} />
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <Experience d={d} t={t} />
          <Education d={d} t={t} />
          <Projects d={d} t={t} />
        </div>
      </div>
    </div>
  );
}

/* black page with gold / green accent */
function Dark({ d, t }) {
  return (
    <div style={{ minHeight: PAGE_H }}>
      <header style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 20, padding: '44px 50px 26px', borderBottom: `1px solid ${t.accent}55` }}>
        <div>
          <div style={{ fontSize: 12, letterSpacing: 3, textTransform: 'uppercase', color: t.muted }}>Curriculum Vitae</div>
          <h1 style={{ margin: '6px 0 0', fontSize: 38, color: '#fff', lineHeight: 1.05 }}>{d.fullName}</h1>
          <div style={{ fontFamily: 'Georgia, serif', fontStyle: 'italic', fontSize: 21, color: t.accent, marginTop: 4 }}>{d.title}</div>
          <div style={{ fontSize: 11, color: t.muted, marginTop: 10, lineHeight: 1.6 }}>{contactItems(d).join('   ·   ')}</div>
        </div>
        <Photo d={d} size={116} border={t.accent} />
      </header>
      <div style={{ display: 'flex' }}>
        <div style={{ flex: 1.7, minWidth: 0, padding: '26px 30px 40px 50px' }}>
          <Summary d={d} t={t} />
          <Experience d={d} t={t} />
          <Projects d={d} t={t} />
        </div>
        <div style={{ flex: 1, minWidth: 0, background: t.panelBg, padding: '26px 38px 40px 26px', minHeight: 820 }}>
          <Skills d={d} t={t} />
          <Education d={d} t={t} />
          <Certs d={d} t={t} />
          <Languages d={d} t={t} />
        </div>
      </div>
    </div>
  );
}

/* bold name with an accent bar */
function Leftbar({ d, t }) {
  return (
    <div style={{ position: 'relative', minHeight: PAGE_H }}>
      <div style={{ position: 'absolute', top: 0, bottom: 0, left: 0, width: 16, background: t.accent }} />
      <div style={{ padding: '46px 52px 40px 58px' }}>
        <header style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 20, marginBottom: 18 }}>
          <div>
            <h1 style={{ margin: 0, fontSize: 40, fontWeight: 800, textTransform: 'uppercase', letterSpacing: 2, lineHeight: 1.05, color: t.text }}>{d.fullName}</h1>
            <div style={{ fontSize: 15, fontWeight: 700, color: t.accent, marginTop: 6, letterSpacing: 1 }}>{d.title}</div>
          </div>
          <Photo d={d} size={104} border={t.accent} />
        </header>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 20 }}>
          {contactItems(d).map((c, i) => (
            <span key={i} style={{ fontSize: 11, padding: '3px 10px', border: `1px solid ${t.accent}`, borderRadius: 3, color: t.text }}>{c}</span>
          ))}
        </div>
        <Summary d={d} t={t} />
        <Experience d={d} t={t} />
        <Projects d={d} t={t} />
        <div style={{ display: 'flex', gap: 28 }}>
          <div style={{ flex: 1 }}><Education d={d} t={t} /><Certs d={d} t={t} /></div>
          <div style={{ flex: 1 }}><Skills d={d} t={t} /><Languages d={d} t={t} /></div>
        </div>
      </div>
    </div>
  );
}

/* dark header + accent strip */
function Split({ d, t }) {
  return (
    <div style={{ minHeight: PAGE_H }}>
      <header style={{ background: t.bannerBg, color: t.bannerText, padding: '40px 50px 34px', display: 'flex', alignItems: 'center', gap: 28 }}>
        <div style={{ flex: 1 }}>
          <h1 style={{ margin: 0, fontSize: 34, lineHeight: 1.1 }}>{d.fullName}</h1>
          <div style={{ fontSize: 15, color: t.stripBg, fontWeight: 600, margin: '4px 0 12px' }}>{d.title}</div>
          {d.summary && <p style={{ margin: 0, fontSize: 12, lineHeight: 1.6, opacity: 0.85 }}>{d.summary}</p>}
        </div>
        <Photo d={d} size={118} border={t.stripBg} />
      </header>
      <div style={{ background: t.stripBg, color: '#06222b', fontSize: 11.5, fontWeight: 600, padding: '8px 50px', textAlign: 'center' }}>
        {contactItems(d).join('    |    ')}
      </div>
      <div style={{ padding: '26px 50px 40px' }}>
        <Experience d={d} t={t} />
        <Projects d={d} t={t} />
        <div style={{ display: 'flex', gap: 32 }}>
          <div style={{ flex: 1 }}><Education d={d} t={t} /><Certs d={d} t={t} /></div>
          <div style={{ flex: 1 }}><Skills d={d} t={t} /><Languages d={d} t={t} /></div>
        </div>
      </div>
    </div>
  );
}

/* plain black & white, recruiter / ATS friendly (no photo) */
function Ats({ d, t }) {
  return (
    <div style={{ padding: '46px 56px' }}>
      <header style={{ textAlign: 'center', marginBottom: 16 }}>
        <h1 style={{ margin: 0, fontSize: 28, letterSpacing: 1 }}>{d.fullName}</h1>
        <div style={{ fontSize: 13.5, marginTop: 2 }}>{d.title}</div>
        <div style={{ fontSize: 11.5, color: t.muted, marginTop: 6 }}>{contactItems(d).join('  |  ')}</div>
      </header>
      <Summary d={d} t={t} />
      <Experience d={d} t={t} />
      <Education d={d} t={t} />
      <Projects d={d} t={t} />
      <Skills d={d} t={t} chips={false} />
      <Certs d={d} t={t} />
      <Languages d={d} t={t} />
    </div>
  );
}


/* =====================  more distinct layouts  ===================== */
const ini = (n) => (n || '?').split(/\s+/).filter(Boolean).slice(0, 2).map((w) => w[0].toUpperCase()).join('');
const Lbl = ({ t, children }) => (
  <div style={{ fontSize: 11.5, fontWeight: 800, letterSpacing: 1.4, textTransform: 'uppercase', color: t.accent }}>{children}</div>
);
const pageBox = { boxSizing: 'border-box', minHeight: PAGE_H };

/* header: name left, contact right-aligned, shaded summary, 65/35 body */
function Executive({ d, t }) {
  return (
    <div style={{ ...pageBox, padding: '46px 54px' }}>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', gap: 20, borderBottom: `3px solid ${t.accent}`, paddingBottom: 14, marginBottom: 16 }}>
        <div>
          <h1 style={{ margin: 0, fontSize: 34, color: t.text, lineHeight: 1.05 }}>{d.fullName}</h1>
          <div style={{ fontSize: 15, color: t.accent, fontWeight: 600, marginTop: 4 }}>{d.title}</div>
        </div>
        <div style={{ textAlign: 'right', fontSize: 11, color: t.muted, lineHeight: 1.7 }}>
          {contactItems(d).map((c, i) => <div key={i}>{c}</div>)}
        </div>
      </header>
      {d.summary && (
        <div style={{ background: `${t.accent}14`, borderLeft: `4px solid ${t.accent}`, padding: '10px 14px', marginBottom: 18, fontSize: 12, lineHeight: 1.6, color: t.text }}>{d.summary}</div>
      )}
      <div style={{ display: 'flex', gap: 30 }}>
        <div style={{ flex: 1.8, minWidth: 0 }}><Experience d={d} t={t} /><Projects d={d} t={t} /></div>
        <div style={{ flex: 1, minWidth: 0 }}><Skills d={d} t={t} /><Education d={d} t={t} /><Certs d={d} t={t} /><Languages d={d} t={t} /></div>
      </div>
    </div>
  );
}

/* three vertical columns separated by thin lines */
function Tricolumn({ d, t }) {
  const col = { padding: '0 18px', boxSizing: 'border-box', minWidth: 0 };
  return (
    <div style={{ ...pageBox, padding: '40px 30px' }}>
      <header style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 20, padding: '0 18px 18px', borderBottom: `4px solid ${t.accent}`, marginBottom: 20 }}>
        <div>
          <h1 style={{ margin: 0, fontSize: 32, color: t.text, lineHeight: 1.05 }}>{d.fullName}</h1>
          <div style={{ fontSize: 14, color: t.accent, fontWeight: 700, marginTop: 4, textTransform: 'uppercase', letterSpacing: 1.5 }}>{d.title}</div>
        </div>
        <Photo d={d} size={84} border={t.accent} />
      </header>
      <div style={{ display: 'flex' }}>
        <div style={{ ...col, width: 188, flexShrink: 0 }}>
          <Heading t={t}>Contact</Heading>
          {contactItems(d).map((c, i) => <div key={i} style={{ fontSize: 11, color: t.text, marginBottom: 6, wordBreak: 'break-word' }}>{c}</div>)}
          <div style={{ height: 14 }} />
          <Skills d={d} t={t} />
          <Languages d={d} t={t} />
        </div>
        <div style={{ ...col, flex: 1, borderLeft: '1px solid #e5e7eb', borderRight: '1px solid #e5e7eb' }}>
          <Summary d={d} t={t} />
          <Experience d={d} t={t} />
        </div>
        <div style={{ ...col, width: 196, flexShrink: 0 }}>
          <Education d={d} t={t} />
          <Projects d={d} t={t} />
          <Certs d={d} t={t} />
        </div>
      </div>
    </div>
  );
}

/* label column on the left, content on the right (Harvard style) */
function Labelcol({ d, t }) {
  const Row = ({ label, children, show = true }) =>
    show ? (
      <div style={{ display: 'flex', gap: 20, padding: '14px 0', borderTop: '1px solid #d1d5db' }}>
        <div style={{ width: 120, flexShrink: 0 }}><Lbl t={t}>{label}</Lbl></div>
        <div style={{ flex: 1, minWidth: 0 }}>{children}</div>
      </div>
    ) : null;
  return (
    <div style={{ ...pageBox, padding: '50px 56px' }}>
      <header style={{ marginBottom: 22 }}>
        <h1 style={{ margin: 0, fontSize: 38, fontWeight: 400, letterSpacing: 1, color: t.text }}>{d.fullName}</h1>
        <div style={{ fontSize: 14, color: t.muted, marginTop: 4, fontStyle: 'italic' }}>{d.title}</div>
        <div style={{ fontSize: 11.5, color: t.text, marginTop: 10 }}>{contactItems(d).join('   •   ')}</div>
      </header>
      <Row label="Profile" show={!!d.summary}><Summary d={d} t={t} noHead /></Row>
      <Row label="Experience" show={arr(d.experience).length > 0}><Experience d={d} t={t} noHead /></Row>
      <Row label="Education" show={arr(d.education).length > 0}><Education d={d} t={t} noHead /></Row>
      <Row label="Projects" show={arr(d.projects).length > 0}><Projects d={d} t={t} noHead /></Row>
      <Row label="Skills" show={arr(d.skills).length > 0}><Skills d={d} t={t} chips={false} noHead /></Row>
      <Row label="Certificates" show={arr(d.certifications).length > 0}><Certs d={d} t={t} noHead /></Row>
      <Row label="Languages" show={arr(d.languages).length > 0}><Languages d={d} t={t} noHead /></Row>
    </div>
  );
}

/* every section is a rounded card */
function Cards({ d, t }) {
  const Card = ({ title, show = true, children }) =>
    show ? (
      <div style={{ border: '1px solid #e5e7eb', borderRadius: 10, padding: '12px 14px', marginBottom: 12, background: '#fff' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 7, marginBottom: 8 }}>
          <span style={{ width: 9, height: 9, borderRadius: 9, background: t.accent }} />
          <span style={{ fontSize: 12.5, fontWeight: 800, color: t.text, textTransform: 'uppercase', letterSpacing: 1 }}>{title}</span>
        </div>
        {children}
      </div>
    ) : null;
  return (
    <div style={{ ...pageBox, background: '#f8fafc', padding: '36px 40px' }}>
      <header style={{ display: 'flex', alignItems: 'center', gap: 20, background: t.accent, color: '#fff', borderRadius: 14, padding: '20px 24px', marginBottom: 14 }}>
        {d.photo?.url ? <Photo d={d} size={92} border="#fff" /> : null}
        <div style={{ flex: 1 }}>
          <h1 style={{ margin: 0, fontSize: 30, lineHeight: 1.1 }}>{d.fullName}</h1>
          <div style={{ fontSize: 14, opacity: 0.92, marginTop: 3 }}>{d.title}</div>
          <div style={{ fontSize: 11, opacity: 0.9, marginTop: 8 }}>{contactItems(d).join('  •  ')}</div>
        </div>
      </header>
      <div style={{ display: 'flex', gap: 12 }}>
        <div style={{ flex: 1.7, minWidth: 0 }}>
          <Card title="About" show={!!d.summary}><Summary d={d} t={t} noHead /></Card>
          <Card title="Experience" show={arr(d.experience).length > 0}><Experience d={d} t={t} noHead /></Card>
          <Card title="Projects" show={arr(d.projects).length > 0}><Projects d={d} t={t} noHead /></Card>
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <Card title="Skills" show={arr(d.skills).length > 0}><Skills d={d} t={t} noHead /></Card>
          <Card title="Education" show={arr(d.education).length > 0}><Education d={d} t={t} noHead /></Card>
          <Card title="Certificates" show={arr(d.certifications).length > 0}><Certs d={d} t={t} noHead /></Card>
          <Card title="Languages" show={arr(d.languages).length > 0}><Languages d={d} t={t} noHead /></Card>
        </div>
      </div>
    </div>
  );
}

/* angled colour header */
function Diagonal({ d, t }) {
  return (
    <div style={pageBox}>
      <div style={{ position: 'relative', height: 236 }}>
        <div style={{ position: 'absolute', inset: 0, background: t.accent, clipPath: 'polygon(0 0, 100% 0, 100% 62%, 0 100%)' }} />
        <div style={{ position: 'absolute', inset: 0, background: `${t.accent2 || '#000'}55`, clipPath: 'polygon(55% 0, 100% 0, 100% 62%, 78% 74%)' }} />
        <div style={{ position: 'absolute', left: 50, top: 42, color: '#fff', maxWidth: 480 }}>
          <h1 style={{ margin: 0, fontSize: 38, lineHeight: 1.05 }}>{d.fullName}</h1>
          <div style={{ fontSize: 16, marginTop: 6, opacity: 0.95 }}>{d.title}</div>
        </div>
        {d.photo?.url && (
          <div style={{ position: 'absolute', right: 52, top: 36 }}><Photo d={d} size={112} border="#fff" /></div>
        )}
      </div>
      <div style={{ display: 'flex', gap: 30, padding: '0 50px 40px', marginTop: 6 }}>
        <div style={{ flex: 1.8, minWidth: 0 }}>
          <Summary d={d} t={t} />
          <Experience d={d} t={t} />
          <Projects d={d} t={t} />
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <Heading t={t}>Contact</Heading>
          {contactItems(d).map((c, i) => <div key={i} style={{ fontSize: 11, marginBottom: 6, color: t.text, wordBreak: 'break-word' }}>{c}</div>)}
          <div style={{ height: 12 }} />
          <Skills d={d} t={t} />
          <Education d={d} t={t} />
          <Certs d={d} t={t} />
          <Languages d={d} t={t} />
        </div>
      </div>
    </div>
  );
}

/* dates in a rail on the left of every entry */
function Daterail({ d, t }) {
  const Sec = ({ title, show = true, children }) =>
    show ? (
      <section style={{ marginBottom: 18 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
          <span style={{ width: 14, height: 14, background: t.accent, display: 'inline-block' }} />
          <h2 style={{ margin: 0, fontSize: 14, textTransform: 'uppercase', letterSpacing: 2, color: t.text }}>{title}</h2>
          <span style={{ flex: 1, height: 1, background: '#d1d5db' }} />
        </div>
        {children}
      </section>
    ) : null;
  const Entry = ({ date, children }) => (
    <div style={{ display: 'flex', gap: 14, marginBottom: 10 }}>
      <div style={{ width: 104, flexShrink: 0, textAlign: 'right', fontSize: 11, color: t.accent, fontWeight: 700, paddingTop: 1 }}>{date}</div>
      <div style={{ borderLeft: `2px solid ${t.accent}55`, paddingLeft: 14, flex: 1, minWidth: 0 }}>{children}</div>
    </div>
  );
  return (
    <div style={{ ...pageBox, padding: '46px 52px' }}>
      <header style={{ display: 'flex', alignItems: 'center', gap: 18, marginBottom: 20 }}>
        <Photo d={d} size={90} border={t.accent} />
        <div style={{ flex: 1 }}>
          <h1 style={{ margin: 0, fontSize: 33, color: t.text, lineHeight: 1.05 }}>{d.fullName}</h1>
          <div style={{ fontSize: 14, color: t.accent, fontWeight: 700, marginTop: 4 }}>{d.title}</div>
          <div style={{ fontSize: 11, color: t.muted, marginTop: 7 }}>{contactItems(d).join('  |  ')}</div>
        </div>
      </header>
      <Summary d={d} t={t} />
      <Sec title="Experience" show={arr(d.experience).length > 0}>
        {arr(d.experience).map((e, i) => (
          <Entry key={i} date={e.period}>
            <strong style={{ fontSize: 13, color: t.text }}>{e.role}</strong>
            <div style={{ fontSize: 12, color: t.muted }}>{[e.company, e.location].filter(Boolean).join(' · ')}</div>
            <Bullets items={e.bullets} t={t} />
          </Entry>
        ))}
      </Sec>
      <Sec title="Education" show={arr(d.education).length > 0}>
        {arr(d.education).map((e, i) => (
          <Entry key={i} date={e.period}>
            <strong style={{ fontSize: 12.5, color: t.text }}>{e.degree}</strong>
            <div style={{ fontSize: 12, color: t.muted }}>{[e.school, e.grade].filter(Boolean).join(' · ')}</div>
          </Entry>
        ))}
      </Sec>
      <Projects d={d} t={t} />
      <div style={{ display: 'flex', gap: 28 }}>
        <div style={{ flex: 1 }}><Skills d={d} t={t} /></div>
        <div style={{ flex: 1 }}><Certs d={d} t={t} /><Languages d={d} t={t} /></div>
      </div>
    </div>
  );
}

/* huge two-line name, pull-quote summary */
function Editorial({ d, t }) {
  const [first, ...rest] = (d.fullName || '').split(' ');
  return (
    <div style={{ ...pageBox, padding: '44px 52px' }}>
      <div style={{ borderTop: `8px solid ${t.accent}`, paddingTop: 20, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 20 }}>
        <div>
          <div style={{ fontSize: 56, lineHeight: 0.98, fontWeight: 300, color: t.text }}>{first}</div>
          <div style={{ fontSize: 56, lineHeight: 0.98, fontWeight: 800, color: t.text }}>{rest.join(' ')}</div>
          <div style={{ fontSize: 12.5, letterSpacing: 4, textTransform: 'uppercase', color: t.accent, fontWeight: 700, marginTop: 12 }}>{d.title}</div>
        </div>
        <Photo d={d} size={110} border={t.accent} />
      </div>
      <div style={{ display: 'flex', gap: 32, marginTop: 26 }}>
        <div style={{ width: 232, flexShrink: 0 }}>
          {d.summary && (
            <p style={{ margin: '0 0 20px', fontFamily: 'Georgia, serif', fontStyle: 'italic', fontSize: 15.5, lineHeight: 1.5, color: t.accent, borderLeft: `3px solid ${t.accent}`, paddingLeft: 12 }}>{d.summary}</p>
          )}
          <Heading t={t}>Contact</Heading>
          {contactItems(d).map((c, i) => <div key={i} style={{ fontSize: 11, marginBottom: 6, color: t.text, wordBreak: 'break-word' }}>{c}</div>)}
          <div style={{ height: 14 }} />
          <Skills d={d} t={t} chips={false} />
          <Languages d={d} t={t} />
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <Experience d={d} t={t} />
          <Education d={d} t={t} />
          <Projects d={d} t={t} />
          <Certs d={d} t={t} />
        </div>
      </div>
    </div>
  );
}

/* gradient header, numbered sections */
function Numbered({ d, t }) {
  let n = 0;
  const Sec = ({ title, show = true, children }) => {
    if (!show) return null;
    n += 1;
    return (
      <section style={{ marginBottom: 16 }}>
        <h2 style={{ margin: '0 0 8px', fontSize: 14, textTransform: 'uppercase', letterSpacing: 1.5, color: t.text }}>
          <span style={{ color: t.accent, fontWeight: 800, marginRight: 10 }}>{String(n).padStart(2, '0')}</span>
          {title}
        </h2>
        {children}
      </section>
    );
  };
  return (
    <div style={pageBox}>
      <header style={{ background: `linear-gradient(120deg, ${t.accent}, ${t.accent2 || t.accent})`, color: '#fff', padding: '38px 52px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 20 }}>
        <div>
          <h1 style={{ margin: 0, fontSize: 36, lineHeight: 1.05 }}>{d.fullName}</h1>
          <div style={{ fontSize: 15, marginTop: 5, opacity: 0.95 }}>{d.title}</div>
          <div style={{ fontSize: 11, marginTop: 12, opacity: 0.92 }}>{contactItems(d).join('   •   ')}</div>
        </div>
        <Photo d={d} size={104} border="#fff" />
      </header>
      <div style={{ padding: '26px 52px 40px' }}>
        <Sec title="Profile" show={!!d.summary}><Summary d={d} t={t} noHead /></Sec>
        <Sec title="Experience" show={arr(d.experience).length > 0}><Experience d={d} t={t} noHead /></Sec>
        <Sec title="Projects" show={arr(d.projects).length > 0}><Projects d={d} t={t} noHead /></Sec>
        <Sec title="Education" show={arr(d.education).length > 0}><Education d={d} t={t} noHead /></Sec>
        <Sec title="Skills" show={arr(d.skills).length > 0}><Skills d={d} t={t} noHead /></Sec>
        <Sec title="Certificates & languages" show={arr(d.certifications).length + arr(d.languages).length > 0}>
          <Certs d={d} t={t} noHead /><Languages d={d} t={t} noHead />
        </Sec>
      </div>
    </div>
  );
}

/* stat tiles under the header */
function Tiles({ d, t }) {
  const tiles = [
    [arr(d.experience).length, 'Roles'],
    [arr(d.projects).length, 'Projects'],
    [arr(d.skills).length, 'Skills'],
    [arr(d.certifications).length, 'Certificates'],
  ];
  return (
    <div style={{ ...pageBox, padding: '42px 50px' }}>
      <header style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 20, marginBottom: 18 }}>
        <div>
          <h1 style={{ margin: 0, fontSize: 34, color: t.text, lineHeight: 1.05 }}>{d.fullName}</h1>
          <div style={{ fontSize: 15, color: t.accent, fontWeight: 700, marginTop: 4 }}>{d.title}</div>
          <div style={{ fontSize: 11, color: t.muted, marginTop: 8 }}>{contactItems(d).join('  |  ')}</div>
        </div>
        <Photo d={d} size={100} border={t.accent} />
      </header>
      <div style={{ display: 'flex', gap: 10, marginBottom: 20 }}>
        {tiles.map(([num, label]) => (
          <div key={label} style={{ flex: 1, background: `${t.accent}12`, border: `1px solid ${t.accent}40`, borderRadius: 8, padding: '10px 0', textAlign: 'center' }}>
            <div style={{ fontSize: 24, fontWeight: 800, color: t.accent, lineHeight: 1 }}>{num}</div>
            <div style={{ fontSize: 10.5, color: t.muted, textTransform: 'uppercase', letterSpacing: 1, marginTop: 4 }}>{label}</div>
          </div>
        ))}
      </div>
      <Summary d={d} t={t} />
      <div style={{ display: 'flex', gap: 28 }}>
        <div style={{ flex: 1.6, minWidth: 0 }}><Experience d={d} t={t} /><Projects d={d} t={t} /></div>
        <div style={{ flex: 1, minWidth: 0 }}><Skills d={d} t={t} /><Education d={d} t={t} /><Certs d={d} t={t} /><Languages d={d} t={t} /></div>
      </div>
    </div>
  );
}

/* monogram, centered, small-caps headings */
function Monogram({ d, t }) {
  return (
    <div style={{ ...pageBox, padding: '48px 58px' }}>
      <header style={{ textAlign: 'center', marginBottom: 22 }}>
        {d.photo?.url ? (
          <div style={{ display: 'flex', justifyContent: 'center' }}><Photo d={d} size={86} border={t.accent} /></div>
        ) : (
          <div style={{ width: 76, height: 76, borderRadius: 76, border: `2px solid ${t.accent}`, color: t.accent, fontSize: 28, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto', letterSpacing: 2 }}>{ini(d.fullName)}</div>
        )}
        <h1 style={{ margin: '14px 0 0', fontSize: 30, fontWeight: 400, letterSpacing: 6, textTransform: 'uppercase', color: t.text }}>{d.fullName}</h1>
        <div style={{ fontSize: 14, fontStyle: 'italic', color: t.accent, marginTop: 5 }}>{d.title}</div>
        <div style={{ fontSize: 11, color: t.muted, marginTop: 9 }}>{contactItems(d).join('   ◆   ')}</div>
      </header>
      <Summary d={d} t={t} />
      <Experience d={d} t={t} />
      <Projects d={d} t={t} />
      <div style={{ display: 'flex', gap: 30 }}>
        <div style={{ flex: 1 }}><Education d={d} t={t} /><Certs d={d} t={t} /></div>
        <div style={{ flex: 1 }}><Skills d={d} t={t} chips={false} /><Languages d={d} t={t} /></div>
      </div>
    </div>
  );
}

const LAYOUTS = { single: Single, sidebar: Sidebar, banner: Banner, timeline: Timeline, howard: Howard, infographic: Infographic, dark: Dark, leftbar: Leftbar, split: Split, ats: Ats, executive: Executive, tricolumn: Tricolumn, labelcol: Labelcol, cards: Cards, diagonal: Diagonal, daterail: Daterail, editorial: Editorial, numbered: Numbered, tiles: Tiles, monogram: Monogram };

/** One A4 page. `templateId` picks the design, `data` is the resume content. */
export default function ResumeDoc({ templateId, data }) {
  const t = getResumeTemplate(templateId);
  const Layout = LAYOUTS[t.layout] || Single;
  return (
    <div
      className="resume-page"
      style={{
        width: PAGE_W,
        minHeight: PAGE_H,
        background: t.pageBg || '#ffffff',
        color: t.text,
        fontFamily: t.font,
        boxSizing: 'border-box',
        overflow: 'hidden',
        WebkitPrintColorAdjust: 'exact',
        printColorAdjust: 'exact',
      }}
    >
      <Layout d={data || {}} t={t} />
    </div>
  );
}
