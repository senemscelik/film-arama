import { imageUrl } from '../api/tmdb.js';
import './MovieCard.scss';

export const ratingClass = (vote) =>
  vote >= 7.5 ? 'is-high' : vote >= 6 ? 'is-mid' : 'is-low';

export default function MovieCard({ movie, genreMap, onSelect, style }) {
  const poster = imageUrl(movie.poster_path, 'w342');
  const year = movie.release_date?.slice(0, 4);
  const vote = movie.vote_average ?? 0;
  const genreNames = (movie.genre_ids || [])
    .slice(0, 2)
    .map((id) => genreMap[id])
    .filter(Boolean);

  return (
    <button
      type="button"
      className="movie-card"
      style={style}
      onClick={() => onSelect(movie.id)}
      aria-label={`${movie.title} detayları`}
    >
      <div className="movie-card__poster">
        {poster ? (
          <img src={poster} alt={movie.title} loading="lazy" />
        ) : (
          <div className="movie-card__placeholder">🎞️</div>
        )}
        {vote > 0 && (
          <span className={`movie-card__rating ${ratingClass(vote)}`}>
            ★ {vote.toFixed(1)}
          </span>
        )}
        <div className="movie-card__overlay">
          <p>{movie.overview || 'Özet bulunmuyor.'}</p>
        </div>
      </div>
      <div className="movie-card__body">
        <h3 className="movie-card__title">{movie.title}</h3>
        <p className="movie-card__meta">
          {year || '—'}
          {genreNames.length > 0 && <> · {genreNames.join(', ')}</>}
        </p>
      </div>
    </button>
  );
}
