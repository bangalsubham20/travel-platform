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
      const msg = typeof err === 'string' ? err : (err.message || 'Login failed');
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  const isUnverified = error && (error.toLowerCase().includes('verify') || error.toLowerCase().includes('unverified') || error.toLowerCase().includes('pending'));

  return (
    <div className="min-h-screen flex items-center justify-center bg-teal-900 relative overflow-hidden font-sans selection:bg-cyan-500 selection:text-teal-900">
      {/* Animated Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-teal-950 via-teal-900 to-black z-0" />

      {/* Animated Orbs */}
      <motion.div
        animate={{ x: [0, 100, 0], y: [0, 50, 0] }}
        transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute top-[-80px] left-[-80px] w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl z-0"
      />
      <motion.div
        animate={{ x: [0, -100, 0], y: [0, -80, 0] }}
        transition={{ duration: 14, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute bottom-[-80px] right-[-80px] w-96 h-96 bg-teal-500/10 rounded-full blur-3xl z-0"
      />

      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 30 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-md bg-teal-900/60 shadow-2xl rounded-3xl p-8 md:p-12 backdrop-blur-xl border border-white/10 relative z-10"
      >
        <div className="text-center mb-8">
          <h2 className="text-4xl font-display font-black text-white mb-2 tracking-tight">Welcome Back</h2>
          <p className="text-grey-400">Sign in to continue your adventure</p>
        </div>

        <AnimatePresence>
          {error && (
            <motion.div
              key="login-error"
              exit={{ opacity: 0, y: -8 }}
              initial={{ opacity: 0, y: -16 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-red-500/10 border border-red-500/30 text-red-300 px-4 py-3 rounded-xl mb-6 text-sm flex flex-col gap-2"
            >
              <div className="flex items-center gap-2">
                <span>⚠️</span> {error}
              </div>
              {isUnverified && (
                <Link
                  to="/register"
                  className="mt-1 inline-block text-cyan-400 underline hover:text-cyan-300 font-semibold text-xs text-center"
                >
                  Click here to register & verify your OTP
                </Link>
              )}
            </motion.div>
          )}
        </AnimatePresence>


        <form className="space-y-6" onSubmit={handleSubmit}>
          <div>
            <label className="block mb-2 text-grey-300 font-semibold text-sm">Email Address</label>
            <div className="relative group">
              <FiMail className="absolute left-4 top-3.5 text-grey-500 group-focus-within:text-cyan-400 transition-colors" size={20} />
              <input
                className="w-full pl-12 pr-4 py-3 bg-black/40 border border-white/10 rounded-xl focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 focus:outline-none text-white placeholder-grey-600 transition-all"
                placeholder="you@example.com"
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
            <label className="block mb-2 text-grey-300 font-semibold text-sm">Password</label>
            <div className="relative group">
              <FiLock className="absolute left-4 top-3.5 text-grey-500 group-focus-within:text-cyan-400 transition-colors" size={20} />
              <input
                className="w-full pl-12 pr-12 py-3 bg-black/40 border border-white/10 rounded-xl focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 focus:outline-none text-white placeholder-grey-600 transition-all"
                placeholder="••••••••"
                required
                type={showPassword ? 'text' : 'password'}
                name="password"
                value={form.password}
                onChange={handleChange}
              />
              <button
                type="button"
                className="absolute right-4 top-3.5 text-grey-500 hover:text-white focus:outline-none transition-colors"
                tabIndex={-1}
                onClick={() => setShowPassword((v) => !v)}
              >
                {showPassword ? <FiEyeOff size={20} /> : <FiEye size={20} />}
              </button>
            </div>
            <div className="flex justify-end mt-2">
              <a href="#" className="text-xs text-cyan-400 hover:text-cyan-300 transition-colors">Forgot Password?</a>
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-3.5 rounded-xl bg-gradient-to-r from-cyan-600 to-teal-600 text-white font-bold text-lg shadow-lg shadow-cyan-500/20 hover:shadow-cyan-500/40 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={loading}
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Logging in...
              </span>
            ) : 'Login'}
          </button>
        </form>

        <p className="text-center text-grey-400 mt-8">
          Don't have an account?{' '}
          <Link
            to="/register"
            className="text-cyan-400 font-bold hover:text-cyan-300 transition-colors"
          >
            Sign Up
          </Link>
        </p>
      </motion.div>
    </div>
  );
}
