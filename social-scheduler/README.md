# Scheduler — Experiments 1.2.1 & 1.2.2

A social-media post scheduler built to demonstrate centralized state management
(Redux Toolkit) and selector-based performance optimization (Reselect).

## How to run

```bash
npm install
npm run dev
```
Then open the URL Vite prints (usually http://localhost:5173).

## Where each requirement lives

### Experiment 1.2.1 — Centralized state management

| Requirement | File |
|---|---|
| Install Redux Toolkit + React-Redux | `package.json` |
| Configure Redux store | `src/app/store.js` |
| `<Provider>` wiring | `src/main.jsx` |
| Slice for posts | `src/features/posts/postsSlice.js` |
| Slice for platforms | `src/features/platforms/platformsSlice.js` |
| Normalized initial state (`entities` + `ids`) | both slices |
| Reducers for CRUD | `postAdded`, `postUpdated`, `postDeleted`, `postScheduled`, `postPublished` |
| Connect components with hooks | every file in `src/components/` (`useSelector`, `useDispatch`) |
| Async thunk / mock API | `fetchPosts` in `postsSlice.js`, dispatched from `App.jsx` |

### Experiment 1.2.2 — Memoized selectors & rendering

| Requirement | File / symbol |
|---|---|
| Basic input selectors | `postsSelectors.js` section 1 |
| Memoized selectors via `createSelector` | sections 2–9 |
| Derived data — filtered posts | `selectVisiblePostIds` |
| Derived data — grouped data | `selectStatsByPlatform` |
| Derived data — no duplicate slice | `selectDrafts` |
| Selectors integrated into components | `PostList`, `PlatformStats`, `DraftsPanel`, `PostCard` |
| `React.memo` | `PostCard.jsx` (`export default memo(PostCard)`) |
| `useMemo` | `PostCard.jsx` (`useMemo(makeSelectPostView, [])`) |
| Analyse re-renders | `RenderBadge.jsx` — the `·n` counter on every panel |

## What to record as your result

1. Load the app — the status pill goes `loading` then `succeeded` (async thunk).
2. Add a post — it appears instantly in the queue, the stats bars and the draft
   count update, with no props passed between those components.
3. Type in the search box — the FilterBar and PostList counters go up; the
   Stats and Drafts counters do **not**. That is memoization working.
4. Click "Edit title" on one card — only that card's `·n` increases. The other
   cards are skipped by `React.memo`.
5. Open Redux DevTools to show the action log and the normalized state tree.
