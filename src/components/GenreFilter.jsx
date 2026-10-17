import './GenreFilter.scss';

const SORT_OPTIONS = [
  { value: 'popularity.desc', label: 'En popüler' },
  { value: 'vote_average.desc', label: 'En yüksek puan' },
  { value: 'primary_release_date.desc', label: 'En yeni' },
  { value: 'revenue.desc', label: 'En çok hasılat' },
];

export default function GenreFilter({
  genres,
  selected,
  onToggle,
  onClear,
  sortBy,
  onSortChange,
  sortDisabled,
}) {
  return (
    <div className="filters">
      <div className="filters__section">
        <label className="filters__label" htmlFor="sort">
          Sıralama
        </label>
        <select
          id="sort"
          className="filters__select"
          value={sortBy}
          onChange={(e) => onSortChange(e.target.value)}
          disabled={sortDisabled}
          title={sortDisabled ? 'Arama yaparken sıralama kullanılamaz' : undefined}
        >
          {SORT_OPTIONS.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
      </div>

      <div className="filters__section">
        <div className="filters__row">
          <span className="filters__label">Türler</span>
          {selected.length > 0 && (
            <button type="button" className="filters__clear" onClick={onClear}>
              Temizle ({selected.length})
            </button>
          )}
        </div>
        <ul className="filters__chips">
          {genres.length === 0
            ? Array.from({ length: 12 }, (_, i) => (
                <li key={i} className="chip chip--skeleton" aria-hidden="true" />
              ))
            : genres.map((g) => {
                const active = selected.includes(g.id);
                return (
                  <li key={g.id}>
                    <button
                      type="button"
                      className={`chip ${active ? 'chip--active' : ''}`}
                      aria-pressed={active}
                      onClick={() => onToggle(g.id)}
                    >
                      {g.name}
                    </button>
                  </li>
                );
              })}
        </ul>
      </div>
    </div>
  );
}
