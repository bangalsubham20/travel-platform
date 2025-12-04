import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, useScroll, useTransform, useInView, animate, useMotionValue } from 'framer-motion';
import SearchBar from '../components/home/SearchBar';
import { FiArrowRight, FiCheck, FiStar, FiTrendingUp, FiUsers, FiMapPin, FiCalendar, FiActivity } from 'react-icons/fi';

import { useRef } from 'react';

const StatItem = ({ stat, index }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const count = useMotionValue(0);
  const rounded = useTransform(count, (latest) => Math.round(latest));

  useEffect(() => {
    if (isInView) {
      const numericValue = parseInt(stat.number.replace(/\D/g, '')) || 0;
      animate(count, numericValue, { duration: 2.5, ease: "easeOut" });
    }
  }, [isInView, stat.number, count]);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 50, scale: 0.9 }}
      animate={isInView ? { opacity: 1, y: 0, scale: 1 } : {}}
      transition={{ duration: 0.8, delay: index * 0.15, type: "spring", bounce: 0.4 }}
      whileHover={{ y: -10, scale: 1.05, backgroundColor: "rgba(20, 184, 166, 0.1)" }}
      className="relative p-8 rounded-3xl border border-white/5 bg-white/5 backdrop-blur-sm group cursor-pointer transition-colors duration-300 hover:border-cyan-500/30 hover:shadow-[0_0_30px_rgba(0,229,255,0.15)]"
    >
      <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-3xl" />

      <div className="relative z-10">
        <div className="inline-flex p-4 rounded-2xl bg-gradient-to-br from-cyan-500/20 to-teal-500/20 text-cyan-400 mb-6 border border-cyan-500/20 group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300 shadow-lg shadow-cyan-900/20">
          <stat.icon size={28} />
        </div>

        <h3 className="text-5xl md:text-6xl font-black text-white mb-2 flex justify-center items-baseline tracking-tight">
          <motion.span>{rounded}</motion.span>
          <span className="text-cyan-500 ml-1 text-3xl md:text-4xl">{stat.number.replace(/\d/g, '')}</span>
        </h3>

        <p className="text-grey-400 font-medium uppercase tracking-widest text-xs group-hover:text-cyan-300 transition-colors">
          {stat.label}
        </p>
      </div>
    </motion.div>
  );
};

