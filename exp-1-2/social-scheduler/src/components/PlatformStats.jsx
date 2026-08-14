import { useSelector } from 'react-redux';
import { selectStatsByPlatform, selectCounts } from '../features/posts/postsSelectors';
import RenderBadge from './RenderBadge';

export default function PlatformStats() {
  // Fully derived. None of these numbers exist in the store.
  const stats = useSelector(selectStatsByPlatform);
  const counts = useSelector(selectCounts);

  return (
    <section className="panel">
      <header className="panel-head">
        <h2>Derived stats</h2>
        <RenderBadge label="Stats" />
      </header>

      <div className="tiles">
        <div className="tile"><b>{counts.total}</b><span>total</span></div>
        <div className="tile"><b>{counts.drafts}</b><span>drafts</span></div>
        <div className="tile"><b>{counts.scheduled}</b><span>scheduled</span></div>
        <div className="tile"><b>{counts.published}</b><span>published</span></div>
      </div>

      <div className="bars">
        {stats.map((s) => (
          <div className="bar-row" key={s.id}>
            <span className="bar-name">{s.name}</span>
            <div className="bar-track">
              <i className={`bar-fill f-${s.id}`} style={{ width: `${s.share}%` }} />
            </div>
            <span className="bar-num">{s.count}</span>
          </div>
        ))}
      </div>
    </section>
  );
}
