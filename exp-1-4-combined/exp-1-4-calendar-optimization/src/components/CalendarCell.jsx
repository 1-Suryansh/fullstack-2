import { useState, useRef, memo } from "react";
import PostChip from "./PostChip";

// ============================================================
//  EXPERIMENT 1.4.2
//  The render counter below is the evidence for the report.
//  It increments on every render of this cell, so you can watch
//  which cells actually re-render when something changes.
// ============================================================
function CalendarCellInner({ cell, posts, onDropPost, onOpenNew, showCounters }) {
  const [isOver, setIsOver] = useState(false);
  const renders = useRef(0);
  renders.current += 1;

  function handleDrop(e) {
    e.preventDefault();
    setIsOver(false);
    const id = e.dataTransfer.getData("text/plain");
    if (id) onDropPost(id, cell.iso);
  }

  return (
    <div
      className={
        "cell" +
        (cell.inMonth ? "" : " cell-muted") +
        (cell.isToday ? " cell-today" : "") +
        (isOver ? " cell-over" : "")
      }
      data-testid={`cell-${cell.iso}`}
      onDragOver={(e) => { e.preventDefault(); setIsOver(true); }}
      onDragLeave={() => setIsOver(false)}
      onDrop={handleDrop}
      onClick={() => onOpenNew(cell.iso)}
    >
      <div className="cell-head">
        <span className="cell-num">{cell.dayNumber}</span>
        {showCounters
          ? <span className="cell-renders" data-testid={`renders-${cell.iso}`}>
              {renders.current}
            </span>
          : posts.length > 0 && <span className="cell-count">{posts.length}</span>}
      </div>

      <div className="cell-body">
        {posts.map((p) => <PostChip key={p.id} post={p} />)}
      </div>
    </div>
  );
}

// Memoized and plain versions of the same component.
// The app swaps between them so the difference is visible live.
export const MemoCalendarCell  = memo(CalendarCellInner);
export const PlainCalendarCell = CalendarCellInner;
export default MemoCalendarCell;
