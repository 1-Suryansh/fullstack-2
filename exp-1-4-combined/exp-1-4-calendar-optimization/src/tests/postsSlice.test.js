// ============================================================
//  UNIT TESTS - reducer logic and pure date helpers
//  These need no browser and no React. They are the fastest and
//  most reliable tests in the suite.
// ============================================================
import { describe, it, expect } from "vitest";
import reducer, {
  addPost, updatePost, deletePost, movePost, openEditor, closeEditor,
} from "../features/posts/postsSlice";
import { buildMonthGrid, formatTime, toISO, shiftMonth } from "../utils/date";

const base = {
  posts: [
    { id: "a", title: "One", platform: "twitter",  date: "2026-08-10", time: "09:00", status: "draft" },
    { id: "b", title: "Two", platform: "linkedin", date: "2026-08-12", time: "17:00", status: "scheduled" },
  ],
  editorOpen: false, editingId: null, editingDate: null,
};

describe("postsSlice reducer", () => {
  it("adds a post with a generated id", () => {
    const next = reducer(base, addPost({
      title: "Three", platform: "youtube", date: "2026-08-15", time: "12:00", status: "draft",
    }));
    expect(next.posts).toHaveLength(3);
    expect(next.posts[2].title).toBe("Three");
    expect(next.posts[2].id).toBeTruthy();
  });

  it("updates an existing post without touching the others", () => {
    const next = reducer(base, updatePost({ id: "a", title: "Renamed" }));
    expect(next.posts[0].title).toBe("Renamed");
    expect(next.posts[1].title).toBe("Two");
  });

  it("deletes only the requested post", () => {
    const next = reducer(base, deletePost("a"));
    expect(next.posts).toHaveLength(1);
    expect(next.posts[0].id).toBe("b");
  });

  it("moves a post to a new date and leaves the time alone", () => {
    const next = reducer(base, movePost({ id: "b", date: "2026-08-20" }));
    expect(next.posts[1].date).toBe("2026-08-20");
    expect(next.posts[1].time).toBe("17:00");
  });

  it("ignores a move for an id that does not exist", () => {
    const next = reducer(base, movePost({ id: "zzz", date: "2026-08-20" }));
    expect(next.posts).toEqual(base.posts);
  });

  it("opens the editor for an existing post", () => {
    const next = reducer(base, openEditor({ id: "a" }));
    expect(next.editorOpen).toBe(true);
    expect(next.editingId).toBe("a");
  });

  it("opens the editor for a new post on a given date", () => {
    const next = reducer(base, openEditor({ date: "2026-08-25" }));
    expect(next.editorOpen).toBe(true);
    expect(next.editingId).toBeNull();
    expect(next.editingDate).toBe("2026-08-25");
  });

  it("clears editor state on close", () => {
    const opened = reducer(base, openEditor({ id: "a" }));
    const next = reducer(opened, closeEditor());
    expect(next.editorOpen).toBe(false);
    expect(next.editingId).toBeNull();
  });
});

describe("date utilities", () => {
  it("always produces exactly 42 cells", () => {
    expect(buildMonthGrid(2026, 7)).toHaveLength(42);
    expect(buildMonthGrid(2026, 1)).toHaveLength(42);   // February
  });

  it("marks days outside the visible month", () => {
    const cells = buildMonthGrid(2026, 7);              // August 2026
    expect(cells.some((c) => !c.inMonth)).toBe(true);
    expect(cells.filter((c) => c.inMonth)).toHaveLength(31);
  });

  it("starts the grid on a Sunday", () => {
    const cells = buildMonthGrid(2026, 7);
    expect(new Date(cells[0].iso + "T00:00:00").getDay()).toBe(0);
  });

  it("formats 24-hour times into 12-hour times", () => {
    expect(formatTime("09:00")).toBe("9:00 AM");
    expect(formatTime("14:30")).toBe("2:30 PM");
    expect(formatTime("00:15")).toBe("12:15 AM");
    expect(formatTime("12:00")).toBe("12:00 PM");
  });

  it("pads single digits in toISO", () => {
    expect(toISO(new Date(2026, 0, 5))).toBe("2026-01-05");
  });

  it("rolls the year over correctly", () => {
    expect(shiftMonth(2026, 11, 1)).toEqual({ year: 2027, month: 0 });
    expect(shiftMonth(2026, 0, -1)).toEqual({ year: 2025, month: 11 });
  });
});
