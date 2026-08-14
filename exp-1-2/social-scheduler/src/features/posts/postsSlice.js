// ============================================================
// EXPERIMENT 1.2.1 — POSTS SLICE (normalized + CRUD + async)
// ============================================================
import { createSlice, createAsyncThunk, nanoid } from '@reduxjs/toolkit';

// ---- Mock API -----------------------------------------------------------
// Pretends to be a server. Resolves after 900ms so you can actually SEE
// the loading -> succeeded transition.
const MOCK_ROWS = [
  { id: 'p1', title: 'Launch teaser',      body: 'Something is coming on Friday.',                 platformId: 'tw', status: 'scheduled', scheduledAt: '2026-08-20T10:00' },
  { id: 'p2', title: 'Behind the scenes',  body: 'A quick look at how we built the new dashboard.', platformId: 'ig', status: 'draft',     scheduledAt: '' },
  { id: 'p3', title: 'Hiring: frontend',   body: 'We are looking for a React engineer in Mohali.',  platformId: 'li', status: 'published', scheduledAt: '2026-08-01T09:30' },
  { id: 'p4', title: 'Tutorial part 1',    body: 'Redux Toolkit from zero — full walkthrough.',     platformId: 'yt', status: 'draft',     scheduledAt: '' },
  { id: 'p5', title: 'Poll: dark mode?',   body: 'Should the app default to dark mode? Vote below.', platformId: 'tw', status: 'draft',    scheduledAt: '' },
];

function fakeApiGetPosts() {
  return new Promise((resolve) => setTimeout(() => resolve(MOCK_ROWS), 900));
}

// createAsyncThunk auto-generates 3 action types:
//   posts/fetchPosts/pending | /fulfilled | /rejected
export const fetchPosts = createAsyncThunk('posts/fetchPosts', async () => {
  const rows = await fakeApiGetPosts();
  return rows;
});

// ---- State --------------------------------------------------------------
const initialState = {
  entities: {},   // { [id]: post }  -> the actual data
  ids: [],        // [id, id, ...]   -> the display order
  status: 'idle', // idle | loading | succeeded | failed
  error: null,
};

const postsSlice = createSlice({
  name: 'posts',
  initialState,
  reducers: {
    // CREATE ------------------------------------------------------------
    // "prepare" lets us generate the id/timestamp before the reducer runs,
    // so the reducer itself stays pure.
    postAdded: {
      reducer(state, action) {
        const post = action.payload;
        state.entities[post.id] = post;
        state.ids.unshift(post.id);
      },
      prepare({ title, body, platformId, status, scheduledAt }) {
        return {
          payload: {
            id: nanoid(),
            title,
            body,
            platformId,
            status,
            scheduledAt: scheduledAt || '',
            createdAt: new Date().toISOString(),
          },
        };
      },
    },

    // UPDATE ------------------------------------------------------------
    postUpdated(state, action) {
      const { id, changes } = action.payload;
      const post = state.entities[id];
      if (post) Object.assign(post, changes);
    },

    // DELETE ------------------------------------------------------------
    postDeleted(state, action) {
      const id = action.payload;
      delete state.entities[id];
      state.ids = state.ids.filter((x) => x !== id);
    },

    // Small, explicit status transitions read better than a generic update.
    postScheduled(state, action) {
      const { id, scheduledAt } = action.payload;
      const post = state.entities[id];
      if (post) {
        post.status = 'scheduled';
        post.scheduledAt = scheduledAt;
      }
    },
    postPublished(state, action) {
      const post = state.entities[action.payload];
      if (post) post.status = 'published';
    },
  },

  // ---- Async handling --------------------------------------------------
  extraReducers: (builder) => {
    builder
      .addCase(fetchPosts.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchPosts.fulfilled, (state, action) => {
        state.status = 'succeeded';
        action.payload.forEach((post) => {
          if (!state.entities[post.id]) {
            state.entities[post.id] = post;
            state.ids.push(post.id);
          }
        });
      })
      .addCase(fetchPosts.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      });
  },
});

export const {
  postAdded,
  postUpdated,
  postDeleted,
  postScheduled,
  postPublished,
} = postsSlice.actions;

export default postsSlice.reducer;
