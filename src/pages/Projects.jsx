import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import PageShell from "../components/PageShell";
import SectionTitle from "../components/SectionTitle";
import ProjectCard from "../components/ProjectCard";
import DataState from "../components/DataState";
import { useSite } from "../context/SiteContext";
import { useFetch } from "../hooks/useFetch";
import { staggerContainer } from "../hooks/useScrollAnimation";

export default function Projects() {
  const { getPage, apiPath } = useSite();
  const page = getPage("projects") || {};
  const { data, loading, error, reload } = useFetch(apiPath("/projects"));
  const [activeFilter, setActiveFilter] = useState("All");

  const projects = useMemo(() => data || [], [data]);
  const filters = useMemo(
    () => ["All", ...new Set(projects.map((p) => p.category).filter(Boolean))],
    [projects]
  );
  const current = filters.includes(activeFilter) ? activeFilter : "All";
  const filtered = useMemo(
    () => (current === "All" ? projects : projects.filter((p) => p.category === current)),
    [projects, current]
  );

  return (
    <PageShell>
      <SectionTitle kicker={page.kicker} title={page.title} description={page.description} />

      <DataState loading={loading} error={error} onRetry={reload} empty={!projects.length} emptyText="No projects added yet.">
        {filters.length > 2 && (
          <div className="mt-10 flex flex-wrap gap-2" role="group" aria-label="Filter projects">
            {filters.map((filter) => (
              <button
                key={filter}
                type="button"
                onClick={() => setActiveFilter(filter)}
                aria-pressed={current === filter}
                className={`rounded-full border px-4 py-1.5 text-sm transition-colors ${
                  current === filter
                    ? "border-[var(--accent)] bg-[var(--accent)]/10 text-[var(--accent)]"
                    : "border-[var(--border)] text-[var(--text-muted)] hover:text-[var(--text)]"
                }`}
              >
                {filter}
              </button>
            ))}
          </div>
        )}

        <motion.div
          key={current}
          {...staggerContainer(0.08)}
          className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3"
        >
          <AnimatePresence mode="popLayout">
            {filtered.map((project) => (
              <ProjectCard key={project._id} project={project} />
            ))}
          </AnimatePresence>
        </motion.div>
      </DataState>
    </PageShell>
  );
}
