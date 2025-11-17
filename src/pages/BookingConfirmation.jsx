import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import Button from '../components/common/Button';
import Card from '../components/common/Card';
import { FiCheck, FiDownload, FiShare2, FiArrowRight, FiPhone, FiMail } from 'react-icons/fi';

function BookingConfirmation() {
  const { tripId } = useParams();
  const navigate = useNavigate();
  const [confetti, setConfetti] = useState([]);

  const bookingId = 'BK' + Math.random().toString(36).substring(2, 9).toUpperCase();

  // Generate confetti on mount
  useEffect(() => {
    setConfetti(Array.from({ length: 30 }, (_, i) => ({
      id: i,
      left: Math.random() * 100,
      delay: Math.random() * 0.5,
      duration: 2 + Math.random() * 1
    })));
  }, []);

  const tripDetails = {
    '1': { name: 'Winter Spiti Valley', date: 'Jan 15-22, 2025', price: '21,150' },
    '2': { name: 'Leh Ladakh Adventure', date: 'Feb 20-26, 2025', price: '34,650' }
  };

  const trip = tripDetails[tripId] || tripDetails['1'];

  const nextSteps = [
    {
      number: 1,
      title: 'Download Confirmation',
      desc: 'Check your email for the PDF with all details',
      icon: '📥'
    },
    {
      number: 2,
      title: 'Join Community Group',
      desc: 'Connect with fellow travelers on WhatsApp',
      icon: '👥'
    },
    {
      number: 3,
      title: 'Pre-Trip Briefing',
      desc: 'Video call 3 days before your trip',
      icon: '🎥'
    },
    {
      number: 4,
      title: 'Pack & Prepare',
      desc: 'Follow the packing list we sent',
      icon: '🎒'
    }
  ];

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800 text-white pb-16 overflow-hidden">
      {/* Animated Background */}
      <motion.div className="fixed -top-96 -right-96 w-[500px] h-[500px] rounded-full bg-gradient-to-br from-green-600/20 via-emerald-600/15 to-transparent blur-3xl -z-10"
        animate={{ y: [0, 60, 0] }}
        transition={{ duration: 12, repeat: Infinity }} />
      <motion.div className="fixed -bottom-96 -left-96 w-[500px] h-[500px] rounded-full bg-gradient-to-tr from-blue-600/20 via-cyan-500/15 to-transparent blur-3xl -z-10"
        animate={{ y: [0, -50, 0] }}
        transition={{ duration: 15, repeat: Infinity }} />

      {/* Confetti Animation */}
      {confetti.map(c => (
        <motion.div
          key={c.id}
          initial={{ y: -100, x: `${c.left}%`, opacity: 1 }}
          animate={{ y: window.innerHeight, opacity: 0 }}
          transition={{ duration: c.duration, delay: c.delay }}
          className="fixed w-2 h-2 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full"
        />
      ))}

      <div className="max-w-2xl mx-auto px-4 relative z-10 pt-8">
        {/* Success Message */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="backdrop-blur-xl bg-gradient-to-br from-green-500/10 to-emerald-600/10 border border-green-500/30 rounded-3xl p-12 mb-8 text-center shadow-2xl"
        >
          {/* Animated Checkmark */}
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ delay: 0.2, type: 'spring', stiffness: 100 }}
            className="flex justify-center mb-8"
          >
            <div className="w-24 h-24 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full flex items-center justify-center shadow-2xl">
              <motion.div
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <FiCheck size={48} className="text-white" />
              </motion.div>
            </div>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-5xl font-black mb-4 bg-clip-text text-transparent bg-gradient-to-r from-green-400 to-emerald-400"
          >
            Booking Confirmed! 🎉
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="text-xl text-slate-300 mb-3"
          >
            Your trip booking has been successfully confirmed
          </motion.p>
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="text-slate-400"
          >
            A confirmation email has been sent to your registered email address
          </motion.p>
        </motion.div>

        {/* Booking Details Card */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-8 mb-8 shadow-2xl"
        >
          <h2 className="text-3xl font-black text-white mb-8">Booking Details</h2>

          <motion.div
            variants={{
              visible: { transition: { staggerChildren: 0.08 } },
              hidden: {}
            }}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-2 gap-6 mb-8 pb-8 border-b border-white/10"
          >
            {[
              { label: 'Booking ID', value: bookingId },
              { label: 'Booking Date', value: new Date().toLocaleDateString() },
              { label: 'Trip', value: trip.name },
              { label: 'Trip Date', value: trip.date }
            ].map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1 }}
              >
                <p className="text-sm text-slate-400 mb-1">{item.label}</p>
                <p className="text-lg font-bold text-white">{item.value}</p>
              </motion.div>
            ))}
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="space-y-3"
          >
            {[
              'Payment received and confirmed',
              'Travel insurance activated (₹4.5L coverage)',
              'Trip leader assigned',
              'Pre-trip briefing scheduled'
            ].map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 + i * 0.08 }}
                className="flex items-center text-slate-200"
              >
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.5 + i * 0.08 }}
                >
                  <FiCheck className="text-green-400 mr-3 w-5 h-5" />
                </motion.div>
                {item}
              </motion.div>
            ))}
          </motion.div>
        </motion.div>

        {/* What's Next */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="backdrop-blur-xl bg-gradient-to-br from-blue-500/10 to-cyan-500/10 border border-blue-500/30 rounded-2xl p-8 mb-8 shadow-2xl"
        >
          <h2 className="text-3xl font-black text-white mb-8">What's Next?</h2>

          <motion.div
            variants={{
              visible: { transition: { staggerChildren: 0.1 } },
              hidden: {}
            }}
            initial="hidden"
            animate="visible"
            className="space-y-4"
          >
            {nextSteps.map((step, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                whileHover={{ x: 10 }}
                transition={{ duration: 0.3 }}
                className="flex gap-4 p-4 backdrop-blur-lg bg-white/5 border border-white/10 rounded-xl hover:border-blue-500/30 hover:bg-white/8 transition-all"
              >
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-400 to-cyan-400 flex items-center justify-center font-bold flex-shrink-0 text-slate-900 text-lg">
                  {step.number}
                </div>
                <div>
                  <p className="font-bold text-white text-lg">{step.title}</p>
                  <p className="text-sm text-slate-400 mt-1">{step.desc}</p>
                </div>
                <div className="ml-auto flex items-center">
                  <span className="text-2xl">{step.icon}</span>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="grid grid-cols-2 gap-4 mb-8"
        >
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button
              fullWidth
              onClick={() => window.print()}
              className="bg-white/10 border border-white/20"
            >
              <FiDownload className="inline mr-2" />
              Download
            </Button>
          </motion.div>
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button
              fullWidth
              onClick={() => {
                const text = `Just booked ${trip.name}! Booking ID: ${bookingId}`;
                if (navigator.share) {
                  navigator.share({ title: 'WravelCommunity', text });
                } else {
                  window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank');
                }
              }}
              className="bg-white/10 border border-white/20"
            >
              <FiShare2 className="inline mr-2" />
              Share
            </Button>
          </motion.div>
        </motion.div>

        {/* Navigation Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="grid grid-cols-2 gap-4 mb-8"
        >
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button
              fullWidth
              onClick={() => navigate('/profile')}
              className="bg-white/10 border border-white/20"
            >
              My Bookings
            </Button>
          </motion.div>
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button
              fullWidth
              onClick={() => navigate('/trips')}
              className="bg-gradient-to-r from-purple-500 to-pink-500"
            >
              More Trips <FiArrowRight className="inline ml-2" size={18} />
            </Button>
          </motion.div>
        </motion.div>

        {/* Support Card */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-8 shadow-2xl"
        >
          <p className="text-slate-300 text-center mb-6">Need help? We're always here</p>
          <div className="flex flex-col md:flex-row items-center justify-center gap-6">
            <motion.a
              whileHover={{ scale: 1.05 }}
              href="tel:+919797972175"
              className="flex items-center gap-2 text-purple-400 hover:text-purple-300 font-bold transition"
            >
              <FiPhone size={18} />
              +91 97 97 97 21 75
            </motion.a>
            <div className="w-0.5 h-6 bg-white/20 hidden md:block" />
            <motion.a
              whileHover={{ scale: 1.05 }}
              href="mailto:support@wravelcommunity.com"
              className="flex items-center gap-2 text-purple-400 hover:text-purple-300 font-bold transition"
            >
              <FiMail size={18} />
              support@wravelcommunity.com
            </motion.a>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

export default BookingConfirmation;
