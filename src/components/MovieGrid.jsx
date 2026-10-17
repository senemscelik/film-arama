import MovieCard from './MovieCard.jsx';
import './MovieGrid.scss';

export default function MovieGrid({ movies, loading, genreMap, onSelect }) {
  if (loading) {
    return (
      <div className="movie-grid" aria-busy="true">
        {Array.from({ length: 12 }, (_, i) => (
          <div key={i} className="movie-card movie-card--skeleton" />
        ))}
      </div>
    );
  }

  if (movies.length === 0) {
    return (
      <div className="movie-grid__empty">
        <span>🍿</span>
        <p>Aradığınız kriterlere uygun film bulunamadı.</p>
      </div>
    );
  }

  return (
    <div className="movie-grid">
      {movies.map((movie, i) => (
        <MovieCard
          key={movie.id}
          movie={movie}
          genreMap={genreMap}
          onSelect={onSelect}
          style={{ '--i': i }}
        />
      ))}
    </div>
  );
}
