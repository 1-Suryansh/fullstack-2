// ============================================================
// EXPERIMENT 1.2.1 — THE STORE (single source of truth)
// ============================================================
// configureStore() replaces plain Redux's createStore().
// It automatically:
//   - combines the reducers listed below
//   - adds redux-thunk (needed for async thunks)
//   - adds dev-time checks for accidental state mutation
//   - wires up Redux DevTools
import { configureStore } from '@reduxjs/toolkit';

import postsReducer from '../features/posts/postsSlice';
import platformsReducer from '../features/platforms/platformsSlice';
import uiReducer from '../features/ui/uiSlice';

export const store = configureStore({
  reducer: {
    posts: postsReducer,         // -> state.posts
    platforms: platformsReducer, // -> state.platforms
    ui: uiReducer,               // -> state.ui
  },
});

// Final shape of the global state:
// {
//   posts:     { entities: {...}, ids: [...], status, error },
//   platforms: { entities: {...}, ids: [...] },
//   ui:        { platformFilter, statusFilter, search }
// }
