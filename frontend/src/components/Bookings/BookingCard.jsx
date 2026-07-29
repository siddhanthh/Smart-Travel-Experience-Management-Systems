import { bookingService } from '../../services/bookingService';

const typeIcons = { hotel: '🏨', flight: '✈️', transport: '🚗', activity: '🎟️' };
const statusColors = {
  pending: 'bg-amber-100 text-amber-700',
  confirmed: 'bg-green-100 text-green-700',
  cancelled: 'bg-red-100 text-red-700',
};

export default function BookingCard({ booking, canManage, onChanged }) {
  async function handleCancel() {
    if (!confirm('Cancel this booking?')) return;
    await bookingService.cancel(booking.id);
    onChanged?.();
  }

  return (
    <div className="flex items-center justify-between rounded-xl border border-slate-200 bg-white p-4">
      <div>
        <p className="font-medium text-slate-900">
          {typeIcons[booking.type]} {booking.title}
        </p>
        <p className="text-xs text-slate-500">
          {booking.type} · ₹{Number(booking.amount).toLocaleString('en-IN')}
          {booking.booking_date && ` · ${booking.booking_date}`}
        </p>
      </div>
      <div className="flex items-center gap-3">
        <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${statusColors[booking.status]}`}>
          {booking.status}
        </span>
        {canManage && booking.status !== 'cancelled' && (
          <button onClick={handleCancel} className="text-xs text-red-500 hover:underline">
            Cancel
          </button>
        )}
      </div>
    </div>
  );
}
