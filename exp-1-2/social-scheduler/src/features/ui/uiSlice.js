// ============================================================
// EXPERIMENT 1.2.1 — UI SLICE
// ============================================================
// Filters are UI state, not server data, so they live in their own slice.
// Keeping them OUT of the posts slice is what lets the same post list be
// re-used with different filters.
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  platformFilter: 'all', // 'all' | platform id
  statusFilter: 'all',   // 'all' | 'draft' | 'scheduled' | 'published'
  search: '',
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    platformFilterSet(state, action) { state.platformFilter = action.payload; },
    statusFilterSet(state, action)   { state.statusFilter = action.payload; },
    searchSet(state, action)         { state.search = action.payload; },
    filtersReset()                   { return initialState; },
  },
});

export const { platformFilterSet, statusFilterSet, searchSet, filtersReset } =
  uiSlice.actions;
export default uiSlice.reducer;
