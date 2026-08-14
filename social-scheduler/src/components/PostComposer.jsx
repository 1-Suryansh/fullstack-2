import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { postAdded } from '../features/posts/postsSlice';
import { selectPlatformIds, selectPlatformEntities } from '../features/posts/postsSelectors';
import RenderBadge from './RenderBadge';

const EMPTY = { title: '', body: '', platformId: 'tw', status: 'draft', scheduledAt: '' };

export default function PostComposer() {
  const dispatch = useDispatch();
  const platformIds = useSelector(selectPlatformIds);
  const platforms = useSelector(selectPlatformEntities);
  const [form, setForm] = useState(EMPTY);

  const limit = platforms[form.platformId]?.charLimit ?? 0;
  const left = limit - form.body.length;

  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  function save() {
    if (!form.title.trim() || !form.body.trim()) return;
    // ONE dispatch. No callback passed down from a parent, no lifted state.
    dispatch(postAdded(form));
    setForm(EMPTY);
  }

  return (
    <section className="panel">
      <header className="panel-head">
        <h2>Compose</h2>
        <RenderBadge label="Composer" />
      </header>

      <div className="field">
        <label htmlFor="title">Title</label>
        <input id="title" value={form.title} onChange={set('title')} placeholder="Launch teaser" />
      </div>

      <div className="field">
        <label htmlFor="body">Post text</label>
        <textarea id="body" rows="3" value={form.body} onChange={set('body')} placeholder="What goes out?" />
        <p className={left < 0 ? 'hint over' : 'hint'}>
          {left < 0 ? `${Math.abs(left)} characters over the limit` : `${left} of ${limit} characters left`}
        </p>
      </div>

      <div className="row">
        <div className="field">
          <label htmlFor="platform">Platform</label>
          <select id="platform" value={form.platformId} onChange={set('platformId')}>
            {platformIds.map((id) => (
              <option key={id} value={id}>{platforms[id].name}</option>
            ))}
          </select>
        </div>

        <div className="field">
          <label htmlFor="status">Status</label>
          <select id="status" value={form.status} onChange={set('status')}>
            <option value="draft">Draft</option>
            <option value="scheduled">Scheduled</option>
            <option value="published">Published</option>
          </select>
        </div>

        <div className="field">
          <label htmlFor="when">Send at</label>
          <input id="when" type="datetime-local" value={form.scheduledAt} onChange={set('scheduledAt')} />
        </div>
      </div>

      <button className="btn primary" onClick={save}>Add post</button>
    </section>
  );
}
