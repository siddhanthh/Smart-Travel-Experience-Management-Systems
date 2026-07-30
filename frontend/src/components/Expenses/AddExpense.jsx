import { useState, useEffect } from 'react';
import { expenseService } from '../../services/expenseService';
import ErrorMessage from '../Common/ErrorMessage';

export default function AddExpense({ tripId, members = [], onAdded, prefill, onClearPrefill }) {
  const [title, setTitle] = useState(prefill?.title || '');
  const [amount, setAmount] = useState(prefill?.amount || '');
  const [splitAmong, setSplitAmong] = useState(members.map((m) => m.user_id));
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (prefill) {
      if (prefill.title) setTitle(prefill.title);
      if (prefill.amount) setAmount(prefill.amount);
    }
  }, [prefill]);

  function toggleMember(id) {
    setSplitAmong((prev) => (prev.includes(id) ? prev.filter((m) => m !== id) : [...prev, id]));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const expense = await expenseService.add({
        trip_id: Number(tripId),
        title,
        amount: Number(amount),
        split_among: splitAmong,
      });
      setTitle('');
      setAmount('');
      onClearPrefill?.();
      onAdded?.(expense);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3 rounded-xl border border-slate-200 bg-white p-4">
      <ErrorMessage message={error} />
      <div>
        <label className="mb-1 block text-sm font-medium text-slate-700">What was it for?</label>
        <input
          required
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Dinner at Beach Shack"
          className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
        />
      </div>
      <div>
        <label className="mb-1 block text-sm font-medium text-slate-700">Amount (₹)</label>
        <input
          type="number"
          required
          min={0}
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
        />
      </div>
      {members.length > 0 && (
        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700">Split among</label>
          <div className="flex flex-wrap gap-2">
            {members.map((m) => (
              <label
                key={m.user_id}
                className={`cursor-pointer rounded-full border px-3 py-1 text-xs ${
                  splitAmong.includes(m.user_id)
                    ? 'border-blue-500 bg-blue-50 text-blue-700'
                    : 'border-slate-300 text-slate-600'
                }`}
              >
                <input
                  type="checkbox"
                  className="hidden"
                  checked={splitAmong.includes(m.user_id)}
                  onChange={() => toggleMember(m.user_id)}
                />
                {m.name || `User #${m.user_id}`}
              </label>
            ))}
          </div>
        </div>
      )}
      <button
        disabled={loading}
        className="w-full rounded-lg bg-blue-600 py-2 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-60"
      >
        {loading ? 'Adding…' : 'Add expense'}
      </button>
    </form>
  );
}
