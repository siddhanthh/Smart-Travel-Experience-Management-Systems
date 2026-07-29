import { useEffect, useState } from 'react';
import { tripService } from '../services/tripService';
import TripList from '../components/Trips/TripList';
import CreateTrip from '../components/Trips/CreateTrip';
import Modal from '../components/Common/Modal';
import Pagination from '../components/Common/Pagination';
import LoadingSpinner from '../components/Common/LoadingSpinner';
import ErrorMessage from '../components/Common/ErrorMessage';
import { usePagination } from '../hooks/usePagination';
import { useNavigate } from 'react-router-dom';

export default function TripsPage() {
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showCreate, setShowCreate] = useState(false);
  const [statusFilter, setStatusFilter] = useState('all');
  const { page, limit, totalPages, setTotalPages, next, prev, goTo } = usePagination();
  const navigate = useNavigate();

  function load() {
    setLoading(true);
    const params = { page, limit };
    if (statusFilter !== 'all') params.status = statusFilter;

    tripService
      .list(params)
      .then((data) => {
        const rawTrips = data.data ?? data.trips ?? data;
        setTrips(Array.isArray(rawTrips) ? rawTrips : []);
        setTotalPages(data.pagination?.totalPages ?? data.totalPages ?? 1);
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }

  useEffect(load, [page, statusFilter]);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-slate-900">Explore & Manage Trips</h1>
        <button
          onClick={() => setShowCreate(true)}
          className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700 shadow-sm"
        >
          + New trip
        </button>
      </div>

      {/* Status Filter Tabs */}
      <div className="flex flex-wrap gap-2 border-b border-slate-200 pb-2 text-sm font-medium">
        {[
          { key: 'all', label: 'All Trips' },
          { key: 'active', label: 'Active' },
          { key: 'planning', label: 'Planning' },
          { key: 'completed', label: 'Completed' },
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => setStatusFilter(tab.key)}
            className={`rounded-lg px-3 py-1.5 transition ${
              statusFilter === tab.key
                ? 'bg-blue-600 font-semibold text-white shadow-sm'
                : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <ErrorMessage message={error} />
      {loading ? <LoadingSpinner /> : <TripList trips={trips} />}
      <Pagination page={page} totalPages={totalPages} onPrev={prev} onNext={next} onGoTo={goTo} />

      <Modal open={showCreate} onClose={() => setShowCreate(false)} title="Create a new trip">
        <CreateTrip
          onCreated={(trip) => {
            setShowCreate(false);
            navigate(`/trips/${trip.id}`);
          }}
        />
      </Modal>
    </div>
  );
}
