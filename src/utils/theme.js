import { fontStack, loadFont } from './fonts';

const VARS = [
  '--bg', '--bg-elevated', '--bg-elevated-2', '--border', '--text', '--text-muted',
  '--accent', '--accent-strong', '--color-ink-950', '--font-sans', '--font-display', 'color-scheme',
];

function luminance(hex) {
  const n = parseInt(hex.slice(1), 16);
  const [r, g, b] = [(n >> 16) & 255, (n >> 8) & 255, n & 255].map((v) => {
    const c = v / 255;
    return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

/** CSS variables for a custom portfolio theme { accent, bg, text, headingFont, bodyFont }. */
export function themeVars(theme) {
  const { accent, bg, text, headingFont, bodyFont } = theme;
  return {
    '--bg': bg,
    '--text': text,
    '--accent': accent,
    '--accent-strong': `color-mix(in srgb, ${accent} 80%, white)`,
    '--bg-elevated': `color-mix(in srgb, ${bg} 93%, ${text} 7%)`,
    '--bg-elevated-2': `color-mix(in srgb, ${bg} 86%, ${text} 14%)`,
    '--border': `color-mix(in srgb, ${bg} 80%, ${text} 20%)`,
    '--text-muted': `color-mix(in srgb, ${text} 62%, ${bg} 38%)`,
    // text that sits on top of the accent colour (buttons)
    '--color-ink-950': luminance(accent) > 0.4 ? '#0b1120' : '#ffffff',
    '--font-sans': fontStack(bodyFont),
    '--font-display': fontStack(headingFont),
    'color-scheme': luminance(bg) > 0.4 ? 'light' : 'dark',
  };
}

/** Applies a custom theme to <html>; returns a function that removes it again. */
export function applyTheme(theme) {
  const root = document.documentElement;
  if (!theme?.enabled) return () => {};
  loadFont(theme.headingFont);
  loadFont(theme.bodyFont);
  Object.entries(themeVars(theme)).forEach(([key, value]) => root.style.setProperty(key, value));
  return () => VARS.forEach((key) => root.style.removeProperty(key));
}
