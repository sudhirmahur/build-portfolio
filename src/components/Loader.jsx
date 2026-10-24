import { motion, AnimatePresence } from "framer-motion";

// Neutral loading screen (no hard-coded name, since every portfolio has its own owner).
export default function Loader({ loading }) {
  return (
    <AnimatePresence>
      {loading && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4, ease: "easeInOut" }}
          className="fixed inset-0 z-[100] flex items-center justify-center bg-[var(--bg)]"
        >
          <span
            role="status"
            aria-label="Loading"
            className="h-8 w-8 animate-spin rounded-full border-2 border-[var(--border)] border-t-[var(--accent)]"
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
