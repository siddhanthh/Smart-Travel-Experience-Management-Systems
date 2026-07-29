import { useState } from 'react';
import { bookingService } from '../../services/bookingService';
import ErrorMessage from '../Common/ErrorMessage';

export default function CreateBooking({ tripId, onCreated }) {
  const [form, setForm] = useState({
    type: 'hotel',
    title: '',
    description: '',
    amount: '',
    booking_date: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  function update(field, value) {
    setForm((f) => ({ ...f, [field]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const booking = await bookingService.create({ ...form, tripId: tripId, trip_id: tripId });
      setForm({ type: 'hotel', title: '', description: '', amount: '', booking_date: '' });
      onCreated?.(booking);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3 rounded-xl border border-slate-200 bg-white p-4">
      <ErrorMessage message={error} />
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700">Type</label>
          <select
            value={form.type}
            onChange={(e) => update('type', e.target.value)}
            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
          >
            <option value="hotel">Hotel</option>
            <option value="flight">Flight</option>
            <option value="transport">Transport</option>
            <option value="activity">Activity</option>
          </select>
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700">Amount (₹)</label>
          <input
            type="number"
            required
            min={0}
            value={form.amount}
            onChange={(e) => update('amount', e.target.value)}
            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
          />
        </div>
      </div>
      <div>
        <label className="mb-1 block text-sm font-medium text-slate-700">Title</label>
        <input
          required
          value={form.title}
          onChange={(e) => update('title', e.target.value)}
          placeholder="Taj Hotel - 2 nights"
          className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
        />
      </div>
      <div>
        <label className="mb-1 block text-sm font-medium text-slate-700">Date</label>
        <input
          type="date"
          value={form.booking_date}
          onChange={(e) => update('booking_date', e.target.value)}
          className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
        />
      </div>
      <button
        disabled={loading}
        className="w-full rounded-lg bg-blue-600 py-2 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-60"
      >
        {loading ? 'Booking…' : 'Add booking'}
      </button>
    </form>
  );
}
