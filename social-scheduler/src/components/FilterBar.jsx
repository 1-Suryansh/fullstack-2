import { useDispatch, useSelector } from 'react-redux';
import {
  platformFilterSet, statusFilterSet, searchSet, filtersReset,
} from '../features/ui/uiSlice';
import {
  selectPlatformIds, selectPlatformEntities,
  selectPlatformFilter, selectStatusFilter, selectSearch,
} from '../features/posts/postsSelectors';
import RenderBadge from './RenderBadge';

const STATUSES = ['all', 'draft', 'scheduled', 'published'];

export default function FilterBar() {
  const dispatch = useDispatch();
  const ids = useSelector(selectPlatformIds);
  const platforms = useSelector(selectPlatformEntities);
  const platformFilter = useSelector(selectPlatformFilter);
  const statusFilter = useSelector(selectStatusFilter);
  const search = useSelector(selectSearch);

  return (
    <section className="panel">
      <header className="panel-head">
        <h2>Filter</h2>
        <RenderBadge label="FilterBar" />
      </header>

      <input
        className="search"
        value={search}
        onChange={(e) => dispatch(searchSet(e.target.value))}
        placeholder="Search title or text"
      />

      <div className="chips">
        <button
          className={platformFilter === 'all' ? 'chip on' : 'chip'}
          onClick={() => dispatch(platformFilterSet('all'))}
        >All platforms</button>
        {ids.map((id) => (
          <button
            key={id}
            className={platformFilter === id ? 'chip on' : 'chip'}
            onClick={() => dispatch(platformFilterSet(id))}
          >{platforms[id].name}</button>
        ))}
      </div>

      <div className="chips">
        {STATUSES.map((s) => (
          <button
            key={s}
            className={statusFilter === s ? 'chip on' : 'chip'}
            onClick={() => dispatch(statusFilterSet(s))}
          >{s === 'all' ? 'Any status' : s}</button>
        ))}
        <button className="chip ghost" onClick={() => dispatch(filtersReset())}>Reset</button>
      </div>
    </section>
  );
}
