import { useState } from 'react';
import { Link } from 'react-router-dom';
import { FiCalendar, FiMapPin, FiTag, FiArrowRight } from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';

const categoryColors = {
  Tech:      'bg-blue-50 text-blue-600 border-blue-100',
  Cultural:  'bg-blue-50 text-blue-600 border-blue-100',
  Sports:    'bg-indigo-50 text-indigo-600 border-indigo-100',
  Academic:  'bg-pink-50 text-pink-600 border-pink-100',
  Workshop:  'bg-purple-50 text-purple-600 border-purple-100',
  Other:     'bg-slate-50 text-slate-600 border-slate-100',
};

const EventCard = ({ event }) => {
  const { user } = useAuth();
  
  const dateStr = new Date(event.date).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
  });

  const yearStr = new Date(event.date).getFullYear();

  return (
    <Link 
      to={`/events/${event._id}`}
      className="group block bg-white rounded-[2rem] p-4 border border-slate-100 shadow-sm hover:shadow-2xl hover:shadow-purple-100 transition-all duration-500 hover:-translate-y-2 overflow-hidden"
    >
      <div className="relative aspect-[16/10] rounded-[1.5rem] overflow-hidden mb-6">
        {/* Placeholder Gradient Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-purple-500 to-blue-600 opacity-90 group-hover:scale-110 transition-transform duration-700" />
        
        {/* Date Badge */}
        <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-md rounded-2xl p-3 text-center min-w-[60px] shadow-lg">
           <span className="block text-lg font-black text-slate-900 leading-none">{dateStr.split(' ')[1]}</span>
           <span className="block text-[10px] font-bold text-purple-600 uppercase tracking-wider">{dateStr.split(' ')[0]}</span>
        </div>

        {/* Category Badge */}
        <div className="absolute top-4 right-4">
           <span className={`text-[10px] font-bold px-3 py-1.5 rounded-full border backdrop-blur-md ${categoryColors[event.category] || categoryColors.Other}`}>
             {event.category.toUpperCase()}
           </span>
        </div>

        {/* Decorative elements */}
        <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/60 to-transparent">
           <div className="flex items-center gap-2 text-white/90 text-xs font-medium">
              <FiMapPin size={12} className="text-purple-300" />
              <span>{event.location}</span>
           </div>
        </div>
      </div>

      <div className="px-2 pb-2">
        <h3 className="text-xl font-bold text-slate-900 mb-2 group-hover:text-purple-600 transition-colors line-clamp-1">
          {event.title}
        </h3>
        
        <p className="text-slate-500 text-sm line-clamp-2 mb-6 leading-relaxed">
          {event.description}
        </p>

        <div className="flex items-center justify-between pt-4 border-t border-slate-50">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-400">
               <FiCalendar size={14} />
            </div>
            <span className="text-xs font-semibold text-slate-600">{yearStr}</span>
          </div>
          
          <div className="flex items-center gap-1.5 text-purple-600 font-bold text-sm">
            Details <FiArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
          </div>
        </div>
      </div>
    </Link>
  );
};

export default EventCard;
