import { useEffect, useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Download } from "lucide-react";
import ThemeToggle from "./ThemeToggle";
import Button from "./Button";
import { useSite } from "../context/SiteContext";

export default function Header() {
  const { profile, navPages, base, customTheme } = useSite();
  const { pathname } = useLocation();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const resumeUrl = profile?.resume?.url;

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // close the mobile menu whenever the route changes
  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  return (
    <header
      className={`fixed top-0 z-50 w-full transition-all duration-300 ${
        scrolled || menuOpen
          ? "border-b border-[var(--border)] bg-[var(--bg)]/90 backdrop-blur-lg"
          : "bg-transparent"
      }`}
    >
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-4 sm:px-6">
        <Link
          to={base}
          className="font-display text-base font-semibold tracking-tight sm:text-lg"
        >
          {profile?.name || "Portfolio"}
          <span className="text-[var(--accent)]">.</span>
        </Link>

        <nav className="hidden items-center gap-1 xl:flex" aria-label="Primary">
          {navPages.map((item) => (
            <NavLink
              key={item.slug}
              to={item.path}
              end={item.slug === "home"}
              className="relative px-3 py-2 text-sm text-[var(--text-muted)] transition-colors hover:text-[var(--text)]"
            >
              {({ isActive }) => (
                <>
                  {isActive && (
                    <motion.span
                      layoutId="nav-active"
                      className="absolute inset-x-2 -bottom-0.5 h-0.5 rounded-full bg-[var(--accent)]"
                      transition={{ type: "spring", stiffness: 380, damping: 30 }}
                    />
                  )}
                  <span className={isActive ? "text-[var(--text)]" : ""}>{item.label}</span>
                </>
              )}
            </NavLink>
          ))}
        </nav>

        <div className="hidden items-center gap-3 xl:flex">
          {!customTheme && <ThemeToggle />}
          {resumeUrl && (
            <Button as="a" href={resumeUrl} target="_blank" rel="noopener noreferrer" variant="secondary" icon={Download}>
              Resume
            </Button>
          )}
        </div>

        <div className="flex items-center gap-3 xl:hidden">
          {!customTheme && <ThemeToggle />}
          <button
            type="button"
            onClick={() => setMenuOpen((prev) => !prev)}
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            aria-expanded={menuOpen}
            className="flex h-9 w-9 items-center justify-center rounded-md border border-[var(--border)]"
          >
            {menuOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {menuOpen && (
          <motion.nav
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="max-h-[80vh] overflow-y-auto border-t border-[var(--border)] bg-[var(--bg)] xl:hidden"
            aria-label="Mobile"
          >
            <div className="flex flex-col gap-1 px-4 py-4 sm:px-6">
              {navPages.map((item) => (
                <NavLink
                  key={item.slug}
                  to={item.path}
                  end={item.slug === "home"}
                  className={({ isActive }) =>
                    `rounded-md px-3 py-2.5 text-left text-sm transition-colors ${
                      isActive
                        ? "bg-[var(--bg-elevated)] text-[var(--accent)]"
                        : "text-[var(--text-muted)]"
                    }`
                  }
                >
                  {item.label}
                </NavLink>
              ))}
              {resumeUrl && (
                <a
                  href={resumeUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-2 rounded-md border border-[var(--border)] px-3 py-2.5 text-center text-sm"
                >
                  Download resume
                </a>
              )}
            </div>
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  );
}
