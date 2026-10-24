import { motion } from "framer-motion";
import { GraduationCap, Award, CalendarClock } from "lucide-react";
import PageShell from "../components/PageShell";
import SectionTitle from "../components/SectionTitle";
import DataState from "../components/DataState";
import { useSite } from "../context/SiteContext";
import { useFetch } from "../hooks/useFetch";
import { fadeUp } from "../hooks/useScrollAnimation";

export default function Education() {
  const { getPage, apiPath } = useSite();
  const page = getPage("education") || {};
  const { data, loading, error, reload } = useFetch(apiPath("/education"));
  const education = data?.education || [];
  const certifications = data?.certifications || [];

  return (
    <PageShell width="max-w-4xl">
      <SectionTitle kicker={page.kicker} title={page.title} description={page.description} />

      <DataState
        loading={loading}
        error={error}
        onRetry={reload}
        empty={!education.length && !certifications.length}
        emptyText="No education added yet."
      >
        <div className="mt-14 flex flex-col gap-6">
          {education.map((edu) => (
            <motion.div
              key={edu._id}
              {...fadeUp}
              className="rounded-lg border border-[var(--border)] bg-[var(--bg-elevated)] p-4 sm:p-6"
            >
              <div className="flex items-start gap-4">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-md bg-[var(--bg-elevated-2)] text-[var(--accent)]">
                  <GraduationCap size={20} aria-hidden="true" />
                </div>
                <div className="min-w-0 flex-1">
                  <h2 className="font-display text-lg font-medium">{edu.degree}</h2>
                  <p className="text-[var(--text-muted)]">{edu.institute}</p>

                  <div className="mt-3 flex flex-wrap gap-4 text-sm text-[var(--text-muted)]">
                    {edu.duration && (
                      <span className="flex items-center gap-1.5">
                        <CalendarClock size={14} aria-hidden="true" />
                        {edu.duration}
                      </span>
                    )}
                    {edu.cgpa && (
                      <span className="flex items-center gap-1.5">
                        <Award size={14} aria-hidden="true" />
                        CGPA: {edu.cgpa}
                      </span>
                    )}
                  </div>

                  {edu.subjects?.length > 0 && (
                    <div className="mt-4 flex flex-wrap gap-2">
                      {edu.subjects.map((subject, index) => (
                        <span
                          key={`${subject}-${index}`}
                          className="rounded-full border border-[var(--border)] px-3 py-1 text-xs text-[var(--text-muted)]"
                        >
                          {subject}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          ))}

          {certifications.length > 0 && (
            <motion.div {...fadeUp} className="mt-4">
              <h2 className="mb-4 font-display text-lg font-medium">Certifications</h2>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                {certifications.map((cert) => {
                  const Wrapper = cert.credentialUrl ? "a" : "div";
                  const extra = cert.credentialUrl
                    ? { href: cert.credentialUrl, target: "_blank", rel: "noopener noreferrer" }
                    : {};
                  return (
                    <Wrapper
                      key={cert._id}
                      {...extra}
                      className="flex items-center gap-3 rounded-lg border border-[var(--border)] bg-[var(--bg-elevated)] p-4 transition-colors hover:border-[var(--accent)]/50"
                    >
                      <Award size={18} className="shrink-0 text-[var(--accent)]" aria-hidden="true" />
                      <div className="min-w-0">
                        <p className="text-sm font-medium">{cert.title}</p>
                        <p className="text-xs text-[var(--text-muted)]">
                          {[cert.issuer, cert.year].filter(Boolean).join(", ")}
                        </p>
                      </div>
                    </Wrapper>
                  );
                })}
              </div>
            </motion.div>
          )}
        </div>
      </DataState>
    </PageShell>
  );
}
