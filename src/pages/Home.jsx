import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, Mail, Download } from "lucide-react";
import Button from "../components/Button";
import SocialLinks from "../components/SocialLinks";
import Terminal from "../components/Terminal";
import { useSite } from "../context/SiteContext";
import { optimizeImage, initials } from "../utils/image";
import { EmbeddedProvider } from "../context/EmbeddedContext";
import About from "./About";
import Experience from "./Experience";
import Skills from "./Skills";
import Projects from "./Projects";
import Education from "./Education";
import Contact from "./Contact";
import CustomPage from "./CustomPage";
import * as H from "../templates/Heroes";

function Hero() {
  const { profile, isVisible, link } = useSite();
  const resumeUrl = profile.resume?.url;
  const terminalLines = (profile.terminalLines || []).filter((l) => l.prompt || l.output);

  return (
    <section className="relative flex min-h-screen items-center overflow-hidden pt-24">
      <div className="bg-dot-grid pointer-events-none absolute inset-0 opacity-[0.35] [mask-image:radial-gradient(ellipse_60%_60%_at_50%_0%,black,transparent)]" />
      <div className="pointer-events-none absolute -top-40 right-[-10%] h-96 w-96 rounded-full bg-[var(--accent)]/10 blur-3xl" />

      <div className="relative mx-auto grid w-full max-w-6xl grid-cols-1 items-center gap-12 px-4 py-16 sm:px-6 sm:py-20 lg:grid-cols-[1.1fr_0.9fr] lg:gap-16">
        <div>
          {profile.availability && (
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              className="mb-5 inline-flex items-center gap-2 rounded-full border border-[var(--border)] bg-[var(--bg-elevated)] px-3 py-1.5 text-xs text-[var(--text-muted)]"
            >
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[var(--accent-2)] opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-[var(--accent-2)]" />
              </span>
              {profile.availability}
            </motion.div>
          )}

          <motion.h1
            initial={{ opacity: 0, x: -40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            className="font-display text-balance text-3xl font-medium leading-[1.15] sm:text-5xl"
          >
            {profile.heroLine1}
            <br />
            <span className="text-[var(--accent)]">{profile.heroHighlight}</span>
            <br />
            {profile.heroLine3}
          </motion.h1>

          {profile.heroDescription && (
            <motion.p
              initial={{ opacity: 0, x: -40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
              className="mt-5 max-w-lg text-sm leading-relaxed text-[var(--text-muted)] sm:text-base"
            >
              {profile.heroDescription}
            </motion.p>
          )}

          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="mt-9 flex flex-wrap items-center gap-3"
          >
            {isVisible("projects") && (
              <Button as={Link} to={link("/projects")} icon={ArrowRight}>
                View projects
              </Button>
            )}
            {isVisible("contact") && (
              <Button as={Link} to={link("/contact")} variant="secondary" icon={Mail} iconPosition="left">
                Contact me
              </Button>
            )}
            {resumeUrl && (
              <Button as="a" href={resumeUrl} target="_blank" rel="noopener noreferrer" variant="ghost" icon={Download}>
                Resume
              </Button>
            )}
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.7, delay: 0.4 }}
            className="mt-10"
          >
            <SocialLinks />
          </motion.div>
        </div>

        {(profile.avatar?.url || terminalLines.length > 0) && (
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, delay: 0.25, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-col items-center gap-6 lg:items-end"
          >
            {profile.avatar?.url && (
              <img
                src={optimizeImage(profile.avatar.url, 500)}
                alt={profile.name}
                className="h-36 w-36 rounded-full border-2 border-[var(--accent)] object-cover shadow-xl sm:h-44 sm:w-44"
              />
            )}
            <Terminal lines={terminalLines} user={initials(profile.name).toLowerCase() || "me"} />
          </motion.div>
        )}
      </div>
    </section>
  );
}

const SECTIONS = {
  about: About,
  experience: Experience,
  skills: Skills,
  projects: Projects,
  education: Education,
  contact: Contact,
};

/** Every visible page of the portfolio, shown one after another under the hero. */
function AllSections() {
  const { pages } = useSite();
  return (
    <EmbeddedProvider value>
      {pages
        .filter((page) => page.slug !== "home")
        .map((page) => {
          const Section = SECTIONS[page.slug];
          return (
            <div key={page.slug} id={page.slug} className="scroll-mt-16">
              {Section ? <Section /> : <CustomPage slug={page.slug} />}
            </div>
          );
        })}
    </EmbeddedProvider>
  );
}

const HEROES = {
  classic: Hero,
  brooklyn: H.BrooklynHero,
  brandon: H.BrandonHero,
  howard: H.HowardHero,
  tejas: H.TejasHero,
  alejandro: H.AlejandroHero,
  roton: H.RotonHero,
  john: H.JohnHero,
  agency: H.AgencyHero,
  crimson: H.CrimsonHero,
};

export default function Home() {
  const { template } = useSite();
  const ActiveHero = HEROES[template] || Hero;
  return (
    <>
      <ActiveHero />
      <AllSections />
    </>
  );
}
