import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../../api/client';
import { PageHeader } from '../components/ui';
import FitToWidth from '../../resume/FitToWidth';
import ResumeDoc from '../../resume/ResumeDoc';
import { RESUME_TEMPLATES } from '../../resume/templates';
import { sampleResume } from '../../resume/sampleData';

export default function ResumeGallery() {
  const [saved, setSaved] = useState(null);

  useEffect(() => {
    let cancelled = false;
    api
      .get('/admin/resume')
      .then((res) => {
        if (!cancelled) setSaved(res.data);
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div>
      <PageHeader
        title="Resume builder"
        description="Pick one of 10 templates, fill in your details and download a ready A4 PDF."
        actions={
          saved && (
            <Link to={`/admin/resume/${saved.template}`} className="btn btn-primary btn-sm">
              Continue my resume
            </Link>
          )
        }
      />
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
        {RESUME_TEMPLATES.map((tpl) => (
          <Link
            key={tpl.id}
            to={`/admin/resume/${tpl.id}`}
            className="group overflow-hidden rounded-lg border border-[var(--border)] bg-[var(--bg-elevated)] transition-colors hover:border-[var(--accent)]"
          >
            <div className="pointer-events-none border-b border-[var(--border)] bg-neutral-200">
              <FitToWidth>
                <ResumeDoc templateId={tpl.id} data={sampleResume} />
              </FitToWidth>
            </div>
            <div className="flex items-center justify-between gap-2 p-3">
              <div className="min-w-0">
                <p className="truncate text-sm font-medium">{tpl.name}</p>
                <p className="truncate text-xs text-[var(--text-muted)]">{tpl.tag}</p>
              </div>
              <span className="text-xs text-[var(--accent)] group-hover:underline">
                {saved?.template === tpl.id ? 'Open' : 'Use'}
              </span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
