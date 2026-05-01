import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { loginUser } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { FiCalendar, FiArrowRight, FiMail, FiLock } from 'react-icons/fi';

const Login = () => {
  const [form, setForm] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) =>
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await loginUser(form);
      login(data);
      toast.success(`Welcome back, ${data.name}!`);
      navigate('/');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-80px)] flex items-center justify-center px-6 py-12 bg-slate-50 relative overflow-hidden">
      {/* Background blobs */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-teal-100 rounded-full blur-3xl opacity-40 translate-x-1/2 -translate-y-1/2" />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-violet-100 rounded-full blur-3xl opacity-40 -translate-x-1/2 translate-y-1/2" />

      <div className="w-full max-w-md animate-fade-up">
        <div className="text-center mb-10">
          <div className="w-16 h-16 bg-purple-600 rounded-2xl flex items-center justify-center text-white shadow-xl shadow-purple-200 mx-auto mb-6">
            <FiCalendar size={32} />
          </div>
          <h1 className="text-3xl font-black text-slate-900 mb-2">Welcome Back</h1>
          <p className="text-slate-500 font-medium">Continue your journey with Event Portal</p>
        </div>

        <div className="bg-white rounded-[2.5rem] shadow-2xl shadow-slate-200/60 p-10 border border-slate-100">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
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
              <div className="flex justify-between items-center ml-1">
                <label className="text-sm font-bold text-slate-700">Password</label>
                <button type="button" className="text-xs font-bold text-purple-600 hover:text-purple-700">Forgot?</button>
              </div>
              <div className="relative group">
                <FiLock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-purple-500 transition-colors" />
                <input
                  type="password"
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  required
                  placeholder="••••••••"
                  className="input-field pl-12"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full py-4 text-lg flex items-center justify-center gap-2"
            >
              {loading ? (
                <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>Sign In <FiArrowRight /></>
              )}
            </button>
          </form>

          <div className="mt-8 pt-8 border-t border-slate-50 text-center">
            <p className="text-slate-500 font-medium">
              New here?{' '}
              <Link to="/register" className="text-purple-600 font-bold hover:text-purple-700 transition-colors">
                Create an account
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
