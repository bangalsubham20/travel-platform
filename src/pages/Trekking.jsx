import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FiChevronLeft, FiChevronRight, FiStar, FiMapPin, FiArrowRight, FiCheck } from 'react-icons/fi';
import tripService from '../services/tripService';

// Default fallback data in case database is empty or offline
const fallbackHeroCards = [
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

const fallbackCatalog = [
  {
    id: 101,
    name: 'Kedarkantha Peak Trek',
    location: 'Uttarakhand, India',
    altitude: '12,500 ft',
    difficulty: 'Easy to Moderate',
    duration: '5 Days',
    price: '₹8,500',
    category: 'Summit',
    image: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?q=80&w=800&auto=format&fit=crop',
    description: 'Walk through pine forests and white snow trails to reach a breathtaking 360-degree Himalayan summit.',
    highlights: ['Snow trail walking', 'Starlit camping', 'Summit Sunrise'],
  },
  {
    id: 102,
    name: 'Spiti Valley Cold Desert Trek',
    location: 'Himachal Pradesh, India',
    altitude: '14,000 ft',
    difficulty: 'Moderate',
    duration: '8 Days',
    price: '₹22,000',
    category: 'Camping',
    image: 'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?q=80&w=800&auto=format&fit=crop',
    description: 'Experience ancient monasteries, high altitude lakes, and dramatic canyon landscapes.',
    highlights: ['Key Monastery', 'Chandratal Lake', 'High Passes'],
  },
  {
    id: 103,
    name: 'Goechala Pass Expedition',
    location: 'Sikkim, India',
    altitude: '15,100 ft',
    difficulty: 'Challenging',
    duration: '10 Days',
    price: '₹24,500',
    category: 'Summit',
    image: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=800&auto=format&fit=crop',
    description: 'Get up close to Mt. Kanchenjunga, the world’s 3rd highest peak, through rhododendron forests.',
    highlights: ['Kanchenjunga View', 'Samiti Lake', 'Rhododendron Forest'],
  },
  {
    id: 104,
    name: 'Hampta Pass & Chandratal',
    location: 'Manali, Himachal Pradesh',
    altitude: '14,100 ft',
    difficulty: 'Moderate',
    duration: '6 Days',
    price: '₹14,200',
    category: 'Beginner',
    image: 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?q=80&w=800&auto=format&fit=crop',
    description: 'Cross from the lush green Kullu valley into the stark, dry landscapes of Lahaul.',
    highlights: ['Dramatic crossover', 'Chandratal Camping', 'Snow Bridges'],
  },
];

const FourPointStar = ({ className = "w-6 h-6 text-cyan-400" }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M12 0C12 6.627 6.627 12 0 12C6.627 12 12 17.373 12 24C12 17.373 17.373 12 24 12C17.373 12 12 6.627 12 0Z" />
  </svg>
);

function Trekking() {
  const navigate = useNavigate();
  const [startIndex, setStartIndex] = useState(0);
  const [selectedFilter, setSelectedFilter] = useState('All');
  const [dbTrips, setDbTrips] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch dynamic trekking trips from Database API
  useEffect(() => {
    const fetchDatabaseTrips = async () => {
      try {
        setLoading(true);
        const data = await tripService.getAllTrips();
        if (data && Array.isArray(data) && data.length > 0) {
          setDbTrips(data);
        } else {
          setDbTrips([]);
        }
      } catch (err) {
        console.error("Failed to load database trips:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchDatabaseTrips();
  }, []);

  // Format database trips for Hero Carousel Cards
  const heroCardsData = dbTrips.length > 0
    ? dbTrips.slice(0, 5).map((trip) => ({
        id: trip.id,
        title: trip.name,
        duration: `${trip.duration} Days`,
        rating: trip.rating || 5.0,
        reviews: trip.reviews || 50,
        price: `₹${trip.price?.toLocaleString('en-IN')}`,
        image: trip.image || 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?q=80&w=800&auto=format&fit=crop',
      }))
    : fallbackHeroCards;

  // Format database trips for All Expeditions Catalog
  const catalogData = dbTrips.length > 0
    ? dbTrips.map((trip) => ({
        id: trip.id,
        name: trip.name,
        location: trip.destination,
        altitude: trip.altitude || `${trip.duration * 2000} ft`,
        difficulty: trip.difficulty || 'Moderate',
        duration: `${trip.duration} Days`,
        price: `₹${trip.price?.toLocaleString('en-IN')}`,
        category: trip.season || 'Summit',
        image: trip.image || 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?q=80&w=800&auto=format&fit=crop',
        description: trip.description,
        highlights: trip.highlights ? trip.highlights.split(',').map(h => h.trim()) : ['Snow Trail', 'Starlit Camping'],
      }))
    : fallbackCatalog;

  const handleNext = () => {
    setStartIndex((prev) => (prev + 1) % Math.max(1, heroCardsData.length - 2));
  };

  const handlePrev = () => {
    setStartIndex((prev) => (prev === 0 ? Math.max(0, heroCardsData.length - 3) : prev - 1));
  };

  const visibleCards = heroCardsData.slice(startIndex, startIndex + 3);

  const filteredTreks = selectedFilter === 'All'
    ? catalogData
    : catalogData.filter((t) => t.category === selectedFilter || t.difficulty === selectedFilter);

  return (
    <div className="min-h-screen text-white pt-24 font-sans selection:bg-[#ff6b4a] selection:text-white">
      
      {/* SVG ClipPath Definition for SMOOTH FLUID S-CURVED MOUNTAIN MASK */}
      <svg width="0" height="0" className="absolute">
        <defs>
          <clipPath id="fluidNotchShape" clipPathUnits="objectBoundingBox">
            <path d="
              M 0.34,0
              L 0.93,0
              C 0.97,0 1,0.04 1,0.08
              L 1,0.67
              C 1,0.735 0.96,0.775 0.895,0.775
              L 0.745,0.775
              C 0.685,0.775 0.645,0.815 0.645,0.875
              L 0.645,0.91
              C 0.645,0.96 0.605,1 0.555,1
              L 0.07,1
              C 0.03,1 0,0.97 0,0.93
              L 0,0.455
              C 0,0.395 0.04,0.36 0.095,0.36
              L 0.225,0.36
              C 0.285,0.36 0.34,0.32 0.34,0.26
              Z
            " />
          </clipPath>
        </defs>
      </svg>

      {/* SECTION 1: HERO SHOWCASE WITH DYNAMIC DATABASE TRIPS */}
      <section className="relative py-12 lg:py-16 px-4 sm:px-8 lg:px-16 max-w-7xl mx-auto">
        
        {/* Glow Spheres */}
        <div className="absolute top-10 left-10 w-72 h-72 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-10 right-10 w-80 h-80 bg-orange-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Four-Point Star Sparkles */}
        <div className="absolute top-2 left-[44%] text-cyan-400 z-20 hidden md:block animate-pulse">
          <FourPointStar className="w-6 h-6 text-cyan-400" />
        </div>
        <div className="absolute top-1/2 left-1 text-cyan-400/40 z-10">
          <FourPointStar className="w-4 h-4 text-cyan-400/40" />
        </div>
        <div className="absolute bottom-24 left-[29%] text-orange-400 z-20">
          <FourPointStar className="w-8 h-8 text-orange-400" />
        </div>
        <div className="absolute top-1/3 right-2 text-teal-400/50 z-10">
          <FourPointStar className="w-4 h-4 text-teal-400/50" />
        </div>

        {/* HERO TOP GRID */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center mb-16 relative">
          
          {/* LEFT SIDE: HEADLINE & BOOK NOW ACTION BUTTON */}
          <div className="lg:col-span-5 text-left z-20 pt-4">
            <span className="inline-block text-xs uppercase tracking-widest font-bold text-cyan-400 mb-4 px-3.5 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20">
              Live Database Expeditions
            </span>
            <h1 className="text-6xl sm:text-7xl lg:text-[5.5rem] font-display font-black text-white tracking-tighter leading-[0.94] mb-6">
              Trekking &amp; <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 via-amber-300 to-cyan-400">
                Camping
              </span>
            </h1>

            <p className="text-gray-300/90 font-light text-lg sm:text-xl max-w-sm mb-10 leading-snug">
              A perfect guide to your snow peak adventures. Conquering majestic peaks &amp; sleeping under starlit skies.
            </p>

            {/* BOOK NOW ORANGE PILL BUTTON */}
            <motion.button
              onClick={() => {
                const element = document.getElementById('all-treks');
                element?.scrollIntoView({ behavior: 'smooth' });
              }}
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.96 }}
              className="px-9 py-4 rounded-full bg-gradient-to-r from-[#ff6b4a] to-[#ff884b] hover:from-[#ff5833] hover:to-[#ff7938] text-white font-bold tracking-wider text-base shadow-[0_12px_35px_rgba(255,107,74,0.45)] flex items-center gap-5 group transition-all duration-300 cursor-pointer"
            >
              <span className="tracking-wider">BOOK NOW</span>
              <div className="w-8 h-8 rounded-full bg-white text-[#ff6b4a] flex items-center justify-center group-hover:translate-x-1 transition-transform shadow-md">
                <FiChevronRight size={20} className="stroke-[3]" />
              </div>
            </motion.button>
          </div>

          {/* RIGHT SIDE: FLUID NOTCHED MOUNTAIN IMAGE & OVERLAID BADGES */}
          <div className="lg:col-span-7 relative min-h-[380px] sm:min-h-[460px] lg:min-h-[490px] flex items-center justify-center">
            
            {/* Mountain Image with Smooth Fluid SVG ClipPath Mask */}
            <div
              className="relative w-full h-[380px] sm:h-[460px] lg:h-[490px] bg-slate-900 group shadow-[0_25px_60px_rgba(0,0,0,0.7)] transition-all border border-white/10"
              style={{ clipPath: 'url(#fluidNotchShape)', WebkitClipPath: 'url(#fluidNotchShape)' }}
            >
              <img
                src="https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?q=80&w=1600&auto=format&fit=crop"
                alt="Reddish Sunset Mountain Peak"
                className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-black/30 pointer-events-none" />

              {/* OVERLAID DOTTED MOUNTAIN TRAIL WITH PINS */}
              <svg className="absolute inset-0 w-full h-full pointer-events-none z-10" viewBox="0 0 600 400" preserveAspectRatio="none">
                <path
                  d="M 60 360 Q 220 270 340 170 T 480 90"
                  fill="none"
                  stroke="#ffffff"
                  strokeWidth="3.5"
                  strokeDasharray="6 6"
                  className="opacity-90 drop-shadow-md"
                />
                <g transform="translate(60, 360)">
                  <circle cx="0" cy="0" r="10" fill="#ff6b4a" stroke="#ffffff" strokeWidth="2" />
                </g>
                <circle cx="340" cy="170" r="7" fill="#ffffff" stroke="#ff6b4a" strokeWidth="3" />
                <g transform="translate(480, 90)">
                  <circle cx="0" cy="0" r="10" fill="#ff6b4a" stroke="#ffffff" strokeWidth="2" />
                </g>
              </svg>

              {/* TOP RIGHT BADGE: Trekking KM 70 KM */}
              <div className="absolute top-6 right-6 sm:top-8 sm:right-8 bg-slate-900/80 backdrop-blur-xl px-4 py-2.5 rounded-full flex items-center gap-3 border border-white/20 shadow-2xl z-20">
                <img
                  src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=150&auto=format&fit=crop"
                  alt="Trekker"
                  className="w-9 h-9 rounded-full object-cover ring-2 ring-cyan-400"
                />
                <div className="text-left text-white">
                  <p className="text-xs font-bold leading-tight">Trekking KM</p>
                  <p className="text-[10px] text-cyan-300 font-semibold">70 KM</p>
                </div>
              </div>
            </div>

            {/* BOTTOM RIGHT BADGE: Inside fluid notch cutout */}
            <div className="absolute bottom-2 right-2 sm:bottom-4 sm:right-4 bg-slate-900/90 backdrop-blur-xl px-5 py-3 rounded-full flex items-center gap-3 shadow-[0_15px_35px_rgba(0,0,0,0.6)] z-30 border border-white/20">
              <div className="flex -space-x-2.5 overflow-hidden">
                <img
                  src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=100&auto=format&fit=crop"
                  alt="User 1"
                  className="inline-block h-8 w-8 rounded-full ring-2 ring-slate-900 object-cover"
                />
                <img
                  src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=100&auto=format&fit=crop"
                  alt="User 2"
                  className="inline-block h-8 w-8 rounded-full ring-2 ring-slate-900 object-cover"
                />
                <img
                  src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=100&auto=format&fit=crop"
                  alt="User 3"
                  className="inline-block h-8 w-8 rounded-full ring-2 ring-slate-900 object-cover"
                />
              </div>
              <div className="text-left">
                <p className="text-sm font-black text-white leading-none">100k</p>
                <p className="text-[10px] text-gray-300 font-medium leading-tight">People have explored</p>
              </div>
            </div>

          </div>
        </div>

        {/* BOTTOM CAROUSEL CARDS FROM DATABASE */}
        <div className="relative pt-6">
          <div className="flex items-center justify-between gap-4">
            
            {/* Left Navigation Button */}
            <button
              onClick={handlePrev}
              className="w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-all shrink-0 cursor-pointer border border-white/10 shadow-lg"
              aria-label="Previous"
            >
              <FiChevronLeft size={22} />
            </button>

            {/* 3 Cards Row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 flex-1">
              <AnimatePresence mode="wait">
                {visibleCards.map((card) => (
                  <motion.div
                    key={card.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.25 }}
                    onClick={() => navigate(`/trips/${card.id}`)}
                    className="bg-slate-900/85 backdrop-blur-xl border border-white/15 rounded-3xl p-3.5 flex items-center gap-4 shadow-2xl hover:border-cyan-500/50 hover:shadow-[0_10px_30px_rgba(6,182,212,0.2)] transition-all duration-300 cursor-pointer group hover:-translate-y-1"
                  >
                    {/* Thumbnail Image */}
                    <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl overflow-hidden shrink-0">
                      <img
                        src={card.image}
                        alt={card.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                    </div>

                    {/* Content */}
                    <div className="flex-1 text-left min-w-0">
                      <h4 className="text-base sm:text-lg font-bold text-white truncate leading-tight group-hover:text-cyan-400 transition-colors">
                        {card.title}
                      </h4>
                      <p className="text-xs text-gray-400 font-medium my-1">
                        {card.duration}
                      </p>
                      {/* Rating Stars */}
                      <div className="flex items-center gap-1">
                        {[...Array(5)].map((_, i) => (
                          <FiStar key={i} className="text-amber-400 fill-amber-400 text-xs" />
                        ))}
                        <span className="text-[11px] text-gray-400 ml-1 font-semibold">
                          ({card.reviews} Reviews)
                        </span>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>

            {/* Right Navigation Button */}
            <button
              onClick={handleNext}
              className="w-12 h-12 rounded-full bg-gradient-to-r from-[#ff6b4a] to-[#ff884b] hover:from-[#ff5833] hover:to-[#ff7938] text-white flex items-center justify-center shadow-[0_8px_25px_rgba(255,107,74,0.4)] transition-all shrink-0 cursor-pointer"
              aria-label="Next"
            >
              <FiChevronRight size={22} className="stroke-[3]" />
            </button>

          </div>
        </div>
      </section>

      {/* SECTION 2: FULL CATALOG FROM DATABASE */}
      <section id="all-treks" className="py-24 px-4 sm:px-6 lg:px-16 max-w-7xl mx-auto border-t border-white/10 mt-12">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 gap-6">
          <div className="text-left">
            <h2 className="text-4xl sm:text-5xl font-display font-black text-white mb-3">
              Explore All <span className="text-cyan-400">Trekking Expeditions</span>
            </h2>
            <p className="text-gray-400 text-base sm:text-lg font-light">
              Certified mountain guides, high-altitude camping &amp; premium gear included.
            </p>
          </div>

          {/* Filter Tags */}
          <div className="flex flex-wrap gap-2">
            {['All', 'Beginner', 'Summit', 'Camping'].map((filter) => (
              <button
                key={filter}
                onClick={() => setSelectedFilter(filter)}
                className={`px-5 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
                  selectedFilter === filter
                    ? 'bg-cyan-500 text-slate-950 shadow-[0_0_20px_rgba(6,182,212,0.4)]'
                    : 'bg-white/5 border border-white/10 text-gray-300 hover:bg-white/10'
                }`}
              >
                {filter}
              </button>
            ))}
          </div>
        </div>

        {/* Trek Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredTreks.map((trek) => (
            <motion.div
              key={trek.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="bg-slate-900/80 backdrop-blur-xl border border-white/10 rounded-3xl overflow-hidden shadow-2xl flex flex-col group hover:border-cyan-500/40 transition-all duration-300"
            >
              <div className="relative h-60 overflow-hidden">
                <img
                  src={trek.image}
                  alt={trek.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent" />
                <span className="absolute top-4 left-4 px-3.5 py-1 bg-cyan-500/20 backdrop-blur-md border border-cyan-500/30 text-cyan-300 text-xs font-bold rounded-full uppercase tracking-wider">
                  {trek.category}
                </span>
                <span className="absolute top-4 right-4 text-xs font-bold text-white bg-black/60 px-3 py-1 rounded-full backdrop-blur-sm">
                  {trek.altitude}
                </span>
              </div>

              <div className="p-6 flex-1 flex flex-col justify-between text-left">
                <div>
                  <h3 className="text-xl font-bold text-white mb-1 group-hover:text-cyan-400 transition-colors">
                    {trek.name}
                  </h3>
                  <p className="text-xs text-cyan-400 font-semibold flex items-center gap-1.5 mb-3">
                    <FiMapPin /> {trek.location}
                  </p>
                  <p className="text-sm text-gray-300/80 line-clamp-2 mb-4 leading-relaxed font-light">
                    {trek.description}
                  </p>

                  <div className="flex flex-wrap gap-1.5 mb-6">
                    {trek.highlights.map((h, i) => (
                      <span key={i} className="text-[11px] px-2.5 py-1 rounded-lg bg-white/5 border border-white/10 text-gray-300">
                        ✓ {h}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="flex items-center justify-between border-t border-white/10 pt-4 mt-auto">
                  <div>
                    <span className="block text-[10px] text-gray-400 uppercase tracking-wider font-semibold">Starting From</span>
                    <span className="text-xl font-black text-white">{trek.price}</span>
                  </div>
                  <button
                    onClick={() => navigate(`/trips/${trek.id}`)}
                    className="px-5 py-2.5 rounded-full bg-gradient-to-r from-[#ff6b4a] to-[#ff884b] hover:from-[#ff5833] hover:to-[#ff7938] text-white text-xs font-bold uppercase tracking-wider shadow-lg transition-all cursor-pointer"
                  >
                    Book Expedition
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  );
}

export default Trekking;
