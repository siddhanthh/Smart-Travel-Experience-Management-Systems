import { useState } from 'react';
import { expenseService } from '../../services/expenseService';
import Modal from '../Common/Modal';
import ErrorMessage from '../Common/ErrorMessage';

export default function SettleUp({ open, onClose, tripId, balances = [], currentUserId, onSettled }) {
  const [payeeId, setPayeeId] = useState('');
  const [amount, setAmount] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // People the current user owes money to
  const owedTo = balances.filter((b) => b.from === currentUserId);

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await expenseService.settle({
        tripId,
        trip_id: tripId,
        payerId: currentUserId,
        payeeId: Number(payeeId),
        amount: Number(amount),
      });
      onSettled?.();
      onClose();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <Modal open={open} onClose={onClose} title="Settle up">
      <form onSubmit={handleSubmit} className="space-y-3">
        <ErrorMessage message={error} />
        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700">Pay to</label>
          <select
            required
            value={payeeId}
            onChange={(e) => setPayeeId(e.target.value)}
            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
          >
            <option value="">Select person</option>
            {owedTo.map((b) => (
              <option key={b.to} value={b.to}>
                {b.toName || `User #${b.to}`} (owe ₹{b.amount})
              </option>
            ))}
          </select>
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
        <button
          disabled={loading}
          className="w-full rounded-lg bg-blue-600 py-2 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-60"
        >
          {loading ? 'Settling…' : 'Confirm settlement'}
        </button>
      </form>
    </Modal>
  );
}
