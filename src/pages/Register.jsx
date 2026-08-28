import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { motion, AnimatePresence } from 'framer-motion';
import { FiMail, FiLock, FiUser, FiPhone, FiCheck, FiEye, FiEyeOff, FiShield, FiArrowLeft, FiRefreshCw } from 'react-icons/fi';

export default function Register() {
  const { register, verifyEmail } = useAuth();
  const navigate = useNavigate();

  // 'form' | 'otp' | 'success'
  const [step, setStep] = useState('form');

  const [form, setForm] = useState({
    fullName: '',
    email: '',
    phone: '',
    password: '',
    confirm: '',
    agree: false
  });

  const [otp, setOtp] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [showConf, setShowConf] = useState(false);
  const [error, setError] = useState('');
  const [infoMessage, setInfoMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);

  function validateForm() {
    if (!form.fullName.trim()) return 'Name required';
    if (!/^[A-Za-z ]{3,}$/.test(form.fullName)) return 'Name must be at least 3 letters';
    if (!/^[\w-.]+@[\w-]+\.\w{2,}$/.test(form.email)) return 'Valid email required';
    if (!/^\d{10}$/.test(form.phone)) return 'Valid 10-digit phone required';
    if (form.password.length < 6) return 'Password must be at least 6 characters';
    if (!/[A-Z]/.test(form.password)) return 'Password must include at least one uppercase letter';
    if (!/[a-z]/.test(form.password)) return 'Password must include at least one lowercase letter';
    if (!/\d/.test(form.password)) return 'Password must include at least one number';
    if (form.password !== form.confirm) return 'Passwords do not match';
    if (!form.agree) return 'You must agree to terms & privacy';
    return null;
  }

  async function handleRegisterSubmit(e) {
    e.preventDefault();
    setError('');
    const err = validateForm();
    if (err) {
      setError(err);
      return;
    }

    setLoading(true);
    try {
      const res = await register(form.fullName, form.email, form.password, form.phone);
      setInfoMessage(res?.message || 'Verification OTP sent to your email.');
      setStep('otp');
    } catch (err) {
      const msg = typeof err === 'string' ? err : (err.message || 'Registration failed');
      setError(msg);
    } finally {
      setLoading(false);
    }
  }

  async function handleOtpSubmit(e) {
    e.preventDefault();
    setError('');

    if (!otp.trim() || otp.length !== 6) {
      setError('Please enter a valid 6-digit OTP code');
      return;
    }

    setLoading(true);
    try {
      await verifyEmail(form.email, otp.trim());
      setStep('success');
      setTimeout(() => navigate('/'), 2000);
    } catch (err) {
      const msg = typeof err === 'string' ? err : (err.message || 'OTP verification failed');
      setError(msg);
    } finally {
      setLoading(false);
    }
  }

  async function handleResendOtp() {
    setError('');
    setInfoMessage('');
    setResending(true);
    try {
      const res = await register(form.fullName, form.email, form.password, form.phone);
      setInfoMessage(res?.message || 'A new verification OTP has been sent to your email.');
    } catch (err) {
      const msg = typeof err === 'string' ? err : (err.message || 'Failed to resend OTP');
      setError(msg);
    } finally {
      setResending(false);
    }
  }

  // ========== STEP 3: SUCCESS STATE ==========
  if (step === 'success') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-teal-900 font-sans px-3 sm:px-6 py-8">
        <motion.div
          initial={{ opacity: 0, scale: 0.85, y: 30 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-sm sm:max-w-md bg-teal-900/60 shadow-2xl rounded-2xl sm:rounded-3xl p-6 sm:p-10 md:p-12 backdrop-blur-xl border border-white/10 flex flex-col items-center text-center"
        >
          <div className="w-16 h-16 sm:w-20 sm:h-20 flex items-center justify-center rounded-full bg-green-500/20 text-green-400 mb-4 sm:mb-6 border border-green-500/30">
            <FiCheck className="text-3xl sm:text-4xl" />
          </div>
          <h2 className="text-2xl sm:text-3xl font-display font-black text-white mb-2">Email Verified!</h2>
          <p className="text-grey-400 text-xs sm:text-sm mb-6 sm:mb-8">Welcome to SundaySoul, {form.fullName}!</p>
          <div className="flex items-center gap-2 text-cyan-400 text-xs sm:text-sm font-semibold">
            <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
            Redirecting to home...
          </div>
        </motion.div>
      </div>
    );
  }

  // ========== STEP 2: OTP VERIFICATION VIEW ==========
  if (step === 'otp') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-teal-900 relative overflow-hidden font-sans py-6 sm:py-12 px-3 sm:px-6 selection:bg-cyan-500 selection:text-teal-900">
        {/* Animated Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-teal-950 via-teal-900 to-black z-0" />

        {/* Orbs */}
        <motion.div
          animate={{ x: [0, 80, 0], y: [0, 60, 0] }}
          transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute -top-24 -left-24 w-72 sm:w-96 h-72 sm:h-96 bg-cyan-500/10 rounded-full blur-3xl z-0"
        />

        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 30 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-sm sm:max-w-md bg-teal-900/60 shadow-2xl rounded-2xl sm:rounded-3xl p-5 sm:p-8 md:p-10 backdrop-blur-xl border border-white/10 relative z-10"
        >
          <button
            type="button"
            onClick={() => setStep('form')}
            className="inline-flex items-center gap-2 text-grey-400 hover:text-white transition-colors text-xs sm:text-sm mb-4 sm:mb-6 font-semibold"
          >
            <FiArrowLeft size={16} /> Back to Register
          </button>

          <div className="text-center mb-6 sm:mb-8">
            <div className="w-12 h-12 sm:w-16 sm:h-16 bg-cyan-500/20 text-cyan-400 rounded-xl sm:rounded-2xl flex items-center justify-center mx-auto mb-3 sm:mb-4 border border-cyan-500/30">
              <FiShield className="text-2xl sm:text-3xl" />
            </div>
            <h2 className="text-2xl sm:text-3xl font-display font-black text-white mb-1 sm:mb-2 tracking-tight">Verify Your Email</h2>
            <p className="text-grey-400 text-xs sm:text-sm">
              We sent a 6-digit OTP code to:
            </p>
            <p className="text-cyan-400 font-semibold mt-1 text-xs sm:text-sm bg-cyan-950/40 py-1 px-2.5 sm:px-3 rounded-lg border border-cyan-500/20 inline-block break-all">
              {form.email}
            </p>
          </div>

          <AnimatePresence>
            {error && (
              <motion.div
                key="otp-error"
                exit={{ opacity: 0, y: -8 }}
                initial={{ opacity: 0, y: -16 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-red-500/10 border border-red-500/30 text-red-300 px-3.5 sm:px-4 py-2.5 sm:py-3 rounded-xl mb-4 sm:mb-6 text-xs sm:text-sm flex items-center gap-2"
              >
                <span>⚠️</span> {error}
              </motion.div>
            )}
            {infoMessage && !error && (
              <motion.div
                key="otp-info"
                exit={{ opacity: 0, y: -8 }}
                initial={{ opacity: 0, y: -16 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 px-3.5 sm:px-4 py-2.5 sm:py-3 rounded-xl mb-4 sm:mb-6 text-xs sm:text-sm flex items-center gap-2"
              >
                <span>✉️</span> {infoMessage}
              </motion.div>
            )}
          </AnimatePresence>

          <form className="space-y-4 sm:space-y-6" onSubmit={handleOtpSubmit}>
            <div>
              <label className="block mb-2 text-grey-300 font-semibold text-xs sm:text-sm text-center">
                6-Digit Verification Code
              </label>
              <div className="relative group">
                <input
                  className="w-full text-center tracking-[0.3em] sm:tracking-[0.5em] text-xl sm:text-2xl font-mono py-3 sm:py-4 px-2 sm:px-4 bg-black/50 border border-white/10 rounded-xl focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/50 focus:outline-none text-cyan-300 placeholder-grey-600 transition-all uppercase"
                  placeholder="123456"
                  maxLength={6}
                  value={otp}
                  onChange={e => setOtp(e.target.value.replace(/\D/g, ''))}
                  autoFocus
                  required
                />
              </div>
            </div>

            <button
              className="w-full py-3 sm:py-3.5 rounded-xl bg-gradient-to-r from-cyan-600 to-teal-600 text-white font-bold text-base sm:text-lg shadow-lg shadow-cyan-500/20 hover:shadow-cyan-500/40 hover:scale-[1.01] active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              type="submit"
              disabled={loading || otp.length !== 6}
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="w-4 h-4 sm:w-5 sm:h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Verifying OTP...
                </span>
              ) : 'Verify & Complete Registration'}
            </button>
          </form>

          <div className="flex flex-col sm:flex-row items-center justify-between gap-2 sm:gap-0 text-xs text-grey-400 mt-6 sm:mt-8 pt-4 sm:pt-6 border-t border-white/10 text-center sm:text-left">
            <span>Didn't receive the code?</span>
            <button
              type="button"
              onClick={handleResendOtp}
              disabled={resending}
              className="text-cyan-400 hover:text-cyan-300 font-semibold transition-colors flex items-center justify-center gap-1 disabled:opacity-50 min-h-[36px]"
            >
              <FiRefreshCw className={resending ? 'animate-spin' : ''} size={14} />
              {resending ? 'Sending...' : 'Resend Code'}
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  // ========== STEP 1: INITIAL REGISTRATION FORM ==========
  return (
    <div className="min-h-screen flex items-center justify-center bg-teal-900 relative overflow-hidden font-sans py-6 sm:py-12 px-3 sm:px-6 selection:bg-cyan-500 selection:text-teal-900">
      {/* Animated Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-teal-950 via-teal-900 to-black z-0" />

      {/* Animated Orbs */}
      <motion.div
        animate={{ x: [0, 80, 0], y: [0, 60, 0] }}
        transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute -top-24 -left-24 w-72 sm:w-96 h-72 sm:h-96 bg-cyan-500/10 rounded-full blur-3xl z-0"
      />
      <motion.div
        animate={{ x: [0, -120, 0], y: [0, -50, 0] }}
        transition={{ duration: 15, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute -bottom-24 -right-32 w-72 sm:w-96 h-72 sm:h-96 bg-teal-500/10 rounded-full blur-3xl z-0"
      />

      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 30 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-sm sm:max-w-md md:max-w-lg bg-teal-900/60 shadow-2xl rounded-2xl sm:rounded-3xl p-5 sm:p-8 md:p-10 backdrop-blur-xl border border-white/10 relative z-10 my-auto"
      >
        <div className="text-center mb-6 sm:mb-8">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-display font-black text-white mb-1.5 sm:mb-2 tracking-tight">Create Account</h2>
          <p className="text-grey-400 text-xs sm:text-sm">Join our community of travelers</p>
        </div>

        <AnimatePresence>
          {error && (
            <motion.div
              key="register-error"
              exit={{ opacity: 0, y: -8 }}
              initial={{ opacity: 0, y: -16 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-red-500/10 border border-red-500/30 text-red-300 px-3.5 sm:px-4 py-2.5 sm:py-3 rounded-xl mb-4 sm:mb-6 text-xs sm:text-sm flex items-center gap-2"
            >
              <span>⚠️</span> {error}
            </motion.div>
          )}
        </AnimatePresence>

        <form className="space-y-4 sm:space-y-5" onSubmit={handleRegisterSubmit}>
          <div>
            <label className="block mb-1.5 sm:mb-2 text-grey-300 font-semibold text-xs sm:text-sm">Full Name</label>
            <div className="relative group">
              <FiUser className="absolute left-3.5 sm:left-4 top-3 sm:top-3.5 text-grey-500 group-focus-within:text-cyan-400 transition-colors text-base sm:text-xl" />
              <input
                className="w-full pl-10 sm:pl-12 pr-4 py-2.5 sm:py-3 bg-black/40 border border-white/10 rounded-xl focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 focus:outline-none text-white placeholder-grey-600 text-sm sm:text-base transition-all"
                placeholder="John Doe"
                name="fullName"
                value={form.fullName}
                onChange={e => setForm({ ...form, fullName: e.target.value })}
                autoFocus required
              />
            </div>
          </div>

          <div>
            <label className="block mb-1.5 sm:mb-2 text-grey-300 font-semibold text-xs sm:text-sm">Email Address</label>
            <div className="relative group">
              <FiMail className="absolute left-3.5 sm:left-4 top-3 sm:top-3.5 text-grey-500 group-focus-within:text-cyan-400 transition-colors text-base sm:text-xl" />
              <input
                className="w-full pl-10 sm:pl-12 pr-4 py-2.5 sm:py-3 bg-black/40 border border-white/10 rounded-xl focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 focus:outline-none text-white placeholder-grey-600 text-sm sm:text-base transition-all"
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
            <label className="block mb-1.5 sm:mb-2 text-grey-300 font-semibold text-xs sm:text-sm">Phone Number</label>
            <div className="relative group">
              <FiPhone className="absolute left-3.5 sm:left-4 top-3 sm:top-3.5 text-grey-500 group-focus-within:text-cyan-400 transition-colors text-base sm:text-xl" />
              <input
                className="w-full pl-10 sm:pl-12 pr-4 py-2.5 sm:py-3 bg-black/40 border border-white/10 rounded-xl focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 focus:outline-none text-white placeholder-grey-600 text-sm sm:text-base transition-all"
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
            <label className="block mb-1.5 sm:mb-2 text-grey-300 font-semibold text-xs sm:text-sm">Password</label>
            <div className="relative group">
              <FiLock className="absolute left-3.5 sm:left-4 top-3 sm:top-3.5 text-grey-500 group-focus-within:text-cyan-400 transition-colors text-base sm:text-xl" />
              <input
                className="w-full pl-10 sm:pl-12 pr-10 sm:pr-12 py-2.5 sm:py-3 bg-black/40 border border-white/10 rounded-xl focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 focus:outline-none text-white placeholder-grey-600 text-sm sm:text-base transition-all"
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
                className="absolute right-3.5 sm:right-4 top-3 sm:top-3.5 text-grey-500 hover:text-white focus:outline-none transition-colors"
                tabIndex={-1}
                onClick={() => setShowPw(v => !v)}
              >
                {showPw ? <FiEyeOff className="text-base sm:text-xl" /> : <FiEye className="text-base sm:text-xl" />}
              </button>
            </div>
          </div>

          <div>
            <label className="block mb-1.5 sm:mb-2 text-grey-300 font-semibold text-xs sm:text-sm">Confirm Password</label>
            <div className="relative group">
              <FiLock className="absolute left-3.5 sm:left-4 top-3 sm:top-3.5 text-grey-500 group-focus-within:text-cyan-400 transition-colors text-base sm:text-xl" />
              <input
                className="w-full pl-10 sm:pl-12 pr-10 sm:pr-12 py-2.5 sm:py-3 bg-black/40 border border-white/10 rounded-xl focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 focus:outline-none text-white placeholder-grey-600 text-sm sm:text-base transition-all"
                placeholder="••••••••"
                type={showConf ? 'text' : 'password'}
                name="confirm"
                value={form.confirm}
                onChange={e => setForm({ ...form, confirm: e.target.value })}
                required
              />
              <button
                type="button"
                className="absolute right-3.5 sm:right-4 top-3 sm:top-3.5 text-grey-500 hover:text-white focus:outline-none transition-colors"
                tabIndex={-1}
                onClick={() => setShowConf(v => !v)}
              >
                {showConf ? <FiEyeOff className="text-base sm:text-xl" /> : <FiEye className="text-base sm:text-xl" />}
              </button>
            </div>
          </div>

          <div className="flex items-center gap-2.5 sm:gap-3 pt-1 sm:pt-2">
            <input
              checked={form.agree}
              id="terms"
              type="checkbox"
              className="w-4 h-4 rounded bg-black/40 border-white/10 text-cyan-500 focus:ring-cyan-500 focus:ring-offset-teal-900 cursor-pointer"
              onChange={e => setForm({ ...form, agree: e.target.checked })}
            />
            <label htmlFor="terms" className="text-grey-400 text-xs sm:text-sm cursor-pointer select-none">
              I agree to&nbsp;
              <a href="#" className="text-cyan-400 hover:text-cyan-300 underline transition-colors">terms & privacy</a>
            </label>
          </div>

          <button
            className="w-full py-3 sm:py-3.5 rounded-xl bg-gradient-to-r from-cyan-600 to-teal-600 text-white font-bold text-base sm:text-lg shadow-lg shadow-cyan-500/20 hover:shadow-cyan-500/40 hover:scale-[1.01] active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed min-h-[46px]"
            type="submit"
            disabled={loading}
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <span className="w-4 h-4 sm:w-5 sm:h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Sending Verification OTP...
              </span>
            ) : 'Send Verification OTP'}
          </button>
        </form>

        <p className="text-center text-grey-400 text-xs sm:text-sm mt-6 sm:mt-8">
          Already have an account?{' '}
          <Link
            to="/login"
            className="text-cyan-400 font-bold hover:text-cyan-300 transition-colors"
          >
            Log In
          </Link>
        </p>
      </motion.div>
    </div>
  );
}
