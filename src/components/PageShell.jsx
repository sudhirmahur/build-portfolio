import { useEmbedded } from "../context/EmbeddedContext";

export default function PageShell({ children, width = "max-w-6xl" }) {
  const embedded = useEmbedded();
  return (
    <div className={embedded ? "" : "min-h-[70vh] pt-16"}>
      <section data-shell className="py-16 sm:py-24">
        <div className={`mx-auto ${width} px-4 sm:px-6`}>{children}</div>
      </section>
    </div>
  );
}
