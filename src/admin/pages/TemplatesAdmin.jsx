import { useEffect, useState } from 'react';
import { api } from '../../api/client';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { Badge, Card, PageHeader, Spinner } from '../components/ui';
import { PORTFOLIO_TEMPLATES } from '../../templates/portfolioTemplates';

/* mini preview drawn with the template's own colours */
function Thumb({ tpl }) {
  const p = tpl.palette || { bg: '#0b1120', text: '#e9edf5', accent: '#f5b942' };
  const line = (w, c = p.text, o = 0.55, h = 5) => <div style={{ width: w, height: h, background: c, opacity: o, borderRadius: 2 }} />;
  const photo = (sz, r = '50%') => <div style={{ width: sz, height: sz, borderRadius: r, background: p.accent, opacity: 0.85 }} />;
  const wrap = { background: p.bg, width: '100%', height: '100%', position: 'relative', overflow: 'hidden' };
  const nav = (
    <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 10px' }}>
      {line(34, p.text, 0.7)}
      <div style={{ display: 'flex', gap: 5 }}>{line(14)}{line(14)}{line(14, p.accent, 1)}</div>
    </div>
  );
  if (tpl.thumb === 'rail') {
    return (
      <div style={{ ...wrap, display: 'flex' }}>
        <div style={{ width: '30%', background: tpl.id === 'howard' ? p.accent : `${p.text}14`, padding: 8, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 5 }}>
          <div style={{ marginTop: 6 }}>{photo(30)}</div>
          {line('70%', tpl.id === 'howard' ? '#fff' : p.text, 0.7)}{line('55%', tpl.id === 'howard' ? '#fff' : p.text, 0.4)}
        </div>
        <div style={{ flex: 1, padding: 12, display: 'flex', flexDirection: 'column', gap: 6, alignItems: tpl.id === 'howard' ? 'center' : 'flex-start' }}>
          {line('70%', p.text, 0.8, 8)}{line('45%', p.accent, 1, 8)}{line('85%', p.text, 0.35, 4)}
          <div style={{ width: '100%', height: 22, background: `${p.text}14`, borderRadius: 4, marginTop: 4 }} />
        </div>
      </div>
    );
  }
  if (tpl.thumb === 'center') {
    return (
      <div style={wrap}>
        {nav}
        <div style={{ margin: '4px 14px', padding: 12, border: `1px solid ${p.accent}66`, borderRadius: 8, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 5 }}>
          {line('60%', p.text, 0.85, 8)}{line('40%', p.accent, 1, 8)}{line('70%', p.text, 0.35, 4)}
          <div style={{ display: 'flex', gap: 5, marginTop: 3 }}>
            <div style={{ width: 28, height: 9, background: p.accent, borderRadius: 9 }} /><div style={{ width: 28, height: 9, border: `1px solid ${p.text}55`, borderRadius: 9 }} />
          </div>
        </div>
      </div>
    );
  }
  if (tpl.thumb === 'banner') {
    return (
      <div style={wrap}>
        <div style={{ background: p.accent, height: '48%', display: 'flex', gap: 10, padding: '0 14px' }}>
          <div style={{ width: 38, height: '115%', background: '#fff', borderRadius: '0 0 20px 20px', boxShadow: '0 1px 4px rgba(0,0,0,.2)' }} />
          <div style={{ flex: 1, paddingTop: 14, display: 'flex', flexDirection: 'column', gap: 5 }}>{line('60%', '#2b1d00', 0.85, 7)}{line('80%', '#fff', 0.8)}{line('70%', '#fff', 0.8)}</div>
        </div>
        <div style={{ padding: '12px 14px 0 60px' }}><div style={{ width: 46, height: 10, background: p.accent, borderRadius: '0 8px 8px 0' }} /></div>
      </div>
    );
  }
  // split (text left, photo right)
  return (
    <div style={wrap}>
      {nav}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '6px 12px' }}>
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 5 }}>
          {line('85%', p.text, 0.85, 8)}{line('55%', p.accent, 1, 8)}{line('90%', p.text, 0.35, 4)}
          <div style={{ width: 30, height: 10, background: p.accent, borderRadius: 3, marginTop: 3 }} />
        </div>
        <div style={{ width: 52, height: 64, background: p.accent, opacity: 0.8, borderRadius: tpl.id === 'classic' ? 32 : 6 }} />
      </div>
    </div>
  );
}

export default function TemplatesAdmin() {
  const toast = useToast();
  const { admin } = useAuth();
  const [current, setCurrent] = useState(null);
  const [busy, setBusy] = useState('');
  const [error, setError] = useState('');
  const slug = admin?.portfolio?.slug;

  useEffect(() => {
    let cancelled = false;
    api
      .get('/admin/portfolio')
      .then((res) => {
        if (!cancelled) setCurrent(res.data.template || 'classic');
      })
      .catch((err) => {
        if (!cancelled) setError(err.message);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const choose = async (id) => {
    setBusy(id);
    try {
      const res = await api.put('/admin/portfolio', { template: id });
      setCurrent(res.data.template || id);
      toast.success('Template applied to your portfolio');
    } catch (err) {
      toast.error(err.message);
    } finally {
      setBusy('');
    }
  };

  if (error) return <p className="text-sm text-red-400">{error}</p>;
  if (!current) {
    return (
      <div className="flex justify-center py-20">
        <Spinner size={26} />
      </div>
    );
  }

  return (
    <div>
      <PageHeader
        title="Portfolio templates"
        description="Choose how your public portfolio looks. Your content stays exactly the same — only the layout changes."
      />
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
        {PORTFOLIO_TEMPLATES.map((tpl) => {
          const active = tpl.id === current;
          return (
            <Card key={tpl.id} className={`overflow-hidden ${active ? 'ring-2 ring-[var(--accent)]' : ''}`}>
              <div className="aspect-[16/10] overflow-hidden border-b border-[var(--border)]"><Thumb tpl={tpl} /></div>
              <div className="p-4">
                <div className="flex items-center justify-between gap-2">
                  <h3 className="font-display text-base font-medium">{tpl.name}</h3>
                  {active && <Badge tone="accent">Active</Badge>}
                </div>
                <p className="mt-1 min-h-[2.5rem] text-xs text-[var(--text-muted)]">{tpl.description}</p>
                <div className="mt-3 flex gap-2">
                  <button
                    type="button"
                    className="btn btn-primary btn-sm flex-1"
                    disabled={active || Boolean(busy)}
                    onClick={() => choose(tpl.id)}
                  >
                    {busy === tpl.id ? 'Applying…' : active ? 'In use' : 'Use this template'}
                  </button>
                  {slug && (
                    <a className="btn btn-outline btn-sm" href={`/p/${slug}?tpl=${tpl.id}`} target="_blank" rel="noreferrer">
                      Preview
                    </a>
                  )}
                </div>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
