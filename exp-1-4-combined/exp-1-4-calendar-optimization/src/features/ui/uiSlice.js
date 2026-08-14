// ============================================================
//  UI state shared by both experiments in this project.
//
//  mode        - which experiment is being demonstrated
//                "1.4.1" hides the performance panel entirely,
//                so the calendar can be shown on its own.
//  memoEnabled - the React.memo on/off switch (Exp 1.4.2)
//  renderTick  - a counter changed by a dispatch that no cell
//                depends on, used to prove memo is working
// ============================================================
import { createSlice } from "@reduxjs/toolkit";

const uiSlice = createSlice({
  name: "ui",
  initialState: { mode: "1.4.1", memoEnabled: true, renderTick: 0 },
  reducers: {
    setMode(state, action) { state.mode = action.payload; },
    toggleMemo(state)      { state.memoEnabled = !state.memoEnabled; },
    forceTick(state)       { state.renderTick += 1; },
  },
});

export const { setMode, toggleMemo, forceTick } = uiSlice.actions;
export default uiSlice.reducer;
