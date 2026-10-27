// 10 portfolio templates. `palette` = the template's own colours + fonts (null = the normal light/dark theme).
// If the user turns on "custom colours" in Design, their colours override the palette.
export const PORTFOLIO_TEMPLATES = [
  { id: 'classic', name: 'Classic', description: 'Default. Dark/light theme, photo + terminal card.', palette: null, thumb: 'split', header: 'classic' },
  {
    id: 'brooklyn', name: 'Brooklyn', description: 'White with purple, soft pink-mint glow, photo card, filled menu buttons.', thumb: 'split', header: 'brooklyn',
    palette: { accent: '#9b2cf0', bg: '#ffffff', text: '#161616', headingFont: 'Work Sans', bodyFont: 'Work Sans' },
  },
  {
    id: 'brandon', name: 'Amber Profile', description: 'Amber banner, arch photo, pill headings — infographic profile.', thumb: 'banner', header: 'plain',
    palette: { accent: '#f5b800', bg: '#ffffff', text: '#2b2b2b', headingFont: 'Montserrat', bodyFont: 'Montserrat' },
  },
  {
    id: 'howard', name: 'Blue Sidebar', description: 'Blue strip with arch photo card on the left, grey section bands.', thumb: 'rail', header: 'plain', rail: 'howard',
    palette: { accent: '#0b5fc4', bg: '#ffffff', text: '#1f2937', headingFont: 'Montserrat', bodyFont: 'Montserrat' },
  },
  {
    id: 'tejas', name: 'Black & Gold', description: 'Black page, gold button, big bold heading with serif italic word.', thumb: 'split', header: 'tejas',
    palette: { accent: '#e0b865', bg: '#0d0d0d', text: '#ffffff', headingFont: 'Manrope', bodyFont: 'Manrope' },
  },
  {
    id: 'alejandro', name: 'Midnight Green', description: 'Tilted black & white photo, huge bottom heading, green highlight.', thumb: 'split', header: 'alejandro',
    palette: { accent: '#3ddc84', bg: '#0a0a0f', text: '#f4f4f5', headingFont: 'Roboto', bodyFont: 'Roboto' },
  },
  {
    id: 'roton', name: 'Neon Developer', description: 'Black network background, neon green, “I Am …” with typing cursor.', thumb: 'split', header: 'roton',
    palette: { accent: '#00e676', bg: '#060606', text: '#ffffff', headingFont: 'Poppins', bodyFont: 'Poppins' },
  },
  {
    id: 'john', name: 'Profile Card', description: 'Sticky profile card on the left, content in rounded dark cards.', thumb: 'rail', header: 'plain', rail: 'john',
    palette: { accent: '#5ee38a', bg: '#0c0c0c', text: '#f4f4f5', headingFont: 'Space Grotesk', bodyFont: 'Space Grotesk' },
  },
  {
    id: 'agency', name: 'Cyan Studio', description: 'Deep teal glow, centered headline, cyan buttons and glass cards.', thumb: 'center', header: 'agency',
    palette: { accent: '#2fd4e0', bg: '#06141a', text: '#ffffff', headingFont: 'Plus Jakarta Sans', bodyFont: 'Plus Jakarta Sans' },
  },
  {
    id: 'crimson', name: 'Crimson Dark', description: 'Black with red glow, bold uppercase heading and floating stat cards.', thumb: 'split', header: 'crimson',
    palette: { accent: '#e63a22', bg: '#0a0a0a', text: '#ffffff', headingFont: 'Poppins', bodyFont: 'Poppins' },
  },
];

export const isTemplateId = (id) => PORTFOLIO_TEMPLATES.some((t) => t.id === id);
export const getPortfolioTemplate = (id) => PORTFOLIO_TEMPLATES.find((t) => t.id === id) || PORTFOLIO_TEMPLATES[0];
