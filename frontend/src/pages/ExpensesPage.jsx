import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { expenseService } from '../services/expenseService';
import { tripService } from '../services/tripService';
import { useAuth } from '../hooks/useAuth';
import ExpenseCard from '../components/Expenses/ExpenseCard';
import AddExpense from '../components/Expenses/AddExpense';
import SettleUp from '../components/Expenses/SettleUp';
import LoadingSpinner from '../components/Common/LoadingSpinner';
import ErrorMessage from '../components/Common/ErrorMessage';

export default function ExpensesPage() {
  const { id: tripId } = useParams();
  const { user } = useAuth();
  const [expenses, setExpenses] = useState([]);
  const [balances, setBalances] = useState([]);
  const [members, setMembers] = useState([]);
  const [trip, setTrip] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showSettle, setShowSettle] = useState(false);

  function load() {
    setLoading(true);
    Promise.all([
      expenseService.listForTrip(tripId),
      expenseService.getBalances(tripId),
      tripService.members(tripId),
      tripService.getById(tripId),
    ])
      .then(([expenseData, balanceData, memberData, tripData]) => {
        const rawExpenses = expenseData.data ?? expenseData.expenses ?? expenseData;
        const rawBalances = balanceData.data ?? balanceData.balances ?? balanceData;
        const rawMembers = memberData.data ?? memberData.members ?? memberData;
        setExpenses(Array.isArray(rawExpenses) ? rawExpenses : []);
        setBalances(Array.isArray(rawBalances) ? rawBalances : []);
        setMembers(Array.isArray(rawMembers) ? rawMembers : []);
        setTrip(tripData.data ?? tripData.trip ?? tripData);
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }

  useEffect(load, [tripId]);

  const myBalance = balances.filter((b) => b.from === user?.id || b.to === user?.id);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-slate-900">
          Expenses {trip && <span className="text-base font-normal text-slate-500">· {trip.title}</span>}
        </h1>
        <button
          onClick={() => setShowSettle(true)}
          className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
        >
          Settle up
        </button>
      </div>

      <ErrorMessage message={error} />

      {myBalance.length > 0 && (
        <div className="rounded-xl border border-slate-200 bg-white p-4">
          <h2 className="mb-2 text-sm font-semibold text-slate-900">Your balance</h2>
          <ul className="space-y-1 text-sm">
            {myBalance.map((b, i) => (
              <li key={i} className={b.from === user?.id ? 'text-red-600' : 'text-green-600'}>
                {b.from === user?.id
                  ? `You owe ${b.toName || `User #${b.to}`} ₹${b.amount}`
                  : `${b.fromName || `User #${b.from}`} owes you ₹${b.amount}`}
              </li>
            ))}
          </ul>
        </div>
      )}

      <AddExpense tripId={tripId} members={members} onAdded={load} />

      {loading ? (
        <LoadingSpinner />
      ) : (
        <div className="space-y-2">
          {expenses.length === 0 && (
            <p className="py-6 text-center text-sm text-slate-500">No expenses logged yet.</p>
          )}
          {expenses.map((e) => (
            <ExpenseCard key={e.id} expense={e} />
          ))}
        </div>
      )}

      <SettleUp
        open={showSettle}
        onClose={() => setShowSettle(false)}
        tripId={tripId}
        balances={balances}
        currentUserId={user?.id}
        onSettled={load}
      />
    </div>
  );
}
