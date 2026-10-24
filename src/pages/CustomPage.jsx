import { useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { ExternalLink } from "lucide-react";
import PageShell from "../components/PageShell";
import SectionTitle from "../components/SectionTitle";
import DataState from "../components/DataState";
import NotFound from "./NotFound";
import { useFetch } from "../hooks/useFetch";
import { useSite } from "../context/SiteContext";
import { fadeUp, staggerContainer, staggerItem } from "../hooks/useScrollAnimation";
import { optimizeImage } from "../utils/image";

function Tags({ tags }) {
  if (!tags?.length) return null;
  return (
    <div className="flex flex-wrap gap-2">
      {tags.map((tag, index) => (
        <span
          key={`${tag}-${index}`}
          className="rounded-full border border-[var(--border)] px-2.5 py-1 font-mono text-xs text-[var(--text-muted)]"
        >
          {tag}
        </span>
      ))}
    </div>
  );
}

function ItemLink({ item }) {
  if (!item.link) return null;
  const external = /^https?:\/\//i.test(item.link);
  return (
    <a
      href={item.link}
      target={external ? "_blank" : undefined}
      rel={external ? "noopener noreferrer" : undefined}
      className="inline-flex items-center gap-1.5 text-sm font-medium text-[var(--accent)] hover:underline"
    >
      {item.linkLabel || "Open"}
      <ExternalLink size={14} aria-hidden="true" />
    </a>
  );
}

function Cards({ items }) {
  return (
    <motion.div
      {...staggerContainer(0.08)}
      className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3"
    >
      {items.map((item) => (
        <motion.article
          key={item._id}
          variants={staggerItem}
          className="flex flex-col overflow-hidden rounded-lg border border-[var(--border)] bg-[var(--bg-elevated)]"
        >
          {item.image?.url && (
            <img
              src={optimizeImage(item.image.url, 800)}
              alt={item.title || ""}
              loading="lazy"
              className="aspect-[16/10] w-full object-cover"
            />
          )}
          <div className="flex flex-1 flex-col gap-3 p-5">
            {item.title && <h2 className="font-display text-lg font-medium">{item.title}</h2>}
            {item.subtitle && <p className="text-sm text-[var(--accent)]">{item.subtitle}</p>}
            {item.description && (
              <p className="whitespace-pre-line text-sm leading-relaxed text-[var(--text-muted)]">
                {item.description}
              </p>
            )}
            <Tags tags={item.tags} />
            <div className="mt-auto pt-2">
              <ItemLink item={item} />
            </div>
          </div>
        </motion.article>
      ))}
    </motion.div>
  );
}

function Gallery({ items }) {
  return (
    <motion.div
      {...staggerContainer(0.06)}
      className="mt-10 grid grid-cols-1 gap-4 min-[480px]:grid-cols-2 lg:grid-cols-3"
    >
      {items.map((item) => {
        const figure = (
          <figure className="group overflow-hidden rounded-lg border border-[var(--border)] bg-[var(--bg-elevated)]">
            {item.image?.url && (
              <img
                src={optimizeImage(item.image.url, 800)}
                alt={item.title || ""}
                loading="lazy"
                className="aspect-[4/3] w-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
            )}
            {(item.title || item.description) && (
              <figcaption className="p-3">
                {item.title && <p className="text-sm font-medium">{item.title}</p>}
                {item.description && (
                  <p className="mt-1 text-xs text-[var(--text-muted)]">{item.description}</p>
                )}
              </figcaption>
            )}
          </figure>
        );
        return (
          <motion.div key={item._id} variants={staggerItem}>
            {item.link ? (
              <a href={item.link} target="_blank" rel="noopener noreferrer" className="block">
                {figure}
              </a>
            ) : (
              figure
            )}
          </motion.div>
        );
      })}
    </motion.div>
  );
}

function List({ items }) {
  return (
    <div className="relative mt-10 flex flex-col gap-6">
      {items.map((item) => (
        <motion.div
          key={item._id}
          {...fadeUp}
          className="flex flex-col gap-4 rounded-lg border border-[var(--border)] bg-[var(--bg-elevated)] p-4 sm:flex-row sm:p-6"
        >
          {item.image?.url && (
            <img
              src={optimizeImage(item.image.url, 400)}
              alt={item.title || ""}
              loading="lazy"
              className="h-40 w-full rounded-md object-cover sm:h-28 sm:w-40 sm:shrink-0"
            />
          )}
          <div className="flex min-w-0 flex-1 flex-col gap-2">
            {item.title && <h2 className="font-display text-lg font-medium">{item.title}</h2>}
            {item.subtitle && <p className="text-sm text-[var(--accent)]">{item.subtitle}</p>}
            {item.description && (
              <p className="whitespace-pre-line text-sm leading-relaxed text-[var(--text-muted)]">
                {item.description}
              </p>
            )}
            <Tags tags={item.tags} />
            <ItemLink item={item} />
          </div>
        </motion.div>
      ))}
    </div>
  );
}

export default function CustomPage({ slug }) {
  const params = useParams();
  const pageSlug = slug || params.pageSlug;
  const { apiPath, base } = useSite();
  const { data: page, loading, error, reload } = useFetch(apiPath(`/pages/${encodeURIComponent(pageSlug)}`));

  if (error?.status === 404) return <NotFound home={base} />;

  const items = page?.items || [];
  const paragraphs = (page?.body || "").split(/\n\s*\n/).map((p) => p.trim()).filter(Boolean);

  return (
    <PageShell>
      <DataState loading={loading} error={error} onRetry={reload}>
        {page && (
          <>
            <SectionTitle
              kicker={page.kicker}
              title={page.title || page.label}
              description={page.description}
            />

            {paragraphs.length > 0 && (
              <motion.div {...fadeUp} className="mt-10 flex max-w-3xl flex-col gap-5">
                {paragraphs.map((text, index) => (
                  <p key={index} className="whitespace-pre-line text-sm leading-relaxed text-[var(--text-muted)] sm:text-base">
                    {text}
                  </p>
                ))}
              </motion.div>
            )}

            {items.length > 0 && page.layout === "gallery" && <Gallery items={items} />}
            {items.length > 0 && page.layout === "list" && <List items={items} />}
            {items.length > 0 && (page.layout === "cards" || !page.layout) && <Cards items={items} />}
          </>
        )}
      </DataState>
    </PageShell>
  );
}
