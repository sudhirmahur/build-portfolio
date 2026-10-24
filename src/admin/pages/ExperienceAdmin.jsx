import ResourceManager from '../components/ResourceManager';

const fields = [
  { name: 'position', label: 'Position', type: 'text', required: true, half: true, placeholder: 'Full Stack Developer' },
  { name: 'company', label: 'Company', type: 'text', required: true, half: true },
  { name: 'duration', label: 'Duration', type: 'text', half: true, placeholder: 'April 2025 — March 2026' },
  { name: 'location', label: 'Location', type: 'text', half: true, placeholder: 'Noida, India' },
  { name: 'description', label: 'Summary', type: 'textarea', rows: 3 },
  { name: 'responsibilities', label: 'Responsibilities / achievements', type: 'lines', rows: 6 },
  { name: 'technologies', label: 'Technologies', type: 'tags', placeholder: 'React.js, Node.js, MongoDB' },
  { name: 'visible', label: 'Visibility', type: 'toggle', toggleLabel: 'Visible on the website' },
];

export default function ExperienceAdmin() {
  return (
    <ResourceManager
      title="Experience"
      description="Your work history, shown as a timeline (top item appears first)."
      endpoint="/admin/experience"
      singular="experience"
      fields={fields}
      modalWide
      newItem={() => ({
        position: '', company: '', duration: '', location: '', description: '',
        responsibilities: [], technologies: [], visible: true,
      })}
      describe={(e) => ({ title: `${e.position} — ${e.company}`, subtitle: e.duration })}
    />
  );
}
