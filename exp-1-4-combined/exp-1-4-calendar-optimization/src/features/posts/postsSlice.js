// ============================================================
//  EXPERIMENT 1.4.1 - the scheduled posts, held in Redux
//  A post is stored FLAT with date and time as separate strings.
//  Moving a post to another day is then a one-field change.
// ============================================================
import { createSlice, nanoid } from "@reduxjs/toolkit";
import { toISO } from "../../utils/date";

const today = new Date();
const day = (offset) => {
  const d = new Date(today.getFullYear(), today.getMonth(), today.getDate() + offset);
  return toISO(d);
};

const initialState = {
  posts: [
    { id: "p1", title: "Product launch teaser", platform: "instagram", date: day(0),  time: "09:00", status: "scheduled" },
    { id: "p2", title: "Behind the scenes reel", platform: "instagram", date: day(1),  time: "18:30", status: "draft"     },
    { id: "p3", title: "Hiring announcement",    platform: "linkedin",  date: day(1),  time: "11:00", status: "scheduled" },
    { id: "p4", title: "Weekly thread",          platform: "twitter",   date: day(3),  time: "14:00", status: "scheduled" },
    { id: "p5", title: "Customer story",         platform: "linkedin",  date: day(-2), time: "16:15", status: "published" },
    { id: "p6", title: "Tutorial short",         platform: "youtube",   date: day(5),  time: "20:00", status: "draft"     },
  ],
  editorOpen: false,
  editingId: null,      // null while creating a new post
  editingDate: null,    // which cell was clicked
};

const postsSlice = createSlice({
  name: "posts",
  initialState,
  reducers: {
    addPost: {
      reducer(state, action) { state.posts.push(action.payload); },
      prepare({ title, platform, date, time, status }) {
        return { payload: { id: nanoid(), title, platform, date, time, status } };
      },
    },

    updatePost(state, action) {
      const p = state.posts.find((x) => x.id === action.payload.id);
      if (p) Object.assign(p, action.payload);
    },

    deletePost(state, action) {
      state.posts = state.posts.filter((p) => p.id !== action.payload);
    },

    // Drag and drop: the only thing that changes is the date
    movePost(state, action) {
      const { id, date } = action.payload;
      const p = state.posts.find((x) => x.id === id);
      if (p) p.date = date;
    },

    openEditor(state, action) {
      state.editorOpen  = true;
      state.editingId   = action.payload.id ?? null;
      state.editingDate = action.payload.date ?? null;
    },

    closeEditor(state) {
      state.editorOpen = false;
      state.editingId = null;
      state.editingDate = null;
    },
  },
});

export const { addPost, updatePost, deletePost, movePost, openEditor, closeEditor } =
  postsSlice.actions;

export default postsSlice.reducer;
