import { bookingService } from '../../services/bookingService';

const typeBadgeStyles = {
  hotel: { label: 'Hotel & Stay', style: 'bg-purple-50 text-purple-700 border-purple-200' },
  flight: { label: 'Flight', style: 'bg-blue-50 text-blue-700 border-blue-200' },
  transport: { label: 'Transport', style: 'bg-amber-50 text-amber-700 border-amber-200' },
  activity: { label: 'Activity', style: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
};

const statusBadgeStyles = {
  pending: 'bg-amber-100 text-amber-800 border-amber-200',
  confirmed: 'bg-emerald-100 text-emerald-800 border-emerald-200',
  cancelled: 'bg-red-100 text-red-800 border-red-200 line-through',
};

function formatDate(dateStr) {
  if (!dateStr) return null;
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return dateStr;
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

export default function BookingCard({ booking, canManage, onChanged, onSplitAsExpense }) {
  const typeConfig = typeBadgeStyles[booking.type] || { label: booking.type, style: 'bg-slate-50 text-slate-700 border-slate-200' };

  async function handleCancel() {
    if (!confirm(`Cancel booking "${booking.title}"?`)) return;
    await bookingService.cancel(booking.id);
    onChanged?.();
  }

  return (
    <div className={`rounded-xl border border-slate-200 bg-white p-4 shadow-sm transition hover:shadow-md ${booking.status === 'cancelled' ? 'opacity-60 bg-slate-50' : ''}`}>
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-3">
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="font-bold text-slate-900">{booking.title}</h3>
              <span className={`inline-flex items-center gap-1 rounded-md border px-2 py-0.5 text-xs font-semibold ${typeConfig.style}`}>
                {typeConfig.label}
              </span>
            </div>
            {booking.description && (
              <p className="mt-1 text-xs text-slate-600 leading-relaxed">{booking.description}</p>
            )}
            <div className="mt-2 flex flex-wrap items-center gap-3 text-xs text-slate-500">
              <span>Booked by <strong className="font-semibold text-slate-700">{booking.booked_by_name || `User #${booking.user_id}`}</strong></span>
              {booking.booking_date && (
                <span>Date: {formatDate(booking.booking_date)}</span>
              )}
            </div>
          </div>
        </div>

        <div className="flex flex-col items-end gap-2 text-right">
          <p className="text-base font-extrabold text-slate-900">
            ₹{Number(booking.amount).toLocaleString('en-IN')}
          </p>
          <div className="flex items-center gap-2">
            <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold ${statusBadgeStyles[booking.status] || 'bg-slate-100 text-slate-700'}`}>
              {booking.status}
            </span>
            {onSplitAsExpense && booking.status !== 'cancelled' && (
              <button
                onClick={() => onSplitAsExpense(booking)}
                className="rounded-md border border-blue-200 bg-blue-50 px-2 py-0.5 text-xs font-semibold text-blue-600 hover:bg-blue-100 transition"
                title="Convert this reservation into a shared group expense"
              >
                Split as Expense
              </button>
            )}
            {canManage && booking.status !== 'cancelled' && (
              <button
                onClick={handleCancel}
                className="text-xs font-medium text-red-500 hover:text-red-700 hover:underline ml-1"
              >
                Cancel
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
