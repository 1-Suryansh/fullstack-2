import { useDispatch, useSelector } from 'react-redux';
import { selectDrafts } from '../features/posts/postsSelectors';
import { postScheduled } from '../features/posts/postsSlice';
import RenderBadge from './RenderBadge';

// The exam point: there is no "drafts" slice anywhere in this app.
// A draft is just a post whose status happens to be 'draft'.
export default function DraftsPanel() {
  const drafts = useSelector(selectDrafts);
  const dispatch = useDispatch();

  const inAnHour = () => new Date(Date.now() + 3600000).toISOString().slice(0, 16);

  return (
    <section className="panel">
      <header className="panel-head">
        <h2>Drafts <span className="count">{drafts.length}</span></h2>
        <RenderBadge label="Drafts" />
      </header>
      <p className="note">Derived from posts. No separate slice, no duplicated data.</p>

      {drafts.length === 0 && <p className="empty">No drafts. Everything is scheduled or out.</p>}

      <ul className="draft-list">
        {drafts.map((d) => (
          <li key={d.id}>
            <span>{d.title}</span>
            <button
              className="btn small"
              onClick={() => dispatch(postScheduled({ id: d.id, scheduledAt: inAnHour() }))}
            >
              Schedule
            </button>
          </li>
        ))}
      </ul>
    </section>
  );
}
