import { Link } from 'react-router-dom';
import TripCard from './TripCard';

export default function TripList({ trips }) {
  if (!trips?.length) {
    return (
      <div className="rounded-xl border border-dashed border-slate-300 bg-white p-8 text-center">
        <p className="text-sm font-semibold text-slate-700">No trips found</p>
        <p className="mt-1 text-xs text-slate-500 mb-4">Start by creating a new trip or joining an existing one.</p>
        <Link
          to="/trips"
          className="rounded-lg bg-blue-600 px-4 py-2 text-xs font-semibold text-white hover:bg-blue-700 transition shadow-sm"
        >
          Create or Join a Trip
        </Link>
      </div>
    );
  }
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {trips.map((trip) => (
        <TripCard key={trip.id} trip={trip} />
      ))}
    </div>
  );
}
