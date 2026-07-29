import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { bookingService } from '../services/bookingService';
import { tripService } from '../services/tripService';
import { useAuth } from '../hooks/useAuth';
import BookingCard from '../components/Bookings/BookingCard';
import CreateBooking from '../components/Bookings/CreateBooking';
import LoadingSpinner from '../components/Common/LoadingSpinner';
import ErrorMessage from '../components/Common/ErrorMessage';

export default function BookingsPage() {
  const { id: tripId } = useParams();
  const { user, isAdmin } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [trip, setTrip] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  function load() {
    setLoading(true);
    Promise.all([bookingService.listForTrip(tripId), tripService.getById(tripId)])
      .then(([bookingData, tripData]) => {
        setBookings(bookingData.bookings ?? bookingData);
        setTrip(tripData.trip ?? tripData);
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }

  useEffect(load, [tripId]);

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold text-slate-900">
        Bookings {trip && <span className="text-base font-normal text-slate-500">· {trip.title}</span>}
      </h1>
      <ErrorMessage message={error} />
      <CreateBooking tripId={tripId} onCreated={load} />
      {loading ? (
        <LoadingSpinner />
      ) : (
        <div className="space-y-2">
          {bookings.length === 0 && (
            <p className="py-6 text-center text-sm text-slate-500">No bookings yet.</p>
          )}
          {bookings.map((b) => (
            <BookingCard
              key={b.id}
              booking={b}
              canManage={isAdmin || b.user_id === user?.id}
              onChanged={load}
            />
          ))}
        </div>
      )}
    </div>
  );
}
