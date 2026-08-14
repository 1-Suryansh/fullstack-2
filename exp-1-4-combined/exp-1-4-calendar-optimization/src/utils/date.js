// ============================================================
//  Pure date helpers - no React, no Redux.
//  Kept separate so the calendar maths can be reasoned about
//  (and tested) on its own.
// ============================================================

export const MONTHS = ["January","February","March","April","May","June",
  "July","August","September","October","November","December"];

export const DAY_NAMES = ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"];

// Turn a Date into the "YYYY-MM-DD" string we store on every post
export function toISO(d) {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

// ------------------------------------------------------------
// Build the 42-cell month grid (6 rows x 7 columns).
// Why 42 and not 28-31? A month can start on any weekday, so the
// grid must include trailing days from the previous month and
// leading days from the next one. 6 rows always covers the worst
// case, and a fixed cell count keeps the layout from jumping
// when the user moves between months.
// ------------------------------------------------------------
export function buildMonthGrid(year, month) {
  const first = new Date(year, month, 1);
  const startOffset = first.getDay();          // 0 = Sunday
  const gridStart = new Date(year, month, 1 - startOffset);

  const cells = [];
  for (let i = 0; i < 42; i++) {
    const d = new Date(gridStart.getFullYear(), gridStart.getMonth(), gridStart.getDate() + i);
    cells.push({
      iso: toISO(d),
      dayNumber: d.getDate(),
      inMonth: d.getMonth() === month,
      isToday: toISO(d) === toISO(new Date()),
    });
  }
  return cells;
}

// "14:30" -> "2:30 PM"
export function formatTime(hhmm) {
  if (!hhmm) return "";
  const [h, m] = hhmm.split(":").map(Number);
  const suffix = h >= 12 ? "PM" : "AM";
  const hour12 = h % 12 === 0 ? 12 : h % 12;
  return `${hour12}:${String(m).padStart(2, "0")} ${suffix}`;
}

// Step forward or backward one month without rolling the year wrong
export function shiftMonth(year, month, delta) {
  const d = new Date(year, month + delta, 1);
  return { year: d.getFullYear(), month: d.getMonth() };
}
