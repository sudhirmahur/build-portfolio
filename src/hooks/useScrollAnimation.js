// Shared Framer Motion variants for scroll-triggered section reveals.
// Import the direction you need and spread it onto a `motion.*` element:
//   <motion.div {...fadeUp}> ... </motion.div>
const viewport = { once: true, amount: 0.2 };

export const fadeUp = {
  initial: { opacity: 0, y: 32 },
  whileInView: { opacity: 1, y: 0 },
  viewport,
  transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] },
};

export const fadeIn = {
  initial: { opacity: 0 },
  whileInView: { opacity: 1 },
  viewport,
  transition: { duration: 0.7, ease: "easeOut" },
};

export const slideInLeft = {
  initial: { opacity: 0, x: -48 },
  whileInView: { opacity: 1, x: 0 },
  viewport,
  transition: { duration: 0.65, ease: [0.16, 1, 0.3, 1] },
};

export const slideInRight = {
  initial: { opacity: 0, x: 48 },
  whileInView: { opacity: 1, x: 0 },
  viewport,
  transition: { duration: 0.65, ease: [0.16, 1, 0.3, 1] },
};

export const scaleIn = {
  initial: { opacity: 0, scale: 0.94 },
  whileInView: { opacity: 1, scale: 1 },
  viewport,
  transition: { duration: 0.55, ease: [0.16, 1, 0.3, 1] },
};

export function staggerContainer(staggerChildren = 0.08, delayChildren = 0) {
  return {
    initial: "hidden",
    whileInView: "visible",
    viewport,
    variants: {
      hidden: {},
      visible: {
        transition: { staggerChildren, delayChildren },
      },
    },
  };
}

export const staggerItem = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] },
  },
};
