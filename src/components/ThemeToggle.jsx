import './ThemeToggle.scss';

export default function ThemeToggle({ theme, onToggle }) {
  const isDark = theme === 'dark';
  return (
    <button
      type="button"
      className="theme-toggle"
      onClick={onToggle}
      aria-label={isDark ? 'Açık temaya geç' : 'Koyu temaya geç'}
      title={isDark ? 'Açık tema' : 'Koyu tema'}
    >
      <span className={`theme-toggle__thumb ${isDark ? 'is-dark' : ''}`}>
        {isDark ? '🌙' : '☀️'}
      </span>
    </button>
  );
}
