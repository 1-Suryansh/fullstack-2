import { configureStore } from "@reduxjs/toolkit";
import postsReducer from "../features/posts/postsSlice";
import uiReducer from "../features/ui/uiSlice";

export const store = configureStore({
  reducer: { posts: postsReducer, ui: uiReducer },
});

// Factory used by the tests so each test gets a clean store
export const makeStore = () =>
  configureStore({ reducer: { posts: postsReducer, ui: uiReducer } });
