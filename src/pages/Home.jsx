import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import SearchBar from '../components/home/SearchBar';
import Button from '../components/common/Button';
import Card from '../components/common/Card';
import { FiArrowRight, FiCheck, FiStar, FiTrendingUp, FiUsers } from 'react-icons/fi';

function Home() {
  const navigate = useNavigate();
  const [activeCategory, setActiveCategory] = useState(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.15, delayChildren: 0.2 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: 'easeOut' },
    },
  };

  const slideInVariants = {
    hidden: { opacity: 0, x: -60 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.8, ease: 'easeOut' },
    },
  };

  const featuredTrips = [
    {
      id: 1,
      title: 'Himalayan Adventure',
      price: '₹18,500',
      desc: 'Trek through scenic mountain trails and experience the thrill of nature.',
      img: 'https://images.pexels.com/photos/2161499/pexels-photo-2161499.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
      rating: 4.8,
      duration: '8 days',
      difficulty: 'Moderate',
      tag: 'Popular',
    },
    {
      id: 2,
      title: 'Goa Beach Escape',
      price: '₹22,000',
      desc: 'Relax, surf, and party at India\'s most vibrant coastal paradise.',
      img: 'https://images.pexels.com/photos/3552472/pexels-photo-3552472.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
      rating: 4.9,
      duration: '5 days',
      difficulty: 'Easy',
      tag: 'Featured',
    },
    {
      id: 3,
      title: 'Spiti Valley Expedition',
      price: '₹27,000',
      desc: 'Explore the cold desert\'s breathtaking beauty and monasteries.',
      img: 'https://images.pexels.com/photos/31307356/pexels-photo-31307356/free-photo-of-spectacular-view-of-key-monastery-in-winter.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
      rating: 4.7,
      duration: '10 days',
      difficulty: 'Hard',
      tag: 'Trending',
    },
  ];

  const categories = [
    { icon: '⛰️', name: 'Trekking', color: 'from-blue-400 to-blue-600' },
    { icon: '🎒', name: 'Backpacking', color: 'from-purple-400 to-purple-600' },
    { icon: '👩‍👩‍👩', name: 'All Girls', color: 'from-pink-400 to-pink-600' },
    { icon: '🏍️', name: 'Biking', color: 'from-orange-400 to-orange-600' },
    { icon: '🏕️', name: 'Weekend', color: 'from-green-400 to-green-600' },
    { icon: '✈️', name: 'International', color: 'from-indigo-400 to-indigo-600' },
  ];

  const testimonials = [
    {
      id: 1,
      name: 'Priya Singh',
      location: 'Delhi',
      text: 'WravelCommunity changed my travel life! Met amazing people and created unforgettable memories.',
      rating: 5,
      image: 'https://i.pravatar.cc/80?img=1',
      role: 'Adventure Enthusiast',
    },
    {
      id: 2,
      name: 'Rahul Kumar',
      location: 'Mumbai',
      text: 'Best experience ever! Professional team, perfect itinerary, and wonderful group bonding.',
      rating: 5,
      image: 'https://i.pravatar.cc/80?img=2',
      role: 'Travel Blogger',
    },
    {
      id: 3,
      name: 'Anjali Sharma',
      location: 'Bangalore',
      text: 'Loved every moment! Safe, fun, educational, and truly memorable adventure!',
      rating: 5,
      image: 'https://i.pravatar.cc/80?img=3',
      role: 'Photographer',
    },
  ];

  const features = [
    { icon: '🔒', title: 'Secure Bookings', desc: 'Safe & verified payments', color: 'from-blue-500 to-cyan-500' },
    { icon: '🛡️', title: 'Travel Insurance', desc: 'Up to ₹4.5 lakhs coverage', color: 'from-purple-500 to-pink-500' },
    { icon: '👥', title: 'Verified Community', desc: 'Trusted travelers only', color: 'from-green-500 to-emerald-500' },
    { icon: '⭐', title: 'Rated 4.8★', desc: 'Thousands of happy travelers', color: 'from-orange-500 to-red-500' },
  ];

  return (
    <div className="bg-black text-white overflow-hidden">
      {/* Hero Section with Parallax */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
        className="relative min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 overflow-hidden flex items-center"
      >
        {/* Animated Background Elements */}
        <motion.div
          animate={{
            x: mousePosition.x * 0.05,
            y: mousePosition.y * 0.05,
          }}
          className="absolute -top-40 -right-40 w-96 h-96 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-full blur-3xl"
        />
        <motion.div
          animate={{
            x: -mousePosition.x * 0.03,
            y: -mousePosition.y * 0.03,
          }}
          className="absolute -bottom-40 -left-40 w-96 h-96 bg-gradient-to-tr from-blue-500/20 to-cyan-500/20 rounded-full blur-3xl"
        />
        <motion.div
          animate={{ y: [0, 30, 0] }}
          transition={{ duration: 6, repeat: Infinity }}
          className="absolute top-1/2 left-1/2 w-72 h-72 bg-gradient-to-r from-indigo-500/10 to-purple-500/10 rounded-full blur-3xl"
        />

        {/* Content */}
        <div className="relative w-full max-w-7xl mx-auto px-4 py-20 z-10">
          <motion.h1
            initial={{ opacity: 0, y: -60 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.1 }}
            className="text-6xl md:text-8xl font-black mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400"
          >
            Wander. Travel. Connect.
          </motion.h1>

          <motion.div
            initial={{ opacity: 0, y: -40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="text-2xl md:text-3xl text-gray-300 mb-12 max-w-2xl leading-relaxed"
          >
            Join India's largest community of adventure seekers and explore hidden gems with like-minded travelers
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="w-full max-w-2xl mb-12"
          >
            <SearchBar />
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.7 }}
            className="flex flex-col sm:flex-row gap-6"
          >
            <motion.div
              whileHover={{ scale: 1.08, y: -5 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button
                size="lg"
                onClick={() => navigate('/trips')}
                className="text-lg px-8 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 shadow-xl"
              >
                🧳 Explore Trips
              </Button>
            </motion.div>
            <motion.div
              whileHover={{ scale: 1.08, y: -5 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button
                size="lg"
                onClick={() => navigate('/register')}
                className="text-lg px-8 border-2 border-purple-400 text-purple-400 hover:bg-purple-400 hover:text-white transition-all"
              >
                🚀 Get Started
              </Button>
            </motion.div>
          </motion.div>
        </div>
      </motion.div>

      {/* Featured Trips */}
      <motion.section
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 1 }}
        viewport={{ once: true }}
        className="py-24 px-4 relative"
      >
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: -40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-5xl md:text-6xl font-black mb-4">
              🌍 Featured <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400">Trips</span>
            </h2>
            <p className="text-xl text-gray-400">Handpicked adventures for the perfect getaway</p>
          </motion.div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
          >
            {featuredTrips.map((trip, idx) => (
              <motion.div
                key={trip.id}
                variants={itemVariants}
                whileHover={{ y: -15, boxShadow: '0 30px 60px rgba(139, 92, 246, 0.3)' }}
                onClick={() => navigate(`/trips/${trip.id}`)}
                className="group relative bg-gradient-to-b from-slate-800 to-slate-900 rounded-2xl overflow-hidden cursor-pointer border border-slate-700 hover:border-purple-500 transition-all"
              >
                {/* Image Container */}
                <div className="relative h-64 overflow-hidden bg-slate-700">
                  <motion.img
                    src={trip.img}
                    alt={trip.title}
                    className="w-full h-full object-cover"
                    whileHover={{ scale: 1.15 }}
                    transition={{ duration: 0.6 }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent" />

                  {/* Tags */}
                  <div className="absolute top-4 left-4 flex gap-2">
                    <motion.span
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="px-3 py-1 bg-gradient-to-r from-purple-500 to-pink-500 text-white text-xs font-bold rounded-full"
                    >
                      {trip.tag}
                    </motion.span>
                  </div>

                  {/* Rating Badge */}
                  <motion.div
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.3 }}
                    className="absolute top-4 right-4 flex items-center gap-1 bg-yellow-400/90 text-slate-900 px-3 py-1 rounded-full font-bold shadow-lg"
                  >
                    ⭐ {trip.rating}
                  </motion.div>
                </div>

                {/* Content */}
                <div className="p-6">
                  <h3 className="text-2xl font-bold text-white mb-2 group-hover:text-purple-400 transition">{trip.title}</h3>
                  <p className="text-gray-400 text-sm mb-4 line-clamp-2">{trip.desc}</p>

                  {/* Meta */}
                  <div className="flex gap-4 mb-4 text-xs text-gray-500">
                    <span>⏱️ {trip.duration}</span>
                    <span>📊 {trip.difficulty}</span>
                  </div>

                  <div className="flex justify-between items-center pt-4 border-t border-slate-700">
                    <span className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">
                      {trip.price}
                    </span>
                    <motion.button
                      whileHover={{ x: 5 }}
                      className="text-purple-400 hover:text-purple-300"
                    >
                      <FiArrowRight size={24} />
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            viewport={{ once: true }}
            className="text-center mt-16"
          >
            <Button
              size="lg"
              onClick={() => navigate('/trips')}
              className="border-2 border-purple-400 text-purple-400 hover:bg-purple-400 hover:text-white px-12"
            >
              See All Trips <FiArrowRight className="inline ml-2" size={20} />
            </Button>
          </motion.div>
        </div>
      </motion.section>

      {/* Categories Section */}
      <motion.section
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 1 }}
        viewport={{ once: true }}
        className="py-24 px-4"
      >
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: -40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-5xl md:text-6xl font-black mb-4">
              📂 Explore <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400">Categories</span>
            </h2>
            <p className="text-xl text-gray-400">Find trips that match your travel style</p>
          </motion.div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6"
          >
            {categories.map((cat, i) => (
              <motion.div
                key={i}
                variants={itemVariants}
                whileHover={{ scale: 1.15, y: -10 }}
                onMouseEnter={() => setActiveCategory(i)}
                onMouseLeave={() => setActiveCategory(null)}
                className={`relative p-6 rounded-2xl cursor-pointer group overflow-hidden border border-slate-700 hover:border-purple-500 transition-all ${
                  activeCategory === i
                    ? 'bg-gradient-to-br ' + cat.color
                    : 'bg-slate-800/50 hover:bg-slate-800'
                }`}
              >
                <motion.div
                  animate={{ y: [0, -10, 0] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="text-6xl mb-3"
                >
                  {cat.icon}
                </motion.div>
                <p className={`font-bold text-lg transition-colors ${
                  activeCategory === i ? 'text-white' : 'text-gray-300 group-hover:text-white'
                }`}>
                  {cat.name}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </motion.section>

      {/* Stats Section */}
      <motion.section
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 1 }}
        viewport={{ once: true }}
        className="py-24 px-4 bg-gradient-to-r from-slate-900 via-purple-900/30 to-slate-900"
      >
        <div className="max-w-7xl mx-auto">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-2 md:grid-cols-4 gap-8"
          >
            {[
              { number: '50K+', label: 'Active Members', icon: FiUsers },
              { number: '500+', label: 'Amazing Trips', icon: FiTrendingUp },
              { number: '10K+', label: 'Happy Travelers', icon: FiCheck },
              { number: '4.8★', label: 'Average Rating', icon: FiStar },
            ].map((stat, i) => {
              const IconComponent = stat.icon;
              return (
                <motion.div
                  key={i}
                  variants={itemVariants}
                  whileHover={{ scale: 1.1, y: -5 }}
                  className="text-center"
                >
                  <motion.div
                    animate={{ y: [0, -5, 0] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="text-5xl md:text-6xl font-black mb-3 text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400"
                  >
                    {stat.number}
                  </motion.div>
                  <div className="flex items-center justify-center gap-2 text-gray-300">
                    <IconComponent size={20} />
                    <p>{stat.label}</p>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </motion.section>

      {/* Testimonials */}
      <motion.section
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 1 }}
        viewport={{ once: true }}
        className="py-24 px-4"
      >
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: -40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-5xl md:text-6xl font-black mb-4">
              💬 What Travelers <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400">Say</span>
            </h2>
            <p className="text-xl text-gray-400">Join thousands of satisfied adventurers</p>
          </motion.div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
          >
            {testimonials.map((testimonial) => (
              <motion.div
                key={testimonial.id}
                variants={itemVariants}
                whileHover={{ y: -10, boxShadow: '0 20px 40px rgba(139, 92, 246, 0.2)' }}
                className="bg-gradient-to-br from-slate-800 to-slate-900 p-8 rounded-2xl border border-slate-700 hover:border-purple-500 transition-all"
              >
                <div className="flex gap-1 mb-4">
                  {Array.from({ length: testimonial.rating }).map((_, i) => (
                    <motion.span
                      key={i}
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: i * 0.1 }}
                      className="text-2xl"
                    >
                      ⭐
                    </motion.span>
                  ))}
                </div>

                <p className="text-gray-300 mb-6 italic">"{testimonial.text}"</p>

                <div className="flex items-center gap-4 pt-6 border-t border-slate-700">
                  <img
                    src={testimonial.image}
                    alt={testimonial.name}
                    className="w-12 h-12 rounded-full"
                  />
                  <div>
                    <p className="font-bold text-white">{testimonial.name}</p>
                    <p className="text-sm text-gray-500">{testimonial.role} • {testimonial.location}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </motion.section>

      {/* Features */}
      <motion.section
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 1 }}
        viewport={{ once: true }}
        className="py-24 px-4"
      >
        <div className="max-w-7xl mx-auto">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
          >
            {features.map((feature, i) => (
              <motion.div
                key={i}
                variants={itemVariants}
                whileHover={{ scale: 1.08, y: -10 }}
                className={`p-6 rounded-xl bg-gradient-to-br ${feature.color} text-white border border-slate-700 hover:border-white transition-all shadow-xl`}
              >
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
                  className="text-5xl mb-4"
                >
                  {feature.icon}
                </motion.div>
                <h3 className="font-bold text-lg mb-2">{feature.title}</h3>
                <p className="text-white/80 text-sm">{feature.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </motion.section>

      {/* CTA */}
      <motion.section
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 1 }}
        viewport={{ once: true }}
        className="py-24 px-4 bg-gradient-to-r from-purple-900 via-slate-900 to-purple-900"
      >
        <div className="max-w-4xl mx-auto text-center">
          <motion.h2
            initial={{ opacity: 0, y: -40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-5xl md:text-7xl font-black mb-6 text-white"
          >
            Ready for Your Next Adventure?
          </motion.h2>

          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
            className="text-xl text-gray-300 mb-12"
          >
            Join our community today and start exploring amazing destinations
          </motion.p>

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            viewport={{ once: true }}
            className="flex flex-col sm:flex-row gap-6 justify-center"
          >
            <motion.div whileHover={{ scale: 1.08, y: -5 }} whileTap={{ scale: 0.95 }}>
              <Button
                onClick={() => navigate('/register')}
                className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white text-lg px-12 shadow-2xl"
                size="lg"
              >
                Sign Up Now 🚀
              </Button>
            </motion.div>
            <motion.div whileHover={{ scale: 1.08, y: -5 }} whileTap={{ scale: 0.95 }}>
              <Button
                onClick={() => navigate('/trips')}
                className="border-2 border-purple-400 text-purple-400 hover:bg-purple-400 hover:text-white text-lg px-12"
                size="lg"
              >
                Explore Trips
              </Button>
            </motion.div>
          </motion.div>
        </div>
      </motion.section>

      {/* Footer */}
      <motion.footer
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.7 }}
        viewport={{ once: true }}
        className="py-12 px-4 border-t border-slate-700"
      >
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            {[
              { icon: '🔒', text: 'Secure Bookings' },
              { icon: '🛡️', text: 'Travel Insurance' },
              { icon: '👥', text: 'Verified Community' },
              { icon: '⭐', text: 'Highly Rated' },
            ].map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ delay: i * 0.1 }}
                viewport={{ once: true }}
                className="text-center text-gray-400"
              >
                <p className="text-2xl mb-2">{item.icon}</p>
                <p className="text-sm">{item.text}</p>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center text-gray-500 border-t border-slate-700 pt-8"
          >
            <p>© 2025 WravelCommunity. Made with ❤️ for adventurers.</p>
          </motion.div>
        </div>
      </motion.footer>
    </div>
  );
}

export default Home;
