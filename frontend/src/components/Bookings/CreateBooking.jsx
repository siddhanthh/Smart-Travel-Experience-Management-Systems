import { useState } from 'react';
import { bookingService } from '../../services/bookingService';
import ErrorMessage from '../Common/ErrorMessage';

export default function CreateBooking({ tripId, onCreated }) {
  const [open, setOpen] = useState(false);
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
      setOpen(false);
      onCreated?.(booking);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="flex w-full items-center justify-center gap-2 rounded-xl border border-dashed border-slate-300 bg-white p-3 text-sm font-semibold text-blue-600 hover:border-blue-500 hover:bg-blue-50/50 transition"
      >
        <span>+</span> Add Reservation / Booking
      </button>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 rounded-xl border border-blue-200 bg-blue-50/30 p-4 shadow-sm">
      <div className="flex items-center justify-between">
        <h3 className="text-base font-bold text-slate-900">Add New Reservation</h3>
        <button
          type="button"
          onClick={() => setOpen(false)}
          className="text-xs font-semibold text-slate-500 hover:text-slate-700"
        >
          Cancel
        </button>
      </div>

      <ErrorMessage message={error} />

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        <div>
          <label className="mb-1 block text-xs font-semibold text-slate-700">Category</label>
          <select
            value={form.type}
            onChange={(e) => update('type', e.target.value)}
            className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
          >
            <option value="hotel">Hotel & Stay</option>
            <option value="flight">Flight</option>
            <option value="transport">Transport / Rental</option>
            <option value="activity">Activity / Tour</option>
          </select>
        </div>
        <div>
          <label className="mb-1 block text-xs font-semibold text-slate-700">Cost (₹)</label>
          <input
            type="number"
            required
            min={0}
            placeholder="e.g. 15000"
            value={form.amount}
            onChange={(e) => update('amount', e.target.value)}
            className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
          />
        </div>
        <div>
          <label className="mb-1 block text-xs font-semibold text-slate-700">Reservation Date</label>
          <input
            type="date"
            value={form.booking_date}
            onChange={(e) => update('booking_date', e.target.value)}
            className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
          />
        </div>
      </div>

      <div>
        <label className="mb-1 block text-xs font-semibold text-slate-700">Booking Title</label>
        <input
          required
          value={form.title}
          onChange={(e) => update('title', e.target.value)}
          placeholder="e.g. Taj Fort Aguada Beach Resort"
          className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
        />
      </div>

      <div>
        <label className="mb-1 block text-xs font-semibold text-slate-700">Notes / Details (Optional)</label>
        <input
          value={form.description}
          onChange={(e) => update('description', e.target.value)}
          placeholder="e.g. 2 Deluxe Sea View Rooms for 5 nights"
          className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
        />
      </div>

      <div className="flex gap-2">
        <button
          disabled={loading}
          className="rounded-lg bg-blue-600 px-5 py-2 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-60"
        >
          {loading ? 'Adding…' : 'Save Booking'}
        </button>
        <button
          type="button"
          onClick={() => setOpen(false)}
          className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
