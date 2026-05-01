import { useEffect, useState } from 'react';
import { fetchEvents } from '../services/api';
import EventCard from '../components/EventCard';
import EventFilters from '../components/EventFilters';
import { toast } from 'react-toastify';
import { FiSearch, FiArrowRight } from 'react-icons/fi';

const Home = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadEvents = async (filters = {}) => {
    setLoading(true);
    try {
      const { data } = await fetchEvents(filters);
      setEvents(data);
    } catch (err) {
      toast.error('Failed to load events');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadEvents();
  }, []);

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-white pt-16 pb-20 lg:pt-24 lg:pb-32">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full -z-10">
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-purple-50 rounded-full blur-3xl opacity-60 translate-x-1/2 -translate-y-1/2" />
          <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-rose-50 rounded-full blur-3xl opacity-60 -translate-x-1/2 translate-y-1/2" />
        </div>

        <div className="section-container">
          <div className="text-center max-w-3xl mx-auto mb-16 animate-fade-up">
            <span className="inline-block px-4 py-1.5 mb-6 text-xs font-bold tracking-widest text-purple-600 uppercase bg-purple-50 rounded-full">
              Explore the latest events
            </span>
            <h1 className="text-5xl lg:text-7xl font-extrabold text-slate-900 mb-6 leading-[1.1]">
              Connecting People Through <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-blue-600">Events</span>
            </h1>
            <p className="text-lg text-slate-600 leading-relaxed">
              Discover and attend the most exciting events happening in your city. From tech meetups to art galleries, find your next experience here.
            </p>
          </div>

          {/* Integrated Filter/Search */}
          <div className="max-w-4xl mx-auto glass-card p-4 rounded-2xl mb-20 animate-fade-up" style={{ animationDelay: '0.1s' }}>
             <EventFilters onFilter={loadEvents} />
          </div>
        </div>
      </section>

      {/* Events Grid Section */}
      <section className="bg-slate-50 py-20">
        <div className="section-container">
          <div className="flex items-end justify-between mb-12">
            <div>
              <h2 className="text-3xl font-bold text-slate-900 mb-2">Upcoming Experiences</h2>
              <p className="text-slate-500">Handpicked events for you</p>
            </div>
            <div className="hidden md:block">
               <button className="flex items-center gap-2 text-purple-600 font-semibold hover:gap-3 transition-all">
                  View all events <FiArrowRight />
               </button>
            </div>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="bg-white rounded-3xl shadow-sm p-6 aspect-[4/5] animate-pulse">
                   <div className="w-full h-48 bg-slate-100 rounded-2xl mb-4" />
                   <div className="w-2/3 h-6 bg-slate-100 rounded-full mb-2" />
                   <div className="w-1/2 h-4 bg-slate-100 rounded-full" />
                </div>
              ))}
            </div>
          ) : events.length === 0 ? (
            <div className="text-center py-24 glass-card rounded-3xl">
              <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-6 text-4xl">
                📭
              </div>
              <h3 className="text-2xl font-bold text-slate-900 mb-2">No events found</h3>
              <p className="text-slate-500 mb-8 max-w-xs mx-auto">We couldn't find any events matching your criteria. Try adjusting your filters.</p>
              <button 
                onClick={() => loadEvents()}
                className="btn-secondary"
              >
                Clear all filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {events.map((event, index) => (
                <div key={event._id} className="animate-fade-up" style={{ animationDelay: `${index * 0.05}s` }}>
                  <EventCard event={event} />
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default Home;
