import { useState, useEffect } from 'react';

const CATEGORIES = ['Tech', 'Cultural', 'Sports', 'Academic', 'Workshop', 'Other'];

const EventForm = ({ initialData = {}, onSubmit, loading }) => {
  const [form, setForm] = useState({
    title:       '',
    description: '',
    category:    'Tech',
    date:        '',
    location:    '',
    ...initialData,
  });

  useEffect(() => {
    if (initialData && initialData._id) {
      setForm({
        title:       initialData.title       || '',
        description: initialData.description || '',
        category:    initialData.category    || 'Tech',
        date:        initialData.date ? initialData.date.slice(0, 10) : '',
        location:    initialData.location    || '',
      });
    }
  }, [initialData?._id]);

  const handleChange = (e) =>
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(form);
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-1">Event Title *</label>
        <input
          name="title"
          value={form.title}
          onChange={handleChange}
          required
          placeholder="e.g. Tech Fest 2025"
          className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-400"
        />
      </div>

      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-1">Description *</label>
        <textarea
          name="description"
          value={form.description}
          onChange={handleChange}
          required
          rows={4}
          placeholder="Describe your event..."
          className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all outline-none font-medium"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">Category *</label>
          <select
            name="category"
            value={form.category}
            onChange={handleChange}
            className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-400"
          >
            {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">Date *</label>
          <input
            type="date"
            name="date"
            value={form.date}
            onChange={handleChange}
            required
            className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-400"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-1">Location *</label>
        <input
          name="location"
          value={form.location}
          onChange={handleChange}
          required
          placeholder="e.g. Auditorium, Block A"
          className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-400"
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="bg-purple-600 text-white font-semibold py-2.5 rounded-lg hover:bg-purple-700 transition disabled:opacity-60"
      >
        {loading ? 'Saving...' : 'Save Event'}
      </button>
    </form>
  );
};

export default EventForm;
