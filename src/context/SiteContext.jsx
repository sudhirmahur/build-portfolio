import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { api } from '../api/client';
import { applyTheme } from '../utils/theme';

const SiteContext = createContext(null);

/** Loads one portfolio (by URL slug) and exposes its profile, pages and theme. */
export function SiteProvider({ slug, children }) {
  const [state, setState] = useState({ profile: null, pages: [], theme: null, loading: true, error: null });
  const [tick, setTick] = useState(0);
  const base = `/p/${slug}`;

  useEffect(() => {
    const controller = new AbortController();
    setState((prev) => ({ ...prev, loading: true, error: null }));
    api
      .get(`/p/${encodeURIComponent(slug)}/site`, { signal: controller.signal })
      .then((res) =>
        setState({
          profile: res.data.profile || {},
          pages: (res.data.pages || []).map((page) => ({
            ...page,
            path: page.slug === 'home' ? base : `${base}/${page.slug}`,
          })),
          theme: res.data.theme || null,
          loading: false,
          error: null,
        })
      )
      .catch((err) => {
        if (err.name === 'AbortError') return;
        setState({ profile: null, pages: [], theme: null, loading: false, error: err });
      });
    return () => controller.abort();
  }, [slug, base, tick]);

  const { profile, theme } = state;

  // keep <title>, meta description and custom colours/fonts in sync with the admin settings
  useEffect(() => {
    if (!profile) return undefined;
    if (profile.siteTitle) document.title = profile.siteTitle;
    if (profile.siteDescription) {
      let meta = document.querySelector('meta[name="description"]');
      if (!meta) {
        meta = document.createElement('meta');
        meta.setAttribute('name', 'description');
        document.head.appendChild(meta);
      }
      meta.setAttribute('content', profile.siteDescription);
    }
    return undefined;
  }, [profile]);

  useEffect(() => applyTheme(theme), [theme]);

  const reload = useCallback(() => setTick((t) => t + 1), []);

  const value = useMemo(() => {
    const { pages } = state;
    return {
      ...state,
      slug,
      base,
      reload,
      /** URL inside this portfolio, e.g. link('/projects') -> /p/sudhir/projects */
      link: (path = '') => (path === '/' || path === '' ? base : `${base}${path}`),
      /** API path inside this portfolio, e.g. apiPath('/projects') -> /p/sudhir/projects */
      apiPath: (path) => `/p/${encodeURIComponent(slug)}${path}`,
      customTheme: Boolean(theme?.enabled),
      navPages: pages.filter((p) => p.showInNav),
      footerPages: pages.filter((p) => p.showInFooter && p.slug !== 'home'),
      getPage: (pageSlug) => pages.find((p) => p.slug === pageSlug) || null,
      isVisible: (pageSlug) => pages.some((p) => p.slug === pageSlug),
    };
  }, [state, reload, slug, base, theme]);

  return <SiteContext.Provider value={value}>{children}</SiteContext.Provider>;
}

export function useSite() {
  const ctx = useContext(SiteContext);
  if (!ctx) throw new Error('useSite must be used within a SiteProvider');
  return ctx;
}
