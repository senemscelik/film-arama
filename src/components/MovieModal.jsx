import { useEffect, useState } from 'react';
import { getMovieDetails, imageUrl } from '../api/tmdb.js';
import { ratingClass } from './MovieCard.jsx';
import './MovieModal.scss';

const formatRuntime = (min) =>
  min ? `${Math.floor(min / 60)} sa ${min % 60} dk` : null;

export default function MovieModal({ id, onClose }) {
  const [movie, setMovie] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const controller = new AbortController();
    setMovie(null);
    setError(null);
    getMovieDetails(id, controller.signal)
      .then(setMovie)
      .catch((err) => err.name !== 'AbortError' && setError(err.message));
    return () => controller.abort();
  }, [id]);

  // ESC ile kapat, arka plan kaydırmayı kilitle
  useEffect(() => {
    const onKey = (e) => e.key === 'Escape' && onClose();
    document.addEventListener('keydown', onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [onClose]);

  const trailer = movie?.videos?.results?.find(
    (v) => v.site === 'YouTube' && v.type === 'Trailer'
  ) || movie?.videos?.results?.find((v) => v.site === 'YouTube');
  const cast = movie?.credits?.cast?.slice(0, 8) ?? [];
  const director = movie?.credits?.crew?.find((c) => c.job === 'Director');
  const backdrop = imageUrl(movie?.backdrop_path, 'w1280');
  const poster = imageUrl(movie?.poster_path, 'w500');

  return (
    <div className="modal" role="dialog" aria-modal="true" onClick={onClose}>
      <div className="modal__panel" onClick={(e) => e.stopPropagation()}>
        <button type="button" className="modal__close" onClick={onClose} aria-label="Kapat">
          ✕
        </button>

        {error && <p className="modal__error">⚠️ {error}</p>}

        {!movie && !error && <div className="modal__loading"><span className="spinner" /></div>}

        {movie && (
          <>
            <div
              className="modal__backdrop"
              style={backdrop ? { backgroundImage: `url(${backdrop})` } : undefined}
            />
            <div className="modal__content">
              <div className="modal__poster">
                {poster ? <img src={poster} alt={movie.title} /> : <div>🎞️</div>}
              </div>

              <div className="modal__info">
                <h2 className="modal__title">
                  {movie.title}
                  {movie.release_date && <span> ({movie.release_date.slice(0, 4)})</span>}
                </h2>
                {movie.tagline && <p className="modal__tagline">“{movie.tagline}”</p>}

                <div className="modal__meta">
                  {movie.vote_average > 0 && (
                    <span className={`modal__rating ${ratingClass(movie.vote_average)}`}>
                      ★ {movie.vote_average.toFixed(1)}
                      <small> / {movie.vote_count.toLocaleString('tr-TR')} oy</small>
                    </span>
                  )}
                  {formatRuntime(movie.runtime) && <span>⏱ {formatRuntime(movie.runtime)}</span>}
                  {director && <span>🎬 {director.name}</span>}
                </div>

                <ul className="modal__genres">
                  {movie.genres.map((g) => (
                    <li key={g.id}>{g.name}</li>
                  ))}
                </ul>

                <h3>Özet</h3>
                <p className="modal__overview">{movie.overview || 'Türkçe özet bulunmuyor.'}</p>

                {cast.length > 0 && (
                  <>
                    <h3>Oyuncular</h3>
                    <ul className="modal__cast">
                      {cast.map((p) => (
                        <li key={p.credit_id}>
                          {p.profile_path ? (
                            <img src={imageUrl(p.profile_path, 'w185')} alt={p.name} loading="lazy" />
                          ) : (
                            <span className="modal__avatar">{p.name[0]}</span>
                          )}
                          <strong>{p.name}</strong>
                          <small>{p.character}</small>
                        </li>
                      ))}
                    </ul>
                  </>
                )}

                {trailer && (
                  <a
                    className="modal__trailer"
                    href={`https://www.youtube.com/watch?v=${trailer.key}`}
                    target="_blank"
                    rel="noreferrer"
                  >
                    ▶ Fragmanı izle
                  </a>
                )}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
