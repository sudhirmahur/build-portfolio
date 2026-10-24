import { Sun, Moon } from "lucide-react";
import { motion } from "framer-motion";
import { useThemeContext } from "../context/ThemeContext";

export default function ThemeToggle() {
  const { isDark, toggleTheme } = useThemeContext();

  return (
    <button
      onClick={toggleTheme}
      role="switch"
      aria-checked={isDark}
      aria-label={`Switch to ${isDark ? "light" : "dark"} mode`}
      className="relative flex h-8 w-14 items-center rounded-full border border-[var(--border)] bg-[var(--bg-elevated)] px-1 transition-colors"
    >
      <motion.span
        className="flex h-6 w-6 items-center justify-center rounded-full bg-[var(--accent)] text-[var(--color-ink-950)]"
        animate={{ x: isDark ? 0 : 22 }}
        transition={{ type: "spring", stiffness: 500, damping: 32 }}
      >
        {isDark ? <Moon size={13} aria-hidden="true" /> : <Sun size={13} aria-hidden="true" />}
      </motion.span>
    </button>
  );
}
