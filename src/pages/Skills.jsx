import { motion } from "framer-motion";
import PageShell from "../components/PageShell";
import SectionTitle from "../components/SectionTitle";
import SkillCard from "../components/SkillCard";
import DataState from "../components/DataState";
import { useSite } from "../context/SiteContext";
import { useFetch } from "../hooks/useFetch";
import { staggerContainer } from "../hooks/useScrollAnimation";

export default function Skills() {
  const { getPage, apiPath } = useSite();
  const page = getPage("skills") || {};
  const { data, loading, error, reload } = useFetch(apiPath("/skills"));
  const categories = (data || []).filter((c) => c.skills?.length);

  return (
    <PageShell>
      <SectionTitle kicker={page.kicker} title={page.title} description={page.description} />

      <DataState loading={loading} error={error} onRetry={reload} empty={!categories.length} emptyText="No skills added yet.">
        <div className="mt-14 flex flex-col gap-14">
          {categories.map((category) => (
            <div key={category._id}>
              <h2 className="mb-4 font-display text-lg font-medium">{category.title}</h2>
              <motion.div
                {...staggerContainer()}
                className="grid grid-cols-1 gap-4 min-[420px]:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
              >
                {category.skills.map((skill) => (
                  <SkillCard key={skill._id || skill.name} skill={skill} />
                ))}
              </motion.div>
            </div>
          ))}
        </div>
      </DataState>
    </PageShell>
  );
}
