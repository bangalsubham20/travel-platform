import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { motion, AnimatePresence } from 'framer-motion';
import { FiMail, FiLock, FiEye, FiEyeOff } from 'react-icons/fi';

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(form.email, form.password);
      navigate('/');
    } catch (err) {
      setError(err.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-tr from-blue-400/60 via-indigo-600/60 to-fuchsia-400/60 relative overflow-hidden">
      {/* Animated Circles */}
      <motion.div
        animate={{ x: [0, 100, 0], y: [0, 50, 0] }}
        transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute top-[-80px] left-[-80px] w-96 h-96 bg-fuchsia-400/30 rounded-full blur-3xl"
      />
      <motion.div
        animate={{ x: [0, -100, 0], y: [0, -80, 0] }}
        transition={{ duration: 14, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute bottom-[-80px] right-[-80px] w-96 h-96 bg-blue-400/30 rounded-full blur-3xl"
      />
      <motion.div
        initial={{ opacity: 0, scale: 0.8, y: 30 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        className="w-full max-w-md bg-white/50 shadow-2xl rounded-3xl p-8 md:p-12 backdrop-blur-xl border border-white border-opacity-30"
      >
        <h2 className="text-4xl font-bold text-center mb-8 text-gray-800 drop-shadow">Welcome Back</h2>
        <AnimatePresence>
          {error && (
            <motion.div
              key="login-error"
              exit={{ opacity: 0, y: -8 }}
              initial={{ opacity: 0, y: -16 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4 text-sm"
            >
              {error}
            </motion.div>
          )}
        </AnimatePresence>
        <form className="space-y-6" onSubmit={handleSubmit}>
          <div>
            <label className="block mb-1 text-gray-700 font-semibold">Email</label>
            <div className="relative">
              <FiMail className="absolute left-3 top-3 text-gray-400" size={20} />
              <input
                className="w-full px-10 py-2 bg-white/80 border border-gray-300 rounded-lg focus:border-blue-400 focus:outline-none shadow-sm transition-all"
                placeholder="you@email.com"
                autoFocus
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                required
              />
            </div>
          </div>
          <div>
            <label className="block mb-1 text-gray-700 font-semibold">Password</label>
            <div className="relative">
              <FiLock className="absolute left-3 top-3 text-gray-400" size={20} />
              <input
                className="w-full px-10 py-2 bg-white/80 border border-gray-300 rounded-lg focus:border-blue-400 focus:outline-none shadow-sm transition-all pr-12"
                placeholder="••••••••"
                required
                type={showPassword ? 'text' : 'password'}
                name="password"
                value={form.password}
                onChange={handleChange}
              />
              <button
                type="button"
                className="absolute right-3 top-3 text-gray-400 focus:outline-none"
                tabIndex={-1}
                onClick={() => setShowPassword((v) => !v)}
              >
                {showPassword ? <FiEyeOff size={20} /> : <FiEye size={20} />}
              </button>
            </div>
          </div>
          <button
            type="submit"
            className="w-full h-12 mt-4 rounded-lg bg-gradient-to-tr from-blue-500 via-indigo-500 to-fuchsia-500 text-white font-bold text-lg shadow-lg hover:scale-[1.03] transition-transform"
            disabled={loading}
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>
        <p className="text-center text-gray-600 mt-6">
          Don't have an account?{' '}
          <Link
            to="/register"
            className="text-fuchsia-600 font-bold hover:underline"
          >
            Sign Up
          </Link>
        </p>
      </motion.div>
    </div>
  );
}
