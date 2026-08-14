import { memo, useCallback } from "react";
import { useDispatch } from "react-redux";
import { openEditor } from "../features/posts/postsSlice";
import { formatTime } from "../utils/date";

// ============================================================
//  EXPERIMENT 1.4.2 - React.memo
//  memo compares the previous props with the next ones. If they
//  are shallow-equal, React skips re-rendering this component.
//  A chip only depends on its own post object, so a change to
//  any OTHER post should not cost anything here.
// ============================================================
function PostChip({ post }) {
  const dispatch = useDispatch();

  // useCallback keeps these function identities stable between
  // renders. Without it a new function is created every render,
  // which would defeat memo on any child receiving it as a prop.
  const handleDragStart = useCallback((e) => {
    e.dataTransfer.setData("text/plain", post.id);
    e.dataTransfer.effectAllowed = "move";
  }, [post.id]);

  const handleClick = useCallback((e) => {
    e.stopPropagation();
    dispatch(openEditor({ id: post.id }));
  }, [dispatch, post.id]);

  return (
    <div
      className={`chip chip-${post.platform} status-${post.status}`}
      draggable
      onDragStart={handleDragStart}
      onClick={handleClick}
      data-testid={`chip-${post.id}`}
      title={`${post.title} - ${formatTime(post.time)}`}
    >
      <span className="chip-time">{formatTime(post.time)}</span>
      <span className="chip-title">{post.title}</span>
    </div>
  );
}

export default memo(PostChip);
