import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { tripService } from '../services/tripService';
import { notificationService } from '../services/notificationService';
import LoadingSpinner from '../components/Common/LoadingSpinner';
import TripList from '../components/Trips/TripList';

export default function DashboardPage() {
  const { user } = useAuth();
  const [trips, setTrips] = useState([]);
  const [unread, setUnread] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([tripService.list({ mine: true, limit: 6 }), notificationService.unreadCount()])
      .then(([tripData, unreadData]) => {
        setTrips(tripData.trips ?? tripData.data ?? tripData);
        setUnread(unreadData.count ?? unreadData.unreadCount ?? 0);
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <LoadingSpinner label="Loading your dashboard…" />;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Welcome back, {user?.name?.split(' ')[0]} 👋</h1>
        <p className="text-sm text-slate-500">
          You have {unread} unread notification{unread === 1 ? '' : 's'}.
        </p>
      </div>

      <div className="flex flex-wrap gap-3">
        <Link to="/trips" className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700">
          Browse trips
        </Link>
        <Link to="/notifications" className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50">
          View notifications
        </Link>
      </div>

      <div>
        <h2 className="mb-3 text-lg font-semibold text-slate-900">Your trips</h2>
        <TripList trips={trips} />
      </div>
    </div>
  );
}
