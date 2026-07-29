export default function Dashboard({ stats }) {
  const cards = [
    { label: 'Total Users', value: stats?.totalUsers ?? '—' },
    { label: 'Total Trips', value: stats?.totalTrips ?? '—' },
    { label: 'Total Bookings', value: stats?.totalBookings ?? '—' },
    { label: 'Revenue', value: stats?.revenue != null ? `₹${Number(stats.revenue).toLocaleString('en-IN')}` : '—' },
  ];

  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
      {cards.map((c) => (
        <div key={c.label} className="rounded-xl border border-slate-200 bg-white p-4 text-center">
          <p className="text-2xl font-bold text-slate-900">{c.value}</p>
          <p className="mt-1 text-xs text-slate-500">{c.label}</p>
        </div>
      ))}
    </div>
  );
}
