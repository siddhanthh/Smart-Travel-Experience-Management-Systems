export default function ExpenseCard({ expense }) {
  const payerName = expense.paid_by_name || expense.paidByName || `User #${expense.paid_by}`;

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm transition hover:shadow-md">
      <div className="flex items-start justify-between">
        <div>
          <h3 className="font-semibold text-slate-900">{expense.title}</h3>
          <p className="mt-0.5 text-xs text-slate-500">
            Paid by <span className="font-medium text-slate-700">{payerName}</span>
          </p>
        </div>
        <div className="text-right">
          <p className="text-base font-bold text-slate-900">₹{Number(expense.amount).toLocaleString('en-IN')}</p>
          <span className="text-[11px] text-slate-400">Total expense</span>
        </div>
      </div>

      {expense.splits?.length > 0 && (
        <div className="mt-3 border-t border-slate-100 pt-3">
          <p className="mb-1.5 text-xs font-semibold text-slate-500">Split Breakdown:</p>
          <div className="flex flex-wrap gap-2 text-xs">
            {expense.splits.map((s) => (
              <span
                key={s.id || s.user_id}
                className="inline-flex items-center gap-1 rounded-md bg-slate-50 px-2 py-1 font-semibold text-slate-600 border border-slate-200"
              >
                {s.user_name || s.userName || `User #${s.user_id}`}: ₹{Number(s.amount).toLocaleString('en-IN')}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
