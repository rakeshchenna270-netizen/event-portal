import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FiCalendar, FiLogOut, FiUser, FiGrid } from 'react-icons/fi';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2.5 group">
          <div className="w-10 h-10 bg-purple-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-purple-200 group-hover:scale-110 transition-transform duration-300">
            <FiCalendar size={20} />
          </div>
          <span className="text-xl font-extrabold tracking-tight text-slate-900">
            Event<span className="text-purple-600">Portal</span>
          </span>
        </Link>

        {/* Nav Links */}
        <div className="hidden md:flex items-center gap-8">
          <Link to="/" className="text-sm font-semibold text-slate-600 hover:text-purple-600 transition-colors">
            Discover
          </Link>

          {user ? (
            <>
              <Link to="/my-registrations" className="text-sm font-semibold text-slate-600 hover:text-purple-600 transition-colors">
                My RSVPs
              </Link>

              {user.role === 'admin' && (
                <Link
                  to="/admin"
                  className="flex items-center gap-1.5 text-sm font-semibold text-slate-600 hover:text-purple-600 transition-colors"
                >
                  <FiGrid size={16} /> Admin
                </Link>
              )}

              <div className="h-6 w-px bg-slate-200 mx-2" />

              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-100 rounded-full">
                  <FiUser className="text-slate-500" size={14} />
                  <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">{user.name}</span>
                </div>

                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2 text-sm font-semibold text-slate-500 hover:text-rose-600 transition-colors"
                >
                  <FiLogOut size={16} />
                </button>
              </div>
            </>
          ) : (
            <div className="flex items-center gap-4">
              <Link to="/login" className="text-sm font-semibold text-slate-600 hover:text-purple-600 transition-colors">
                Sign In
              </Link>
              <Link
                to="/register"
                className="btn-primary py-2 px-5 text-sm"
              >
                Get Started
              </Link>
            </div>
          )}
        </div>

        {/* Mobile Toggle Placeholder */}
        <div className="md:hidden">
            {/* You could add a mobile menu icon here */}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
