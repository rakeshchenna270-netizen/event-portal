import { useEffect, useState } from 'react';
import {
  fetchEvents, createEvent, updateEvent, deleteEvent, getAttendees, removeAttendee,
} from '../services/api';
import EventForm from '../components/EventForm';
import { toast } from 'react-toastify';
import { FiEdit2, FiTrash2, FiUsers, FiPlus, FiX, FiCalendar, FiActivity, FiArchive } from 'react-icons/fi';

const AdminDashboard = () => {
  const [events,     setEvents]     = useState([]);
  const [loading,    setLoading]    = useState(true);
  const [formOpen,   setFormOpen]   = useState(false);
  const [editEvent,  setEditEvent]  = useState(null);
  const [saving,     setSaving]     = useState(false);
  const [attendees,  setAttendees]  = useState(null);
  const [attendeeEventId, setAttendeeEventId] = useState(null);
  const [attendeeEventTitle, setAttendeeEventTitle] = useState('');

  const load = async () => {
    try {
      const { data } = await fetchEvents();
      setEvents(data);
    } catch {
      toast.error('Failed to load events');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const openCreate = () => { setEditEvent(null); setFormOpen(true); };

  const openEdit = (event) => { setEditEvent(event); setFormOpen(true); };

  const closeForm = () => { setFormOpen(false); setEditEvent(null); };

  const handleSave = async (formData) => {
    setSaving(true);
    try {
      if (editEvent) {
        await updateEvent(editEvent._id, formData);
        toast.success('Event updated!');
      } else {
        await createEvent(formData);
        toast.success('Event created!');
      }
      closeForm();
      load();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id, title) => {
    if (!window.confirm(`Delete "${title}"?`)) return;
    try {
      await deleteEvent(id);
      toast.success('Event deleted');
      load();
    } catch {
      toast.error('Failed to delete');
    }
  };

  const handleViewAttendees = async (event) => {
    try {
      const { data } = await getAttendees(event._id);
      setAttendees(data);
      setAttendeeEventId(event._id);
      setAttendeeEventTitle(event.title);
    } catch {
      toast.error('Failed to load attendees');
    }
  };

  const handleRemoveAttendee = async (userId) => {
    if (!window.confirm('Remove this attendee?')) return;
    try {
      await removeAttendee(attendeeEventId, userId);
      toast.success('Attendee removed');
      const { data } = await getAttendees(attendeeEventId);
      setAttendees(data);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to remove attendee');
    }
  };

  return (
    <div className="section-container min-h-screen">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12 animate-fade-up">
        <div>
          <h1 className="text-4xl font-black text-slate-900 mb-2">Admin Portal</h1>
          <p className="text-slate-500 font-medium">Create, edit, and track your events</p>
        </div>
        <button
          onClick={openCreate}
          className="btn-primary flex items-center justify-center gap-2 py-4 px-8"
        >
          <FiPlus size={20} /> Create New Event
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12 animate-fade-up" style={{ animationDelay: '0.1s' }}>
        <div className="bg-purple-600 rounded-[2.5rem] p-8 text-white shadow-xl shadow-purple-100 flex items-center justify-between">
          <div>
            <p className="text-sm font-bold opacity-80 uppercase tracking-widest mb-1">Total Events</p>
            <p className="text-5xl font-black">{events.length}</p>
          </div>
          <div className="w-16 h-16 bg-white/20 rounded-3xl flex items-center justify-center">
            <FiActivity size={32} />
          </div>
        </div>
        
        <div className="bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-1">Upcoming</p>
            <p className="text-5xl font-black text-slate-900">
              {events.filter((e) => new Date(e.date) >= new Date()).length}
            </p>
          </div>
          <div className="w-16 h-16 bg-emerald-50 text-emerald-600 rounded-3xl flex items-center justify-center">
            <FiCalendar size={32} />
          </div>
        </div>

        <div className="bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-1">Past</p>
            <p className="text-5xl font-black text-slate-900">
              {events.filter((e) => new Date(e.date) < new Date()).length}
            </p>
          </div>
          <div className="w-16 h-16 bg-slate-50 text-slate-400 rounded-3xl flex items-center justify-center">
            <FiArchive size={32} />
          </div>
        </div>
      </div>

      {/* Events Table Container */}
      <div className="bg-white rounded-[2.5rem] shadow-xl shadow-slate-200/50 border border-slate-100 overflow-hidden animate-fade-up" style={{ animationDelay: '0.2s' }}>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-slate-50/50 border-b border-slate-100">
                <th className="px-8 py-6 text-left text-xs font-black text-slate-400 uppercase tracking-[0.2em]">Event Detail</th>
                <th className="px-8 py-6 text-left text-xs font-black text-slate-400 uppercase tracking-[0.2em]">Category</th>
                <th className="px-8 py-6 text-left text-xs font-black text-slate-400 uppercase tracking-[0.2em]">Schedule</th>
                <th className="px-8 py-6 text-center text-xs font-black text-slate-400 uppercase tracking-[0.2em]">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {loading ? (
                [...Array(4)].map((_, i) => (
                  <tr key={i} className="animate-pulse">
                    <td colSpan={4} className="px-8 py-10">
                      <div className="h-12 bg-slate-50 rounded-2xl w-full" />
                    </td>
                  </tr>
                ))
              ) : events.length === 0 ? (
                <tr>
                  <td colSpan={4} className="text-center py-24">
                    <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-300">
                       <FiActivity size={32} />
                    </div>
                    <p className="text-slate-400 font-bold">No events created yet.</p>
                  </td>
                </tr>
              ) : (
                events.map((ev) => (
                  <tr key={ev._id} className="group hover:bg-slate-50/50 transition-colors">
                    <td className="px-8 py-6">
                       <div>
                          <p className="text-lg font-bold text-slate-900 mb-0.5 group-hover:text-purple-600 transition-colors">{ev.title}</p>
                          <p className="text-sm text-slate-400 font-medium">{ev.location}</p>
                       </div>
                    </td>
                    <td className="px-8 py-6">
                       <span className="px-3 py-1 bg-slate-100 text-slate-600 text-[10px] font-black uppercase tracking-widest rounded-full">
                         {ev.category}
                       </span>
                    </td>
                    <td className="px-8 py-6">
                       <p className="text-sm font-bold text-slate-700">
                         {new Date(ev.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                       </p>
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={() => handleViewAttendees(ev)}
                          className="w-10 h-10 flex items-center justify-center text-purple-600 hover:bg-purple-50 rounded-xl transition-all"
                          title="View Attendees"
                        >
                          <FiUsers size={18} />
                        </button>
                        <button
                          onClick={() => openEdit(ev)}
                          className="w-10 h-10 flex items-center justify-center text-amber-500 hover:bg-amber-50 rounded-xl transition-all"
                          title="Edit"
                        >
                          <FiEdit2 size={18} />
                        </button>
                        <button
                          onClick={() => handleDelete(ev._id, ev.title)}
                          className="w-10 h-10 flex items-center justify-center text-rose-500 hover:bg-rose-50 rounded-xl transition-all"
                          title="Delete"
                        >
                          <FiTrash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modals with Glassmorphism Overlay */}
      {(formOpen || attendees !== null) && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center z-[100] px-6 py-12">
           <div className="animate-fade-up w-full max-w-2xl">
              {formOpen && (
                <div className="bg-white rounded-[2.5rem] shadow-2xl p-10 relative overflow-hidden">
                  <div className="absolute top-0 left-0 w-full h-2 bg-purple-600" />
                  <button onClick={closeForm} className="absolute top-6 right-6 p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-xl transition-all">
                    <FiX size={24} />
                  </button>
                  <h2 className="text-3xl font-black text-slate-900 mb-8">
                    {editEvent ? 'Edit Event' : 'Create New Event'}
                  </h2>
                  <EventForm
                    initialData={editEvent || {}}
                    onSubmit={handleSave}
                    loading={saving}
                  />
                </div>
              )}

              {attendees !== null && (
                <div className="bg-white rounded-[2.5rem] shadow-2xl p-10 relative overflow-hidden max-h-[85vh] flex flex-col">
                  <div className="absolute top-0 left-0 w-full h-2 bg-teal-600" />
                  <button onClick={() => setAttendees(null)} className="absolute top-6 right-6 p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-xl transition-all">
                    <FiX size={24} />
                  </button>
                  <div className="mb-8">
                    <h2 className="text-3xl font-black text-slate-900 mb-1">Attendees</h2>
                    <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">{attendeeEventTitle}</p>
                  </div>

                  <div className="flex-1 overflow-y-auto pr-2 space-y-4">
                    {attendees.length === 0 ? (
                      <div className="text-center py-12 bg-slate-50 rounded-3xl border border-dashed border-slate-200">
                         <FiUsers size={40} className="mx-auto text-slate-200 mb-4" />
                         <p className="text-slate-400 font-bold">No registrations yet</p>
                      </div>
                    ) : (
                      attendees.map((user, i) => (
                        <div key={user._id} className="flex items-center justify-between p-5 bg-slate-50 rounded-[1.5rem] border border-slate-100 group">
                          <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-white text-purple-600 rounded-2xl flex items-center justify-center font-black text-lg shadow-sm">
                              {i + 1}
                            </div>
                            <div>
                              <p className="font-bold text-slate-900">{user.name}</p>
                              <p className="text-sm text-slate-500 font-medium">{user.email}</p>
                            </div>
                          </div>
                          <button
                            onClick={() => handleRemoveAttendee(user._id)}
                            className="w-10 h-10 flex items-center justify-center text-slate-300 hover:text-rose-600 hover:bg-white rounded-xl transition-all"
                            title="Remove Attendee"
                          >
                            <FiX size={20} />
                          </button>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
           </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
