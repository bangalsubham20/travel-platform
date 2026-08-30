import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FiChevronLeft, FiChevronRight, FiStar, FiArrowRight, FiMapPin } from 'react-icons/fi';

const trekkingCards = [
  {
    id: 1,
    title: 'Manali Trek',
    duration: '7 Days / 6 Nights',
    rating: 5.0,
    reviews: 70,
    price: '₹14,500',
    image: 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?q=80&w=800&auto=format&fit=crop',
  },
  {
    id: 2,
    title: 'Sikkim, India',
    duration: '7 Days / 6 Nights',
    rating: 4.9,
    reviews: 85,
    price: '₹18,200',
    image: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=800&auto=format&fit=crop',
  },
  {
    id: 3,
    title: 'Snow Peak Manali',
    duration: '7 Days / 6 Nights',
    rating: 5.0,
    reviews: 92,
    price: '₹16,800',
    image: 'https://images.unsplash.com/photo-1519681393784-d120267933ba?q=80&w=800&auto=format&fit=crop',
  },
  {
    id: 4,
    title: 'Kedarkantha Summit',
    duration: '6 Days / 5 Nights',
    rating: 4.9,
    reviews: 110,
    price: '₹12,900',
    image: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?q=80&w=800&auto=format&fit=crop',
  },
];