function Home() {
  const navigate = useNavigate();
  const { scrollY } = useScroll();
  const y1 = useTransform(scrollY, [0, 500], [0, 200]);
  const y2 = useTransform(scrollY, [0, 500], [0, -150]);
  const [activeCategory, setActiveCategory] = useState(1);

  const featuredTrips = [
    {
      id: 1,
      title: 'Mystic Himalayas',
      price: '₹18,500',
      desc: 'Traverse the ancient trails of the Himalayas, where snow-capped peaks meet the endless sky.',
      img: 'https://images.unsplash.com/photo-1518098268026-4e1877a1c37b?q=80&w=2070&auto=format&fit=crop',
      rating: 4.9,
      duration: '8 Days',
      difficulty: 'Moderate',
      tag: 'Bestseller',
    },
    {
      id: 2,
      title: 'Coastal Odyssey',
      price: '₹22,000',
      desc: 'Discover the untouched beaches and hidden coves of the Konkan coast.',
      img: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=2073&auto=format&fit=crop',
      rating: 4.8,
      duration: '5 Days',
      difficulty: 'Easy',
      tag: 'Trending',
    },
    {
      id: 3,
      title: 'Spiti: The Middle Land',
      price: '₹27,000',
      desc: 'A journey through the stark, hauntingly beautiful landscapes of the cold desert.',
      img: 'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?q=80&w=2070&auto=format&fit=crop',
      rating: 4.9,
      duration: '10 Days',
      difficulty: 'Challenging',
      tag: 'Adventure',
    },
  ];

  const categories = [
    {
      id: 1,
      name: 'Trekking',
      desc: 'Conquer the peaks',
      icon: '🏔️',
      image: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=2070&auto=format&fit=crop'
    },
    {
      id: 2,
      name: 'Backpacking',
      desc: 'Travel light, travel far',
      icon: '🎒',
      image: 'https://images.unsplash.com/photo-1501555088652-021faa106b9b?q=80&w=2073&auto=format&fit=crop'
    },
    {
      id: 3,
      name: 'Biking',
      desc: 'Ride the wind',
      icon: '🏍️',
      image: 'https://images.unsplash.com/photo-1558981403-c5f9899a28bc?q=80&w=2070&auto=format&fit=crop'
    },
    {
      id: 4,
      name: 'Camping',
      desc: 'Sleep under stars',
      icon: '🏕️',
      image: 'https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?q=80&w=2070&auto=format&fit=crop'
    },
    {
      id: 5,
      name: 'Coastal',
      desc: 'Sun, sand, and sea',
      icon: '🌊',
      image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=2073&auto=format&fit=crop'
    },
    {
      id: 6,
      name: 'Wildlife',
      desc: 'Into the wild',
      icon: '🦁',
      image: 'https://images.unsplash.com/photo-1564349683136-77e08dba1ef7?q=80&w=2072&auto=format&fit=crop'
    },
  ];

  return (
    <div className="text-white overflow-hidden font-sans selection:bg-cyan-500 selection:text-teal-900">

      {/* Hero Section */}
      <div className="relative h-screen w-full overflow-hidden">
        {/* Background Image with Parallax */}
        <motion.div
          style={{ y: y1 }}
          className="absolute inset-0 z-0"
        >
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-teal-900/20 to-teal-900 z-10" />
          <img
            src="https://images.unsplash.com/photo-1469474968028-56623f02e42e?q=80&w=2074&auto=format&fit=crop"
            alt="Hero Background"
            className="w-full h-full object-cover scale-110"
          />

          {/* Hero Floating Particles */}
          {[...Array(15)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute rounded-full bg-cyan-400/30 blur-sm z-10"
              style={{
                width: Math.random() * 4 + 2,
                height: Math.random() * 4 + 2,
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
              animate={{
                y: [0, -100, 0],
                x: [0, Math.random() * 50 - 25, 0],
                opacity: [0, 0.8, 0],
                scale: [0, 1.5, 0],
              }}
              transition={{
                duration: Math.random() * 10 + 10,
                repeat: Infinity,
                ease: "easeInOut",
                delay: Math.random() * 5,
              }}
            />
          ))}
        </motion.div>

        {/* Hero Content */}
        <div className="relative z-20 h-full flex flex-col justify-center items-center text-center px-4 max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.2 }}
          >
            <h2 className="text-cyan-400 font-bold tracking-[0.2em] uppercase mb-4 text-sm md:text-base">
              Discover the Untamed
            </h2>
            <h1 className="text-6xl md:text-8xl lg:text-9xl font-display font-black text-white mb-8 tracking-tight leading-none">
              WILD<span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-teal-500">SOUL</span>
            </h1>
            <p className="text-xl md:text-2xl text-grey-400 max-w-2xl mx-auto mb-12 font-light leading-relaxed">
              Join a community of explorers seeking the raw beauty of nature.
              Your next great adventure begins here.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="w-full max-w-3xl"
          >
            <SearchBar />
          </motion.div>
        </div>

        {/* Scroll Indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5, duration: 1 }}
          className="absolute bottom-10 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-2"
        >
          <span className="text-xs uppercase tracking-widest text-white/50">Scroll to Explore</span>
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="w-px h-12 bg-gradient-to-b from-cyan-500 to-transparent"
          />
        </motion.div>
      </div>

      {/* Featured Trips Section */}
      <section className="py-32 px-4 relative z-10 bg-teal-900">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
            <div>
              <h2 className="text-4xl md:text-6xl font-display font-bold text-white mb-4">
                Curated <span className="text-cyan-400">Expeditions</span>
              </h2>
              <p className="text-grey-400 text-lg max-w-xl">
                Handpicked adventures designed to challenge your limits and soothe your soul.
              </p>
            </div>
            <button
              onClick={() => navigate('/trips')}
              className="group flex items-center gap-2 text-cyan-400 font-bold uppercase tracking-wider hover:text-white transition-colors"
            >
              View All Trips
              <FiArrowRight className="group-hover:translate-x-1 transition-transform" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {featuredTrips.map((trip, idx) => (
              <motion.div
                key={trip.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.2 }}
                viewport={{ once: true }}
                onClick={() => navigate(`/trips/${trip.id}`)}
                className="group relative h-[500px] rounded-3xl overflow-hidden cursor-pointer"
              >
                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/0 transition-colors duration-500 z-10" />
                <img
                  src={trip.img}
                  alt={trip.title}
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent z-20" />

                <div className="absolute top-6 left-6 z-30">
                  <span className="px-4 py-2 bg-cyan-500/20 backdrop-blur-md border border-cyan-500/30 text-cyan-400 text-xs font-bold uppercase tracking-wider rounded-full">
                    {trip.tag}
                  </span>
                </div>

                <div className="absolute bottom-0 left-0 right-0 p-8 z-30 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-2xl font-bold text-white leading-tight group-hover:text-cyan-400 transition-colors">
                      {trip.title}
                    </h3>
                    <div className="flex items-center gap-1 text-yellow-400 font-bold bg-black/30 px-2 py-1 rounded-lg backdrop-blur-sm">
                      <FiStar size={14} fill="currentColor" /> {trip.rating}
                    </div>
                  </div>

                  <p className="text-grey-400 text-sm mb-6 line-clamp-2 opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-100">
                    {trip.desc}
                  </p>

                  <div className="flex items-center justify-between border-t border-white/10 pt-4">
                    <div className="flex gap-4 text-xs font-medium text-grey-300 uppercase tracking-wide">
                      <span className="flex items-center gap-1"><FiCalendar className="text-cyan-500" /> {trip.duration}</span>
                      <span className="flex items-center gap-1"><FiActivity className="text-cyan-500" /> {trip.difficulty}</span>
                    </div>
                    <span className="text-xl font-bold text-white">{trip.price}</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Categories Section - Cinematic Expandable Gallery */}
      <section className="py-32 bg-teal-900 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-6xl font-display font-bold text-white mb-4">
              Choose Your <span className="text-cyan-400">Adventure</span>
            </h2>
            <p className="text-xl text-grey-400">Explore the world your way</p>
          </motion.div>

          <div className="flex flex-col lg:flex-row gap-4 h-[600px] w-full">
            {categories.map((cat) => (
              <motion.div
                key={cat.id}
                layout
                transition={{ type: 'spring', stiffness: 200, damping: 20 }}
                onClick={() => setActiveCategory(cat.id)}
                onHoverStart={() => setActiveCategory(cat.id)}
                className={`relative rounded-3xl overflow-hidden cursor-pointer ${activeCategory === cat.id
                  ? 'lg:flex-[3] flex-[3] ring-2 ring-cyan-500/50 shadow-[0_0_30px_rgba(0,229,255,0.2)]'
                  : 'lg:flex-[0.5] flex-[1] grayscale hover:grayscale-0'
                  }`}
              >
                {/* Background Image */}
                <motion.img
                  src={cat.image}
                  alt={cat.name}
                  animate={{ scale: activeCategory === cat.id ? 1.1 : 1 }}
                  transition={{ duration: 0.7 }}
                  className="absolute inset-0 w-full h-full object-cover"
                />

                {/* Overlay */}
                <div className={`absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black/90 transition-opacity duration-300 ${activeCategory === cat.id ? 'opacity-80' : 'opacity-60 hover:opacity-40'
                  }`} />

                {/* Content */}
                <div className="absolute inset-0 flex flex-col justify-end p-8">
                  <motion.div
                    layout="position"
                    className={`transition-all duration-500 ${activeCategory === cat.id ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-70'
                      }`}>
                    <motion.div
                      layout="position"
                      className="text-4xl mb-2"
                    >
                      {cat.icon}
                    </motion.div>
                    <motion.h3
                      layout="position"
                      className={`font-display font-bold text-white mb-2 transition-all duration-300 ${activeCategory === cat.id ? 'text-3xl md:text-4xl' : 'text-xl rotate-0 lg:-rotate-90 lg:origin-bottom-left lg:translate-x-8 lg:-translate-y-8 whitespace-nowrap'
                        }`}>
                      {cat.name}
                    </motion.h3>

                    {activeCategory === cat.id && (
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2, duration: 0.3 }}
                      >
                        <p className="text-grey-300 mb-4 text-lg">{cat.desc}</p>
                        <button className="px-6 py-2 bg-cyan-500/20 border border-cyan-500/50 rounded-full text-cyan-400 text-sm font-bold uppercase tracking-wider hover:bg-cyan-500 hover:text-teal-900 transition-all shadow-[0_0_15px_rgba(0,229,255,0.3)]">
                          Explore
                        </button>
                      </motion.div>
                    )}
                  </motion.div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-32 px-4 bg-teal-900 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-5" />
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-12">
            {[
              { number: '50K+', label: 'Explorers', icon: FiUsers },
              { number: '500+', label: 'Expeditions', icon: FiMapPin },
              { number: '10K+', label: 'Reviews', icon: FiStar },
              { number: '100%', label: 'Adventure', icon: FiTrendingUp },
            ].map((stat, idx) => (
              <StatItem key={idx} stat={stat} index={idx} />
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-32 px-4 bg-teal-900 relative overflow-hidden">
        <div className="absolute inset-0">
          <motion.img
            initial={{ scale: 1 }}
            whileInView={{ scale: 1.1 }}
            transition={{ duration: 10, ease: "linear" }}
            src="https://images.unsplash.com/photo-1533240332313-0db49b459ad6?q=80&w=2066&auto=format&fit=crop"
            alt="CTA Background"
            className="w-full h-full object-cover opacity-20"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-teal-900 via-teal-900/80 to-transparent" />

          {/* Floating Particles */}
          {[...Array(5)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute rounded-full bg-cyan-500/20 blur-xl"
              style={{
                width: Math.random() * 200 + 50,
                height: Math.random() * 200 + 50,
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
              animate={{
                y: [0, -50, 0],
                x: [0, 30, 0],
                opacity: [0.2, 0.5, 0.2],
              }}
              transition={{
                duration: Math.random() * 5 + 5,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />
          ))}
        </div>

        <div className="max-w-4xl mx-auto text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-5xl md:text-7xl font-display font-black text-white mb-8">
              The Wild is <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-teal-400 animate-pulse-slow">Calling</span>
            </h2>
            <p className="text-xl text-grey-300 mb-12 max-w-2xl mx-auto leading-relaxed">
              Don't let another adventure pass you by. Join our community today and start writing your own story.
            </p>
          </motion.div>

          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <motion.button
              onClick={() => navigate('/register')}
              whileHover={{ scale: 1.05, boxShadow: "0 0 40px rgba(0,229,255,0.4)" }}
              whileTap={{ scale: 0.95 }}
              className="px-10 py-4 bg-cyan-500 text-teal-900 font-bold text-lg rounded-full transition-all relative overflow-hidden group"
            >
              <span className="relative z-10">Start Your Journey</span>
              <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
            </motion.button>

            <motion.button
              onClick={() => navigate('/trips')}
              whileHover={{ scale: 1.05, backgroundColor: "rgba(255,255,255,0.1)" }}
              whileTap={{ scale: 0.95 }}
              className="px-10 py-4 bg-transparent border border-white/30 text-white font-bold text-lg rounded-full transition-all backdrop-blur-sm"
            >
              Browse Trips
            </motion.button>
          </div>
        </div>
      </section>

    </div>
  );
}

export default Home;
