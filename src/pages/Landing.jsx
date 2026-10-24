import { useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ArrowRight, Braces, Server, Layers, Terminal as TerminalIcon, Atom, Globe, Boxes,
} from "lucide-react";
import ThemeToggle from "../components/ThemeToggle";
import { NeuralNetwork, ChatIllustration, VoiceWave } from "../components/ai/Illustrations";
import { fadeUp, staggerContainer, staggerItem } from "../hooks/useScrollAnimation";

const COMPANY = {
  fullName: "SRN Tech Private Limited",
  brand: "SRN Tech",
  tagline: "Innovating Today, Transforming Tomorrow. 🚀",
  founder: "Sudhir Mahur",
};

const STATS = [
  { value: "2+", label: "Years of experience" },
  { value: "12+", label: "Projects delivered" },
  { value: "AI", label: "Chat & voice features" },
  { value: "MERN", label: "Full stack expertise" },
];

const SERVICES = [
  {
    icon: Braces,
    title: "Software Engineering",
    text: "Clean, scalable and maintainable software built for real business needs — from idea to deployment.",
  },
  {
    icon: Globe,
    title: "Web Development",
    text: "Fast, responsive and accessible websites and web applications that look great on every device.",
  },
  {
    icon: Layers,
    title: "MERN Stack Development",
    text: "End-to-end applications with MongoDB, Express, React and Node.js, including APIs, auth and dashboards.",
  },
  {
    icon: TerminalIcon,
    title: "Python Development",
    text: "Backend services, automation and data workflows written in Python.",
  },
  {
    icon: Atom,
    title: "AI Chat Features",
    text: "Intelligent chat assistants that answer questions, guide users and automate support inside your product.",
  },
  {
    icon: Server,
    title: "AI Voice Features",
    text: "Voice-enabled experiences — speak to your app and get natural, spoken responses.",
  },
];

const TECH = ["MongoDB", "Express.js", "React.js", "Node.js", "Python", "REST APIs", "AI Chat", "AI Voice", "Tailwind CSS", "JWT Auth"];

const NAV = [
  { href: "#about", label: "About" },
  { href: "#services", label: "Services" },
  { href: "#ai", label: "AI" },
  { href: "#founder", label: "Founder" },
];

function Heading({ kicker, title, text, center }) {
  return (
    <motion.div {...fadeUp} className={`flex max-w-2xl flex-col gap-3 ${center ? "mx-auto items-center text-center" : ""}`}>
      <div className="flex items-center gap-2 text-sm text-[var(--accent)]">
        <span className="h-px w-6 bg-[var(--accent)]" aria-hidden="true" />
        {kicker}
      </div>
      <h2 className="font-display text-balance text-2xl font-medium sm:text-3xl">{title}</h2>
      {text && <p className="text-sm leading-relaxed text-[var(--text-muted)] sm:text-base">{text}</p>}
    </motion.div>
  );
}

