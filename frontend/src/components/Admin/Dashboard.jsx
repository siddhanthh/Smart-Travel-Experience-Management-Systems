export default function Dashboard({ stats }) {
  const cards = [
    {
      label: 'Registered Users',
      value: stats?.totalUsers ?? '—',
      color: 'border-l-4 border-blue-500',
      note: 'Active accounts on platform',
    },
    {
      label: 'Total Trips',
      value: stats?.totalTrips ?? '—',
      color: 'border-l-4 border-indigo-500',
      note: 'Excursions & expeditions',
    },
    {
      label: 'Total Reservations',
      value: stats?.totalBookings ?? '—',
      color: 'border-l-4 border-emerald-500',
      note: 'Hotels, flights & tours',
    },
    {
      label: 'Platform Volume',
      value: stats?.totalExpenseVolume != null ? `₹${Number(stats.totalExpenseVolume).toLocaleString('en-IN')}` : '—',
      color: 'border-l-4 border-amber-500',
      note: 'Total booking transaction value',
    },
  ];

  return (
    <div className="space-y-6">
      {/* System Status Banner */}
      <div className="flex flex-wrap items-center justify-between rounded-2xl border border-emerald-200 bg-emerald-50/50 p-4">
        <div className="flex items-center gap-3">
          <span className="flex h-3 w-3 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
          </span>
          <div>
            <p className="text-xs font-bold text-emerald-900 uppercase tracking-wide">System Operational</p>
            <p className="text-xs text-emerald-700">MySQL DB + MongoDB cluster online & healthy</p>
          </div>
        </div>
        <span className="text-xs font-semibold text-emerald-800 bg-emerald-100 px-3 py-1 rounded-full border border-emerald-200">
          STEMS Platform v1.2
        </span>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {cards.map((c) => (
          <div
            key={c.label}
            className={`rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:shadow-md ${c.color}`}
          >
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              {c.label}
            </span>
            <p className="mt-2 text-3xl font-extrabold text-slate-900">{c.value}</p>
            <p className="mt-1 text-xs text-slate-500">{c.note}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
