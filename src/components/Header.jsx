import SearchBar from './SearchBar.jsx';
import ThemeToggle from './ThemeToggle.jsx';
import './Header.scss';

export default function Header({ query, onQueryChange, theme, onToggleTheme }) {
  return (
    <header className="header">
      <a className="header__brand" href="/" aria-label="Ana sayfa">
        <span className="header__logo">🎬</span>
        <span className="header__name">Sinemaskop</span>
      </a>
      <SearchBar value={query} onChange={onQueryChange} />
      <ThemeToggle theme={theme} onToggle={onToggleTheme} />
    </header>
  );
}