export default function Landing() {
  useEffect(() => {
    document.title = `${COMPANY.fullName} — Innovating Today, Transforming Tomorrow`;
    document
      .querySelector('meta[name="description"]')
      ?.setAttribute(
        "content",
        "SRN Tech Private Limited — software engineering, MERN stack, Python and AI chat & voice features."
      );
  }, []);

  const year = new Date().getFullYear();

  return (
    <div className="min-h-screen">
      {/* ---------- header ---------- */}
      <header className="sticky top-0 z-50 border-b border-[var(--border)] bg-[var(--bg)]/85 backdrop-blur-lg">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-3 sm:px-6">
          <a href="#top" className="font-display text-lg font-semibold tracking-tight">
            {COMPANY.brand}
            <span className="text-[var(--accent)]">.</span>
          </a>
          <nav className="hidden items-center gap-1 md:flex" aria-label="Primary">
            {NAV.map((item) => (
              <a
                key={item.href}
                href={item.href}
                className="px-3 py-2 text-sm text-[var(--text-muted)] transition-colors hover:text-[var(--text)]"
              >
                {item.label}
              </a>
            ))}
          </nav>
          <div className="flex items-center gap-2 sm:gap-3">
            <ThemeToggle />
            <Link
              to="/admin/login"
              className="rounded-md border border-[var(--border)] px-3 py-2 text-sm transition-colors hover:border-[var(--accent)] hover:text-[var(--accent)] sm:px-4"
            >
              Login
            </Link>
            <Link
              to="/admin/register"
              className="rounded-md bg-[var(--accent)] px-3 py-2 text-sm font-medium text-[var(--color-ink-950)] transition-colors hover:bg-[var(--accent-strong)] sm:px-4"
            >
              Register
            </Link>
          </div>
        </div>
      </header>

      <main id="top">
        {/* ---------- hero ---------- */}
        <section className="relative overflow-hidden">
          <div className="bg-dot-grid pointer-events-none absolute inset-0 opacity-[0.35] [mask-image:radial-gradient(ellipse_60%_60%_at_50%_0%,black,transparent)]" />
          <div className="pointer-events-none absolute -top-40 right-[-10%] h-96 w-96 rounded-full bg-[var(--accent)]/10 blur-3xl" />
          <div className="relative mx-auto grid max-w-6xl grid-cols-1 items-center gap-10 px-4 py-16 sm:px-6 sm:py-24 lg:grid-cols-[1.1fr_0.9fr]">
            <div>
              <motion.p
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-4 inline-flex rounded-full border border-[var(--border)] bg-[var(--bg-elevated)] px-3 py-1.5 text-xs text-[var(--text-muted)]"
              >
                {COMPANY.fullName}
              </motion.p>
              <motion.h1
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.05, ease: [0.16, 1, 0.3, 1] }}
                className="font-display text-balance text-3xl font-medium leading-[1.15] sm:text-5xl"
              >
                <span className="text-[var(--accent)]">Innovating Today,</span>
                <br />
                Transforming Tomorrow. 🚀
              </motion.h1>
              <motion.p
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
                className="mt-5 max-w-xl text-sm leading-relaxed text-[var(--text-muted)] sm:text-base"
              >
                {COMPANY.brand} is a software company building modern web applications and intelligent AI chat and
                voice experiences with the MERN stack and Python.
              </motion.p>
              <motion.div
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.25, ease: [0.16, 1, 0.3, 1] }}
                className="mt-8 flex flex-wrap items-center gap-3"
              >
                <Link
                  to="/admin/register"
                  className="inline-flex items-center gap-2 rounded-md bg-[var(--accent)] px-6 py-3 text-sm font-medium text-[var(--color-ink-950)] transition-colors hover:bg-[var(--accent-strong)]"
                >
                  Create your portfolio <ArrowRight size={16} aria-hidden="true" />
                </Link>
                <a
                  href="#services"
                  className="rounded-md border border-[var(--border)] px-6 py-3 text-sm transition-colors hover:border-[var(--accent)] hover:text-[var(--accent)]"
                >
                  Our services
                </a>
              </motion.div>
            </div>

            <motion.div
              initial={{ opacity: 0, scale: 0.94 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.7, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
              className="mx-auto w-full max-w-md"
            >
              <NeuralNetwork className="h-auto w-full" />
            </motion.div>
          </div>
        </section>

        {/* ---------- stats ---------- */}
        <section aria-label="Highlights" className="border-y border-[var(--border)] bg-[var(--bg-elevated)]">
          <div className="mx-auto grid max-w-6xl grid-cols-2 gap-6 px-4 py-8 sm:px-6 md:grid-cols-4">
            {STATS.map((stat) => (
              <div key={stat.label} className="text-center">
                <p className="font-display text-3xl font-medium text-[var(--accent)]">{stat.value}</p>
                <p className="mt-1 text-xs text-[var(--text-muted)] sm:text-sm">{stat.label}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ---------- about ---------- */}
        <section id="about" className="scroll-mt-16 py-16 sm:py-24">
          <div className="mx-auto grid max-w-6xl grid-cols-1 gap-10 px-4 sm:px-6 lg:grid-cols-[1.1fr_0.9fr]">
            <div>
              <Heading
                kicker="About us"
                title="A team that turns ideas into working software."
                text="SRN Tech Private Limited is a technology company focused on software engineering and development. For the last 2 years we have designed, built and shipped 12+ projects — web platforms, dashboards, APIs and AI-powered chat and voice features — using the MERN stack and Python."
              />
              <motion.ul {...staggerContainer(0.08)} className="mt-8 grid grid-cols-1 gap-3 sm:grid-cols-2">
                {[
                  "Software engineers & developers",
                  "MERN stack applications",
                  "Python development",
                  "AI chat & voice features",
                ].map((item) => (
                  <motion.li
                    key={item}
                    variants={staggerItem}
                    className="flex items-center gap-3 rounded-lg border border-[var(--border)] bg-[var(--bg-elevated)] px-4 py-3 text-sm"
                  >
                    <span className="h-2 w-2 shrink-0 rounded-full bg-[var(--accent-2)]" />
                    {item}
                  </motion.li>
                ))}
              </motion.ul>
            </div>

            <motion.dl
              {...fadeUp}
              className="self-start rounded-xl border border-[var(--border)] bg-[var(--bg-elevated)] p-5 sm:p-6"
            >
              <p className="mb-4 font-display text-lg font-medium">🏢 Company details</p>
              {[
                ["Company Name", COMPANY.fullName],
                ["Full Name", COMPANY.fullName],
                ["Brand Name", COMPANY.brand],
                ["Tagline", COMPANY.tagline],
                ["Founder", COMPANY.founder],
              ].map(([label, value]) => (
                <div
                  key={label}
                  className="grid grid-cols-[6.5rem_1fr] gap-3 border-t border-[var(--border)] py-3 text-sm first-of-type:border-t-0"
                >
                  <dt className="text-[var(--text-muted)]">{label}</dt>
                  <dd className="min-w-0 break-words font-medium">{value}</dd>
                </div>
              ))}
            </motion.dl>
          </div>
        </section>

        {/* ---------- services ---------- */}
        <section id="services" className="scroll-mt-16 border-t border-[var(--border)] py-16 sm:py-24">
          <div className="mx-auto max-w-6xl px-4 sm:px-6">
            <Heading
              center
              kicker="What we do"
              title="Services built around your product."
              text="From the first line of code to AI-powered features, we cover the full stack."
            />
            <motion.div
              {...staggerContainer(0.08)}
              className="mt-12 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3"
            >
              {SERVICES.map(({ icon: Icon, title, text }) => (
                <motion.article
                  key={title}
                  variants={staggerItem}
                  whileHover={{ y: -4 }}
                  className="rounded-lg border border-[var(--border)] bg-[var(--bg-elevated)] p-5 transition-colors hover:border-[var(--accent)]/50"
                >
                  <span className="flex h-11 w-11 items-center justify-center rounded-md bg-[var(--bg-elevated-2)] text-[var(--accent)]">
                    <Icon size={20} aria-hidden="true" />
                  </span>
                  <h3 className="mt-4 font-display text-lg font-medium">{title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-[var(--text-muted)]">{text}</p>
                </motion.article>
              ))}
            </motion.div>
          </div>
        </section>

        {/* ---------- AI ---------- */}
        <section id="ai" className="scroll-mt-16 border-t border-[var(--border)] bg-[var(--bg-elevated)] py-16 sm:py-24">
          <div className="mx-auto max-w-6xl px-4 sm:px-6">
            <Heading
              center
              kicker="Artificial intelligence"
              title="AI chat and voice, built into your product."
              text="We add conversational intelligence to applications — text chat that understands users and voice features that talk back."
            />
            <div className="mt-12 grid grid-cols-1 items-center gap-8 md:grid-cols-2">
              <motion.div {...fadeUp} className="flex flex-col gap-4">
                <ChatIllustration className="h-auto w-full max-w-sm self-center" />
                <div>
                  <h3 className="font-display text-lg font-medium">AI Chat</h3>
                  <p className="mt-1 text-sm text-[var(--text-muted)]">
                    Smart assistants for support, onboarding and automation inside your web app.
                  </p>
                </div>
              </motion.div>
              <motion.div {...fadeUp} className="flex flex-col gap-4">
                <VoiceWave className="h-auto w-full max-w-sm self-center" />
                <div>
                  <h3 className="font-display text-lg font-medium">AI Voice</h3>
                  <p className="mt-1 text-sm text-[var(--text-muted)]">
                    Voice-enabled interfaces so users can simply speak and listen.
                  </p>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* ---------- tech ---------- */}
        <section className="py-16 sm:py-20">
          <div className="mx-auto max-w-6xl px-4 text-center sm:px-6">
            <Heading center kicker="Technology" title="The stack we work with." />
            <motion.ul {...staggerContainer(0.04)} className="mt-8 flex flex-wrap justify-center gap-3">
              {TECH.map((tech) => (
                <motion.li
                  key={tech}
                  variants={staggerItem}
                  className="inline-flex items-center gap-2 rounded-full border border-[var(--border)] bg-[var(--bg-elevated)] px-4 py-2 font-mono text-xs text-[var(--text-muted)] sm:text-sm"
                >
                  <Boxes size={14} className="text-[var(--accent)]" aria-hidden="true" />
                  {tech}
                </motion.li>
              ))}
            </motion.ul>
          </div>
        </section>

        {/* ---------- founder ---------- */}
        <section id="founder" className="scroll-mt-16 border-t border-[var(--border)] py-16 sm:py-24">
          <div className="mx-auto max-w-3xl px-4 sm:px-6">
            <motion.div
              {...fadeUp}
              className="flex flex-col items-center gap-5 rounded-xl border border-[var(--border)] bg-[var(--bg-elevated)] p-6 text-center sm:flex-row sm:p-8 sm:text-left"
            >
              <span className="flex h-24 w-24 shrink-0 items-center justify-center rounded-full border-2 border-[var(--accent)] bg-[var(--bg-elevated-2)] font-display text-3xl text-[var(--accent)]">
                SM
              </span>
              <div>
                <p className="text-sm text-[var(--accent)]">Founder</p>
                <h2 className="font-display text-2xl font-medium">{COMPANY.founder}</h2>
                <p className="mt-2 text-sm leading-relaxed text-[var(--text-muted)]">
                  Software engineer and full stack developer working with the MERN stack and Python, and the person
                  behind {COMPANY.brand}&apos;s AI chat and voice features.
                </p>
              </div>
            </motion.div>
          </div>
        </section>

        {/* ---------- CTA ---------- */}
        <section className="border-t border-[var(--border)] bg-[var(--bg-elevated)] py-16 sm:py-20">
          <div className="mx-auto max-w-3xl px-4 text-center sm:px-6">
            <motion.h2 {...fadeUp} className="font-display text-balance text-2xl font-medium sm:text-3xl">
              Create your own portfolio website.
            </motion.h2>
            <motion.p {...fadeUp} className="mt-3 text-sm text-[var(--text-muted)] sm:text-base">
              Register for free, manage everything from your own admin panel and share your personal portfolio link.
            </motion.p>
            <motion.div {...fadeUp} className="mt-7 flex flex-wrap justify-center gap-3">
              <Link
                to="/admin/register"
                className="inline-flex items-center gap-2 rounded-md bg-[var(--accent)] px-6 py-3 text-sm font-medium text-[var(--color-ink-950)] transition-colors hover:bg-[var(--accent-strong)]"
              >
                Get started <ArrowRight size={16} aria-hidden="true" />
              </Link>
              <Link
                to="/admin/login"
                className="rounded-md border border-[var(--border)] px-6 py-3 text-sm transition-colors hover:border-[var(--accent)] hover:text-[var(--accent)]"
              >
                Login
              </Link>
            </motion.div>
          </div>
        </section>
      </main>

      {/* ---------- footer ---------- */}
      <footer className="border-t border-[var(--border)]">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-4 py-8 text-center text-sm text-[var(--text-muted)] sm:flex-row sm:px-6 sm:text-left">
          <div>
            <p className="font-display text-base font-semibold text-[var(--text)]">
              {COMPANY.brand}
              <span className="text-[var(--accent)]">.</span>
            </p>
            <p className="mt-1 text-xs">{COMPANY.tagline}</p>
          </div>
          <p>
            © {year} {COMPANY.fullName}. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
