import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiArrowRight } from 'react-icons/fi';

function Categories() {
  const navigate = useNavigate();

  const categories = [
    { id: 1, name: 'Trekking', icon: '⛰️', count: '12+ Treks', link: '/trekking', color: 'from-orange-500/20 to-amber-500/10', border: 'border-orange-500/30' },
    { id: 2, name: 'Backpacking', icon: '🎒', count: '18+ Trips', link: '/trips', color: 'from-cyan-500/20 to-teal-500/10', border: 'border-cyan-500/30' },
    { id: 3, name: 'All Girls', icon: '👩‍👩‍👩', count: '8+ Tours', link: '/trips', color: 'from-pink-500/20 to-rose-500/10', border: 'border-pink-500/30' },
    { id: 4, name: 'Biking', icon: '🏍️', count: '6+ Rides', link: '/trips', color: 'from-amber-500/20 to-[#ff6b4a]/10', border: 'border-amber-500/30' },
    { id: 5, name: 'Weekend', icon: '🏕️', count: '15+ Getaways', link: '/trips', color: 'from-emerald-500/20 to-teal-500/10', border: 'border-emerald-500/30' },
    { id: 6, name: 'International', icon: '✈️', count: '10+ Expeditions', link: '/trips', color: 'from-purple-500/20 to-indigo-500/10', border: 'border-purple-500/30' },
  ];

  return (
    <section className="py-20 relative bg-slate-950 overflow-hidden">
      {/* Background Subtle Ambient Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-7xl h-96 bg-cyan-500/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-14 gap-4">
          <div className="text-left">
            <span className="inline-block text-xs font-bold uppercase tracking-widest text-cyan-400 mb-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20">
              Curated Experiences
            </span>
            <h2 className="text-3xl sm:text-5xl font-display font-black text-white tracking-tight">
              Explore by <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-teal-300 to-amber-400">Category</span>
            </h2>
          </div>
          <motion.button
            whileHover={{ x: 5 }}
            onClick={() => navigate('/trips')}
            className="flex items-center gap-2 text-cyan-400 font-bold text-sm hover:text-cyan-300 transition-colors group"
          >
            <span>View All Categories</span>
            <FiArrowRight className="group-hover:translate-x-1 transition-transform" />
          </motion.button>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4 sm:gap-6">
          {categories.map((cat, index) => (
            <motion.div
              key={cat.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.08, duration: 0.4 }}
              viewport={{ once: true }}
              whileHover={{ y: -6, scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => navigate(cat.link)}
              className={`bg-slate-900/80 backdrop-blur-xl border border-white/10 rounded-3xl p-5 flex flex-col items-center justify-between text-center cursor-pointer shadow-xl hover:shadow-2xl transition-all duration-300 group hover:${cat.border} relative overflow-hidden`}
            >
              {/* Subtle Gradient Hover Overlay */}
              <div className={`absolute inset-0 bg-gradient-to-b ${cat.color} opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none`} />

              {/* Category Emoji Icon */}
              <div className="w-16 h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-3xl mb-4 group-hover:scale-110 group-hover:bg-white/10 transition-all duration-300 shadow-inner">
                {cat.icon}
              </div>

              {/* Title & Count */}
              <div>
                <h3 className="font-bold text-base text-white group-hover:text-cyan-400 transition-colors mb-1">
                  {cat.name}
                </h3>
                <span className="text-[11px] font-semibold text-gray-400/80 group-hover:text-gray-300 transition-colors">
                  {cat.count}
                </span>
              </div>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}

export default Categories;
