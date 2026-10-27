import { useLayoutEffect, useRef, useState } from 'react';

/** Scales a fixed-width page (794px = A4) down to the width of its container. */
export default function FitToWidth({ width = 794, className = '', children }) {
  const outer = useRef(null);
  const inner = useRef(null);
  const [scale, setScale] = useState(0.4);
  const [height, setHeight] = useState(1123);

  useLayoutEffect(() => {
    const o = outer.current;
    const i = inner.current;
    if (!o || !i) return undefined;
    const update = () => {
      const w = o.clientWidth || width;
      setScale(w / width);
      setHeight(i.offsetHeight || 1123);
    };
    update();
    const ro = new ResizeObserver(update);
    ro.observe(o);
    ro.observe(i);
    return () => ro.disconnect();
  }, [width]);

  return (
    <div ref={outer} className={className} style={{ position: 'relative', width: '100%', height: height * scale, overflow: 'hidden' }}>
      <div
        ref={inner}
        style={{ position: 'absolute', top: 0, left: 0, width, transformOrigin: 'top left', transform: `scale(${scale})` }}
      >
        {children}
      </div>
    </div>
  );
}
