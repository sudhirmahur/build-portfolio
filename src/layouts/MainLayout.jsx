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
import { SiteProvider, useSite } from "../context/SiteContext";

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

function SiteShell() {
  const { loading, error, profile, reload } = useSite();
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

  return (
    <>
      <Loader loading={loading} />
      {!loading && (
        <div className="min-h-screen">
          <ScrollToTop />
          <ScrollProgress />
          <Header />
          <motion.main
            key={pathname}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.35, ease: "easeOut" }}
          >
            <Outlet />
          </motion.main>
          <Footer />
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
