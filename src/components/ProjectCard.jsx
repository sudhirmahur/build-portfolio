import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ExternalLink, ArrowUpRight } from "lucide-react";
import { staggerItem } from "../hooks/useScrollAnimation";
import GithubIcon from "./icons/GithubIcon";
import { optimizeImage, initials } from "../utils/image";

const hasLink = (url) => Boolean(url) && url !== "#";

export default function ProjectCard({ project }) {
  const [showFeatures, setShowFeatures] = useState(false);
  const isLive = hasLink(project.liveUrl);
  const hasGithub = hasLink(project.githubUrl);
  const features = project.features || [];

  return (
    <motion.article
      variants={staggerItem}
      whileHover={{ y: -6 }}
      transition={{ duration: 0.25, ease: "easeOut" }}
      className="group flex flex-col overflow-hidden rounded-lg border border-[var(--border)] bg-[var(--bg-elevated)]"
    >
      <div className="relative aspect-[16/10] overflow-hidden bg-[var(--bg-elevated-2)]">
        {project.image?.url ? (
          <img
            src={optimizeImage(project.image.url, 900)}
            alt={project.title}
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center font-display text-3xl text-[var(--text-muted)] transition-transform duration-500 group-hover:scale-110">
            {initials(project.title)}
          </div>
        )}
        <div className="pointer-events-none absolute inset-0 flex items-end bg-gradient-to-t from-black/60 via-black/0 to-transparent p-4 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
          <span className="text-sm text-white">{project.category}</span>
        </div>
        <span
          className={`absolute right-3 top-3 flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ${
            isLive
              ? "bg-[var(--accent-2)]/15 text-[var(--accent-2-strong)] backdrop-blur"
              : "bg-[var(--bg)]/70 text-[var(--text-muted)]"
          }`}
        >
          <span
            className={`h-1.5 w-1.5 rounded-full ${
              isLive ? "bg-[var(--accent-2)]" : "bg-[var(--text-muted)]"
            }`}
          />
          {isLive ? "Live Project" : "Not deployed"}
        </span>
      </div>

      <div className="flex flex-1 flex-col gap-3 p-5">
        <h3 className="font-display text-lg font-medium">{project.title}</h3>
        <p className="text-sm leading-relaxed text-[var(--text-muted)]">{project.description}</p>

        {project.tags?.length > 0 && (
          <div className="flex flex-wrap gap-2 pt-1">
            {project.tags.map((tag, index) => (
              <span
                key={`${tag}-${index}`}
                className="rounded-full border border-[var(--border)] px-2.5 py-1 text-xs font-mono text-[var(--text-muted)]"
              >
                {tag}
              </span>
            ))}
          </div>
        )}

        {features.length > 0 && (
          <div>
            <button
              type="button"
              onClick={() => setShowFeatures((v) => !v)}
              aria-expanded={showFeatures}
              className="text-xs font-medium text-[var(--accent)] hover:underline"
            >
              {showFeatures ? "Hide key features" : "Show key features"}
            </button>
            <AnimatePresence initial={false}>
              {showFeatures && (
                <motion.ul
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.25 }}
                  className="mt-2 space-y-1.5 overflow-hidden"
                >
                  {features.map((feature, index) => (
                    <li key={`${feature}-${index}`} className="flex gap-2 text-xs text-[var(--text-muted)]">
                      <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-[var(--accent-2)]" />
                      {feature}
                    </li>
                  ))}
                </motion.ul>
              )}
            </AnimatePresence>
          </div>
        )}

        <div className="mt-auto flex items-center gap-3 pt-4">
          {hasGithub && (
            <a
              href={project.githubUrl}
              target="_blank"
              rel="noreferrer"
              aria-label={`${project.title} on GitHub`}
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md border border-[var(--border)] text-[var(--text-muted)] transition-colors hover:border-[var(--accent)] hover:text-[var(--accent)]"
            >
              <GithubIcon size={16} />
            </a>
          )}
          {isLive ? (
            <a
              href={project.liveUrl}
              target="_blank"
              rel="noreferrer"
              className="flex flex-1 items-center justify-center gap-1.5 rounded-md bg-[var(--accent)] px-3 py-2 text-sm font-medium text-[var(--color-ink-950)] transition-colors hover:bg-[var(--accent-strong)]"
            >
              View project
              <ExternalLink size={14} aria-hidden="true" />
            </a>
          ) : (
            <span
              aria-disabled="true"
              className="flex flex-1 cursor-not-allowed items-center justify-center gap-1.5 rounded-md border border-dashed border-[var(--border)] px-3 py-2 text-sm text-[var(--text-muted)]"
            >
              Live demo coming soon
              <ArrowUpRight size={14} aria-hidden="true" />
            </span>
          )}
        </div>
      </div>
    </motion.article>
  );
}
