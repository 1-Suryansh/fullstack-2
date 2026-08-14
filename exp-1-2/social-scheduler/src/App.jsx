import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchPosts } from './features/posts/postsSlice';
import { selectPostsStatus, selectOverLimitPostIds } from './features/posts/postsSelectors';

import PostComposer from './components/PostComposer';
import FilterBar from './components/FilterBar';
import PostList from './components/PostList';
import PlatformStats from './components/PlatformStats';
import DraftsPanel from './components/DraftsPanel';

export default function App() {
  const dispatch = useDispatch();
  const status = useSelector(selectPostsStatus);
  const overLimit = useSelector(selectOverLimitPostIds);

  // Async thunk fires once when the app mounts.
  useEffect(() => {
    if (status === 'idle') dispatch(fetchPosts());
  }, [status, dispatch]);

  return (
    <div className="shell">
      <header className="masthead">
        <div>
          <p className="eyebrow">Experiment 1.2.1 + 1.2.2</p>
          <h1>Scheduler</h1>
          <p className="sub">
            One Redux store. Normalized posts and platforms. Every number below is
            computed by a memoized selector.
          </p>
        </div>
        <div className={`wire wire-${status}`}>store: {status}</div>
      </header>

      {overLimit.length > 0 && (
        <p className="alert">
          {overLimit.length} post{overLimit.length > 1 ? 's are' : ' is'} longer than the
          platform character limit.
        </p>
      )}

      <main className="grid">
        <div className="col">
          <PostComposer />
          <FilterBar />
          <PostList />
        </div>
        <aside className="col side">
          <PlatformStats />
          <DraftsPanel />
        </aside>
      </main>

      <footer className="foot">
        Type in the search box and watch the render counters. Only the components
        that actually depend on the filters go up.
      </footer>
    </div>
  );
}
