import { useState } from 'react';
import { FiSearch, FiFilter, FiX, FiCalendar, FiMapPin } from 'react-icons/fi';

const CATEGORIES = ['Tech', 'Cultural', 'Sports', 'Academic', 'Workshop', 'Other'];

const EventFilters = ({ onFilter }) => {
  const [search,   setSearch]   = useState('');
  const [category, setCategory] = useState('');
  const [date,     setDate]     = useState('');
  const [location, setLocation] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    onFilter({ search, category, date, location });
  };

  const handleReset = () => {
    setSearch(''); setCategory(''); setDate(''); setLocation('');
    onFilter({});
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col lg:flex-row gap-4 items-stretch lg:items-center"
    >
      {/* Search Input Group */}
      <div className="flex-1 relative group">
        <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-purple-500 transition-colors" />
        <input
          type="text"
          placeholder="What are you looking for?"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full bg-slate-50 border-none rounded-2xl pl-12 pr-4 py-4 text-slate-700 placeholder:text-slate-400 focus:ring-2 focus:ring-purple-500 transition-all outline-none font-medium"
        />
      </div>

      <div className="flex flex-wrap md:flex-nowrap gap-3 flex-[1.5]">
        {/* Category Select */}
        <div className="relative flex-1">
          <FiFilter className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full bg-slate-50 border-none rounded-2xl pl-12 pr-4 py-4 text-slate-700 focus:ring-2 focus:ring-purple-500 transition-all outline-none font-medium appearance-none"
          >
            <option value="">Category</option>
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>

        {/* Date Input */}
        <div className="relative flex-1">
          <FiCalendar className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="w-full bg-slate-50 border-none rounded-2xl pl-12 pr-4 py-4 text-slate-700 focus:ring-2 focus:ring-purple-500 transition-all outline-none font-medium"
          />
        </div>

        {/* Location Input */}
        <div className="relative flex-1">
          <FiMapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
          <input
            type="text"
            placeholder="Location"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className="w-full bg-slate-50 border-none rounded-2xl pl-12 pr-4 py-4 text-slate-700 focus:ring-2 focus:ring-purple-500 transition-all outline-none font-medium"
          />
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-2">
        <button
          type="submit"
          className="btn-primary flex items-center justify-center gap-2 flex-1 lg:flex-none whitespace-nowrap"
        >
          Find Events
        </button>
        <button
          type="button"
          onClick={handleReset}
          className="w-12 h-12 flex items-center justify-center bg-slate-100 text-slate-500 rounded-2xl hover:bg-rose-50 hover:text-rose-600 transition-all active:scale-90"
          title="Reset Filters"
        >
          <FiX size={20} />
        </button>
      </div>
    </form>
  );
};

export default EventFilters;
