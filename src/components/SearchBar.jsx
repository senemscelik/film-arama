import './SearchBar.scss';

export default function SearchBar({ value, onChange }) {
  return (
    <form className="search" role="search" onSubmit={(e) => e.preventDefault()}>
      <svg className="search__icon" viewBox="0 0 24 24" aria-hidden="true">
        <circle cx="11" cy="11" r="7" />
        <path d="m20 20-3.5-3.5" />
      </svg>
      <input
        className="search__input"
        type="search"
        placeholder="Film adı ara…"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        aria-label="Film adı ara"
      />
      {value && (
        <button
          type="button"
          className="search__clear"
          onClick={() => onChange('')}
          aria-label="Aramayı temizle"
        >
          ✕
        </button>
      )}
    </form>
  );
}
