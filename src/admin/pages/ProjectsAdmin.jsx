import ResourceManager from '../components/ResourceManager';

const fields = [
  { name: 'title', label: 'Project title', type: 'text', required: true, placeholder: 'Wizly — E-commerce Platform' },
  { name: 'image', label: 'Project image / screenshot', type: 'image', folder: 'projects' },
  { name: 'description', label: 'Description', type: 'textarea', rows: 4 },
  { name: 'category', label: 'Category', type: 'text', half: true, placeholder: 'Full Stack', help: 'Used for the filter buttons on the Projects page (e.g. Full Stack, Frontend, Mobile).' },
  { name: 'tags', label: 'Tech stack / tags', type: 'tags', half: true, placeholder: 'React.js, Node.js, MongoDB' },
  { name: 'features', label: 'Key features', type: 'lines', rows: 5, placeholder: 'Razorpay payment integration' },
  { name: 'githubUrl', label: 'GitHub URL', type: 'url', half: true, placeholder: 'https://github.com/…' },
  { name: 'liveUrl', label: 'Live URL', type: 'url', half: true, placeholder: 'https://…' },
  { name: 'featured', label: 'Home page', type: 'toggle', half: true, toggleLabel: 'Show in “Selected work” on the home page' },
  { name: 'visible', label: 'Visibility', type: 'toggle', half: true, toggleLabel: 'Visible on the website' },
];

export default function ProjectsAdmin() {
  return (
    <ResourceManager
      title="Projects"
      description="Add, edit, reorder or hide the projects shown on the Projects page. Upload a screenshot for each one."
      endpoint="/admin/projects"
      singular="project"
      fields={fields}
      modalWide
      newItem={() => ({
        title: '', image: null, description: '', category: 'Full Stack', tags: [], features: [],
        githubUrl: '', liveUrl: '', featured: false, visible: true,
      })}
      describe={(p) => ({
        title: p.title,
        subtitle: p.category,
        image: p.image?.url || '',
        badges: [
          ...(p.featured ? [{ label: 'Featured', tone: 'accent' }] : []),
          ...(p.liveUrl ? [{ label: 'Live', tone: 'green' }] : []),
        ],
      })}
    />
  );
}
