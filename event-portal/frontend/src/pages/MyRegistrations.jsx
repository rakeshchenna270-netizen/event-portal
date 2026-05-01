import { useEffect, useState } from 'react';
import { getMyRegistrations, cancelRSVP } from '../services/api';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { FiCalendar, FiMapPin, FiTag, FiX, FiArrowRight } from 'react-icons/fi';

const categoryColors = {
  Tech:      'bg-blue-50 text-blue-600',
  Cultural:  'bg-rose-50 text-rose-600',
  Sports:    'bg-emerald-50 text-emerald-600',
  Academic:  'bg-amber-50 text-amber-600',
  Workshop:  'bg-violet-50 text-violet-600',
  Other:     'bg-slate-50 text-slate-600',
};

const MyRegistrations = () => {
  const [registrations, setRegistrations] = useState([]);
  const [loading,       setLoading]       = useState(true);

  const load = async () => {
    try {
      const { data } = await getMyRegistrations();
      setRegistrations(data);
    } catch {
      toast.error('Failed to load registrations');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const handleCancel = async (eventId) => {
    if (!window.confirm('Are you sure you want to cancel this registration?')) return;
    try {
      await cancelRSVP(eventId);
      toast.info('Registration cancelled');
      load();
    } catch {
      toast.error('Failed to cancel');
    }
  };

  return (
    <div className="section-container min-h-screen">
      <div className="mb-12 animate-fade-up">
        <h1 className="text-4xl font-black text-slate-900 mb-2">My RSVPs</h1>
        <p className="text-slate-500 font-medium">Keep track of all the events you're attending</p>
      </div>

      {loading ? (
        <div className="space-y-6">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="bg-white rounded-[2rem] p-8 h-32 animate-pulse border border-slate-100" />
          ))}
        </div>
      ) : registrations.length === 0 ? (
        <div className="text-center py-24 glass-card rounded-[3rem] animate-fade-up">
          <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-6 text-4xl">
            📋
          </div>
          <h2 className="text-2xl font-bold text-slate-900 mb-2">No registrations yet</h2>
          <p className="text-slate-500 mb-8 max-w-xs mx-auto">You haven't signed up for any events. Start exploring the latest happenings!</p>
          <Link to="/" className="btn-primary inline-flex items-center gap-2">
            Explore Events <FiArrowRight />
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6">
          {registrations.map((event, index) => {
            const dateStr = new Date(event.date).toLocaleDateString('en-US', {
              weekday: 'short', year: 'numeric', month: 'short', day: 'numeric',
            });
            return (
              <div
                key={event._id}
                className="group bg-white rounded-[2rem] p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 border border-slate-100 shadow-sm hover:shadow-xl hover:shadow-slate-200/50 transition-all duration-300 animate-fade-up"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="flex flex-col gap-3">
                  <span className={`text-[10px] font-black px-3 py-1 rounded-full w-fit uppercase tracking-widest ${categoryColors[event.category] || categoryColors.Other}`}>
                    {event.category}
                  </span>
                  <Link
                    to={`/events/${event._id}`}
                    className="text-2xl font-black text-slate-900 hover:text-purple-600 transition-colors"
                  >
                    {event.title}
                  </Link>
                  <div className="flex flex-wrap gap-6 text-sm font-semibold text-slate-500">
                    <span className="flex items-center gap-2">
                      <FiCalendar size={16} className="text-purple-400" />{dateStr}
                    </span>
                    <span className="flex items-center gap-2">
                      <FiMapPin size={16} className="text-purple-400" />{event.location}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-4 w-full md:w-auto">
                   <Link 
                    to={`/events/${event._id}`}
                    className="flex-1 md:flex-none btn-secondary text-center"
                   >
                     View Details
                   </Link>
                   <button
                    onClick={() => handleCancel(event._id)}
                    className="w-12 h-12 flex items-center justify-center text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-2xl transition-all"
                    title="Cancel Registration"
                  >
                    <FiX size={20} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default MyRegistrations;
