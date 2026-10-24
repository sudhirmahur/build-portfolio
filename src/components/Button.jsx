import { motion } from "framer-motion";

const base =
  "inline-flex items-center justify-center gap-2 rounded-md px-5 py-2.5 text-sm font-medium transition-colors duration-200 focus-visible:outline-none";

const variants = {
  primary:
    "bg-[var(--accent)] text-[var(--color-ink-950)] hover:bg-[var(--accent-strong)]",
  secondary:
    "border border-[var(--border)] text-[var(--text)] hover:border-[var(--accent)] hover:text-[var(--accent)]",
  ghost: "text-[var(--text-muted)] hover:text-[var(--text)]",
};

export default function Button({
  as: Component = "button",
  variant = "primary",
  icon: Icon,
  iconPosition = "right",
  className = "",
  children,
  ...props
}) {
  return (
    <motion.div
      whileHover={{ y: -2 }}
      whileTap={{ y: 0, scale: 0.98 }}
      transition={{ duration: 0.18, ease: "easeOut" }}
      className="inline-block"
    >
      <Component className={`${base} ${variants[variant]} ${className}`} {...props}>
        {Icon && iconPosition === "left" && <Icon size={16} aria-hidden="true" />}
        {children}
        {Icon && iconPosition === "right" && <Icon size={16} aria-hidden="true" />}
      </Component>
    </motion.div>
  );
}
