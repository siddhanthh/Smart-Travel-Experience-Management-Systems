import { useState } from 'react';
import { searchService } from '../services/searchService';
import SearchBar from '../components/Common/SearchBar';
import TripList from '../components/Trips/TripList';
import LoadingSpinner from '../components/Common/LoadingSpinner';

export default function SearchPage() {
  const [mode, setMode] = useState('trips');
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);

  async function handleSearch(q) {
    if (!q) return setResults(null);
    setLoading(true);
    try {
      const data = mode === 'trips' ? await searchService.trips(q) : await searchService.users(q);
      setResults(data.results ?? data.trips ?? data.users ?? data);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold text-slate-900">Search</h1>
      <div className="flex gap-2">
        {['trips', 'users'].map((m) => (
          <button
            key={m}
            onClick={() => {
              setMode(m);
              setResults(null);
            }}
            className={`rounded-full px-3 py-1 text-sm font-medium capitalize ${
              mode === m ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-600'
            }`}
          >
            {m}
          </button>
        ))}
      </div>
      <SearchBar
        placeholder={mode === 'trips' ? 'Search by title or destination…' : 'Search by name or email…'}
        onSearch={handleSearch}
      />

      {loading && <LoadingSpinner />}

      {results && mode === 'trips' && <TripList trips={results} />}

      {results && mode === 'users' && (
        <ul className="divide-y divide-slate-100 rounded-xl border border-slate-200 bg-white">
          {results.length === 0 && (
            <li className="p-4 text-center text-sm text-slate-500">No users found.</li>
          )}
          {results.map((u) => (
            <li key={u.id} className="flex items-center justify-between p-4 text-sm">
              <span className="font-medium text-slate-900">{u.name}</span>
              <span className="text-slate-500">{u.email}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
