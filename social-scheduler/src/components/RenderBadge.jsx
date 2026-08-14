// A tiny instrument, not a feature. It counts how many times a component
// has rendered so the effect of memoization is visible on screen.
import { useRef } from 'react';

export default function RenderBadge({ label }) {
  const count = useRef(0);
  count.current += 1;
  return (
    <span className="render-badge" title={`${label} has rendered this many times`}>
      {label} ·{count.current}
    </span>
  );
}
