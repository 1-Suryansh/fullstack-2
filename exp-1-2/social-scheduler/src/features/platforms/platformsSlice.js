// ============================================================
// EXPERIMENT 1.2.1 — PLATFORMS SLICE (normalized)
// ============================================================
// A "slice" = one piece of the global state + the reducers that change it.
// Notice the shape: a lookup object (entities) + an order array (ids).
// That is what "normalized state" means. Reading platform "tw" is
// entities.tw  -> O(1), instead of scanning an array.
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  entities: {
    tw: { id: 'tw', name: 'Twitter / X', mark: 'X',  charLimit: 280 },
    ig: { id: 'ig', name: 'Instagram',   mark: 'IG', charLimit: 2200 },
    li: { id: 'li', name: 'LinkedIn',    mark: 'in', charLimit: 3000 },
    yt: { id: 'yt', name: 'YouTube',     mark: 'YT', charLimit: 5000 },
  },
  ids: ['tw', 'ig', 'li', 'yt'],
};

const platformsSlice = createSlice({
  name: 'platforms',
  initialState,
  reducers: {
    // RTK uses Immer internally, so "mutating" code here is safe —
    // Immer converts it into an immutable update behind the scenes.
    platformAdded(state, action) {
      const p = action.payload;
      state.entities[p.id] = p;
      state.ids.push(p.id);
    },
    platformRemoved(state, action) {
      const id = action.payload;
      delete state.entities[id];
      state.ids = state.ids.filter((x) => x !== id);
    },
  },
});

export const { platformAdded, platformRemoved } = platformsSlice.actions;
export default platformsSlice.reducer;
