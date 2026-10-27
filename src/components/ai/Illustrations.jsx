import { motion } from "framer-motion";

/* Decorative, self-contained SVG illustrations (no external images needed). */

const LAYERS = [
  [60, 120, 180, 240],
  [40, 100, 160, 220, 280 - 20],
  [90, 150, 210],
];
const XS = [50, 170, 290];

export function NeuralNetwork({ className = "" }) {
  const nodes = LAYERS.map((ys, layer) => ys.map((y) => ({ x: XS[layer], y })));
  const lines = [];
  for (let l = 0; l < nodes.length - 1; l += 1) {
    nodes[l].forEach((a, i) => {
      nodes[l + 1].forEach((b, j) => lines.push({ a, b, key: `${l}-${i}-${j}` }));
    });
  }

  return (
    <svg viewBox="0 0 340 300" className={className} role="img" aria-label="Illustration of an AI neural network">
      <defs>
        <radialGradient id="nn-glow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="var(--accent)" stopOpacity="0.35" />
          <stop offset="100%" stopColor="var(--accent)" stopOpacity="0" />
        </radialGradient>
      </defs>
      <ellipse cx="170" cy="150" rx="160" ry="140" fill="url(#nn-glow)" />
      {lines.map(({ a, b, key }) => (
        <line key={key} x1={a.x} y1={a.y} x2={b.x} y2={b.y} stroke="var(--border)" strokeWidth="1" />
      ))}
      {nodes.flat().map((n, i) => (
        <motion.circle
          key={i}
          cx={n.x}
          cy={n.y}
          r="9"
          fill={i % 3 === 0 ? "var(--accent)" : "var(--accent-2)"}
          style={{ transformBox: "fill-box", transformOrigin: "center" }}
          animate={{ opacity: [0.45, 1, 0.45], scale: [0.85, 1.15, 0.85] }}
          transition={{ duration: 2.4, repeat: Infinity, delay: (i % 7) * 0.25, ease: "easeInOut" }}
        />
      ))}
    </svg>
  );
}

export function ChatIllustration({ className = "" }) {
  return (
    <svg viewBox="0 0 300 220" className={className} role="img" aria-label="Illustration of an AI chat conversation">
      <rect x="10" y="10" width="280" height="200" rx="18" fill="var(--bg-elevated)" stroke="var(--border)" />
      <circle cx="36" cy="36" r="6" fill="#ff5f56" />
      <circle cx="54" cy="36" r="6" fill="#ffbd2e" />
      <circle cx="72" cy="36" r="6" fill="#27c93f" />

      <rect x="28" y="62" width="150" height="34" rx="12" fill="var(--bg-elevated-2)" />
      <rect x="40" y="73" width="100" height="6" rx="3" fill="var(--text-muted)" opacity="0.7" />
      <rect x="40" y="84" width="60" height="5" rx="2.5" fill="var(--text-muted)" opacity="0.4" />

      <rect x="112" y="108" width="160" height="40" rx="12" fill="var(--accent)" />
      <rect x="126" y="120" width="110" height="6" rx="3" fill="var(--color-ink-950)" opacity="0.75" />
      <rect x="126" y="131" width="74" height="5" rx="2.5" fill="var(--color-ink-950)" opacity="0.45" />

      <rect x="28" y="160" width="70" height="32" rx="12" fill="var(--bg-elevated-2)" />
      {[0, 1, 2].map((i) => (
        <motion.circle
          key={i}
          cx={50 + i * 14}
          cy="176"
          r="4"
          fill="var(--text-muted)"
          animate={{ y: [0, -4, 0], opacity: [0.4, 1, 0.4] }}
          transition={{ duration: 1, repeat: Infinity, delay: i * 0.18 }}
        />
      ))}
    </svg>
  );
}

export function VoiceWave({ className = "" }) {
  const bars = Array.from({ length: 21 }, (_, i) => i);
  return (
    <svg viewBox="0 0 300 160" className={className} role="img" aria-label="Illustration of a voice waveform">
      <rect x="10" y="10" width="280" height="140" rx="18" fill="var(--bg-elevated)" stroke="var(--border)" />
      {bars.map((i) => {
        const h = 20 + Math.abs(Math.sin(i * 0.9)) * 70;
        return (
          <motion.rect
            key={i}
            x={30 + i * 12}
            y={80 - h / 2}
            width="6"
            height={h}
            rx="3"
            fill={i % 4 === 0 ? "var(--accent)" : "var(--accent-2)"}
            style={{ transformOrigin: `${33 + i * 12}px 80px` }}
            animate={{ scaleY: [0.35, 1, 0.35] }}
            transition={{ duration: 1.3, repeat: Infinity, delay: (i % 8) * 0.12, ease: "easeInOut" }}
          />
        );
      })}
    </svg>
  );
}
