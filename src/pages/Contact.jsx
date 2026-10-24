import { useState } from "react";
import { motion } from "framer-motion";
import { Mail, MapPin, Phone, Send, CheckCircle2 } from "lucide-react";
import PageShell from "../components/PageShell";
import SectionTitle from "../components/SectionTitle";
import SocialLinks from "../components/SocialLinks";
import { useSite } from "../context/SiteContext";
import { api } from "../api/client";
import { slideInLeft, slideInRight } from "../hooks/useScrollAnimation";

const initialForm = { name: "", email: "", message: "", website: "" };

function validate(form) {
  const errors = {};
  if (!form.name.trim()) errors.name = "Name is required.";
  if (!form.email.trim()) {
    errors.email = "Email is required.";
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
    errors.email = "Enter a valid email address.";
  }
  if (!form.message.trim()) {
    errors.message = "Message is required.";
  } else if (form.message.trim().length < 10) {
    errors.message = "Message should be at least 10 characters.";
  }
  return errors;
}

const inputClass =
  "w-full rounded-md border border-[var(--border)] bg-[var(--bg)] px-4 py-2.5 text-sm outline-none transition-colors focus:border-[var(--accent)]";

export default function Contact() {
  const { profile, getPage, apiPath } = useSite();
  const page = getPage("contact") || {};
  const [form, setForm] = useState(initialForm);
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState("idle"); // idle | submitting | sent | error
  const [serverError, setServerError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: undefined }));
    if (status === "sent" || status === "error") setStatus("idle");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validate(form);
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length > 0) return;

    setStatus("submitting");
    setServerError("");
    try {
      await api.post(apiPath("/contact"), form);
      setStatus("sent");
      setForm(initialForm);
    } catch (err) {
      setServerError(err.message || "Could not send your message. Please try again.");
      setStatus("error");
    }
  };

  const phoneHref = profile.phone ? `tel:${profile.phone.replace(/\s+/g, "")}` : null;

  return (
    <PageShell>
      <SectionTitle
        kicker={page.kicker}
        title={page.title}
        description={page.description}
        align="center"
      />

      <div className="mt-14 grid grid-cols-1 gap-10 lg:grid-cols-[0.8fr_1.2fr]">
        <motion.div {...slideInLeft} className="flex flex-col gap-6">
          {profile.email && (
            <a
              href={`mailto:${profile.email}`}
              className="flex items-center gap-4 rounded-lg border border-[var(--border)] bg-[var(--bg-elevated)] p-4 transition-colors hover:border-[var(--accent)] sm:p-5"
            >
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-md bg-[var(--bg-elevated-2)] text-[var(--accent)]">
                <Mail size={18} aria-hidden="true" />
              </div>
              <div className="min-w-0">
                <p className="text-xs text-[var(--text-muted)]">Email</p>
                <p className="break-all text-sm font-medium">{profile.email}</p>
              </div>
            </a>
          )}

          {profile.phone && (
            <a
              href={phoneHref}
              className="flex items-center gap-4 rounded-lg border border-[var(--border)] bg-[var(--bg-elevated)] p-4 transition-colors hover:border-[var(--accent)] sm:p-5"
            >
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-md bg-[var(--bg-elevated-2)] text-[var(--accent)]">
                <Phone size={18} aria-hidden="true" />
              </div>
              <div>
                <p className="text-xs text-[var(--text-muted)]">Phone</p>
                <p className="text-sm font-medium">{profile.phone}</p>
              </div>
            </a>
          )}

          {profile.location && (
            <div className="flex items-center gap-4 rounded-lg border border-[var(--border)] bg-[var(--bg-elevated)] p-4 sm:p-5">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-md bg-[var(--bg-elevated-2)] text-[var(--accent)]">
                <MapPin size={18} aria-hidden="true" />
              </div>
              <div>
                <p className="text-xs text-[var(--text-muted)]">Location</p>
                <p className="text-sm font-medium">{profile.location}</p>
              </div>
            </div>
          )}

          <div>
            <p className="mb-3 text-sm text-[var(--text-muted)]">Find me elsewhere</p>
            <SocialLinks />
          </div>
        </motion.div>

        <motion.form
          {...slideInRight}
          onSubmit={handleSubmit}
          noValidate
          className="flex flex-col gap-5 rounded-lg border border-[var(--border)] bg-[var(--bg-elevated)] p-4 sm:p-8"
        >
          {/* honeypot field – hidden from humans, bots fill it */}
          <input
            type="text"
            name="website"
            value={form.website}
            onChange={handleChange}
            tabIndex={-1}
            autoComplete="off"
            aria-hidden="true"
            className="absolute -left-[9999px] h-0 w-0 opacity-0"
          />

          <div>
            <label htmlFor="name" className="mb-1.5 block text-sm font-medium">
              Name
            </label>
            <input
              id="name"
              name="name"
              type="text"
              value={form.name}
              onChange={handleChange}
              aria-invalid={Boolean(errors.name)}
              aria-describedby={errors.name ? "name-error" : undefined}
              className={inputClass}
              placeholder="Your name"
            />
            {errors.name && (
              <p id="name-error" className="mt-1.5 text-xs text-red-400">
                {errors.name}
              </p>
            )}
          </div>

          <div>
            <label htmlFor="email" className="mb-1.5 block text-sm font-medium">
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              aria-invalid={Boolean(errors.email)}
              aria-describedby={errors.email ? "email-error" : undefined}
              className={inputClass}
              placeholder="you@example.com"
            />
            {errors.email && (
              <p id="email-error" className="mt-1.5 text-xs text-red-400">
                {errors.email}
              </p>
            )}
          </div>

          <div>
            <label htmlFor="message" className="mb-1.5 block text-sm font-medium">
              Message
            </label>
            <textarea
              id="message"
              name="message"
              rows={5}
              value={form.message}
              onChange={handleChange}
              aria-invalid={Boolean(errors.message)}
              aria-describedby={errors.message ? "message-error" : undefined}
              className={`${inputClass} resize-none`}
              placeholder="Tell me about your project or role..."
            />
            {errors.message && (
              <p id="message-error" className="mt-1.5 text-xs text-red-400">
                {errors.message}
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={status === "submitting"}
            className="mt-2 flex items-center justify-center gap-2 rounded-md bg-[var(--accent)] px-5 py-3 text-sm font-medium text-[var(--color-ink-950)] transition-colors hover:bg-[var(--accent-strong)] disabled:opacity-70"
          >
            {status === "sent" ? (
              <>
                <CheckCircle2 size={16} aria-hidden="true" />
                Message sent
              </>
            ) : (
              <>
                {status === "submitting" ? "Sending..." : "Send message"}
                {status !== "submitting" && <Send size={16} aria-hidden="true" />}
              </>
            )}
          </button>
          <p
            className={`text-xs ${status === "error" ? "text-red-400" : "text-[var(--text-muted)]"}`}
            role="status"
            aria-live="polite"
          >
            {status === "sent" && "Thanks for reaching out — I'll get back to you soon."}
            {status === "error" && serverError}
          </p>
        </motion.form>
      </div>
    </PageShell>
  );
}
