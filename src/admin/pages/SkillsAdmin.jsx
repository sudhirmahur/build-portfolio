import ResourceManager from '../components/ResourceManager';

const fields = [
  { name: 'title', label: 'Category name', type: 'text', required: true, placeholder: 'Frontend' },
  {
    name: 'skills',
    label: 'Skills in this category',
    type: 'array',
    itemName: 'skill',
    addLabel: 'Add skill',
    newItem: () => ({ name: '', icon: 'code', level: 80, description: '' }),
    itemLabel: (item) => item.name,
    fields: [
      { name: 'name', label: 'Skill name', type: 'text', half: true, placeholder: 'React.js' },
      { name: 'icon', label: 'Icon', type: 'icon', half: true },
      { name: 'description', label: 'Short description', type: 'text', placeholder: 'Component-driven interfaces' },
      { name: 'level', label: 'Proficiency', type: 'range', min: 0, max: 100 },
    ],
  },
  { name: 'visible', label: 'Visibility', type: 'toggle', toggleLabel: 'Visible on the website' },
];

export default function SkillsAdmin() {
  return (
    <ResourceManager
      title="Skills"
      description="Group your skills into categories. Each skill has an icon and a proficiency bar."
      endpoint="/admin/skills"
      singular="category"
      fields={fields}
      modalWide
      newItem={() => ({ title: '', skills: [], visible: true })}
      describe={(c) => ({
        title: c.title,
        subtitle: (c.skills || []).map((s) => s.name).join(', '),
        badges: [{ label: `${(c.skills || []).length} skills` }],
      })}
    />
  );
}
