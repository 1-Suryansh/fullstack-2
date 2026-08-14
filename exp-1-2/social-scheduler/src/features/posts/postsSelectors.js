// ============================================================
// EXPERIMENT 1.2.2 — MEMOIZED SELECTORS (derived state)
// ============================================================
// Rule of this file: NOTHING here is stored in the store.
// Everything is COMPUTED from what is already there.
//
// createSelector caches the last result. If the input selectors return the
// same references as last time, the expensive function does NOT run again and
// the SAME array/object reference is returned -> useSelector sees no change
// -> the component does not re-render.
import { createSelector } from '@reduxjs/toolkit';

// ---- 1. INPUT SELECTORS -------------------------------------------------
// Plain, cheap, no computation, no .map / .filter. They only reach into state.
export const selectPostEntities   = (state) => state.posts.entities;
export const selectPostIds        = (state) => state.posts.ids;
export const selectPostsStatus    = (state) => state.posts.status;
export const selectPostsError     = (state) => state.posts.error;

export const selectPlatformEntities = (state) => state.platforms.entities;
export const selectPlatformIds      = (state) => state.platforms.ids;

export const selectPlatformFilter = (state) => state.ui.platformFilter;
export const selectStatusFilter   = (state) => state.ui.statusFilter;
export const selectSearch         = (state) => state.ui.search;

// ---- 2. DENORMALIZE -----------------------------------------------------
// ids + entities  ->  a plain array the UI can loop over.
// WITHOUT createSelector this .map() would build a brand-new array on every
// single dispatch, and every subscribed component would re-render.
export const selectAllPosts = createSelector(
  [selectPostIds, selectPostEntities],
  (ids, entities) => ids.map((id) => entities[id]).filter(Boolean)
);

// ---- 3. JOIN (the "relational" part of normalization) -------------------
// Posts store only platformId. The platform object is looked up here, so if a
// platform is renamed we change ONE record, not every post.
export const selectPostsWithPlatform = createSelector(
  [selectAllPosts, selectPlatformEntities],
  (posts, platforms) =>
    posts.map((p) => ({ ...p, platform: platforms[p.platformId] ?? null }))
);

// ---- 4. DERIVED SUBSETS -------------------------------------------------
// IMPORTANT: drafts are NOT a separate slice. Duplicating them in the store
// would mean two places to keep in sync. They are derived instead.
export const selectDrafts = createSelector([selectAllPosts], (posts) =>
  posts.filter((p) => p.status === 'draft')
);

export const selectScheduledPosts = createSelector([selectAllPosts], (posts) =>
  posts
    .filter((p) => p.status === 'scheduled')
    .sort((a, b) => a.scheduledAt.localeCompare(b.scheduledAt))
);

export const selectPublishedPosts = createSelector([selectAllPosts], (posts) =>
  posts.filter((p) => p.status === 'published')
);

// ---- 5. FILTERED VIEW (multi-input memoization) -------------------------
// Recomputes only when posts, platforms, or one of the three filters changes.
// Returns IDS, not objects. A list of strings compares stably, so PostList
// re-renders only when the visible SET changes — not when a post's text edits.
export const selectVisiblePostIds = createSelector(
  [selectPostsWithPlatform, selectPlatformFilter, selectStatusFilter, selectSearch],
  (posts, platformFilter, statusFilter, search) => {
    const q = search.trim().toLowerCase();
    return posts
      .filter((p) => platformFilter === 'all' || p.platformId === platformFilter)
      .filter((p) => statusFilter === 'all' || p.status === statusFilter)
      .filter(
        (p) =>
          !q ||
          p.title.toLowerCase().includes(q) ||
          p.body.toLowerCase().includes(q)
      )
      .map((p) => p.id);
  }
);

// ---- 6. AGGREGATION / GROUPING -----------------------------------------
// Group posts by platform and count each status. This is the "expensive"
// computation that memoization is really protecting.
export const selectStatsByPlatform = createSelector(
  [selectAllPosts, selectPlatformIds, selectPlatformEntities],
  (posts, platformIds, platforms) => {
    const total = posts.length || 1;
    return platformIds.map((pid) => {
      const mine = posts.filter((p) => p.platformId === pid);
      return {
        id: pid,
        name: platforms[pid].name,
        mark: platforms[pid].mark,
        count: mine.length,
        share: Math.round((mine.length / total) * 100),
        draft: mine.filter((p) => p.status === 'draft').length,
        scheduled: mine.filter((p) => p.status === 'scheduled').length,
        published: mine.filter((p) => p.status === 'published').length,
      };
    });
  }
);

// ---- 7. CROSS-SLICE VALIDATION -----------------------------------------
// Uses the platform's charLimit against the post's body length. Neither slice
// knows about the other — the selector is where they meet.
export const selectOverLimitPostIds = createSelector(
  [selectPostsWithPlatform],
  (posts) =>
    posts
      .filter((p) => p.platform && p.body.length > p.platform.charLimit)
      .map((p) => p.id)
);

// ---- 8. PARAMETERIZED SELECTOR (a factory) ------------------------------
// A single shared selector would thrash its cache when 20 cards each pass a
// different id. So we EXPORT A FACTORY and each component instance calls it
// once (inside useMemo) to get its own private cache.
export const makeSelectPostView = () =>
  createSelector(
    [selectPostEntities, selectPlatformEntities, (_state, postId) => postId],
    (postEntities, platformEntities, postId) => {
      const post = postEntities[postId];
      if (!post) return null;
      const platform = platformEntities[post.platformId] ?? null;
      return {
        ...post,
        platform,
        overLimit: platform ? post.body.length > platform.charLimit : false,
        charsLeft: platform ? platform.charLimit - post.body.length : 0,
      };
    }
  );

// ---- 9. HEADLINE COUNTS -------------------------------------------------
export const selectCounts = createSelector(
  [selectAllPosts, selectDrafts, selectScheduledPosts, selectPublishedPosts],
  (all, drafts, scheduled, published) => ({
    total: all.length,
    drafts: drafts.length,
    scheduled: scheduled.length,
    published: published.length,
  })
);
