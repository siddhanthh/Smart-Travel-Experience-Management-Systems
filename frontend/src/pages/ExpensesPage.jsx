import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { expenseService } from '../services/expenseService';
import { bookingService } from '../services/bookingService';
import { tripService } from '../services/tripService';
import { useAuth } from '../hooks/useAuth';
import ExpenseCard from '../components/Expenses/ExpenseCard';
import AddExpense from '../components/Expenses/AddExpense';
import BookingCard from '../components/Bookings/BookingCard';
import CreateBooking from '../components/Bookings/CreateBooking';
import SettleUp from '../components/Expenses/SettleUp';
import LoadingSpinner from '../components/Common/LoadingSpinner';
import ErrorMessage from '../components/Common/ErrorMessage';

export default function ExpensesPage({ initialTab = 'expenses' }) {
  const { id: tripId } = useParams();
  const { user, isAdmin } = useAuth();
  const [expenses, setExpenses] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [balances, setBalances] = useState([]);
  const [members, setMembers] = useState([]);
  const [trip, setTrip] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showSettle, setShowSettle] = useState(false);
  const [activeTab, setActiveTab] = useState(initialTab); // 'expenses' | 'bookings' | 'overview'
  const [expensePrefill, setExpensePrefill] = useState(null);

  function load() {
    setLoading(true);
    Promise.all([
      expenseService.listForTrip(tripId),
      bookingService.listForTrip(tripId),
      expenseService.getBalances(tripId),
      tripService.members(tripId),
      tripService.getById(tripId),
    ])
      .then(([expenseData, bookingData, balanceData, memberData, tripData]) => {
        const rawExpenses = expenseData.data ?? expenseData.expenses ?? expenseData;
        const rawBookings = bookingData.data ?? bookingData.bookings ?? bookingData;
        const rawBalances = balanceData.data ?? balanceData.balances ?? balanceData;
        const rawMembers = memberData.data ?? memberData.members ?? memberData;
        setExpenses(Array.isArray(rawExpenses) ? rawExpenses : []);
        setBookings(Array.isArray(rawBookings) ? rawBookings : []);
        setBalances(Array.isArray(rawBalances) ? rawBalances : []);
        setMembers(Array.isArray(rawMembers) ? rawMembers : []);
        setTrip(tripData.data ?? tripData.trip ?? tripData);
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }

  useEffect(load, [tripId]);

  const myBalance = balances.filter((b) => b.from === user?.id || b.to === user?.id);
  const totalGroupExpenses = expenses.reduce((sum, e) => sum + Number(e.amount || 0), 0);
  const activeBookings = bookings.filter((b) => b.status !== 'cancelled');
  const totalBookingsCost = activeBookings.reduce((sum, b) => sum + Number(b.amount || 0), 0);

  function handleConvertBookingToExpense(booking) {
    setExpensePrefill({
      title: `${booking.title} (${booking.type})`,
      amount: booking.amount,
    });
    setActiveTab('expenses');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  return (
    <div className="space-y-4">
      <div>
        <Link to={`/trips/${tripId}`} className="inline-flex items-center gap-1 text-sm font-semibold text-blue-600 hover:underline">
          ← Back to {trip?.title || 'Trip'}
        </Link>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-2xl font-bold text-slate-900">
          Trip Finances & Reservations {trip && <span className="text-base font-normal text-slate-500">· {trip.title}</span>}
        </h1>
        <button
          onClick={() => setShowSettle(true)}
          className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-700 shadow-sm"
        >
          Settle up
        </button>
      </div>

      <ErrorMessage message={error} />

      {/* Financial Summary Cards */}
      <div className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">Total Group Expenses</p>
          <p className="mt-1 text-2xl font-extrabold text-slate-900">
            ₹{totalGroupExpenses.toLocaleString('en-IN')}
          </p>
          <p className="mt-1 text-xs text-slate-500">{expenses.length} split expense{expenses.length === 1 ? '' : 's'}</p>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">Total Reservations Cost</p>
          <p className="mt-1 text-2xl font-extrabold text-blue-600">
            ₹{totalBookingsCost.toLocaleString('en-IN')}
          </p>
          <p className="mt-1 text-xs text-slate-500">{activeBookings.length} active reservation{activeBookings.length === 1 ? '' : 's'}</p>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">Your Net Balance</p>
          {myBalance.length === 0 ? (
            <p className="mt-1 text-sm font-semibold text-emerald-600">You are all settled up.</p>
          ) : (
            <ul className="mt-1 space-y-1 text-xs font-medium">
              {myBalance.map((b, i) => (
                <li key={i} className={b.from === user?.id ? 'text-red-600 font-semibold' : 'text-emerald-600 font-semibold'}>
                  {b.from === user?.id
                    ? `You owe ${b.toName || `User #${b.to}`} ₹${Number(b.amount).toLocaleString('en-IN')}`
                    : `${b.fromName || `User #${b.from}`} owes you ₹${Number(b.amount).toLocaleString('en-IN')}`}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      {/* Sub-Navigation Hub Tabs */}
      <div className="flex border-b border-slate-200 text-sm font-medium">
        <button
          onClick={() => setActiveTab('expenses')}
          className={`border-b-2 px-4 py-2 transition ${
            activeTab === 'expenses'
              ? 'border-blue-600 font-bold text-blue-600'
              : 'border-transparent text-slate-500 hover:text-slate-700'
          }`}
        >
          Group Expenses ({expenses.length})
        </button>
        <button
          onClick={() => setActiveTab('bookings')}
          className={`border-b-2 px-4 py-2 transition ${
            activeTab === 'bookings'
              ? 'border-blue-600 font-bold text-blue-600'
              : 'border-transparent text-slate-500 hover:text-slate-700'
          }`}
        >
          Reservations & Bookings ({bookings.length})
        </button>
      </div>

      {/* TAB CONTENT 1: EXPENSES */}
      {activeTab === 'expenses' && (
        <div className="space-y-4">
          {expensePrefill && (
            <div className="flex items-center justify-between rounded-lg border border-blue-200 bg-blue-50 px-3 py-2 text-xs text-blue-800 font-medium">
              <span>Pre-filled from booking: <strong>{expensePrefill.title}</strong> (₹{expensePrefill.amount})</span>
              <button onClick={() => setExpensePrefill(null)} className="font-bold underline text-blue-600">Clear</button>
            </div>
          )}

          <AddExpense
            tripId={tripId}
            members={members}
            prefill={expensePrefill}
            onClearPrefill={() => setExpensePrefill(null)}
            onAdded={load}
          />

          {loading ? (
            <LoadingSpinner />
          ) : (
            <div className="space-y-3">
              {expenses.length === 0 && (
                <div className="rounded-xl border border-dashed border-slate-200 bg-white py-8 text-center text-sm text-slate-500">
                  No split expenses logged yet. Add one above or convert a booking!
                </div>
              )}
              {expenses.map((e) => (
                <ExpenseCard key={e.id} expense={e} />
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB CONTENT 2: BOOKINGS */}
      {activeTab === 'bookings' && (
        <div className="space-y-4">
          <CreateBooking tripId={tripId} onCreated={load} />

          {loading ? (
            <LoadingSpinner />
          ) : (
            <div className="space-y-3">
              {bookings.length === 0 && (
                <div className="rounded-xl border border-dashed border-slate-200 bg-white py-8 text-center text-sm text-slate-500">
                  No bookings found for this trip.
                </div>
              )}
              {bookings.map((b) => (
                <BookingCard
                  key={b.id}
                  booking={b}
                  canManage={isAdmin || b.user_id === user?.id}
                  onChanged={load}
                  onSplitAsExpense={handleConvertBookingToExpense}
                />
              ))}
            </div>
          )}
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
