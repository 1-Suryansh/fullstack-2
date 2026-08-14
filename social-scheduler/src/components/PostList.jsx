import { useSelector } from 'react-redux';
import { selectVisiblePostIds, selectPostsStatus } from '../features/posts/postsSelectors';
import PostCard from './PostCard';
import RenderBadge from './RenderBadge';

export default function PostList() {
  // (1) A memoized selector returning IDS. Same set of ids -> same array
  // reference -> this component does not re-render when a post's TEXT changes.
  const ids = useSelector(selectVisiblePostIds);
  const status = useSelector(selectPostsStatus);

  return (
    <section className="panel">
      <header className="panel-head">
        <h2>Queue <span className="count">{ids.length}</span></h2>
        <RenderBadge label="PostList" />
      </header>

      {status === 'loading' && <p className="empty">Loading posts from the mock API…</p>}

      {status !== 'loading' && ids.length === 0 && (
        <p className="empty">Nothing matches these filters. Reset them, or add a post above.</p>
      )}

      <div className="cards">
        {ids.map((id) => (
          <PostCard key={id} postId={id} />
        ))}
      </div>
    </section>
  );
}
