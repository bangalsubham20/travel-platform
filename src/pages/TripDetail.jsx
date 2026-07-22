import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FiMapPin, FiCalendar, FiUsers, FiStar, FiClock, FiCheck, FiX, FiShield, FiAward, FiHeart, FiTrendingUp } from 'react-icons/fi';
import { useAuth } from '../hooks/useAuth';
import Button from '../components/common/Button';
import LoadingSpinner from '../components/common/LoadingSpinner';
import Card from '../components/common/Card';
import tripService from '../services/tripService';
import MapComponent from '../components/common/MapComponent';


function TripDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [rawTrip, setRawTrip] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');
  const [isFavorite, setIsFavorite] = useState(false);



  const tabs = [
    { key: 'overview', label: 'Overview', icon: FiMapPin },
    { key: 'itinerary', label: 'Itinerary', icon: FiCalendar },
    { key: 'includes', label: 'Includes', icon: FiCheck },
    { key: 'reviews', label: 'Reviews', icon: FiStar }
  ];

  useEffect(() => {
    const fetchTripData = async () => {
      try {
        setLoading(true);
        setError(null);
        const tripData = await tripService.getTripById(id);
        setRawTrip(tripData);
      } catch (err) {
        console.error('Error fetching trip data:', err);
        setError('Failed to load trip details');
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchTripData();
  }, [id]);

  // Helper to safely parse array fields
  const parseList = (data) => {
    if (!data) return [];
    if (Array.isArray(data)) return data;
    if (typeof data === 'string') {
      try {
        // Try JSON parse first
        const parsed = JSON.parse(data);
        if (Array.isArray(parsed)) return parsed;
      } catch (e) {
        // If not JSON, try splitting by comma if it looks like a CSV list
        // But for itinerary (objects), splitting won't work well.
        // For highlights (strings), it might.
        return data.split(',').map(item => item.trim());
      }
    }
    return [];
  };

  // Safe trip object with parsed fields
  const trip = rawTrip ? {
    ...rawTrip,
    highlights: parseList(rawTrip.highlights),
    itinerary: parseList(rawTrip.itinerary),
    inclusions: parseList(rawTrip.inclusions),
    exclusions: parseList(rawTrip.exclusions),
    tripReviews: rawTrip.tripReviews || []
  } : null;

  if (loading) return <LoadingSpinner />;

  if (error || !trip) {
    return (
      <div className="min-h-screen bg-teal-900 flex items-center justify-center px-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-12 max-w-md text-center shadow-2xl"
        >
          <FiX size={64} className="text-red-400 mx-auto mb-4" />
          <p className="text-2xl text-white font-bold mb-2">{error || 'Trip not found'}</p>
          <p className="text-grey-400 mb-6">The trip you're looking for doesn't exist</p>
          <Button onClick={() => navigate('/trips')}>Back to Trips</Button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen bg-teal-900 text-white overflow-x-hidden font-sans selection:bg-cyan-500 selection:text-teal-900">

      {/* Hero Section */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
        className="relative h-[70vh] overflow-hidden"
      >
        {/* Hero Image with Parallax */}
        <motion.div
          className="absolute inset-0"
          initial={{ scale: 1.1 }}
          animate={{ scale: 1 }}
          transition={{ duration: 1.5 }}
        >
          <img
            src={trip.image}
            alt={trip.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-teal-900 via-teal-900/50 to-transparent" />
        </motion.div>

        {/* Hero Content */}
        <div className="absolute inset-0 flex items-end">
          <div className="max-w-7xl mx-auto px-4 pb-16 w-full">
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <motion.div
                className="inline-block px-4 py-2 bg-cyan-500/20 border border-cyan-500/30 rounded-full text-cyan-300 text-sm font-bold mb-4 backdrop-blur-lg"
                whileHover={{ scale: 1.05 }}
              >
                {trip.difficulty} • {trip.duration} Days
              </motion.div>

              <h1 className="text-4xl md:text-7xl font-display font-black mb-4 text-white tracking-tight">
                {trip.name}
              </h1>

              <div className="flex flex-wrap items-center gap-6 text-grey-300">
                <div className="flex items-center gap-2">
                  <FiMapPin className="text-cyan-400" size={20} />
                  <span className="font-semibold">{trip.destination}</span>
                </div>
                <div className="flex items-center gap-2">
                  <FiStar className="text-yellow-400" size={20} />
                  <span className="font-semibold">{trip.rating} ({trip.reviews} reviews)</span>
                </div>
                <div className="flex items-center gap-2">
                  <FiUsers className="text-green-400" size={20} />
                  <span className="font-semibold">{trip.availableSeats} seats left</span>
                </div>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Favorite Button */}
        <motion.button
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.5 }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => setIsFavorite(!isFavorite)}
          className="absolute top-24 right-8 p-4 backdrop-blur-xl bg-black/20 border border-white/10 rounded-full shadow-2xl hover:bg-black/40 transition-all z-20"
        >
          <FiHeart
            size={24}
            className={`${isFavorite ? 'fill-red-500 text-red-500' : 'text-white'} transition-all`}
          />
        </motion.button>
      </motion.div>

      {/* Main Content */}
      <div className="relative max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Quick Stats */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="grid grid-cols-2 md:grid-cols-4 gap-4"
            >
              {[
                { icon: FiClock, label: 'Duration', value: `${trip.duration} days`, color: 'cyan' },
                { icon: FiCalendar, label: 'Start Date', value: trip.startDate.split(',')[0], color: 'teal' },
                { icon: FiTrendingUp, label: 'Altitude', value: trip.altitude, color: 'green' },
                { icon: FiUsers, label: 'Group Size', value: trip.groupSize, color: 'orange' }
              ].map((stat, idx) => {
                const Icon = stat.icon;
                return (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.1 }}
                    whileHover={{ y: -5 }}
                  >
                    <div className="p-4 bg-teal-800/30 border border-white/5 rounded-2xl backdrop-blur-md">
                      <Icon className={`text-${stat.color}-400 mb-2`} size={24} />
                      <p className="text-grey-400 text-xs mb-1 uppercase tracking-wider">{stat.label}</p>
                      <p className="text-white font-bold">{stat.value}</p>
                    </div>
                  </motion.div>
                );
              })}
            </motion.div>

            {/* Tabs */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="bg-teal-800/30 backdrop-blur-xl border border-white/10 rounded-3xl p-2"
            >
              <div className="flex gap-2 mb-6 overflow-x-auto pb-2 md:pb-0">
                {tabs.map((tab) => {
                  const Icon = tab.icon;
                  return (
                    <motion.button
                      key={tab.key}
                      onClick={() => setActiveTab(tab.key)}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className={`flex-1 flex items-center justify-center gap-2 px-6 py-4 rounded-2xl font-bold transition-all whitespace-nowrap ${activeTab === tab.key
                        ? 'bg-cyan-500 text-teal-900 shadow-lg'
                        : 'text-grey-400 hover:text-white hover:bg-white/5'
                        }`}
                    >
                      <Icon size={18} />
                      <span>{tab.label}</span>
                    </motion.button>
                  );
                })}
              </div>

              {/* Tab Content */}
              <AnimatePresence mode="wait">
                {activeTab === 'overview' && (
                  <motion.div
                    key="overview"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="space-y-8 p-6"
                  >
                    <div>
                      <h2 className="text-2xl font-display font-bold mb-4 text-white">About This Trip</h2>
                      <p className="text-grey-300 leading-relaxed text-lg font-light">{trip.description}</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                      <div className="p-6 bg-white/5 rounded-2xl border border-white/5">
                        <strong className="text-cyan-400 block mb-2 uppercase tracking-wider text-xs">Difficulty</strong>
                        <span className={`px-3 py-1 rounded-full text-sm font-bold ${trip.difficulty === 'Easy' ? 'bg-green-500/20 text-green-300'
                          : trip.difficulty?.includes('Moderate') ? 'bg-yellow-500/20 text-yellow-300'
                            : 'bg-red-500/20 text-red-300'
                          }`}>
                          {trip.difficulty}
                        </span>
                      </div>
                      <div className="p-6 bg-white/5 rounded-2xl border border-white/5">
                        <strong className="text-teal-400 block mb-2 uppercase tracking-wider text-xs">Best Season</strong>
                        <span className="text-white font-medium">{trip.bestSeason}</span>
                      </div>
                    </div>

                    {trip.highlights && (
                      <div>
                        <h3 className="text-xl font-display font-bold mb-6 text-white">Trip Highlights</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {trip.highlights.map((highlight, idx) => (
                            <motion.div
                              key={idx}
                              initial={{ opacity: 0, x: -20 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: idx * 0.05 }}
                              className="flex items-center gap-3 p-4 bg-teal-800/20 border border-white/5 rounded-xl hover:border-cyan-500/30 transition-colors"
                            >
                              <div className="w-8 h-8 rounded-full bg-cyan-500/10 flex items-center justify-center flex-shrink-0">
                                <FiCheck className="text-cyan-400" size={16} />
                              </div>
                              <span className="text-grey-200">{highlight}</span>
                            </motion.div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Map Section */}
                    {trip.latitude && trip.longitude && (
                      <div className="mt-8">
                        <h3 className="text-xl font-display font-bold mb-6 text-white">Trip Location</h3>
                        <MapComponent
                          lat={trip.latitude}
                          lng={trip.longitude}
                          popupText={trip.destination}
                        />
                      </div>
                    )}
                  </motion.div>
                )}

                {activeTab === 'itinerary' && (
                  <motion.div
                    key="itinerary"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="space-y-6 p-6"
                  >
                    <h2 className="text-2xl font-display font-bold mb-6 text-white">Day-by-Day Itinerary</h2>
                    <div className="relative border-l-2 border-white/10 ml-4 space-y-8">
                      {trip.itinerary?.map((day, idx) => (
                        <motion.div
                          key={idx}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: idx * 0.1 }}
                          className="relative pl-8"
                        >
                          <div className="absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-teal-900 border-2 border-cyan-500" />

                          <div className="bg-white/5 border border-white/5 rounded-2xl p-6 hover:bg-white/10 transition-colors">
                            <div className="flex flex-col md:flex-row md:items-center justify-between mb-4 gap-4">
                              <div>
                                <h3 className="text-xl font-bold text-white mb-1">
                                  Day {day.day}: {day.title}
                                </h3>
                                <p className="text-grey-400">{day.description}</p>
                              </div>
                              <span className="px-4 py-2 bg-orange-500/10 border border-orange-500/20 text-orange-300 text-xs font-bold rounded-full whitespace-nowrap self-start md:self-center">
                                {day.meals}
                              </span>
                            </div>

                            {day.activities && (
                              <div className="flex flex-wrap gap-2">
                                {day.activities.map((activity, i) => (
                                  <span
                                    key={i}
                                    className="px-3 py-1 bg-black/20 text-grey-300 text-xs rounded-lg border border-white/5"
                                  >
                                    {activity}
                                  </span>
                                ))}
                              </div>
                            )}
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </motion.div>
                )}

                {activeTab === 'includes' && (
                  <motion.div
                    key="includes"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="space-y-6 p-6"
                  >
                    <div className="bg-green-500/5 border border-green-500/10 rounded-2xl p-8">
                      <h2 className="text-xl font-bold mb-6 text-white flex items-center gap-2">
                        <FiCheck className="text-green-400" /> What's Included
                      </h2>
                      <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {trip.inclusions?.map((inc, idx) => (
                          <motion.li
                            key={idx}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: idx * 0.05 }}
                            className="flex items-center gap-3 text-grey-200"
                          >
                            <div className="w-6 h-6 rounded-full bg-green-500/20 flex items-center justify-center flex-shrink-0">
                              <FiCheck className="text-green-400" size={12} />
                            </div>
                            {inc}
                          </motion.li>
                        ))}
                      </ul>
                    </div>

                    <div className="bg-red-500/5 border border-red-500/10 rounded-2xl p-8">
                      <h2 className="text-xl font-bold mb-6 text-white flex items-center gap-2">
                        <FiX className="text-red-400" /> Not Included
                      </h2>
                      <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {trip.exclusions?.map((exc, idx) => (
                          <motion.li
                            key={idx}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: idx * 0.05 }}
                            className="flex items-center gap-3 text-grey-200"
                          >
                            <div className="w-6 h-6 rounded-full bg-red-500/20 flex items-center justify-center flex-shrink-0">
                              <FiX className="text-red-400" size={12} />
                            </div>
                            {exc}
                          </motion.li>
                        ))}
                      </ul>
                    </div>
                  </motion.div>
                )}

                {activeTab === 'reviews' && (
                  <motion.div
                    key="reviews"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="space-y-6 p-6"
                  >
                    <h2 className="text-2xl font-display font-bold mb-6 text-white">
                      Traveler Reviews ({trip.reviews})
                    </h2>
                    {trip.tripReviews?.length ? (
                      trip.tripReviews.map((review, idx) => (
                        <motion.div
                          key={review.id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: idx * 0.1 }}
                        >
                          <div className="bg-white/5 border border-white/5 rounded-2xl p-6">
                            <div className="flex justify-between items-start mb-4">
                              <div className="flex gap-4">
                                <div className="w-12 h-12 rounded-full bg-cyan-500/20 flex items-center justify-center text-cyan-400 font-bold text-xl">
                                  {review.author[0]}
                                </div>
                                <div>
                                  <h4 className="text-lg font-bold text-white">{review.author}</h4>
                                  <p className="text-xs text-grey-400">{review.date}</p>
                                </div>
                              </div>
                              <div className="flex gap-1 text-yellow-400">
                                {'⭐'.repeat(review.rating)}
                              </div>
                            </div>
                            <p className="text-grey-300 mb-4 italic">"{review.text}"</p>
                            {review.verified && (
                              <div className="flex items-center gap-2 text-green-400 text-xs font-bold uppercase tracking-wider">
                                <FiCheck /> Verified Booking
                              </div>
                            )}
                          </div>
                        </motion.div>
                      ))
                    ) : (
                      <div className="p-12 text-center bg-white/5 rounded-2xl border border-white/5">
                        <FiStar size={48} className="text-grey-600 mx-auto mb-4" />
                        <p className="text-grey-400">No reviews yet. Be the first to review!</p>
                      </div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          </div>

          {/* Right Sidebar - Booking Card */}
          <div className="lg:col-span-1 relative z-30">
            <div className="sticky top-24">
              <div className="bg-teal-800/30 backdrop-blur-xl border border-white/10 rounded-3xl p-8 shadow-2xl">
                <div className="mb-8 pb-8 border-b border-white/10">
                  <div className="text-5xl font-display font-black text-white mb-2">
                    ₹{trip.price.toLocaleString()}
                  </div>
                  <p className="text-grey-400">Per person including taxes</p>
                </div>

                <div className="space-y-4 mb-8">
                  <div className="flex justify-between items-center p-3 bg-white/5 rounded-xl">
                    <span className="text-grey-300 font-medium">Dates</span>
                    <span className="text-white font-bold">{trip.startDate.split(',')[0]}</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-white/5 rounded-xl">
                    <span className="text-grey-300 font-medium">Difficulty</span>
                    <span className="text-white font-bold">{trip.difficulty}</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-white/5 rounded-xl">
                    <span className="text-grey-300 font-medium">Availability</span>
                    <span className={`font-bold ${trip.availableSeats < 3 ? 'text-red-400' : 'text-green-400'}`}>
                      {trip.availableSeats} Seats Left
                    </span>
                  </div>
                </div>

                {user ? (
                  <Button
                    fullWidth
                    size="lg"
                    onClick={() => navigate(`/booking/${trip.id}`)}
                    className="mb-6 bg-cyan-500 text-teal-900 hover:bg-cyan-400 shadow-lg shadow-cyan-500/20"
                  >
                    Book Adventure Now
                  </Button>
                ) : (
                  <Button
                    fullWidth
                    size="lg"
                    onClick={() => navigate('/login')}
                    className="mb-6 bg-cyan-500 text-teal-900 hover:bg-cyan-400 shadow-lg shadow-cyan-500/20"
                  >
                    Login to Book
                  </Button>
                )}

                <div className="space-y-3">
                  <div className="p-4 bg-green-500/10 border border-green-500/20 rounded-xl">
                    <div className="flex items-start gap-3">
                      <FiShield className="text-green-400 flex-shrink-0 mt-0.5" size={20} />
                      <div>
                        <p className="text-green-300 font-bold text-sm mb-1">Free Travel Insurance</p>
                        <p className="text-green-400/70 text-xs">Coverage up to ₹4.5 lakhs included</p>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 bg-blue-500/10 border border-blue-500/20 rounded-xl">
                    <div className="flex items-start gap-3">
                      <FiAward className="text-blue-400 flex-shrink-0 mt-0.5" size={20} />
                      <div>
                        <p className="text-blue-300 font-bold text-sm mb-1">Certified Leader</p>
                        <p className="text-blue-400/70 text-xs">AMC/BMC qualified with first-aid</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Booking Bar */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-teal-900/95 backdrop-blur-xl border-t border-white/10 lg:hidden z-50">
        <div className="flex items-center justify-between max-w-7xl mx-auto">
          <div>
            <p className="text-grey-400 text-[10px] uppercase tracking-wider">Total Price</p>
            <p className="text-xl font-bold text-white">₹{trip.price.toLocaleString()}</p>
          </div>
          <Button
            size="md"
            onClick={() => user ? navigate(`/booking/${trip.id}`) : navigate('/login')}
            className="px-6 py-2.5 bg-cyan-500 text-teal-900 hover:bg-cyan-400 shadow-neon-secondary text-sm"
          >
            {user ? 'Book Now' : 'Login'}
          </Button>
        </div>
      </div>
    </div>
  );
}

export default TripDetail;
