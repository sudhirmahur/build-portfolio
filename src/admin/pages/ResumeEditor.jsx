import { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { api } from '../../api/client';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import DynamicForm from '../fields/DynamicForm';
import { Card, PageHeader, Spinner } from '../components/ui';
import FitToWidth from '../../resume/FitToWidth';
import ResumeDoc from '../../resume/ResumeDoc';
import ResumePrintPortal, { printResume } from '../../resume/ResumePrint';
import { RESUME_TEMPLATES, getResumeTemplate } from '../../resume/templates';
import { emptyResume } from '../../resume/sampleData';

const fields = [
  { type: 'heading', label: 'Personal details' },
  { name: 'fullName', label: 'Full name', type: 'text', half: true },
  { name: 'title', label: 'Job title', type: 'text', half: true, placeholder: 'Full Stack Developer' },
  { name: 'email', label: 'Email', type: 'text', half: true },
  { name: 'phone', label: 'Phone', type: 'text', half: true },
  { name: 'location', label: 'Location', type: 'text', half: true },
  { name: 'website', label: 'Website', type: 'text', half: true },
  { name: 'linkedin', label: 'LinkedIn', type: 'text', half: true },
  { name: 'github', label: 'GitHub', type: 'text', half: true },
  { name: 'photo', label: 'Photo (optional)', type: 'image', folder: 'resume', help: 'Used by templates that show a photo.' },
  { name: 'summary', label: 'Profile summary', type: 'textarea', rows: 4 },

  { type: 'heading', label: 'Experience' },
  {
    name: 'experience',
    label: 'Jobs',
    type: 'array',
    itemName: 'job',
    addLabel: 'Add job',
    newItem: () => ({ role: '', company: '', location: '', period: '', bullets: [] }),
    itemLabel: (i) => [i.role, i.company].filter(Boolean).join(' — '),
    fields: [
      { name: 'role', label: 'Role', type: 'text', half: true },
      { name: 'company', label: 'Company', type: 'text', half: true },
      { name: 'location', label: 'Location', type: 'text', half: true },
      { name: 'period', label: 'Period', type: 'text', half: true, placeholder: 'Jan 2024 – Present' },
      { name: 'bullets', label: 'Achievements', type: 'lines', rows: 4 },
    ],
  },

  { type: 'heading', label: 'Projects' },
  {
    name: 'projects',
    label: 'Projects',
    type: 'array',
    itemName: 'project',
    addLabel: 'Add project',
    newItem: () => ({ name: '', link: '', tech: [], description: '' }),
    itemLabel: (i) => i.name,
    fields: [
      { name: 'name', label: 'Name', type: 'text', half: true },
      { name: 'link', label: 'Link', type: 'text', half: true },
      { name: 'tech', label: 'Technologies', type: 'tags' },
      { name: 'description', label: 'Description', type: 'textarea', rows: 3 },
    ],
  },

  { type: 'heading', label: 'Education' },
  {
    name: 'education',
    label: 'Education',
    type: 'array',
    itemName: 'education',
    addLabel: 'Add education',
    newItem: () => ({ degree: '', school: '', period: '', grade: '' }),
    itemLabel: (i) => i.degree,
    fields: [
      { name: 'degree', label: 'Degree', type: 'text', half: true },
      { name: 'school', label: 'School / college', type: 'text', half: true },
      { name: 'period', label: 'Period', type: 'text', half: true },
      { name: 'grade', label: 'Grade / CGPA', type: 'text', half: true },
    ],
  },

  { type: 'heading', label: 'Skills, certificates & languages' },
  { name: 'skills', label: 'Skills', type: 'tags' },
  {
    name: 'certifications',
    label: 'Certifications',
    type: 'array',
    itemName: 'certification',
    addLabel: 'Add certification',
    newItem: () => ({ name: '', issuer: '', year: '' }),
    itemLabel: (i) => i.name,
    fields: [
      { name: 'name', label: 'Name', type: 'text' },
      { name: 'issuer', label: 'Issuer', type: 'text', half: true },
      { name: 'year', label: 'Year', type: 'text', half: true },
    ],
  },
  { name: 'languages', label: 'Languages', type: 'tags' },
];

const list = (res) => (Array.isArray(res?.data) ? res.data : []);

export default function ResumeEditor() {
  const { templateId } = useParams();
  const navigate = useNavigate();
  const toast = useToast();
  const { admin } = useAuth();
  const tpl = getResumeTemplate(templateId);
  const [data, setData] = useState(null);
  const [saving, setSaving] = useState(false);
  const [importing, setImporting] = useState(false);
  const [formKey, setFormKey] = useState(0);

  // invalid template id in the URL -> go to the first valid one
  useEffect(() => {
    if (!RESUME_TEMPLATES.some((t) => t.id === templateId)) navigate(`/admin/resume/${tpl.id}`, { replace: true });
  }, [templateId, tpl.id, navigate]);

  useEffect(() => {
    let cancelled = false;
    api
      .get('/admin/resume')
      .then((res) => {
        if (cancelled) return;
        setData(res.data?.data ? { ...emptyResume(), ...res.data.data } : { ...emptyResume(), fullName: admin?.name || '', email: admin?.email || '' });
      })
      .catch((err) => {
        if (cancelled) return;
        toast.error(err.message);
        setData({ ...emptyResume() });
      });
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const setField = (name, value) => setData((prev) => ({ ...prev, [name]: value }));

  const save = async () => {
    setSaving(true);
    try {
      await api.put('/admin/resume', { template: tpl.id, data });
      toast.success('Resume saved');
    } catch (err) {
      toast.error(err.message);
    } finally {
      setSaving(false);
    }
  };

  const importFromPortfolio = async () => {
    if (!window.confirm('This replaces the fields with your portfolio data. Continue?')) return;
    setImporting(true);
    try {
      const [profile, exp, skills, edu, projects, certs] = await Promise.all([
        api.get('/admin/profile'),
        api.get('/admin/experience'),
        api.get('/admin/skills'),
        api.get('/admin/education'),
        api.get('/admin/projects'),
        api.get('/admin/certifications').catch(() => ({ data: [] })),
      ]);
      const p = profile.data || {};
      const email = (p.socials || []).find((s) => /^mailto:/i.test(s.url || ''))?.url?.replace(/^mailto:/i, '');
      setData({
        ...emptyResume(),
        fullName: p.name || '',
        title: p.role || '',
        email: p.email || email || '',
        phone: p.phone || '',
        location: p.location || '',
        // only the URL is copied, so removing it here never deletes the portfolio photo
        photo: p.avatar?.url ? { url: p.avatar.url } : null,
        summary: (p.aboutParagraphs || [])[0] || p.heroDescription || '',
        experience: list(exp).map((e) => ({
          role: e.position || '',
          company: e.company || '',
          location: e.location || '',
          period: e.duration || '',
          bullets: e.responsibilities?.length ? e.responsibilities : e.description ? [e.description] : [],
        })),
        education: list(edu).map((e) => ({
          degree: e.degree || '',
          school: e.institute || '',
          period: e.duration || '',
          grade: e.cgpa || '',
        })),
        skills: list(skills).flatMap((c) => (c.skills || []).map((s) => s.name)).filter(Boolean),
        projects: list(projects).map((x) => ({
          name: x.title || '',
          link: x.liveUrl || x.githubUrl || '',
          tech: x.tags || [],
          description: x.description || '',
        })),
        certifications: list(certs).map((c) => ({ name: c.title || '', issuer: c.issuer || '', year: c.year || '' })),
      });
      setFormKey((k) => k + 1);
      toast.success('Imported from your portfolio — review and save');
    } catch (err) {
      toast.error(err.message);
    } finally {
      setImporting(false);
    }
  };

  const preview = useMemo(() => data && <ResumeDoc templateId={tpl.id} data={data} />, [data, tpl.id]);

  if (!data) {
    return (
      <div className="flex justify-center py-20">
        <Spinner size={26} />
      </div>
    );
  }

  return (
    <div>
      <PageHeader
        title={`Resume — ${tpl.name}`}
        description="Fill in the details on the left. The A4 preview updates live."
        actions={
          <>
            <Link to="/admin/resume" className="btn btn-outline btn-sm">All templates</Link>
            <button type="button" className="btn btn-outline btn-sm" onClick={importFromPortfolio} disabled={importing}>
              {importing ? 'Importing…' : 'Import from portfolio'}
            </button>
            <button type="button" className="btn btn-outline btn-sm" onClick={save} disabled={saving}>
              {saving ? 'Saving…' : 'Save'}
            </button>
            <button type="button" className="btn btn-primary btn-sm" onClick={printResume}>
              Download PDF
            </button>
          </>
        }
      />

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-[minmax(0,1fr)_minmax(0,430px)]">
        <Card className="p-5">
          <div className="mb-5">
            <label htmlFor="rb-template" className="mb-1.5 block text-sm font-medium">Template</label>
            <select
              id="rb-template"
              className="field-input"
              value={tpl.id}
              onChange={(e) => navigate(`/admin/resume/${e.target.value}`)}
            >
              {RESUME_TEMPLATES.map((t) => (
                <option key={t.id} value={t.id}>{t.name} — {t.tag}</option>
              ))}
            </select>
          </div>
          <DynamicForm key={formKey} fields={fields} values={data} onChange={setField} idPrefix="rb" />
        </Card>

        <div className="xl:sticky xl:top-4 xl:self-start">
          <Card className="overflow-hidden p-3">
            <div className="overflow-hidden rounded border border-[var(--border)] bg-neutral-200 shadow-sm">
              <FitToWidth>{preview}</FitToWidth>
            </div>
            <p className="mt-3 text-xs text-[var(--text-muted)]">
              Tip: in the print window choose <strong>Save as PDF</strong>, paper <strong>A4</strong>, margins <strong>None</strong> and
              turn on <strong>Background graphics</strong>.
            </p>
          </Card>
        </div>
      </div>
      <ResumePrintPortal templateId={tpl.id} data={data} />
    </div>
  );
}
