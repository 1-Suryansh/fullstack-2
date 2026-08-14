import { useSelector, useDispatch } from "react-redux";
import { setMode } from "./features/ui/uiSlice";
import Calendar from "./components/Calendar";
import PostEditor from "./components/PostEditor";

const TABS = [
  { id: "1.4.1", label: "Exp 1.4.1", sub: "Interactive calendar" },
  { id: "1.4.2", label: "Exp 1.4.2", sub: "Optimization + testing" },
];

export default function App() {
  const dispatch = useDispatch();
  const mode = useSelector((s) => s.ui.mode);

  return (
    <div className="page">
      <header className="topbar">
        <div>
          <h1>Content Calendar</h1>
          <p className="muted">
            {mode === "1.4.1"
              ? "Scheduling posts on a time-based grid"
              : "Same calendar, with memoization and a test suite"}
          </p>
        </div>

        {/* Switch which experiment is on show. The calendar itself
            is identical - only the measurement panel appears or hides. */}
        <div className="tabs">
          {TABS.map((t) => (
            <button
              key={t.id}
              className={"tab" + (mode === t.id ? " tab-active" : "")}
              onClick={() => dispatch(setMode(t.id))}
            >
              <strong>{t.label}</strong>
              <span>{t.sub}</span>
            </button>
          ))}
        </div>
      </header>

      <Calendar />
      <PostEditor />
    </div>
  );
}
