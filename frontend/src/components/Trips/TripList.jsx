import TripCard from './TripCard';

export default function TripList({ trips }) {
  if (!trips?.length) {
    return <p className="py-8 text-center text-sm text-slate-500">No trips found.</p>;
  }
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {trips.map((trip) => (
        <TripCard key={trip.id} trip={trip} />
      ))}
    </div>
  );
}
