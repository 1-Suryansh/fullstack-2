import { useState, useMemo, useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";
import { buildMonthGrid, shiftMonth, MONTHS, DAY_NAMES } from "../utils/date";
import { movePost, openEditor } from "../features/posts/postsSlice";
import { toggleMemo, forceTick } from "../features/ui/uiSlice";
import { MemoCalendarCell, PlainCalendarCell } from "./CalendarCell";

export default function Calendar() {
  const dispatch = useDispatch();
  const posts       = useSelector((s) => s.posts.posts);
  const mode        = useSelector((s) => s.ui.mode);
  const memoEnabled = useSelector((s) => s.ui.memoEnabled);
  const renderTick  = useSelector((s) => s.ui.renderTick);

  const perfMode = mode === "1.4.2";        // show counters and the switch

  const now = new Date();
  const [view, setView] = useState({ year: now.getFullYear(), month: now.getMonth() });

  // --------------------------------------------------------
  // EXPERIMENT 1.4.1 - build the 42-cell month grid
  // EXPERIMENT 1.4.2 - useMemo stops it being rebuilt on every
  // render, since it only depends on the visible month.
  // --------------------------------------------------------
  const cells = useMemo(
    () => buildMonthGrid(view.year, view.month),
    [view.year, view.month]
  );

  // --------------------------------------------------------
  // EXPERIMENT 1.4.1 - map post data onto dates
  // EXPERIMENT 1.4.2 - bucket once instead of 42 cells each
  // filtering the whole posts array on every render.
  // --------------------------------------------------------
  const byDate = useMemo(() => {
    const map = {};
    posts.forEach((p) => { (map[p.date] ||= []).push(p); });
    Object.values(map).forEach((l) => l.sort((a, b) => a.time.localeCompare(b.time)));
    return map;
  }, [posts]);

  // --------------------------------------------------------
  // EXPERIMENT 1.4.2 - useCallback keeps these identities stable.
  // A fresh arrow function each render would be a new prop value,
  // so React.memo on the cell would re-render anyway. memo and
  // useCallback only work as a pair.
  // --------------------------------------------------------
  const handleDropPost = useCallback(
    (id, date) => dispatch(movePost({ id, date })), [dispatch]);

  const handleOpenNew = useCallback(
    (date) => dispatch(openEditor({ date })), [dispatch]);

  const EMPTY = useMemo(() => [], []);      // stable empty array reference

  // In 1.4.2 the switch decides; in 1.4.1 the memoized version is
  // used silently, since optimization is not that experiment's topic.
  const Cell = (!perfMode || memoEnabled) ? MemoCalendarCell : PlainCalendarCell;

  return (
    <div className="calendar">
      <div className="cal-head">
        <div className="cal-nav">
          <button className="btn-icon" onClick={() => setView(shiftMonth(view.year, view.month, -1))}>&larr;</button>
          <h2>{MONTHS[view.month]} {view.year}</h2>
          <button className="btn-icon" onClick={() => setView(shiftMonth(view.year, view.month, 1))}>&rarr;</button>
        </div>
        <button className="btn-sm" onClick={() => setView({ year: now.getFullYear(), month: now.getMonth() })}>Today</button>
      </div>

      {/* Measurement panel - Experiment 1.4.2 only */}
      {perfMode && (
        <div className="perf-bar">
          <label className="switch">
            <input type="checkbox" checked={memoEnabled}
                   onChange={() => dispatch(toggleMemo())} />
            <span>Memoization {memoEnabled ? "ON" : "OFF"}</span>
          </label>

          <button className="btn-sm" onClick={() => dispatch(forceTick())}>
            Fire unrelated update ({renderTick})
          </button>

          <span className="perf-note">
            The number in each cell is its render count. Press the button and watch.
          </span>
        </div>
      )}

      <div className="weekdays">
        {DAY_NAMES.map((d) => <div key={d} className="weekday">{d}</div>)}
      </div>

      <div className="grid">
        {cells.map((cell) => (
          <Cell
            key={cell.iso}
            cell={cell}
            posts={byDate[cell.iso] || EMPTY}
            onDropPost={handleDropPost}
            onOpenNew={handleOpenNew}
            showCounters={perfMode}
          />
        ))}
      </div>

      <p className="hint-line">
        Click a day to add &middot; click a post to edit &middot; drag a post to another day to reschedule
      </p>
    </div>
  );
}
