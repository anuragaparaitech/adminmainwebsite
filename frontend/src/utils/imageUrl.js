const MAIN_SITE_ORIGIN = process.env.REACT_APP_MAIN_SITE_URL || 'https://anuragaparaitech-mainwebsite.vercel.app';

export function resolveImageUrl(src) {
  if (!src) return '';
  if (src.startsWith('data:') || src.startsWith('http://') || src.startsWith('https://')) {
    return src;
  }
  if (src.startsWith('/')) {
    return `${MAIN_SITE_ORIGIN.replace(/\/$/, '')}${src}`;
  }
  return src;
}
