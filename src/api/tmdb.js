const BASE_URL = 'https://api.themoviedb.org/3';
const KEY = import.meta.env.VITE_TMDB_KEY;

// v4 "Read Access Token" bir JWT'dir (eyJ... ile başlar) ve Bearer header ile gönderilir.
// v3 "API Key" ise api_key query parametresi olarak gönderilir.
const isBearer = typeof KEY === 'string' && KEY.startsWith('eyJ');

export const imageUrl = (path, size = 'w500') =>
  path ? `https://image.tmdb.org/t/p/${size}${path}` : null;

async function request(path, params = {}, signal) {
  if (!KEY) {
    throw new Error('VITE_TMDB_KEY bulunamadı. Proje kökündeki .env dosyasını kontrol edin.');
  }

  const url = new URL(BASE_URL + path);
  const query = { language: 'tr-TR', ...params };
  if (!isBearer) query.api_key = KEY;

  Object.entries(query).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      url.searchParams.set(key, value);
    }
  });

  const res = await fetch(url, {
    signal,
    headers: {
      accept: 'application/json',
      ...(isBearer && { Authorization: `Bearer ${KEY}` }),
    },
  });

  if (!res.ok) {
    let message = `İstek başarısız oldu (${res.status})`;
    try {
      const body = await res.json();
      if (body.status_message) message = body.status_message;
    } catch {
      /* gövde JSON değil */
    }
    throw new Error(message);
  }

  return res.json();
}

export const getGenres = (signal) =>
  request('/genre/movie/list', {}, signal).then((data) => data.genres);

export const discoverMovies = ({ genres = [], page = 1, sortBy = 'popularity.desc' }, signal) =>
  request(
    '/discover/movie',
    {
      // "|" = VEYA, "," = VE
      with_genres: genres.join('|'),
      page,
      sort_by: sortBy,
      include_adult: false,
      // Puana göre sıralamada az oy alan filmleri ele
      'vote_count.gte': sortBy.startsWith('vote_average') ? 300 : undefined,
    },
    signal
  );

export const searchMovies = ({ query, page = 1 }, signal) =>
  request('/search/movie', { query, page, include_adult: false }, signal);

export const getMovieDetails = (id, signal) =>
  request(
    `/movie/${id}`,
    { append_to_response: 'videos,credits', include_video_language: 'tr,en' },
    signal
  );
