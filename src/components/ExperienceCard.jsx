import { motion } from "framer-motion";
import { MapPin, Calendar } from "lucide-react";
import { slideInLeft, slideInRight } from "../hooks/useScrollAnimation";

export default function ExperienceCard({ item, index }) {
  const variant = index % 2 === 0 ? slideInLeft : slideInRight;

  return (
    <motion.div {...variant} className="relative pl-10 sm:pl-14">
      <span className="absolute left-0 top-1.5 flex h-6 w-6 items-center justify-center rounded-full border-2 border-[var(--accent)] bg-[var(--bg)] sm:left-1">
        <span className="h-2 w-2 rounded-full bg-[var(--accent)]" />
      </span>

      <div className="rounded-lg border border-[var(--border)] bg-[var(--bg-elevated)] p-4 sm:p-6">
        <div className="flex flex-wrap items-start justify-between gap-2">
          <div>
            <h3 className="font-display text-lg font-medium">{item.position}</h3>
            <p className="text-[var(--accent)]">{item.company}</p>
          </div>
          <div className="flex flex-col items-start gap-1 text-sm text-[var(--text-muted)] sm:items-end">
            <span className="flex items-center gap-1.5">
              <Calendar size={14} aria-hidden="true" />
              {item.duration}
            </span>
            <span className="flex items-center gap-1.5">
              <MapPin size={14} aria-hidden="true" />
              {item.location}
            </span>
          </div>
        </div>

        <p className="mt-4 text-sm leading-relaxed text-[var(--text-muted)]">
          {item.description}
        </p>

        <ul className="mt-4 space-y-2">
          {(item.responsibilities || []).map((r, i) => (
            <li key={`${r}-${i}`} className="flex gap-2 text-sm text-[var(--text-muted)]">
              <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-[var(--accent-2)]" />
              {r}
            </li>
          ))}
        </ul>

        <div className="mt-5 flex flex-wrap gap-2">
          {(item.technologies || []).map((tech, i) => (
            <span
              key={`${tech}-${i}`}
              className="rounded-full border border-[var(--border)] px-3 py-1 text-xs font-mono text-[var(--text-muted)]"
            >
              {tech}
            </span>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
