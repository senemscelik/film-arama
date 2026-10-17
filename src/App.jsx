import { useEffect, useMemo, useState } from 'react';
import Header from './components/Header.jsx';
import GenreFilter from './components/GenreFilter.jsx';
import MovieGrid from './components/MovieGrid.jsx';
import Pagination from './components/Pagination.jsx';
import MovieModal from './components/MovieModal.jsx';
import useTheme from './hooks/useTheme.js';
import useDebounce from './hooks/useDebounce.js';
import { discoverMovies, getGenres, searchMovies } from './api/tmdb.js';
import './styles/App.scss';

// TMDB en fazla 500 sayfa döndürür
const MAX_PAGES = 500;

export default function App() {
  const { theme, toggleTheme } = useTheme();

  const [query, setQuery] = useState('');
  const debouncedQuery = useDebounce(query.trim());
  const [selectedGenres, setSelectedGenres] = useState([]);
  const [sortBy, setSortBy] = useState('popularity.desc');
  const [page, setPage] = useState(1);

  const [genres, setGenres] = useState([]);
  const [data, setData] = useState({ results: [], total_pages: 0, total_results: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedMovieId, setSelectedMovieId] = useState(null);

  const isSearching = debouncedQuery.length > 0;

  // Türleri bir kez yükle
  useEffect(() => {
    const controller = new AbortController();
    getGenres(controller.signal)
      .then(setGenres)
      .catch((err) => err.name !== 'AbortError' && setError(err.message));
    return () => controller.abort();
  }, []);

  // Arama ya da filtre değişince başa dön (render sırasında sıfırlanır; fazladan istek atılmaz)
  const filterKey = `${debouncedQuery}|${selectedGenres.join(',')}|${sortBy}`;
  const [prevFilterKey, setPrevFilterKey] = useState(filterKey);
  if (prevFilterKey !== filterKey) {
    setPrevFilterKey(filterKey);
    setPage(1);
  }

  // Filmleri getir
  useEffect(() => {
    const controller = new AbortController();
    setLoading(true);
    setError(null);

    const request = isSearching
      ? searchMovies({ query: debouncedQuery, page }, controller.signal)
      : discoverMovies({ genres: selectedGenres, page, sortBy }, controller.signal);

    request
      .then((res) => {
        setData(res);
        setLoading(false);
      })
      .catch((err) => {
        if (err.name === 'AbortError') return;
        setError(err.message);
        setLoading(false);
      });

    return () => controller.abort();
  }, [debouncedQuery, selectedGenres, sortBy, page, isSearching]);

  // TMDB arama uç noktası tür filtresini desteklemez; arama sonuçlarını istemci tarafında süz
  const movies = useMemo(() => {
    if (!isSearching || selectedGenres.length === 0) return data.results;
    return data.results.filter((m) => m.genre_ids?.some((id) => selectedGenres.includes(id)));
  }, [data.results, isSearching, selectedGenres]);

  const genreMap = useMemo(
    () => Object.fromEntries(genres.map((g) => [g.id, g.name])),
    [genres]
  );

  const toggleGenre = (id) =>
    setSelectedGenres((prev) =>
      prev.includes(id) ? prev.filter((g) => g !== id) : [...prev, id]
    );

  const changePage = (p) => {
    setPage(p);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const totalPages = Math.min(data.total_pages || 0, MAX_PAGES);

  const heading = isSearching
    ? `“${debouncedQuery}” için sonuçlar`
    : selectedGenres.length
      ? selectedGenres.map((id) => genreMap[id]).filter(Boolean).join(' · ')
      : 'Popüler Filmler';

  return (
    <div className="app">
      <Header
        query={query}
        onQueryChange={setQuery}
        theme={theme}
        onToggleTheme={toggleTheme}
      />

      <aside className="app__sidebar">
        <GenreFilter
          genres={genres}
          selected={selectedGenres}
          onToggle={toggleGenre}
          onClear={() => setSelectedGenres([])}
          sortBy={sortBy}
          onSortChange={setSortBy}
          sortDisabled={isSearching}
        />
      </aside>

      <main className="app__main">
        <div className="app__heading">
          <h1>{heading}</h1>
          {!loading && !error && (
            <span className="app__count">
              {data.total_results.toLocaleString('tr-TR')} film
            </span>
          )}
        </div>

        {isSearching && selectedGenres.length > 0 && (
          <p className="app__hint">
            Arama sonuçları seçili türlere göre bu sayfa içinde süzülüyor.
          </p>
        )}

        {error ? (
          <div className="app__state app__state--error">
            <span>⚠️</span>
            <p>{error}</p>
          </div>
        ) : (
          <>
            <MovieGrid
              movies={movies}
              loading={loading}
              genreMap={genreMap}
              onSelect={setSelectedMovieId}
            />
            {!loading && totalPages > 1 && (
              <Pagination page={page} totalPages={totalPages} onChange={changePage} />
            )}
          </>
        )}
      </main>

      <footer className="app__footer">
        Veriler <a href="https://www.themoviedb.org/" target="_blank" rel="noreferrer">TMDB</a>{' '}
        tarafından sağlanmaktadır.
      </footer>

      {selectedMovieId && (
        <MovieModal id={selectedMovieId} onClose={() => setSelectedMovieId(null)} />
      )}
    </div>
  );
}
