import { useState } from 'react';
import { tripService } from '../../services/tripService';
import ErrorMessage from '../Common/ErrorMessage';

export default function CreateTrip({ onCreated }) {
  const [form, setForm] = useState({
    title: '',
    description: '',
    destination: '',
    start_date: '',
    end_date: '',
    max_members: 10,
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
      const trip = await tripService.create(form);
      onCreated?.(trip);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <ErrorMessage message={error} />
      <div>
        <label className="mb-1 block text-sm font-medium text-slate-700">Title</label>
        <input
          required
          value={form.title}
          onChange={(e) => update('title', e.target.value)}
          placeholder="Goa Beach Trip"
          className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
        />
      </div>
      <div>
        <label className="mb-1 block text-sm font-medium text-slate-700">Destination</label>
        <input
          required
          value={form.destination}
          onChange={(e) => update('destination', e.target.value)}
          placeholder="Goa, India"
          className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
        />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700">Start date</label>
          <input
            type="date"
            required
            value={form.start_date}
            onChange={(e) => update('start_date', e.target.value)}
            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
          />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700">End date</label>
          <input
            type="date"
            required
            value={form.end_date}
            onChange={(e) => update('end_date', e.target.value)}
            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
          />
        </div>
      </div>
      <div>
        <label className="mb-1 block text-sm font-medium text-slate-700">Max members</label>
        <input
          type="number"
          min={2}
          value={form.max_members}
          onChange={(e) => update('max_members', Number(e.target.value))}
          className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
        />
      </div>
      <div>
        <label className="mb-1 block text-sm font-medium text-slate-700">Description</label>
        <textarea
          rows={3}
          value={form.description}
          onChange={(e) => update('description', e.target.value)}
          className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
        />
      </div>
      <button
        disabled={loading}
        className="w-full rounded-lg bg-blue-600 py-2 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-60"
      >
        {loading ? 'Creating…' : 'Create trip'}
      </button>
    </form>
  );
}
