import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { registerUser } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { FiUser, FiMail, FiLock, FiShield, FiArrowRight } from 'react-icons/fi';

const Register = () => {
  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'user' });
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) =>
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await registerUser(form);
      login(data);
      toast.success('Account created! Welcome 🎉');
      navigate('/');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-80px)] flex items-center justify-center px-6 py-12 bg-slate-50 relative overflow-hidden">
      {/* Background blobs */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-purple-100 rounded-full blur-3xl opacity-40 translate-x-1/2 -translate-y-1/2" />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-rose-100 rounded-full blur-3xl opacity-40 -translate-x-1/2 translate-y-1/2" />

      <div className="w-full max-w-lg animate-fade-up">
        <div className="text-center mb-10">
          <h1 className="text-4xl font-black text-slate-900 mb-2 tracking-tight">Create Account</h1>
          <p className="text-slate-500 font-medium text-lg">Join the community of event enthusiasts</p>
        </div>

        <div className="bg-white rounded-[2.5rem] shadow-2xl shadow-slate-200/60 p-10 border border-slate-100">
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2 md:col-span-2">
              <label className="text-sm font-bold text-slate-700 ml-1">Full Name</label>
              <div className="relative group">
                <FiUser className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-purple-500 transition-colors" />
                <input
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  required
                  placeholder="John Doe"
                  className="input-field pl-12"
                />
              </div>
            </div>

            <div className="space-y-2 md:col-span-2">
              <label className="text-sm font-bold text-slate-700 ml-1">Email Address</label>
              <div className="relative group">
                <FiMail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-purple-500 transition-colors" />
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  required
                  placeholder="name@example.com"
                  className="input-field pl-12"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700 ml-1">Password</label>
              <div className="relative group">
                <FiLock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-purple-500 transition-colors" />
                <input
                  type="password"
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  required
                  placeholder="Min 6 chars"
                  className="input-field pl-12"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700 ml-1">Account Type</label>
              <div className="relative group">
                <FiShield className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-teal-500 transition-colors" />
                <select
                  name="role"
                  value={form.role}
                  onChange={handleChange}
                  className="input-field pl-12 appearance-none"
                >
                  <option value="user">Attendee</option>
                  <option value="admin">Organizer</option>
                </select>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-primary md:col-span-2 py-4 text-lg flex items-center justify-center gap-2 mt-2"
            >
              {loading ? (
                <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>Get Started <FiArrowRight /></>
              )}
            </button>
          </form>

          <div className="mt-8 pt-8 border-t border-slate-50 text-center">
            <p className="text-slate-500 font-medium">
              Already have an account?{' '}
              <Link to="/login" className="text-purple-600 font-bold hover:text-purple-700 transition-colors">
                Sign In
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
