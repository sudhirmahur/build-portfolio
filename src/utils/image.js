/** Insert Cloudinary auto-format / auto-quality / width transformation into a delivery URL. */
export function optimizeImage(url, width = 800) {
  if (!url || typeof url !== 'string') return url || '';
  if (!url.includes('res.cloudinary.com') || !url.includes('/upload/')) return url;
  if (/\.svg($|\?)/i.test(url)) return url;
  if (/\/upload\/[a-z]_[^/]*\//.test(url)) return url; // already transformed
  return url.replace('/upload/', `/upload/f_auto,q_auto,w_${width}/`);
}

export const pagePath = (page) => (page?.slug === 'home' ? '/' : `/${page?.slug ?? ''}`);

export const initials = (text = '') =>
  text
    .split(/\s+/)
    .filter(Boolean)
    .map((word) => word[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();
