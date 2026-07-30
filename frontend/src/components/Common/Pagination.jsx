export default function Pagination({ page, totalPages, onPrev, onNext, onGoTo }) {
  if (totalPages <= 1) return null;

  const pages = Array.from({ length: totalPages }, (_, i) => i + 1).filter(
    (p) => p === 1 || p === totalPages || Math.abs(p - page) <= 1
  );

  return (
    <div className="flex items-center justify-center gap-1 py-4">
      <button
        onClick={onPrev}
        disabled={page === 1}
        className="rounded-md px-3 py-1.5 text-sm text-slate-600 hover:bg-slate-100 disabled:opacity-40"
      >
        Prev
      </button>
      {pages.map((p, idx) => (
        <span key={p} className="flex items-center">
          {idx > 0 && pages[idx - 1] !== p - 1 && <span className="px-1 text-slate-400">…</span>}
          <button
            onClick={() => onGoTo(p)}
            className={`rounded-md px-3 py-1.5 text-sm ${
              p === page ? 'bg-blue-600 text-white' : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            {p}
          </button>
        </span>
      ))}
      <button
        onClick={onNext}
        disabled={page === totalPages}
        className="rounded-md px-3 py-1.5 text-sm text-slate-600 hover:bg-slate-100 disabled:opacity-40"
      >
        Next
      </button>
    </div>
  );
}
