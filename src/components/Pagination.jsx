import './Pagination.scss';

// Örn: 1 … 4 5 [6] 7 8 … 500
function getPages(page, total) {
  const pages = new Set([1, total]);
  for (let p = page - 2; p <= page + 2; p++) {
    if (p > 1 && p < total) pages.add(p);
  }
  const sorted = [...pages].sort((a, b) => a - b);
  const result = [];
  sorted.forEach((p, i) => {
    if (i > 0 && p - sorted[i - 1] > 1) result.push(`gap-${p}`);
    result.push(p);
  });
  return result;
}

export default function Pagination({ page, totalPages, onChange }) {
  return (
    <nav className="pagination" aria-label="Sayfalama">
      <button
        type="button"
        className="pagination__btn"
        onClick={() => onChange(page - 1)}
        disabled={page <= 1}
        aria-label="Önceki sayfa"
      >
        ‹
      </button>
      {getPages(page, totalPages).map((p) =>
        typeof p === 'string' ? (
          <span key={p} className="pagination__gap">
            …
          </span>
        ) : (
          <button
            key={p}
            type="button"
            className={`pagination__btn ${p === page ? 'is-active' : ''}`}
            onClick={() => onChange(p)}
            aria-current={p === page ? 'page' : undefined}
          >
            {p}
          </button>
        )
      )}
      <button
        type="button"
        className="pagination__btn"
        onClick={() => onChange(page + 1)}
        disabled={page >= totalPages}
        aria-label="Sonraki sayfa"
      >
        ›
      </button>
    </nav>
  );
}
