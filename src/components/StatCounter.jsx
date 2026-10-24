import { useCountUp } from "../hooks/useCountUp";

export default function StatCounter({ target, suffix = "", label }) {
  const { ref, value } = useCountUp(target);

  return (
    <div ref={ref} className="flex flex-col gap-1">
      <span className="font-display text-2xl font-medium text-[var(--accent)]">
        {value}
        {suffix}
      </span>
      <span className="text-xs text-[var(--text-muted)]">{label}</span>
    </div>
  );
}
