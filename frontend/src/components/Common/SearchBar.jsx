import { useState } from 'react';

export default function SearchBar({ placeholder = 'Search…', onSearch }) {
  const [value, setValue] = useState('');

  function handleSubmit(e) {
    e.preventDefault();
    onSearch(value.trim());
  }

  return (
    <form onSubmit={handleSubmit} className="flex gap-2">
      <input
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder={placeholder}
        className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
      />
      <button
        type="submit"
        className="shrink-0 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
      >
        Search
      </button>
    </form>
  );
}
