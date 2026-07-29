import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { tripService } from '../services/tripService';
import { useAuth } from '../hooks/useAuth';
import TripDetail from '../components/Trips/TripDetail';
import LoadingSpinner from '../components/Common/LoadingSpinner';
import ErrorMessage from '../components/Common/ErrorMessage';

export default function TripDetailPage() {
  const { id } = useParams();
  const { user, isAdmin } = useAuth();
  const [trip, setTrip] = useState(null);
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  function load() {
    setLoading(true);
    Promise.all([tripService.getById(id), tripService.members(id)])
      .then(([tripData, memberData]) => {
        setTrip(tripData.trip ?? tripData);
        setMembers(memberData.members ?? memberData);
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }

  useEffect(load, [id]);

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorMessage message={error} />;
  if (!trip) return null;

  return (
    <div className="space-y-4">
      <TripDetail
        trip={trip}
        members={members}
        currentUserId={user?.id}
        isAdmin={isAdmin}
        onUpdated={load}
      />
      <div className="flex flex-wrap gap-3">
        <Link
          to={`/trips/${id}/feed`}
          className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
        >
          Trip feed
        </Link>
        <Link
          to={`/trips/${id}/bookings`}
          className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
        >
          Bookings
        </Link>
        <Link
          to={`/trips/${id}/expenses`}
          className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
        >
          Expenses
        </Link>
      </div>
    </div>
  );
}
