// ============================================================
// EXPERIMENT 1.2.2 — the three optimizations, all in one file
// ============================================================
import { memo, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { makeSelectPostView } from '../features/posts/postsSelectors';
import { postDeleted, postPublished, postUpdated } from '../features/posts/postsSlice';
import RenderBadge from './RenderBadge';

function PostCard({ postId }) {
  const dispatch = useDispatch();

  // (2) useMemo — build this instance's OWN memoized selector, once.
  // Without useMemo a new selector would be created on every render and its
  // cache would be thrown away every time, i.e. no memoization at all.
  const selectPostView = useMemo(makeSelectPostView, []);

  // The card subscribes only to ITS post. Editing another post changes a
  // different key in entities, this selector returns its cached object,
  // and this card does not re-render.
  const post = useSelector((state) => selectPostView(state, postId));
  if (!post) return null;

  return (
    <article className={post.overLimit ? 'card over' : 'card'}>
      <div className="card-top">
        <span className={`mark m-${post.platformId}`}>{post.platform?.mark}</span>
        <h3>{post.title}</h3>
        <span className={`tag t-${post.status}`}>{post.status}</span>
      </div>

      <p className="body">{post.body}</p>

      <div className="card-foot">
        <span className="meta">
          {post.scheduledAt ? post.scheduledAt.replace('T', ' · ') : 'not scheduled'}
        </span>
        <span className={post.overLimit ? 'meta warn' : 'meta'}>
          {post.overLimit ? `${-post.charsLeft} over limit` : `${post.charsLeft} left`}
        </span>
        <RenderBadge label="card" />
      </div>

      <div className="card-actions">
        {post.status !== 'published' && (
          <button className="btn small" onClick={() => dispatch(postPublished(post.id))}>
            Publish
          </button>
        )}
        <button
          className="btn small"
          onClick={() =>
            dispatch(postUpdated({ id: post.id, changes: { title: post.title + '!' } }))
          }
        >
          Edit title
        </button>
        <button className="btn small danger" onClick={() => dispatch(postDeleted(post.id))}>
          Delete
        </button>
      </div>
    </article>
  );
}

// (3) React.memo — props are just { postId }, a string. If the id has not
// changed, React skips this component entirely.
export default memo(PostCard);