function TrekkingSection() {
  const navigate = useNavigate();
  const [startIndex, setStartIndex] = useState(0);

  const handleNext = () => {
    setStartIndex((prev) => (prev + 1) % (trekkingCards.length - 2));
  };

  const handlePrev = () => {
    setStartIndex((prev) => (prev === 0 ? trekkingCards.length - 3 : prev - 1));
  };

  const visibleCards = trekkingCards.slice(startIndex, startIndex + 3);

  return (
    <section className="py-24 px-4 sm:px-6 lg:px-8 bg-slate-900 text-white relative overflow-hidden">
      {/* Background Subtle Sparkle Effects */}
      <div className="absolute top-12 left-10 text-cyan-400/40 text-xl font-serif select-none pointer-events-none animate-pulse">
        ✦
      </div>
      <div className="absolute bottom-20 left-1/3 text-orange-400/40 text-2xl font-serif select-none pointer-events-none">
        ✦
      </div>
      <div className="absolute top-1/2 right-12 text-teal-400/30 text-3xl font-serif select-none pointer-events-none">
        ✦
      </div>

      <div className="max-w-7xl mx-auto">
        {/* Main Grid: Headline Left, Curved Trekking Hero Right */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center mb-16">
          {/* LEFT COLUMN: Typography & Action Button */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="lg:col-span-5 text-left"
          >
            <span className="inline-block text-xs uppercase tracking-widest font-bold text-cyan-400 mb-3 px-3.5 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20">
              Snow Peak Adventures
            </span>
            <h2 className="text-5xl sm:text-6xl lg:text-7xl font-display font-black text-white leading-[1.05] tracking-tight mb-6">
              Trekking &amp; <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 via-amber-300 to-cyan-400">
                Camping
              </span>
            </h2>
            <p className="text-lg sm:text-xl text-gray-300/90 font-light max-w-md mb-8 leading-relaxed">
              A perfect guide to your snow peak adventures. Conquering majestic peaks &amp; sleeping under starlit wilderness skies.
            </p>

            <motion.button
              onClick={() => navigate('/trips')}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-8 py-4 rounded-full bg-gradient-to-r from-[#ff6b4a] to-[#ff884b] text-white font-bold text-base shadow-[0_10px_30px_rgba(255,107,74,0.4)] hover:shadow-[0_15px_40px_rgba(255,107,74,0.6)] flex items-center gap-3 group transition-all duration-300 cursor-pointer"
            >
              <span>BOOK NOW</span>
              <div className="w-8 h-8 rounded-full bg-white text-[#ff6b4a] flex items-center justify-center group-hover:translate-x-1 transition-transform">
                <FiArrowRight size={18} />
              </div>
            </motion.button>
          </motion.div>

          {/* RIGHT COLUMN: Asymmetric Masked Mountain Image with Dotted Trail & Badges */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="lg:col-span-7 relative"
          >
            {/* Curved Mask Banner Image Container */}
            <div className="relative w-full h-[380px] sm:h-[450px] lg:h-[480px] rounded-[3.5rem] lg:rounded-tr-[6rem] lg:rounded-bl-[6rem] overflow-hidden shadow-[0_25px_60px_rgba(0,0,0,0.6)] border border-white/10 group">
              <img
                src="https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=1600&auto=format&fit=crop"
                alt="Trekking & Camping Mountain Trail"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-black/30" />

              {/* OVERLAID DOTTED TRAIL LINE & WAYPOINTS */}
              <svg className="absolute inset-0 w-full h-full pointer-events-none z-10" viewBox="0 0 600 400" preserveAspectRatio="none">
                <path
                  d="M 60 360 Q 220 280 340 180 T 480 100"
                  fill="none"
                  stroke="#ffffff"
                  strokeWidth="3"
                  strokeDasharray="6 6"
                  className="opacity-80"
                />
                {/* Start Waypoint */}
                <circle cx="60" cy="360" r="7" fill="#ff6b4a" stroke="#ffffff" strokeWidth="2" />
                {/* Mid Waypoint */}
                <circle cx="340" cy="180" r="7" fill="#ffffff" stroke="#ff6b4a" strokeWidth="3" />
                {/* End Summit Waypoint */}
                <circle cx="480" cy="100" r="7" fill="#ff6b4a" stroke="#ffffff" strokeWidth="2" />
              </svg>

              {/* FLOATING TOP-RIGHT BADGE: Trekking 70 KM */}
              <motion.div
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.5, duration: 0.5 }}
                className="absolute top-6 right-6 sm:top-8 sm:right-8 bg-slate-900/80 backdrop-blur-xl border border-white/20 px-4 py-2.5 rounded-full flex items-center gap-3 shadow-xl z-20"
              >
                <img
                  src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=150&auto=format&fit=crop"
                  alt="Trekker Avatar"
                  className="w-9 h-9 rounded-full object-cover border border-cyan-400"
                />
                <div className="text-left">
                  <p className="text-xs font-bold text-white leading-tight">Trekking KM</p>
                  <p className="text-[10px] text-cyan-300 font-semibold">70 KM</p>
                </div>
              </motion.div>

              {/* FLOATING BOTTOM-RIGHT BADGE: 100k People Have Explored */}
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.7, duration: 0.5 }}
                className="absolute bottom-6 right-6 sm:bottom-8 sm:right-8 bg-slate-900/85 backdrop-blur-xl border border-white/20 px-4 py-3 rounded-full flex items-center gap-3 shadow-2xl z-20"
              >
                {/* Avatar Stack */}
                <div className="flex -space-x-2.5 overflow-hidden">
                  <img
                    src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=100&auto=format&fit=crop"
                    alt="User"
                    className="inline-block h-8 w-8 rounded-full ring-2 ring-slate-900 object-cover"
                  />
                  <img
                    src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=100&auto=format&fit=crop"
                    alt="User"
                    className="inline-block h-8 w-8 rounded-full ring-2 ring-slate-900 object-cover"
                  />
                  <img
                    src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=100&auto=format&fit=crop"
                    alt="User"
                    className="inline-block h-8 w-8 rounded-full ring-2 ring-slate-900 object-cover"
                  />
                </div>
                <div className="text-left">
                  <p className="text-sm font-black text-white leading-none">100k</p>
                  <p className="text-[10px] text-gray-300 leading-tight">People have explored</p>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>

        {/* BOTTOM CAROUSEL CARDS SECTION */}
        <div className="relative pt-4">
          <div className="flex items-center justify-between gap-4">
            {/* Left Carousel Arrow */}
            <button
              onClick={handlePrev}
              className="w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 border border-white/15 flex items-center justify-center text-white transition-all shadow-lg shrink-0 cursor-pointer"
              aria-label="Previous Trekking Options"
            >
              <FiChevronLeft size={22} />
            </button>

            {/* Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 flex-1">
              <AnimatePresence mode="wait">
                {visibleCards.map((card) => (
                  <motion.div
                    key={card.id}
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -15 }}
                    transition={{ duration: 0.3 }}
                    onClick={() => navigate(`/trips`)}
                    className="bg-white/95 backdrop-blur-xl border border-white/40 rounded-3xl p-3.5 flex items-center gap-4 shadow-xl hover:shadow-2xl transition-all duration-300 cursor-pointer group hover:-translate-y-1"
                  >
                    {/* Thumbnail Image */}
                    <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl overflow-hidden shrink-0">
                      <img
                        src={card.image}
                        alt={card.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                    </div>

                    {/* Card Content */}
                    <div className="flex-1 text-left min-w-0">
                      <h4 className="text-base sm:text-lg font-bold text-slate-900 truncate leading-tight group-hover:text-[#ff6b4a] transition-colors">
                        {card.title}
                      </h4>
                      <p className="text-xs text-gray-500 font-medium my-1">
                        {card.duration}
                      </p>
                      {/* Rating Stars */}
                      <div className="flex items-center gap-1">
                        {[...Array(5)].map((_, i) => (
                          <FiStar key={i} className="text-amber-400 fill-amber-400 text-xs" />
                        ))}
                        <span className="text-[11px] text-gray-500 ml-1 font-semibold">
                          ({card.reviews} Reviews)
                        </span>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>

            {/* Right Carousel Arrow */}
            <button
              onClick={handleNext}
              className="w-12 h-12 rounded-full bg-gradient-to-r from-[#ff6b4a] to-[#ff884b] hover:from-[#ff5833] hover:to-[#ff7938] text-white flex items-center justify-center shadow-[0_8px_20px_rgba(255,107,74,0.4)] transition-all shrink-0 cursor-pointer"
              aria-label="Next Trekking Options"
            >
              <FiChevronRight size={22} />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

export default TrekkingSection;
