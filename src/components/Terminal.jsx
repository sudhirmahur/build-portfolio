import { useEffect, useState } from "react";
import { motion } from "framer-motion";

export default function Terminal({ lines = [], user = "portfolio" }) {
  const [visibleLines, setVisibleLines] = useState(0);

  useEffect(() => {
    if (visibleLines >= lines.length) return undefined;
    const timer = setTimeout(() => setVisibleLines((v) => v + 1), 650);
    return () => clearTimeout(timer);
  }, [visibleLines, lines.length]);

  if (!lines.length) return null;

  return (
    <div className="w-full max-w-md rounded-lg border border-[var(--border)] bg-[var(--bg-elevated)] shadow-2xl shadow-black/20">
      <div className="flex items-center gap-1.5 border-b border-[var(--border)] px-4 py-3">
        <span className="h-2.5 w-2.5 rounded-full bg-[#ff5f56]" />
        <span className="h-2.5 w-2.5 rounded-full bg-[#ffbd2e]" />
        <span className="h-2.5 w-2.5 rounded-full bg-[#27c93f]" />
        <span className="ml-2 font-mono text-[11px] text-[var(--text-muted)]">{user}@portfolio</span>
      </div>
      <div className="space-y-3 px-4 py-4 font-mono text-xs sm:text-sm">
        {lines.slice(0, visibleLines).map((line, index) => (
          <motion.div
            key={`${line.prompt}-${index}`}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <p className="text-[var(--accent-2-strong)]">{line.prompt}</p>
            <p className="break-words text-[var(--text)]">{line.output}</p>
          </motion.div>
        ))}
        {visibleLines >= lines.length && (
          <motion.span
            className="inline-block h-4 w-2 bg-[var(--accent)]"
            animate={{ opacity: [1, 0] }}
            transition={{ duration: 0.8, repeat: Infinity, repeatType: "reverse" }}
          />
        )}
      </div>
    </div>
  );
}
