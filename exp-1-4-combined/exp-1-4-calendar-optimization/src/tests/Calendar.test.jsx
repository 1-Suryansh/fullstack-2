// ============================================================
//  COMPONENT TESTS - rendering, user interaction, memoization
// ============================================================
import { describe, it, expect, beforeEach } from "vitest";
import { render, screen, fireEvent, act } from "@testing-library/react";
import { Provider } from "react-redux";
import { makeStore } from "../app/store";
import { movePost, addPost, deletePost } from "../features/posts/postsSlice";
import { forceTick, toggleMemo, setMode } from "../features/ui/uiSlice";
import { toISO } from "../utils/date";
import Calendar from "../components/Calendar";
import PostEditor from "../components/PostEditor";

let store;
const today = toISO(new Date());

function setup() {
  store = makeStore();
  return render(
    <Provider store={store}>
      <Calendar />
      <PostEditor />
    </Provider>
  );
}

// Pick a day that is currently on screen and has no posts in it.
// Hardcoding a date would break as soon as the real month changes.
function emptyCellIso() {
  const cells = [...document.querySelectorAll('[data-testid^="cell-"]')];
  const blank = cells.find((c) => c.querySelector(".cell-body").children.length === 0);
  return blank.getAttribute("data-testid").replace("cell-", "");
}

beforeEach(() => setup());

describe("calendar rendering", () => {
  it("renders all 42 cells of the month grid", () => {
    const cells = document.querySelectorAll('[data-testid^="cell-"]');
    expect(cells).toHaveLength(42);
  });

  it("renders the seven weekday headers", () => {
    ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"].forEach((d) => {
      expect(screen.getByText(d)).toBeInTheDocument();
    });
  });

  it("places a seeded post in the cell for its date", () => {
    const cell = screen.getByTestId(`cell-${today}`);
    expect(cell.textContent).toContain("Product launch teaser");
  });
});

describe("user interaction", () => {
  it("opens the editor when an empty day is clicked", () => {
    fireEvent.click(screen.getByTestId(`cell-${today}`));
    expect(store.getState().posts.editorOpen).toBe(true);
  });

  it("opens the editor with the post loaded when a chip is clicked", () => {
    fireEvent.click(screen.getByTestId("chip-p1"));
    expect(store.getState().posts.editingId).toBe("p1");
    expect(screen.getByDisplayValue("Product launch teaser")).toBeInTheDocument();
  });

  it("moves a post to a new date on drop", () => {
    const target = "2026-12-25";
    act(() => { store.dispatch(movePost({ id: "p1", date: target })); });
    expect(store.getState().posts.posts.find((p) => p.id === "p1").date).toBe(target);
  });

  it("adds a post through the editor and shows it on the grid", () => {
    fireEvent.click(screen.getByTestId(`cell-${today}`));
    fireEvent.change(screen.getByPlaceholderText("What is going out?"),
                     { target: { value: "Test post" } });
    fireEvent.click(screen.getByText("Save"));
    expect(screen.getByTestId(`cell-${today}`).textContent).toContain("Test post");
  });

  it("refuses to save a post with an empty title", () => {
    const before = store.getState().posts.posts.length;
    fireEvent.click(screen.getByTestId(`cell-${today}`));
    fireEvent.click(screen.getByText("Save"));
    expect(screen.getByText("Give the post a title first")).toBeInTheDocument();
    expect(store.getState().posts.posts).toHaveLength(before);
  });

  it("deletes a post from the editor", () => {
    fireEvent.click(screen.getByTestId("chip-p1"));
    fireEvent.click(screen.getByText("Delete"));
    expect(store.getState().posts.posts.find((p) => p.id === "p1")).toBeUndefined();
  });
});

describe("memoization behaviour", () => {
  // Counters only render in Experiment 1.4.2 mode
  beforeEach(() => { act(() => { store.dispatch(setMode("1.4.2")); }); });

  // The render counter is the measurement. An unrelated dispatch
  // must not increase it while memoization is on.
  it("does not re-render cells on an unrelated update when memo is ON", () => {
    const empty = emptyCellIso();
    const before = Number(screen.getByTestId(`renders-${empty}`).textContent);

    act(() => { store.dispatch(forceTick()); });

    const after = Number(screen.getByTestId(`renders-${empty}`).textContent);
    expect(after).toBe(before);
  });

  it("DOES re-render cells on an unrelated update when memo is OFF", () => {
    act(() => { store.dispatch(toggleMemo()); });

    const empty = emptyCellIso();
    const before = Number(screen.getByTestId(`renders-${empty}`).textContent);

    act(() => { store.dispatch(forceTick()); });

    const after = Number(screen.getByTestId(`renders-${empty}`).textContent);
    expect(after).toBeGreaterThan(before);
  });

  it("re-renders only the affected cells when a post is added", () => {
    const far = emptyCellIso();
    const before = Number(screen.getByTestId(`renders-${far}`).textContent);

    act(() => {
      store.dispatch(addPost({
        title: "New", platform: "twitter", date: today, time: "10:00", status: "draft",
      }));
    });

    // The posts array changed, so byDate is rebuilt, but this distant
    // cell still receives an equal empty array and is skipped.
    const after = Number(screen.getByTestId(`renders-${far}`).textContent);
    expect(after).toBe(before);
  });

  it("updates the cell that actually changed", () => {
    act(() => {
      store.dispatch(addPost({
        title: "Visible now", platform: "twitter", date: today, time: "10:00", status: "draft",
      }));
    });
    expect(screen.getByTestId(`cell-${today}`).textContent).toContain("Visible now");
  });

  it("removes the chip from the grid when its post is deleted", () => {
    act(() => { store.dispatch(deletePost("p1")); });
    expect(screen.queryByTestId("chip-p1")).toBeNull();
  });
});
