import { useEffect } from "react";
import { Outlet, useLocation, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import Header from "../components/Header";
import Footer from "../components/Footer";
import ScrollProgress from "../components/ScrollProgress";
import BackToTop from "../components/BackToTop";
import Loader from "../components/Loader";
import { AlertTriangleIcon } from "../components/icons/StatusIcons";
import NotFound from "../pages/NotFound";
import TemplateHeader from "../templates/TemplateHeader";
import { HowardRail, JohnRail } from "../templates/Rails";
import { getPortfolioTemplate } from "../templates/portfolioTemplates";
import { themeVars } from "../utils/theme";
import { fontStack, loadFont } from "../utils/fonts";
import { SiteProvider, useSite } from "../context/SiteContext";

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

function SiteShell() {
  const { loading, error, profile, reload, template, theme } = useSite();
  const tpl = getPortfolioTemplate(template);
  // the user's own colours (Design page) win over the template palette
  const palette = theme?.enabled ? null : tpl.palette;

  useEffect(() => {
    if (!palette) return undefined;
    loadFont(palette.headingFont);
    loadFont(palette.bodyFont);
    const previous = document.body.style.backgroundColor;
    document.body.style.backgroundColor = palette.bg;
    return () => {
      document.body.style.backgroundColor = previous;
    };
  }, [palette]);
  const { pathname } = useLocation();

  if (error?.status === 404) return <NotFound home="/" title="Portfolio not found" text="This portfolio does not exist, or its owner has not published it." />;

  if (error || (!loading && !profile)) {
    return (
      <div className="flex min-h-screen items-center justify-center px-6">
        <div className="flex max-w-md flex-col items-center gap-4 rounded-lg border border-[var(--border)] bg-[var(--bg-elevated)] p-8 text-center">
          <AlertTriangleIcon size={30} className="text-red-400" />
          <h1 className="font-display text-xl font-medium">Unable to load the site</h1>
          <p className="text-sm text-[var(--text-muted)]">
            {error?.message || "Something went wrong while loading the portfolio."}
          </p>
          <button
            type="button"
            onClick={reload}
            className="rounded-md bg-[var(--accent)] px-5 py-2.5 text-sm font-medium text-[var(--color-ink-950)] transition-colors hover:bg-[var(--accent-strong)]"
          >
            Try again
          </button>
        </div>
      </div>
    );
  }

  const wrapStyle = palette
    ? {
        ...themeVars(palette),
        '--accent-2': palette.accent,
        '--accent-2-strong': palette.accent,
        backgroundColor: palette.bg,
        color: palette.text,
        fontFamily: fontStack(palette.bodyFont),
      }
    : undefined;

  const content = (
    <>
      <motion.main
        key={pathname}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.35, ease: "easeOut" }}
      >
        <Outlet />
      </motion.main>
      <Footer />
    </>
  );

  let body;
  if (tpl.rail === "howard") {
    body = (
      <>
        <HowardRail />
        <div className="lg:hidden"><TemplateHeader variant="plain" /></div>
        <div className="lg:pl-72">{content}</div>
      </>
    );
  } else if (tpl.rail === "john") {
    body = (
      <>
        <div className="lg:hidden"><TemplateHeader variant="plain" /></div>
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:grid lg:grid-cols-[20rem_minmax(0,1fr)] lg:gap-8 lg:py-8">
          <JohnRail />
          <div className="min-w-0">{content}</div>
        </div>
      </>
    );
  } else {
    body = (
      <>
        {tpl.header === "classic" ? <Header /> : <TemplateHeader variant={tpl.header} />}
        {content}
      </>
    );
  }

  return (
    <>
      <Loader loading={loading} />
      {!loading && (
        <div className="min-h-screen" data-tpl={tpl.id} style={wrapStyle}>
          <ScrollToTop />
          <ScrollProgress />
          {body}
          <BackToTop />
        </div>
      )}
    </>
  );
}

/** Portfolio layout (/p/:slug): header + page + footer are identical on every page. */
export default function MainLayout() {
  const { slug } = useParams();
  return (
    <SiteProvider slug={slug}>
      <SiteShell />
    </SiteProvider>
  );
}
