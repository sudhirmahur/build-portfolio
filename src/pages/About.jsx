import { motion } from "framer-motion";
import { Download } from "lucide-react";
import PageShell from "../components/PageShell";
import SectionTitle from "../components/SectionTitle";
import StatCounter from "../components/StatCounter";
import { useSite } from "../context/SiteContext";
import { fadeUp, slideInRight } from "../hooks/useScrollAnimation";
import { getIcon } from "../utils/icons";
import { optimizeImage, initials } from "../utils/image";

export default function About() {
  const { profile, getPage } = useSite();
  const page = getPage("about") || {};
  const facts = profile.aboutFacts || [];
  const stats = profile.aboutStats || [];
  const paragraphs = profile.aboutParagraphs || [];

  return (
    <PageShell>
      <SectionTitle kicker={page.kicker} title={page.title} description={page.description} />

      <div className="mt-12 grid grid-cols-1 gap-10 lg:grid-cols-[1fr_1.1fr]">
        <motion.div {...slideInRight} className="order-2 lg:order-1">
          <div className="rounded-xl border border-[var(--border)] bg-[var(--bg-elevated)] p-5 sm:p-6">
            <div className="flex items-center gap-4">
              {profile.avatar?.url ? (
                <img
                  src={optimizeImage(profile.avatar.url, 200)}
                  alt={profile.name}
                  className="h-14 w-14 rounded-full object-cover"
                />
              ) : (
                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[var(--bg-elevated-2)] font-display text-xl text-[var(--accent)]">
                  {initials(profile.name)}
                </div>
              )}
              <div>
                <h2 className="font-display text-base font-medium">{profile.name}</h2>
                <p className="text-sm text-[var(--text-muted)]">{profile.role}</p>
              </div>
            </div>

            {facts.length > 0 && (
              <ul className="mt-6 space-y-4 text-sm">
                {facts.map((fact, index) => {
                  const Icon = getIcon(fact.icon, "briefcase");
                  return (
                    <li key={`${fact.text}-${index}`} className="flex items-center gap-3 text-[var(--text-muted)]">
                      <Icon size={16} className="shrink-0 text-[var(--accent)]" aria-hidden="true" />
                      {fact.text}
                    </li>
                  );
                })}
              </ul>
            )}

            {profile.availability && (
              <div className="mt-6 flex items-center gap-2 rounded-md border border-[var(--accent-2)]/30 bg-[var(--accent-2)]/10 px-3 py-2 text-sm text-[var(--accent-2-strong)]">
                <span className="h-2 w-2 rounded-full bg-[var(--accent-2)]" />
                {profile.availability}
              </div>
            )}

            {profile.resume?.url && (
              <a
                href={profile.resume.url}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-md border border-[var(--accent)] bg-[var(--accent)] px-4 py-3 text-sm font-medium text-[var(--color-ink-950)] transition-all duration-200 hover:-translate-y-0.5 hover:opacity-90"
              >
                <Download size={17} aria-hidden="true" />
                Download Resume
              </a>
            )}
          </div>
        </motion.div>

        <motion.div {...fadeUp} className="order-1 flex flex-col gap-6 lg:order-2">
          {paragraphs.map((text, index) => (
            <p key={index} className="text-sm leading-relaxed text-[var(--text-muted)]">
              {text}
            </p>
          ))}

          {stats.length > 0 && (
            <div className="mt-4 grid grid-cols-2 gap-6 border-t border-[var(--border)] pt-6 sm:grid-cols-4">
              {stats.map((stat, index) => (
                <StatCounter
                  key={`${stat.label}-${index}`}
                  target={Number(stat.target) || 0}
                  suffix={stat.suffix || ""}
                  label={stat.label}
                />
              ))}
            </div>
          )}
        </motion.div>
      </div>
    </PageShell>
  );
}
