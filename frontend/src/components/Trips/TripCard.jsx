import { Link } from 'react-router-dom';

const statusColors = {
  planning: 'bg-amber-100 text-amber-700',
  active: 'bg-green-100 text-green-700',
  completed: 'bg-slate-100 text-slate-600',
  cancelled: 'bg-red-100 text-red-700',
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

  return (
    <Link
      to={`/trips/${trip.id}`}
      className="block rounded-xl border border-slate-200 bg-white p-4 shadow-sm transition hover:shadow-md"
    >
      <div className="flex items-start justify-between">
        <h3 className="font-semibold text-slate-900">{trip.title}</h3>
        <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${statusColors[trip.status] || 'bg-slate-100 text-slate-600'}`}>
          {trip.status}
        </span>
      </div>
      <p className="mt-1 text-sm text-slate-500">{trip.destination}</p>
      <p className="mt-2 text-xs text-slate-400">
        📅 {formatDate(trip.start_date)} – {formatDate(trip.end_date)}
      </p>
      <p className="mt-2 text-xs font-medium text-slate-600">
        👥 {memberCount} / {trip.max_members} members
      </p>
    </Link>
  );
}
