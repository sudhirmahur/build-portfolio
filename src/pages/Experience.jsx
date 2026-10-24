import PageShell from "../components/PageShell";
import SectionTitle from "../components/SectionTitle";
import ExperienceCard from "../components/ExperienceCard";
import DataState from "../components/DataState";
import { useSite } from "../context/SiteContext";
import { useFetch } from "../hooks/useFetch";

export default function Experience() {
  const { getPage, apiPath } = useSite();
  const page = getPage("experience") || {};
  const { data, loading, error, reload } = useFetch(apiPath("/experience"));
  const items = data || [];

  return (
    <PageShell width="max-w-4xl">
      <SectionTitle kicker={page.kicker} title={page.title} description={page.description} />

      <DataState loading={loading} error={error} onRetry={reload} empty={!items.length} emptyText="No experience added yet.">
        <div className="relative mt-14 flex flex-col gap-10">
          <div
            className="absolute bottom-2 left-3 top-2 w-px bg-[var(--border)] sm:left-4"
            aria-hidden="true"
          />
          {items.map((item, index) => (
            <ExperienceCard key={item._id} item={item} index={index} />
          ))}
        </div>
      </DataState>
    </PageShell>
  );
}
