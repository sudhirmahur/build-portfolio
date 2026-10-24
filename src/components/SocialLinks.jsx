import { motion } from "framer-motion";
import { useSite } from "../context/SiteContext";
import { getIcon } from "../utils/icons";

export default function SocialLinks({ className = "", size = 18 }) {
  const { profile } = useSite();

  const links = [...(profile?.socials || [])].filter((link) => link.url);
  if (profile?.resume?.url) {
    links.push({ label: "View Resume", url: profile.resume.url, icon: "file-text" });
  }
  if (!links.length) return null;

  return (
    <ul className={`flex flex-wrap items-center gap-2 ${className}`}>
      {links.map(({ label, url, icon }, index) => {
        const Icon = getIcon(icon, "link");
        const external = /^https?:\/\//i.test(url) || url.startsWith("/");
        return (
          <li key={`${label}-${index}`}>
            <motion.a
              href={url}
              target={external ? "_blank" : undefined}
              rel={external ? "noopener noreferrer" : undefined}
              aria-label={label}
              title={label}
              whileHover={{ y: -3 }}
              whileTap={{ scale: 0.92 }}
              transition={{ duration: 0.18, ease: "easeOut" }}
              className="flex h-9 w-9 items-center justify-center rounded-md border border-[var(--border)] text-[var(--text-muted)] transition-colors hover:border-[var(--accent)] hover:text-[var(--accent)]"
            >
              <Icon size={size} aria-hidden="true" />
            </motion.a>
          </li>
        );
      })}
    </ul>
  );
}
