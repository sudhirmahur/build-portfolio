import { useEffect, useState } from 'react';
import { api } from '../../api/client';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { FONTS, loadFont } from '../../utils/fonts';
import { themeVars } from '../../utils/theme';
import AdminIcon from '../components/AdminIcon';
import { Card, PageHeader, Spinner, Toggle } from '../components/ui';

const HEX = /^#[0-9a-fA-F]{6}$/;
const slugify = (text) =>
  text.toLowerCase().trim().replace(/&/g, ' and ').replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 60);

const PRESETS = [
  { name: 'Midnight Gold', accent: '#f5b942', bg: '#0b1120', text: '#e9edf5' },
  { name: 'Paper', accent: '#d99b23', bg: '#f7f5f0', text: '#171a22' },
  { name: 'Ocean', accent: '#38bdf8', bg: '#06141f', text: '#e6f4fb' },
  { name: 'Forest', accent: '#4ade80', bg: '#0d1a12', text: '#e7f5ec' },
  { name: 'Rose', accent: '#fb7185', bg: '#1a0d12', text: '#fbe9ee' },
  { name: 'Violet', accent: '#a78bfa', bg: '#120e1f', text: '#eeeafb' },
  { name: 'Clean White', accent: '#2563eb', bg: '#ffffff', text: '#0f172a' },
];

function ColorField({ id, label, value, onChange }) {
  const [text, setText] = useState(value);
  useEffect(() => setText(value), [value]);

  return (
    <div>
      <label htmlFor={id} className="mb-1.5 block text-sm font-medium">{label}</label>
      <div className="flex items-center gap-2">
        <input
          id={id}
          type="color"
          value={HEX.test(value) ? value : '#000000'}
          onChange={(e) => onChange(e.target.value)}
          className="h-10 w-12 shrink-0 cursor-pointer rounded-md border border-[var(--border)] bg-transparent p-1"
        />
        <input
          className="field-input font-mono"
          value={text}
          maxLength={7}
          aria-label={`${label} hex code`}
          onChange={(e) => {
            const v = e.target.value.startsWith('#') ? e.target.value : `#${e.target.value}`;
            setText(v);
            if (HEX.test(v)) onChange(v.toLowerCase());
          }}
        />
      </div>
    </div>
  );
}

