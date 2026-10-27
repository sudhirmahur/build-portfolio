import { motion } from "framer-motion";
import { fadeUp } from "../hooks/useScrollAnimation";

export default function SectionTitle({ kicker, title, description, align = "left" }) {
  const alignment = align === "center" ? "items-center text-center mx-auto" : "items-start text-left";
  if (!kicker && !title && !description) return null;

  return (
    <motion.div {...fadeUp} data-st="wrap" className={`flex max-w-2xl flex-col gap-3 ${alignment}`}>
      {kicker && (
        <div data-st="kicker" className="flex items-center gap-2 text-sm text-[var(--accent)]">
          <span className="h-px w-6 bg-[var(--accent)]" aria-hidden="true" />
          {kicker}
        </div>
      )}
      {title && (
        <h1 data-st="title" className="font-display text-balance text-2xl font-medium sm:text-3xl">{title}</h1>
      )}
      {description && (
        <p className="text-sm leading-relaxed text-[var(--text-muted)]">{description}</p>
      )}
    </motion.div>
  );
}
