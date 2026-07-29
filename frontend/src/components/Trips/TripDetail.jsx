import { useState } from 'react';
import { tripService } from '../../services/tripService';
import ErrorMessage from '../Common/ErrorMessage';

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

export default function TripDetail({ trip, members, currentUserId, isAdmin, onUpdated }) {
  const [error, setError] = useState('');
  const [joining, setJoining] = useState(false);

  const isMember = members?.some((m) => m.user_id === currentUserId);
  const isOwner = trip.created_by === currentUserId;
  const isFull = trip.max_members && members?.length >= trip.max_members;

  async function handleJoin() {
    setError('');
    setJoining(true);
    try {
      await tripService.join(trip.id);
      onUpdated?.();
    } catch (err) {
      setError(err.message);
    } finally {
      setJoining(false);
    }
  }

  async function handleCancel() {
    if (!confirm('Cancel this trip? All bookings will be cancelled too.')) return;
    try {
      await tripService.cancel(trip.id);
      onUpdated?.();
    } catch (err) {
      setError(err.message);
    }
  }

  async function handleLeave() {
    if (!confirm('Are you sure you want to leave this trip?')) return;
    try {
      await tripService.leave(trip.id);
      onUpdated?.();
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <div className="space-y-4">
      <ErrorMessage message={error} />
      <div className="rounded-xl border border-slate-200 bg-white p-5">
        <div className="flex flex-wrap items-start justify-between gap-2">
          <div>
            <h1 className="text-xl font-bold text-slate-900">{trip.title}</h1>
            <p className="text-sm text-slate-500">{trip.destination}</p>
          </div>
          <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-medium text-blue-700">
            {trip.status}
          </span>
        </div>
        {trip.description && <p className="mt-3 text-sm text-slate-600">{trip.description}</p>}
        <div className="mt-4 flex flex-wrap gap-6 text-sm text-slate-500">
          <span>{formatDate(trip.start_date)} – {formatDate(trip.end_date)}</span>
          <span>{members?.length ?? 0} / {trip.max_members} members</span>
        </div>
        <div className="mt-4 flex gap-2">
          {!isMember && !isFull && trip.status !== 'cancelled' && (
            <button
              onClick={handleJoin}
              disabled={joining}
              className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-60"
            >
              {joining ? 'Joining…' : 'Join trip'}
            </button>
          )}
          {isMember && !isOwner && trip.status !== 'cancelled' && (
            <button
              onClick={handleLeave}
              className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50 shadow-sm"
            >
              Leave trip
            </button>
          )}
          {isFull && !isMember && (
            <span className="rounded-lg bg-slate-100 px-4 py-2 text-sm text-slate-500">Trip full</span>
          )}
          {(isOwner || isAdmin) && trip.status !== 'cancelled' && (
            <button
              onClick={handleCancel}
              className="rounded-lg border border-red-300 px-4 py-2 text-sm font-semibold text-red-600 hover:bg-red-50"
            >
              Cancel trip
            </button>
          )}
        </div>
      </div>

      <div className="rounded-xl border border-slate-200 bg-white p-5">
        <h2 className="mb-3 font-semibold text-slate-900">Members ({members?.length ?? 0}/{trip.max_members})</h2>
        <ul className="divide-y divide-slate-100">
          {members?.map((m) => {
            const displayName = m.name || `User #${m.user_id}`;
            const initial = displayName.charAt(0).toUpperCase();
            return (
              <li key={m.id || m.user_id} className="flex items-center justify-between py-2.5 text-sm">
                <div className="flex items-center gap-2.5">
                  <div className="flex h-7 w-7 items-center justify-center rounded-full bg-blue-100 text-xs font-bold text-blue-700">
                    {initial}
                  </div>
                  <span className="font-medium text-slate-800">{displayName}</span>
                </div>
                <span className={`rounded-md border px-2 py-0.5 text-xs font-semibold ${
                  m.role === 'organizer'
                    ? 'bg-blue-50 text-blue-700 border-blue-200'
                    : 'bg-slate-50 text-slate-600 border-slate-200'
                }`}>
                  {m.role}
                </span>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}
