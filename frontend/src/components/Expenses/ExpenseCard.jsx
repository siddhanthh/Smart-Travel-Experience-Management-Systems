export default function ExpenseCard({ expense }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4">
      <div className="flex items-center justify-between">
        <p className="font-medium text-slate-900">{expense.title}</p>
        <p className="font-semibold text-slate-900">₹{Number(expense.amount).toLocaleString('en-IN')}</p>
      </div>
      <p className="mt-1 text-xs text-slate-500">
        Paid by {expense.paidByName || `User #${expense.paid_by}`}
      </p>
      {expense.splits?.length > 0 && (
        <ul className="mt-2 space-y-1 text-xs text-slate-500">
          {expense.splits.map((s) => (
            <li key={s.id}>
              {s.userName || `User #${s.user_id}`} owes ₹{Number(s.amount).toLocaleString('en-IN')}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
