# Experiments 1.4.1 & 1.4.2 — Interactive Calendar with Rendering Optimization

One project covering both experiments. Switch between them with the two
buttons in the top-right corner.

## Run

    npm install
    npm run dev

Opens on **http://localhost:5176**

## Run the tests

    npm test

Expected: **28 tests passing** across 2 files.

---

## Experiment 1.4.1 — Interactive calendar

Click the **Exp 1.4.1** tab. The performance panel is hidden, leaving just
the calendar.

| Action | What it demonstrates |
|---|---|
| Click an empty day | Editor opens pre-filled with that date — cell to data mapping |
| Click a post chip | Editor opens with that post loaded — event mapping |
| Drag a chip to another day | Dispatches movePost, Redux updates, grid re-renders |
| Arrow buttons / Today | Grid rebuilds for a different month |
| Save / Delete | State syncs back to the calendar immediately |

**Files for this experiment**

| File | Purpose |
|---|---|
| src/utils/date.js | builds the 42-cell month grid, formats times |
| src/features/posts/postsSlice.js | posts array + add/update/delete/move |
| src/components/Calendar.jsx | month grid, buckets posts by date |
| src/components/CalendarCell.jsx | one day; drop target |
| src/components/PostChip.jsx | one post; drag source |
| src/components/PostEditor.jsx | create / edit modal |

---

## Experiment 1.4.2 — Optimization and testing

Click the **Exp 1.4.2** tab. A measurement panel appears and every cell
starts showing its own render count.

**The demonstration**

1. All cells show 1.
2. Leave **Memoization ON**. Press **Fire unrelated update** five times.
   The numbers do not move — React.memo compared props, found them equal,
   and skipped all 42 cells.
3. Untick to **Memoization OFF**. Press five more times.
   Every number climbs by one per press — 42 wasted re-renders each click.
4. Tick it back ON and drag a post. Only the two cells involved go up.

**The three techniques**

| Hook | Where | Problem it solves |
|---|---|---|
| React.memo | CalendarCell, PostChip | Skips re-render when props are shallow-equal |
| useMemo | grid build, post bucketing | Stops recomputing 42 dates and re-bucketing on every render |
| useCallback | onDropPost, onOpenNew | Keeps handler identity stable so memo actually holds |

**The trap worth knowing.** useCallback is not optional here. A fresh arrow
function is a new value on every render, so React.memo would see "props
changed" every time and re-render regardless. They only work as a pair.

**Test coverage**

*postsSlice.test.js (14)* — add, update, delete, move, editor open/close,
ignoring an unknown id, plus the date helpers: always 42 cells, grid starts
on Sunday, 12-hour formatting, year rollover.

*Calendar.test.jsx (14)* — 42 cells render, weekday headers, posts land in
the right cell, click-to-open, edit, save, delete, empty-title validation,
drag-and-drop, and three memoization tests asserting the render counter does
not move on an unrelated dispatch.

---

## Screenshots for the reports

**For 1.4.1**
1. Exp 1.4.1 tab active — full month grid with posts across several days
2. Editor open on an existing post
3. Mid-drag with the target cell highlighted (dashed border)
4. The post on its new day after the drop
5. Redux DevTools showing a `posts/movePost` action

**For 1.4.2**
6. Exp 1.4.2 tab, memo ON, all counters at 1
7. After 5 presses with memo ON — counters unchanged
8. After 5 presses with memo OFF — every counter at 6
9. Terminal output of `npm test` showing 28 passed

---

## Two deliberate deviations from the lab sheet

**Vitest instead of Jest.** The sheet says Jest. Vitest has the same API
(describe, it, expect) but runs natively under Vite with no extra Babel
configuration. Every test would run under Jest unchanged.

**A custom grid instead of FullCalendar.** The sheet lists FullCalendar as an
option. Building the grid by hand keeps the date maths visible and testable,
which matters when an examiner asks how the calendar works.

## Design decisions worth explaining in the viva

**Why 42 cells and not 28–31?** A month can begin on any weekday, so the grid
needs trailing days from the previous month and leading days from the next.
Six rows always covers the worst case, and a fixed count stops the layout
jumping in height when you change month.

**Why is date stored separately from time?** Dragging a post changes only
which day it sits on. With date as its own field, that is a one-field update.
A single combined timestamp would have to be parsed, edited and rebuilt on
every drag.