export default function DesignAdmin() {
  const toast = useToast();
  const { admin, setAdmin } = useAuth();
  const [data, setData] = useState(null);
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    let cancelled = false;
    api
      .get('/admin/portfolio')
      .then((res) => {
        if (!cancelled) setData({ slug: res.data.slug, published: res.data.published, theme: { ...res.data.theme } });
      })
      .catch((err) => {
        if (!cancelled) setError(err.message);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (data) {
      loadFont(data.theme.headingFont);
      loadFont(data.theme.bodyFont);
    }
  }, [data]);

  if (error) return <Card className="p-6 text-center text-sm text-red-400">{error}</Card>;
  if (!data) {
    return (
      <div className="flex justify-center py-20">
        <Spinner size={28} />
      </div>
    );
  }

  const { theme } = data;
  const setTheme = (patch) => setData((d) => ({ ...d, theme: { ...d.theme, ...patch } }));
  const url = `${window.location.origin}/p/${slugify(data.slug)}`;

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(url);
      toast.success('Link copied');
    } catch {
      toast.error('Could not copy — select the link and copy it manually');
    }
  };

  const save = async (e) => {
    e.preventDefault();
    const slug = slugify(data.slug);
    if (slug.length < 3) return toast.error('Portfolio URL must be at least 3 characters');
    setSaving(true);
    try {
      const res = await api.put('/admin/portfolio', { slug, published: data.published, theme: data.theme });
      setData({ slug: res.data.slug, published: res.data.published, theme: { ...res.data.theme } });
      setAdmin({ ...admin, portfolio: { slug: res.data.slug, published: res.data.published } });
      toast.success('Saved');
    } catch (err) {
      toast.error(err.message);
    } finally {
      setSaving(false);
    }
  };

  const { 'color-scheme': _ignored, ...previewVars } = themeVars(theme);

  return (
    <form onSubmit={save} noValidate>
      <PageHeader
        title="Design & link"
        description="Choose your portfolio's public link, colors and fonts."
        actions={
          <button type="submit" className="btn btn-primary" disabled={saving}>
            <AdminIcon name="check" size={16} />
            {saving ? 'Saving…' : 'Save changes'}
          </button>
        }
      />

      <Card className="mb-6 p-4 sm:p-6">
        <h2 className="mb-4 font-display text-lg font-medium">Public link</h2>
        <label htmlFor="slug" className="mb-1.5 block text-sm font-medium">Portfolio URL name</label>
        <div className="flex items-stretch overflow-hidden rounded-md border border-[var(--border)] focus-within:border-[var(--accent)]">
          <span className="hidden shrink-0 items-center bg-[var(--bg-elevated-2)] px-3 text-sm text-[var(--text-muted)] sm:flex">
            {window.location.host}/p/
          </span>
          <input
            id="slug"
            className="min-w-0 flex-1 bg-[var(--bg)] px-3 py-2.5 text-sm outline-none"
            value={data.slug}
            onChange={(e) => setData({ ...data, slug: e.target.value })}
          />
        </div>
        <p className="mt-2 break-all text-sm">
          <span className="text-[var(--text-muted)]">Your link: </span>
          <a href={url} target="_blank" rel="noopener noreferrer" className="text-[var(--accent)] hover:underline">{url}</a>
        </p>
        <p className="mt-1 text-xs text-[var(--text-muted)]">Changing the name changes your link — the old link stops working.</p>
        <div className="mt-4 flex flex-wrap items-center gap-3">
          <button type="button" className="btn btn-outline btn-sm" onClick={copy}>Copy link</button>
          <Toggle id="published" checked={data.published} onChange={(v) => setData({ ...data, published: v })} label="Published (anyone with the link can view it)" />
        </div>
      </Card>

      <Card className="mb-6 p-4 sm:p-6">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <h2 className="font-display text-lg font-medium">Colors & fonts</h2>
          <Toggle id="theme-enabled" checked={theme.enabled} onChange={(v) => setTheme({ enabled: v })} label="Use my own colors & fonts" />
        </div>

        <div className={theme.enabled ? '' : 'pointer-events-none opacity-50'} aria-disabled={!theme.enabled}>
          <p className="mb-2 text-sm font-medium">Quick presets</p>
          <div className="mb-5 flex flex-wrap gap-2">
            {PRESETS.map((preset) => (
              <button
                key={preset.name}
                type="button"
                onClick={() => setTheme({ accent: preset.accent, bg: preset.bg, text: preset.text })}
                className="flex items-center gap-2 rounded-full border border-[var(--border)] px-3 py-1.5 text-xs transition-colors hover:border-[var(--accent)]"
              >
                <span className="h-4 w-4 rounded-full border border-white/20" style={{ background: preset.bg }} />
                <span className="-ml-3 h-4 w-4 rounded-full border border-white/20" style={{ background: preset.accent }} />
                {preset.name}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <ColorField id="c-accent" label="Accent color" value={theme.accent} onChange={(v) => setTheme({ accent: v })} />
            <ColorField id="c-bg" label="Background color" value={theme.bg} onChange={(v) => setTheme({ bg: v })} />
            <ColorField id="c-text" label="Text color" value={theme.text} onChange={(v) => setTheme({ text: v })} />
          </div>

          <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor="f-heading" className="mb-1.5 block text-sm font-medium">Heading font</label>
              <select id="f-heading" className="field-input" value={theme.headingFont} onChange={(e) => setTheme({ headingFont: e.target.value })}>
                {FONTS.map((f) => <option key={f} value={f}>{f}</option>)}
              </select>
            </div>
            <div>
              <label htmlFor="f-body" className="mb-1.5 block text-sm font-medium">Body font</label>
              <select id="f-body" className="field-input" value={theme.bodyFont} onChange={(e) => setTheme({ bodyFont: e.target.value })}>
                {FONTS.map((f) => <option key={f} value={f}>{f}</option>)}
              </select>
            </div>
          </div>
        </div>

        <p className="mb-2 mt-6 text-sm font-medium">Preview</p>
        <div
          style={{ ...previewVars, background: 'var(--bg)', color: 'var(--text)', fontFamily: 'var(--font-sans)', borderColor: 'var(--border)' }}
          className="rounded-lg border p-5"
        >
          <p style={{ color: 'var(--accent)' }} className="text-sm">Kicker label</p>
          <h3 style={{ fontFamily: 'var(--font-display)' }} className="mt-1 text-2xl font-medium">
            Your heading looks like this.
          </h3>
          <p style={{ color: 'var(--text-muted)' }} className="mt-2 max-w-md text-sm leading-relaxed">
            This is how body text appears on your portfolio, with your chosen font and colors.
          </p>
          <div className="mt-4 flex flex-wrap items-center gap-3">
            <span style={{ background: 'var(--accent)', color: 'var(--color-ink-950)' }} className="rounded-md px-4 py-2 text-sm font-medium">
              Button
            </span>
            <span style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border)' }} className="rounded-md px-4 py-2 text-sm">
              Card
            </span>
          </div>
        </div>
        {!theme.enabled && (
          <p className="mt-3 text-xs text-[var(--text-muted)]">Custom colors are off — visitors get the default dark/light theme with a toggle.</p>
        )}
      </Card>

      <div className="flex justify-end">
        <button type="submit" className="btn btn-primary" disabled={saving}>
          <AdminIcon name="check" size={16} />
          {saving ? 'Saving…' : 'Save changes'}
        </button>
      </div>
    </form>
  );
}
