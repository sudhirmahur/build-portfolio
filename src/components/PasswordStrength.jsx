// Password strength meter: Weak / Fair / Good / Strong.
export function passwordScore(password = "") {
  if (!password) return { level: 0, label: "", tips: [] };

  const checks = {
    length8: password.length >= 8,
    length12: password.length >= 12,
    mixedCase: /[a-z]/.test(password) && /[A-Z]/.test(password),
    number: /\d/.test(password),
    symbol: /[^A-Za-z0-9]/.test(password),
  };
  const points = Object.values(checks).filter(Boolean).length;

  const tips = [];
  if (!checks.length8) tips.push("use 8+ characters");
  if (!checks.mixedCase) tips.push("mix UPPER and lower case");
  if (!checks.number) tips.push("add a number");
  if (!checks.symbol) tips.push("add a symbol (@ # ! $)");

  let level = 1; // weak
  if (password.length >= 6) {
    if (points >= 5) level = 4;
    else if (points >= 4) level = 3;
    else if (points >= 2) level = 2;
  }
  const label = ["", "Weak", "Fair", "Good", "Strong"][level];
  return { level, label, tips };
}

const COLORS = ["", "#ef4444", "#f97316", "#eab308", "#22c55e"];

export default function PasswordStrength({ password }) {
  const { level, label, tips } = passwordScore(password);
  const tooShort = password.length > 0 && password.length < 6;

  return (
    <div className="mt-2" aria-live="polite">
      <div className="flex gap-1.5" aria-hidden="true">
        {[1, 2, 3, 4].map((step) => (
          <span
            key={step}
            className="h-1.5 flex-1 rounded-full transition-colors"
            style={{ background: step <= level && !tooShort ? COLORS[level] : "var(--bg-elevated-2)" }}
          />
        ))}
      </div>
      <p className="mt-1.5 text-xs text-[var(--text-muted)]">
        {!password && "Minimum 6 characters. Longer passwords with numbers and symbols are stronger."}
        {tooShort && <span className="text-red-400">Too short — at least 6 characters required.</span>}
        {password.length >= 6 && (
          <>
            Password strength:{" "}
            <strong style={{ color: COLORS[level] }}>{label}</strong>
            {level < 4 && tips.length > 0 && <> — {tips.slice(0, 2).join(", ")}.</>}
          </>
        )}
      </p>
    </div>
  );
}
