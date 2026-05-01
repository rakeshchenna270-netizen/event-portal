import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchEvent, rsvpEvent, cancelRSVP, toggleLikeEvent } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';
import { FiCalendar, FiMapPin, FiTag, FiUser, FiArrowLeft, FiHeart, FiShare2, FiCheckCircle } from 'react-icons/fi';
import { FaHeart } from 'react-icons/fa';

const EventDetail = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [event,      setEvent]      = useState(null);
  const [registered, setRegistered] = useState(false);
  const [loading,    setLoading]    = useState(true);
  const [rsvpLoading, setRsvpLoading] = useState(false);
  const [likes, setLikes] = useState([]);
  const [isLiking, setIsLiking] = useState(false);

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    toast.success('Event link copied to clipboard!');
  };

  useEffect(() => {
    const load = async () => {
      try {
        const { data } = await fetchEvent(id);
        setEvent(data);
        setLikes(data.likes || []);

        if (user && data.attendees) {
          setRegistered(data.attendees.includes(user._id));
        }
      } catch {
        toast.error('Event not found');
        navigate('/');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id, user, navigate]);

  const handleRSVP = async () => {
    if (!user) return navigate('/login');
    setRsvpLoading(true);
    try {
      await rsvpEvent(id);
      setRegistered(true);
      toast.success('Successfully registered! 🎉');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to register');
    } finally {
      setRsvpLoading(false);
    }
  };

  const handleCancel = async () => {
    setRsvpLoading(true);
    try {
      await cancelRSVP(id);
      setRegistered(false);
      toast.info('Registration cancelled');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to cancel');
    } finally {
      setRsvpLoading(false);
    }
  };

  const handleLike = async () => {
    if (!user) return navigate('/login');
    setIsLiking(true);
    try {
      const { data } = await toggleLikeEvent(id);
      setLikes(data.likes);
    } catch (err) {
      toast.error('Failed to like event');
    } finally {
      setIsLiking(false);
    }
  };

  if (loading)
    return (
      <div className="section-container animate-pulse">
        <div className="h-10 w-32 bg-slate-200 rounded-lg mb-8" />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          <div className="lg:col-span-2 space-y-6">
             <div className="h-64 bg-slate-200 rounded-3xl" />
             <div className="h-10 w-2/3 bg-slate-200 rounded-lg" />
             <div className="h-32 bg-slate-200 rounded-2xl" />
          </div>
          <div className="h-80 bg-slate-200 rounded-3xl" />
        </div>
      </div>
    );

  if (!event) return null;

  const dateStr = new Date(event.date).toLocaleDateString('en-US', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
  });

  const isLiked = user && likes.includes(user._id);

  return (
    <div className="bg-slate-50 min-h-screen pb-20">
      {/* Header / Hero Area */}
      <div className="bg-white border-b border-slate-200">
        <div className="section-container !py-8">
           <button
            onClick={() => navigate(-1)}
            className="group flex items-center gap-2 text-slate-500 font-bold text-sm mb-8 hover:text-purple-600 transition-colors"
          >
            <FiArrowLeft className="group-hover:-translate-x-1 transition-transform" /> Back to Discover
          </button>

          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div>
              <div className="flex items-center gap-3 mb-4">
                 <span className="px-3 py-1 bg-purple-50 text-purple-600 text-xs font-black uppercase tracking-widest rounded-full border border-purple-100">
                    {event.category}
                 </span>
                 <span className="text-slate-400 text-sm font-medium">• 5 min read</span>
              </div>
              <h1 className="text-4xl lg:text-5xl font-black text-slate-900 leading-tight mb-4">{event.title}</h1>
              <div className="flex items-center gap-6 text-slate-500">
                 <div className="flex items-center gap-2">
                    <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center border-2 border-white shadow-sm">
                       <FiUser className="text-slate-400" />
                    </div>
                    <span className="text-sm font-bold text-slate-700">Organized by {event.createdBy?.name || 'Admin'}</span>
                 </div>
              </div>
            </div>

            <div className="flex items-center gap-3">
               <button 
                onClick={handleLike}
                disabled={isLiking}
                className={`w-12 h-12 flex items-center justify-center rounded-2xl border transition-all ${isLiked ? 'bg-rose-50 border-rose-100 text-rose-500 shadow-lg shadow-rose-100' : 'bg-white border-slate-200 text-slate-400 hover:border-rose-200 hover:text-rose-400'}`}
               >
                 {isLiked ? <FaHeart size={20} /> : <FiHeart size={20} />}
               </button>
                <button 
                  onClick={handleShare}
                  className="w-12 h-12 flex items-center justify-center rounded-2xl border border-slate-200 bg-white text-slate-400 hover:bg-slate-50 transition-all"
                  title="Share Event"
                >
                  <FiShare2 size={20} />
                </button>
            </div>
          </div>
        </div>
      </div>

      <div className="section-container">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 mt-4">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-12">
            <div className="aspect-video w-full rounded-[2.5rem] bg-gradient-to-br from-purple-500 to-blue-600 shadow-2xl shadow-purple-100 relative overflow-hidden group">
               <div className="absolute inset-0 flex items-center justify-center text-white/20">
                  <FiCalendar size={120} className="rotate-12 group-hover:scale-110 transition-transform duration-700" />
               </div>
            </div>

            <div className="bg-white rounded-[2rem] p-10 border border-slate-100 shadow-sm">
               <h2 className="text-2xl font-bold text-slate-900 mb-6">About the Event</h2>
               <div className="prose prose-slate max-w-none text-slate-600 leading-relaxed whitespace-pre-wrap font-medium">
                  {event.description}
               </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            <div className="bg-white rounded-[2rem] p-8 border border-slate-100 shadow-xl shadow-slate-200/50 sticky top-28">
               <div className="space-y-6 mb-8">
                  <div className="flex items-start gap-4">
                     <div className="w-12 h-12 rounded-2xl bg-teal-50 flex items-center justify-center text-teal-600 shrink-0">
                        <FiCalendar size={20} />
                     </div>
                     <div>
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Date & Time</p>
                        <p className="text-slate-900 font-bold">{dateStr}</p>
                     </div>
                  </div>

                  <div className="flex items-start gap-4">
                     <div className="w-12 h-12 rounded-2xl bg-teal-50 flex items-center justify-center text-teal-600 shrink-0">
                        <FiMapPin size={20} />
                     </div>
                     <div>
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Location</p>
                        <p className="text-slate-900 font-bold">{event.location}</p>
                     </div>
                  </div>

                  <div className="flex items-start gap-4">
                     <div className="w-12 h-12 rounded-2xl bg-teal-50 flex items-center justify-center text-teal-600 shrink-0">
                        <FiUser size={20} />
                     </div>
                     <div>
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Capacity</p>
                        <p className="text-slate-900 font-bold">Open for all</p>
                     </div>
                  </div>
               </div>

               <div className="pt-8 border-t border-slate-50">
                  {registered ? (
                    <div className="space-y-4">
                      <div className="flex items-center gap-3 px-4 py-4 bg-emerald-50 text-emerald-700 rounded-2xl border border-emerald-100">
                        <FiCheckCircle size={20} className="shrink-0" />
                        <span className="font-bold text-sm">You are registered for this event!</span>
                      </div>
                      {user?.role !== 'admin' && (
                        <button
                          onClick={handleCancel}
                          disabled={rsvpLoading}
                          className="w-full py-4 text-rose-600 font-bold text-sm hover:bg-rose-50 rounded-2xl transition-colors"
                        >
                          {rsvpLoading ? 'Processing...' : 'Cancel Registration'}
                        </button>
                      )}
                    </div>
                  ) : (
                    user?.role !== 'admin' ? (
                      <button
                        onClick={handleRSVP}
                        disabled={rsvpLoading}
                        className="btn-primary w-full py-4 text-lg shadow-purple-200"
                      >
                        {rsvpLoading ? 'Registering...' : 'Secure My Spot'}
                      </button>
                    ) : (
                      <div className="text-center p-4 bg-slate-50 rounded-2xl text-slate-500 text-sm font-medium">
                        Admins cannot register for events
                      </div>
                    )
                  )}
                  
                  {!user && (
                    <button
                      onClick={() => navigate('/login')}
                      className="btn-primary w-full py-4 text-lg"
                    >
                      Sign in to Register
                    </button>
                  )}
               </div>
            </div>

            {/* Attendees mini widget could go here */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventDetail;
