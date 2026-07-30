import { Link } from 'react-router-dom';

const statusBadgeStyles = {
  planning: 'bg-amber-100 text-amber-800 border-amber-200',
  active: 'bg-emerald-100 text-emerald-800 border-emerald-200 font-bold',
  completed: 'bg-slate-100 text-slate-700 border-slate-200',
  cancelled: 'bg-red-100 text-red-800 border-red-200 line-through',
};

function formatDate(dateStr) {
  if (!dateStr) return '';
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return dateStr;
  return d.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

export default function TripCard({ trip }) {
  const memberCount = trip.member_count ?? trip.memberCount ?? trip.members?.length ?? 1;
  const maxMembers = trip.max_members || 5;
  const fillPercent = Math.min(100, Math.round((memberCount / maxMembers) * 100));

  return (
    <Link
      to={`/trips/${trip.id}`}
      className="group block rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-blue-300 hover:shadow-md"
    >
      <div className="flex items-start justify-between gap-2">
        <div>
          <h3 className="font-bold text-slate-900 group-hover:text-blue-600 transition">
            {trip.title}
          </h3>
          <p className="mt-0.5 text-xs font-semibold text-blue-600 flex items-center gap-1">
            {trip.destination}
          </p>
        </div>
        <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold uppercase tracking-wider ${statusBadgeStyles[trip.status] || 'bg-slate-100 text-slate-600'}`}>
          {trip.status}
        </span>
      </div>

      {trip.description && (
        <p className="mt-2.5 text-xs text-slate-600 line-clamp-2 leading-relaxed">
          {trip.description}
        </p>
      )}

      <div className="mt-4 flex items-center justify-between text-xs text-slate-500 border-t border-slate-100 pt-3">
        <span>{formatDate(trip.start_date)} – {formatDate(trip.end_date)}</span>
        <span className="font-semibold text-slate-700">{memberCount}/{maxMembers} members</span>
      </div>

      {/* Member Fill Progress Bar */}
      <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-slate-100">
        <div
          className={`h-full transition-all duration-300 ${fillPercent >= 100 ? 'bg-amber-500' : 'bg-blue-600'}`}
          style={{ width: `${fillPercent}%` }}
        />
      </div>
    </Link>
  );
}
