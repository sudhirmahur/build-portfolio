// 20 resume templates, each with its own page structure (not just a colour swap).
const SERIF = 'Georgia, "Times New Roman", serif';
const SANS = 'Inter, "Helvetica Neue", Arial, sans-serif';

export const RESUME_TEMPLATES = [
  { id: 'classic-serif', name: 'Classic', tag: 'Centered header · single column', layout: 'single', variant: 'center', font: SERIF, accent: '#111827', text: '#1f2937', muted: '#6b7280' },
  { id: 'executive', name: 'Executive', tag: 'Contact on right · summary box', layout: 'executive', font: SANS, accent: '#0f3d5e', text: '#1f2937', muted: '#6b7280' },
  { id: 'navy-sidebar', name: 'Navy Sidebar', tag: 'Dark left sidebar · photo', layout: 'sidebar', side: 'left', font: SANS, accent: '#1e3a5f', sidebarBg: '#1e3a5f', sidebarText: '#ffffff', text: '#1f2937', muted: '#6b7280' },
  { id: 'banner-blue', name: 'Blue Banner', tag: 'Header banner · two columns', layout: 'banner', font: SANS, accent: '#2563eb', bannerBg: '#2563eb', bannerText: '#ffffff', text: '#1f2937', muted: '#6b7280' },
  { id: 'timeline-purple', name: 'Timeline', tag: 'Dotted timeline · creative', layout: 'timeline', font: SANS, accent: '#7c3aed', text: '#1f2937', muted: '#6b7280' },
  { id: 'howard-blue', name: 'Blue Arch', tag: 'Arch photo · grey section bands', layout: 'howard', font: SANS, accent: '#0b5fc4', text: '#1f2937', muted: '#6b7280', headingStyle: 'band' },
  { id: 'amber-infographic', name: 'Amber Profile', tag: 'Infographic · pill headings', layout: 'infographic', font: SANS, accent: '#f5b800', bannerBg: '#f5b800', bannerText: '#2b1d00', pillText: '#2b1d00', text: '#2b2b2b', muted: '#6b7280', headingStyle: 'pill' },
  { id: 'dark-gold', name: 'Black & Gold', tag: 'Dark page · premium', layout: 'dark', font: SANS, accent: '#e0b865', pageBg: '#0e0e0e', panelBg: '#171717', text: '#e8e8e8', muted: '#9ca3af' },
  { id: 'leftbar-red', name: 'Red Bar', tag: 'Bold name · accent bar', layout: 'leftbar', font: SANS, accent: '#e63a22', text: '#1f2937', muted: '#6b7280', headingStyle: 'bar' },
  { id: 'split-cyan', name: 'Cyan Split', tag: 'Dark header · cyan strip', layout: 'split', font: SANS, accent: '#0e7490', bannerBg: '#06222b', bannerText: '#ffffff', stripBg: '#22d3ee', text: '#1f2937', muted: '#6b7280' },
  { id: 'ats-mono', name: 'ATS Plain', tag: 'Black & white · recruiter safe', layout: 'ats', font: '"Times New Roman", Times, serif', accent: '#000000', text: '#000000', muted: '#444444', headingStyle: 'plain' },
  { id: 'tricolumn', name: 'Three Columns', tag: 'Skills · experience · education', layout: 'tricolumn', font: SANS, accent: '#9a3412', text: '#1f2937', muted: '#6b7280', headingStyle: 'bar' },
  { id: 'labelcol', name: 'Label Column', tag: 'Harvard style · labels on left', layout: 'labelcol', font: SERIF, accent: '#14532d', text: '#1f2937', muted: '#6b7280' },
  { id: 'cards', name: 'Cards', tag: 'Rounded cards · coloured header', layout: 'cards', font: SANS, accent: '#4f46e5', text: '#1f2937', muted: '#6b7280' },
  { id: 'diagonal', name: 'Angle', tag: 'Angled header · photo', layout: 'diagonal', font: SANS, accent: '#0d9488', accent2: '#134e4a', text: '#1f2937', muted: '#6b7280', headingStyle: 'thick' },
  { id: 'daterail', name: 'Date Rail', tag: 'Dates on the left rail', layout: 'daterail', font: SANS, accent: '#be123c', text: '#1f2937', muted: '#6b7280', headingStyle: 'bar' },
  { id: 'editorial', name: 'Editorial', tag: 'Giant name · pull-quote', layout: 'editorial', font: SANS, accent: '#c2410c', text: '#111827', muted: '#6b7280', headingStyle: 'thick' },
  { id: 'numbered', name: 'Numbered', tag: 'Gradient header · 01 02 03', layout: 'numbered', font: SANS, accent: '#db2777', accent2: '#7c3aed', text: '#1f2937', muted: '#6b7280' },
  { id: 'tiles', name: 'Stat Tiles', tag: 'Key numbers · two columns', layout: 'tiles', font: SANS, accent: '#0369a1', text: '#1f2937', muted: '#6b7280', headingStyle: 'thick' },
  { id: 'monogram', name: 'Monogram', tag: 'Centered · elegant small caps', layout: 'monogram', font: SERIF, accent: '#854d0e', text: '#292524', muted: '#78716c', headingStyle: 'center' },
];

export const getResumeTemplate = (id) => RESUME_TEMPLATES.find((t) => t.id === id) || RESUME_TEMPLATES[0];
