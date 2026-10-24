export const FONTS = [
  'Inter', 'Poppins', 'Roboto', 'Montserrat', 'Lato', 'Open Sans', 'Nunito', 'Raleway',
  'DM Sans', 'Space Grotesk', 'Fraunces', 'Playfair Display', 'Lora', 'Merriweather', 'JetBrains Mono',
];

const SERIF = ['Fraunces', 'Playfair Display', 'Lora', 'Merriweather'];
export const fontStack = (name) =>
  `"${name}", ${SERIF.includes(name) ? 'ui-serif, Georgia, serif' : name === 'JetBrains Mono' ? 'ui-monospace, monospace' : 'ui-sans-serif, system-ui, sans-serif'}`;

/** Adds the Google Fonts stylesheet for a font once. */
export function loadFont(name) {
  if (!name || typeof document === 'undefined') return;
  const id = `gf-${name.replace(/\s+/g, '-').toLowerCase()}`;
  if (document.getElementById(id)) return;
  const link = document.createElement('link');
  link.id = id;
  link.rel = 'stylesheet';
  link.href = `https://fonts.googleapis.com/css2?family=${name.replace(/\s+/g, '+')}:wght@400;500;600;700&display=swap`;
  document.head.appendChild(link);
}
