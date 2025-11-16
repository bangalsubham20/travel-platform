import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { motion, AnimatePresence } from 'framer-motion';
import { FiMail, FiLock, FiUser, FiPhone, FiCheck, FiEye, FiEyeOff } from 'react-icons/fi';

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    fullName: '',
    email: '',
    phone: '',
    password: '',
    confirm: '',
    agree: false
  });
  const [showPw, setShowPw] = useState(false);
  const [showConf, setShowConf] = useState(false);
  const [error, setError] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  function validate() {
    if (!form.fullName.trim()) return 'Name required';
    if (!/^[A-Za-z ]{3,}$/.test(form.fullName)) return 'Name must be at least 3 letters';
    if (!/^[\w-.]+@[\w-]+\.\w{2,}$/.test(form.email)) return 'Valid email required';
    if (!/^\d{10}$/.test(form.phone)) return 'Valid 10-digit phone required';
    if (form.password.length < 6) return 'Password at least 6 chars';
    if (!/[A-Z]/.test(form.password)) return 'Password: one uppercase required';
    if (!/[a-z]/.test(form.password)) return 'Password: one lowercase required';
    if (!/\d/.test(form.password)) return 'Password: one number required';
    if (form.password !== form.confirm) return 'Passwords do not match';
    if (!form.agree) return 'You must agree to terms';
    return null;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    const err = validate();
    if (err) {
      setError(err);
      return;
    }
    setLoading(true);
    try {
      await register(form.fullName, form.email, form.password, form.phone);
      setSubmitted(true);
      setTimeout(() => navigate('/'), 2000);
    } catch (err) {
      setError(err.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  }

  if (submitted) return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-tr from-green-400/60 via-blue-400/60 to-fuchsia-400/60">
      <motion.div
        initial={{ opacity: 0, scale: 0.8, y: 40 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md bg-white/70 shadow-2xl rounded-3xl p-12 backdrop-blur-lg border border-white border-opacity-30 flex flex-col items-center text-center"
      >
        <div className="w-16 h-16 flex items-center justify-center rounded-full bg-green-500 mb-4">
          <FiCheck size={36} className="text-white" />
        </div>
        <h2 className="text-3xl font-bold text-gray-800 mb-2">Account Created!</h2>
        <p className="text-gray-600 mb-6">Welcome to WravelCommunity.</p>
        <p className="text-sm text-gray-400">Redirecting...</p>
      </motion.div>
    </div>
  );

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-tr from-blue-400/60 via-indigo-600/60 to-fuchsia-400/60 relative overflow-hidden">
      {/* Animated Circles */}
      <motion.div
        animate={{ x: [0, 80, 0], y: [0, 60, 0] }}
        transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute -top-24 -left-24 w-96 h-96 bg-blue-400/30 rounded-full blur-3xl"
      />
      <motion.div
        animate={{ x: [0, -120, 0], y: [0, -50, 0] }}
        transition={{ duration: 15, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute -bottom-24 -right-32 w-96 h-96 bg-fuchsia-400/30 rounded-full blur-3xl"
      />
      <motion.div
        initial={{ opacity: 0, scale: 0.8, y: 30 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        className="w-full max-w-md bg-white/60 shadow-2xl rounded-3xl p-8 md:p-12 backdrop-blur-2xl border border-white border-opacity-40"
      >
        <h2 className="text-4xl font-bold text-center mb-8 text-gray-900 drop-shadow">Create Account</h2>
        <AnimatePresence>
          {error && (
            <motion.div
              key="register-error"
              exit={{ opacity: 0, y: -8 }}
              initial={{ opacity: 0, y: -16 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4 text-sm"
            >
              {error}
            </motion.div>
          )}
        </AnimatePresence>
        <form className="space-y-5" onSubmit={handleSubmit}>
          <div>
            <label className="block mb-1 text-gray-700 font-semibold">Full Name</label>
            <div className="relative">
              <FiUser className="absolute left-3 top-3 text-gray-400" size={20} />
              <input
                className="w-full pl-10 pr-4 py-2 bg-white/80 border border-gray-300 rounded-lg focus:border-blue-400 focus:outline-none shadow-sm transition-all"
                placeholder="John Doe"
                name="fullName"
                value={form.fullName}
                onChange={e => setForm({ ...form, fullName: e.target.value })}
                autoFocus required
              />
            </div>
          </div>
          <div>
            <label className="block mb-1 text-gray-700 font-semibold">Email</label>
            <div className="relative">
              <FiMail className="absolute left-3 top-3 text-gray-400" size={20} />
              <input
                className="w-full pl-10 pr-4 py-2 bg-white/80 border border-gray-300 rounded-lg focus:border-blue-400 focus:outline-none shadow-sm transition-all"
                placeholder="you@email.com"
                type="email"
                name="email"
                value={form.email}
                onChange={e => setForm({ ...form, email: e.target.value })}
                required
              />
            </div>
          </div>
          <div>
            <label className="block mb-1 text-gray-700 font-semibold">Phone</label>
            <div className="relative">
              <FiPhone className="absolute left-3 top-3 text-gray-400" size={20} />
              <input
                className="w-full pl-10 pr-4 py-2 bg-white/80 border border-gray-300 rounded-lg focus:border-blue-400 focus:outline-none shadow-sm transition-all"
                placeholder="1234567890"
                type="tel"
                name="phone"
                value={form.phone}
                onChange={e => setForm({ ...form, phone: e.target.value })}
                required
              />
            </div>
          </div>
          <div>
            <label className="block mb-1 text-gray-700 font-semibold">Password</label>
            <div className="relative">
              <FiLock className="absolute left-3 top-3 text-gray-400" size={20} />
              <input
                className="w-full pl-10 pr-10 py-2 bg-white/80 border border-gray-300 rounded-lg focus:border-blue-400 focus:outline-none shadow-sm transition-all"
                placeholder="••••••••"
                type={showPw ? 'text' : 'password'}
                name="password"
                value={form.password}
                autoComplete="new-password"
                onChange={e => setForm({ ...form, password: e.target.value })}
                required
              />
              <button
                type="button"
                className="absolute right-3 top-3 text-gray-400 focus:outline-none"
                tabIndex={-1}
                onClick={() => setShowPw(v => !v)}
              >
                {showPw ? <FiEyeOff size={20} /> : <FiEye size={20} />}
              </button>
            </div>
          </div>
          <div>
            <label className="block mb-1 text-gray-700 font-semibold">Confirm Password</label>
            <div className="relative">
              <FiLock className="absolute left-3 top-3 text-gray-400" size={20} />
              <input
                className="w-full pl-10 pr-10 py-2 bg-white/80 border border-gray-300 rounded-lg focus:border-blue-400 focus:outline-none shadow-sm transition-all"
                placeholder="••••••••"
                type={showConf ? 'text' : 'password'}
                name="confirm"
                value={form.confirm}
                onChange={e => setForm({ ...form, confirm: e.target.value })}
                required
              />
              <button
                type="button"
                className="absolute right-3 top-3 text-gray-400 focus:outline-none"
                tabIndex={-1}
                onClick={() => setShowConf(v => !v)}
              >
                {showConf ? <FiEyeOff size={20} /> : <FiEye size={20} />}
              </button>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <input
              checked={form.agree}
              id="terms"
              type="checkbox"
              className="rounded accent-fuchsia-500 focus:ring-fuchsia-500"
              onChange={e => setForm({ ...form, agree: e.target.checked })}
            />
            <label htmlFor="terms" className="text-gray-600 text-sm">
              I agree to&nbsp;
              <a href="#" className="text-fuchsia-500 underline">terms & privacy</a>
            </label>
          </div>
          <button
            className="w-full h-12 mt-2 rounded-lg bg-gradient-to-tr from-blue-500 via-indigo-500 to-fuchsia-500 text-white font-bold text-lg shadow-lg hover:scale-[1.03] transition-transform"
            type="submit"
            disabled={loading}
          >
            {loading ? 'Creating...' : 'Create Account'}
          </button>
        </form>
        <p className="text-center text-gray-600 mt-6">
          Already have an account?{' '}
          <Link
            to="/login"
            className="text-fuchsia-600 font-bold hover:underline"
          >
            Log In
          </Link>
        </p>
      </motion.div>
    </div>
  );
}
