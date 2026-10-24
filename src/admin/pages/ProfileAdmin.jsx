import { useEffect, useState } from 'react';
import { api } from '../../api/client';
import { useToast } from '../../context/ToastContext';
import DynamicForm, { validateRequired } from '../fields/DynamicForm';
import { PageHeader, Spinner, Card } from '../components/ui';
import AdminIcon from '../components/AdminIcon';

const fields = [
  { type: 'heading', label: 'Identity & contact', help: 'Shown on the Home, About and Contact pages and in the footer.' },
  { name: 'name', label: 'Full name', type: 'text', required: true, half: true },
  { name: 'role', label: 'Role / title', type: 'text', half: true, placeholder: 'Full Stack Developer' },
  { name: 'availability', label: 'Availability badge', type: 'text', half: true, placeholder: 'Open to opportunities' },
  { name: 'location', label: 'Location', type: 'text', half: true },
  { name: 'email', label: 'Email', type: 'email', half: true },
  { name: 'phone', label: 'Phone', type: 'text', half: true },
  { name: 'currentJob', label: 'Current job', type: 'text', half: true },
  { name: 'education', label: 'Education (short)', type: 'text', half: true },

  { type: 'heading', label: 'Photo & resume' },
  { name: 'avatar', label: 'Profile photo', type: 'image', folder: 'profile', help: 'Shown on the Home and About pages. Optional.' },
  { name: 'resume', label: 'Resume (PDF)', type: 'file', folder: 'profile', help: 'Used by every “Resume” button on the site.' },

  { type: 'heading', label: 'Home page (hero)' },
  { name: 'heroLine1', label: 'Headline — line 1', type: 'text', placeholder: 'Sudhir Mahur builds' },
  { name: 'heroHighlight', label: 'Headline — highlighted line', type: 'text', placeholder: 'full stack experiences' },
  { name: 'heroLine3', label: 'Headline — line 3', type: 'text', placeholder: 'that feel effortless.' },
  { name: 'heroDescription', label: 'Intro paragraph', type: 'textarea', rows: 4 },
  {
    name: 'terminalLines',
    label: 'Terminal card lines',
    type: 'array',
    itemName: 'line',
    addLabel: 'Add line',
    newItem: () => ({ prompt: '$ ', output: '' }),
    itemLabel: (item) => item.prompt,
    fields: [
      { name: 'prompt', label: 'Command', type: 'text', half: true, placeholder: '$ whoami' },
      { name: 'output', label: 'Output', type: 'text', half: true, placeholder: 'Sudhir Mahur' },
    ],
  },

  { type: 'heading', label: 'About page content', help: 'The heading of the About page is edited under “Pages & menu”.' },
  { name: 'aboutParagraphs', label: 'About paragraphs', type: 'paragraphs', rows: 9 },
  {
    name: 'aboutFacts',
    label: 'Quick facts (profile card)',
    type: 'array',
    itemName: 'fact',
    addLabel: 'Add fact',
    newItem: () => ({ icon: 'briefcase', text: '' }),
    itemLabel: (item) => item.text,
    fields: [
      { name: 'icon', label: 'Icon', type: 'icon', half: true },
      { name: 'text', label: 'Text', type: 'text', half: true },
    ],
  },
  {
    name: 'aboutStats',
    label: 'Animated counters',
    type: 'array',
    itemName: 'counter',
    addLabel: 'Add counter',
    newItem: () => ({ target: 1, suffix: '+', label: '' }),
    itemLabel: (item) => item.label,
    fields: [
      { name: 'target', label: 'Number', type: 'number', min: 0, half: true },
      { name: 'suffix', label: 'Suffix', type: 'text', half: true, placeholder: '+' },
      { name: 'label', label: 'Label', type: 'text', placeholder: 'Projects shipped' },
    ],
  },

  { type: 'heading', label: 'Social links', help: 'Shown on the Home page, Contact page and footer.' },
  {
    name: 'socials',
    label: 'Links',
    type: 'array',
    itemName: 'link',
    addLabel: 'Add link',
    newItem: () => ({ label: '', url: '', icon: 'globe' }),
    itemLabel: (item) => item.label,
    fields: [
      { name: 'label', label: 'Label', type: 'text', half: true, placeholder: 'GitHub' },
      { name: 'icon', label: 'Icon', type: 'icon', half: true },
      { name: 'url', label: 'URL', type: 'text', placeholder: 'https://github.com/username  or  mailto:you@example.com' },
    ],
  },

  { type: 'heading', label: 'Footer & SEO' },
  { name: 'footerText', label: 'Footer description', type: 'textarea', rows: 2 },
  { name: 'footerNote', label: 'Footer note (bottom right)', type: 'text', placeholder: 'Built with React' },
  { name: 'siteTitle', label: 'Browser tab title', type: 'text' },
  { name: 'siteDescription', label: 'Meta description (Google)', type: 'textarea', rows: 3 },
];

export default function ProfileAdmin() {
  const toast = useToast();
  const [values, setValues] = useState(null);
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    let cancelled = false;
    api
      .get('/admin/profile')
      .then((res) => {
        if (!cancelled) setValues(JSON.parse(JSON.stringify(res.data)));
      })
      .catch((err) => {
        if (!cancelled) setError(err.message);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const handleSave = async (event) => {
    event.preventDefault();
    const problem = validateRequired(fields, values);
    if (problem) {
      toast.error(problem);
      return;
    }
    const payload = {};
    fields.forEach((field) => {
      if (field.name) payload[field.name] = values[field.name];
    });
    setSaving(true);
    try {
      const res = await api.put('/admin/profile', payload);
      setValues(JSON.parse(JSON.stringify(res.data)));
      toast.success('Profile saved');
    } catch (err) {
      toast.error(err.message);
    } finally {
      setSaving(false);
    }
  };

  if (error) {
    return (
      <Card className="p-6 text-center">
        <p className="text-sm text-red-400">{error}</p>
      </Card>
    );
  }
  if (!values) {
    return (
      <div className="flex justify-center py-20">
        <Spinner size={28} />
      </div>
    );
  }

  return (
    <form onSubmit={handleSave} noValidate>
      <PageHeader
        title="Profile & site content"
        description="Your name, hero text, about section, resume, social links and footer — everything that is not a list of items."
        actions={
          <button type="submit" className="btn btn-primary" disabled={saving}>
            <AdminIcon name="check" size={16} />
            {saving ? 'Saving…' : 'Save changes'}
          </button>
        }
      />
      <Card className="p-4 sm:p-6">
        <DynamicForm
          fields={fields}
          values={values}
          onChange={(name, value) => setValues((current) => ({ ...current, [name]: value }))}
          idPrefix="profile"
        />
      </Card>
      <div className="sticky bottom-0 z-10 mt-6 flex justify-end border-t border-[var(--border)] bg-[var(--bg)]/90 py-3 backdrop-blur">
        <button type="submit" className="btn btn-primary" disabled={saving}>
          <AdminIcon name="check" size={16} />
          {saving ? 'Saving…' : 'Save changes'}
        </button>
      </div>
    </form>
  );
}
