import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addPost, updatePost, deletePost, closeEditor } from "../features/posts/postsSlice";

const PLATFORMS = ["instagram", "twitter", "linkedin", "youtube"];
const STATUSES  = ["draft", "scheduled", "published"];

// Inner form. It is mounted fresh each time the editor opens
// (see the key prop below), so its useState initialisers run again
// with the correct post. This avoids syncing Redux into local state
// with useEffect, which is a common source of stale-form bugs.
function EditorForm({ existing, date }) {
  const dispatch = useDispatch();

  const [title, setTitle]       = useState(existing?.title ?? "");
  const [platform, setPlatform] = useState(existing?.platform ?? "instagram");
  const [time, setTime]         = useState(existing?.time ?? "09:00");
  const [status, setStatus]     = useState(existing?.status ?? "scheduled");
  const [error, setError]       = useState("");

  const postDate = existing?.date ?? date;

  function save() {
    if (!title.trim()) { setError("Give the post a title first"); return; }

    if (existing) {
      dispatch(updatePost({ id: existing.id, title, platform, time, status, date: postDate }));
    } else {
      dispatch(addPost({ title, platform, time, status, date: postDate }));
    }
    dispatch(closeEditor());
  }

  return (
    <div className="modal" onClick={(e) => e.stopPropagation()}>
      <h3>{existing ? "Edit post" : "New post"}</h3>
      <p className="muted">{postDate}</p>

      <label>Title</label>
      <input value={title} placeholder="What is going out?"
             onChange={(e) => { setTitle(e.target.value); setError(""); }} />

      <label>Platform</label>
      <select value={platform} onChange={(e) => setPlatform(e.target.value)}>
        {PLATFORMS.map((p) => <option key={p} value={p}>{p}</option>)}
      </select>

      <label>Time</label>
      <input type="time" value={time} onChange={(e) => setTime(e.target.value)} />

      <label>Status</label>
      <select value={status} onChange={(e) => setStatus(e.target.value)}>
        {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
      </select>

      {error && <p className="error">{error}</p>}

      <div className="modal-actions">
        <button className="btn" onClick={save}>Save</button>
        {existing && (
          <button className="btn-danger"
                  onClick={() => { dispatch(deletePost(existing.id)); dispatch(closeEditor()); }}>
            Delete
          </button>
        )}
        <button className="btn-ghost" onClick={() => dispatch(closeEditor())}>Cancel</button>
      </div>
    </div>
  );
}

export default function PostEditor() {
  const dispatch = useDispatch();
  const { editorOpen, editingId, editingDate, posts } = useSelector((s) => s.posts);

  if (!editorOpen) return null;

  const existing = editingId ? posts.find((p) => p.id === editingId) : null;

  return (
    <div className="overlay" onClick={() => dispatch(closeEditor())}>
      {/* key forces a fresh mount per post - no stale form values */}
      <EditorForm key={editingId ?? editingDate} existing={existing} date={editingDate} />
    </div>
  );
}
