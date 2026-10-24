import { useState } from 'react';
import ResourceManager from '../components/ResourceManager';

const educationFields = [
  { name: 'degree', label: 'Degree', type: 'text', required: true, placeholder: 'Bachelor of Technology — Computer Science' },
  { name: 'institute', label: 'Institute', type: 'text', required: true },
  { name: 'duration', label: 'Duration', type: 'text', half: true, placeholder: '2021 — 2025' },
  { name: 'cgpa', label: 'CGPA / Percentage', type: 'text', half: true, placeholder: '7.29 / 10' },
  { name: 'subjects', label: 'Key subjects', type: 'tags', placeholder: 'DSA, DBMS, Computer Networks' },
  { name: 'visible', label: 'Visibility', type: 'toggle', toggleLabel: 'Visible on the website' },
];

const certificationFields = [
  { name: 'title', label: 'Certification title', type: 'text', required: true },
  { name: 'issuer', label: 'Issued by', type: 'text', half: true },
  { name: 'year', label: 'Year', type: 'text', half: true, placeholder: '2025' },
  { name: 'credentialUrl', label: 'Credential URL (optional)', type: 'url', placeholder: 'https://…' },
  { name: 'visible', label: 'Visibility', type: 'toggle', toggleLabel: 'Visible on the website' },
];

export default function EducationAdmin() {
  const [tab, setTab] = useState('education');

  const tabs = (
    <div className="flex rounded-md border border-[var(--border)] p-0.5" role="tablist">
      {[
        ['education', 'Education'],
        ['certifications', 'Certifications'],
      ].map(([id, label]) => (
        <button
          key={id}
          type="button"
          role="tab"
          aria-selected={tab === id}
          onClick={() => setTab(id)}
          className={`rounded px-3 py-1.5 text-sm transition-colors ${
            tab === id ? 'bg-[var(--accent)] text-[var(--color-ink-950)]' : 'text-[var(--text-muted)] hover:text-[var(--text)]'
          }`}
        >
          {label}
        </button>
      ))}
    </div>
  );

  if (tab === 'certifications') {
    return (
      <ResourceManager
        key="certifications"
        title="Certifications"
        description="Courses and certificates shown under the Education page."
        endpoint="/admin/certifications"
        singular="certification"
        fields={certificationFields}
        headerExtra={tabs}
        newItem={() => ({ title: '', issuer: '', year: '', credentialUrl: '', visible: true })}
        describe={(c) => ({ title: c.title, subtitle: [c.issuer, c.year].filter(Boolean).join(', ') })}
      />
    );
  }

  return (
    <ResourceManager
      key="education"
      title="Education"
      description="Your academic background."
      endpoint="/admin/education"
      singular="education"
      fields={educationFields}
      headerExtra={tabs}
      newItem={() => ({ degree: '', institute: '', duration: '', cgpa: '', subjects: [], visible: true })}
      describe={(e) => ({ title: e.degree, subtitle: `${e.institute}${e.duration ? ` · ${e.duration}` : ''}` })}
    />
  );
}
