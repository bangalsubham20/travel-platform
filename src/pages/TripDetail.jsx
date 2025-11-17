import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FiMapPin, FiCalendar, FiUsers, FiStar, FiClock, FiCheck } from 'react-icons/fi';
import { useAuth } from '../hooks/useAuth';
import Button from '../components/common/Button';
import LoadingSpinner from '../components/common/LoadingSpinner';
import Card from '../components/common/Card';
import tripService from '../services/tripService';
import { motion, AnimatePresence } from 'framer-motion';

function TripDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [trip, setTrip] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');

  // ... mockTrips as in your code

  /* keep your mockTrips definition here for fallback */

  // Animated tabs with sliding bar
  const tabs = [
    { key: 'overview', label: 'Overview' },
    { key: 'itinerary', label: 'Itinerary' },
    { key: 'includes', label: 'Includes' },
    { key: 'reviews', label: 'Reviews' },
  ];

  useEffect(() => {
    const fetchTripData = async () => {
      try {
        setLoading(true);
        setError(null);
        const tripData = await tripService.getTripById(id);
        setTrip(tripData);
      } catch (err) {
        // fallback to mock data on error
        setTrip(mockTrips[id]);
        if (!mockTrips[id]) setError('Trip not found');
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchTripData();
  }, [id]);

  if (loading) return <LoadingSpinner />;
  if (error || !trip) return (
    <motion.div
      initial={{ opacity: 0, y: 60 }}
      animate={{ opacity: 1, y: 0 }}
      className="text-center py-12"
    >
      <p className="text-xl text-gray-600 mb-4">{error || 'Trip not found'}</p>
      <Button onClick={() => navigate('/trips')}>Back to Trips</Button>
    </motion.div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 via-indigo-50 to-orange-50 overflow-hidden pb-12">
      {/* Hero Image Parallax */}
      <motion.div
        initial={{ opacity: 0, scale: 1.04 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1 }}
        className="h-96 bg-gray-200 relative overflow-hidden"
      >
        <motion.img
          src={trip.image}
          alt={trip.name}
          className="w-full h-full object-cover scale-105"
          initial={{ scale: 1.08, y: 30 }}
          animate={{ scale: 1, y: 0 }}
          transition={{ duration: 1.2 }}
        />
        <motion.div
          className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.65 }}
          transition={{ duration: 1 }}
        />
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="absolute top-8 right-8 bg-orange-500 text-white font-bold px-6 py-3 rounded-full text-lg shadow-xl"
        >
          ₹{trip.price.toLocaleString()}
        </motion.div>
      </motion.div>

      <div className="max-w-7xl mx-auto px-4 -mt-20">
        <motion.div
          initial={{ opacity: 0, y: 36 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="bg-white/90 rounded-2xl p-10 shadow-2xl relative"
        >
          <h1 className="text-4xl md:text-5xl font-extrabold mb-4 text-slate-900 tracking-tight">{trip.name}</h1>

          {/* Quick Info Grid */}
          <motion.div
            className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-10"
            variants={{
              visible: { transition: { staggerChildren: 0.14 } },
              hidden: {},
            }}
            initial="hidden"
            animate="visible"
          >
            <motion.div variants={{ visible: { opacity: 1, y: 0 }, hidden: { opacity: 0, y: 12 } }}>
              <Card className="p-5 flex flex-col gap-2 bg-white/70 shadow-sm">
                <span className="flex items-center gap-2 text-blue-700 font-bold"><FiMapPin /> Location</span>
                <p className="text-gray-800">{trip.destination}</p>
              </Card>
            </motion.div>
            <motion.div variants={{ visible: { opacity: 1, y: 0 }, hidden: { opacity: 0, y: 12 } }}>
              <Card className="p-5 flex flex-col gap-2 bg-white/70 shadow-sm">
                <span className="flex items-center gap-2 text-fuchsia-700 font-bold"><FiClock /> Duration</span>
                <p className="text-gray-800">{trip.duration} days</p>
              </Card>
            </motion.div>
            <motion.div variants={{ visible: { opacity: 1, y: 0 }, hidden: { opacity: 0, y: 12 } }}>
              <Card className="p-5 flex flex-col gap-2 bg-white/70 shadow-sm">
                <span className="flex items-center gap-2 text-green-700 font-bold"><FiUsers /> Seats Left</span>
                <p className="text-gray-800">{trip.availableSeats} / {trip.groupSize}</p>
              </Card>
            </motion.div>
            <motion.div variants={{ visible: { opacity: 1, y: 0 }, hidden: { opacity: 0, y: 12 } }}>
              <Card className="p-5 flex flex-col gap-2 bg-white/70 shadow-sm">
                <span className="flex items-center gap-2 text-yellow-600 font-bold"><FiStar /> Rating</span>
                <p className="text-gray-800">⭐ {trip.rating} ({trip.reviews})</p>
              </Card>
            </motion.div>
          </motion.div>

          {/* Tabs with animated index bar */}
          <div className="relative mb-6 border-b">
            <div className="flex gap-6 overflow-x-auto">
              {tabs.map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key)}
                  className={`relative pb-4 text-lg font-bold transition-colors ${
                    activeTab === tab.key
                      ? 'text-orange-500'
                      : 'text-gray-400 hover:text-orange-600'
                  }`}
                >
                  {tab.label}
                  {activeTab === tab.key && (
                    <motion.div
                      layoutId="underline"
                      className="absolute left-0 right-0 -bottom-1 h-1 rounded-t-full bg-gradient-to-r from-orange-500 via-fuchsia-400 to-purple-500 shadow"
                    />
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Tab Content */}
          <AnimatePresence mode="wait" initial={false}>
            {activeTab === 'overview' && (
              <motion.div
                key="overview"
                initial={{ opacity: 0, y: 42 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -24 }}
                transition={{ duration: 0.3, type: 'spring', bounce: 0.2 }}
                className="space-y-6"
              >
                <Card className="p-6 animate-fade-in">
                  <h2 className="text-2xl font-bold mb-3">About This Trip</h2>
                  <p className="text-gray-600 leading-relaxed mb-4">{trip.description}</p>
                  <div className="grid grid-cols-2 gap-6 text-sm">
                    <div>
                      <strong>Difficulty:</strong>{' '}
                      <span className={`
                        px-2 py-1 rounded font-bold
                        ${trip.difficulty === 'Easy' ? 'bg-green-100 text-green-800'
                        : trip.difficulty?.includes('Moderate') ? 'bg-yellow-100 text-yellow-800'
                        : 'bg-red-100 text-red-800'}`}>{trip.difficulty}</span>
                    </div>
                    <div><strong>Best Season:</strong> {trip.bestSeason}</div>
                    <div><strong>Altitude:</strong> {trip.altitude}</div>
                    <div><strong>Group Size:</strong> {trip.groupSize}</div>
                  </div>
                </Card>
                <Card className="p-6 bg-orange-50">
                  <h2 className="text-xl font-bold mb-3">Highlights</h2>
                  <ul className="grid grid-cols-1 md:grid-cols-2 gap-3 list-inside list-none">
                    {trip.highlights?.map((h, idx) => (
                      <li key={idx} className="flex items-center gap-2">
                        <span className="text-green-500"><FiCheck /></span> {h}
                      </li>
                    ))}
                  </ul>
                </Card>
              </motion.div>
            )}

            {activeTab === 'itinerary' && (
              <motion.div
                key="itinerary"
                initial={{ opacity: 0, x: 60 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -40 }}
                transition={{ duration: 0.3, type: 'tween' }}
                className="space-y-4"
              >
                <h2 className="text-2xl font-bold mb-3">Day-by-Day Itinerary</h2>
                {trip.itinerary?.map((day, idx) => (
                  <Card key={idx} className="p-4 border-l-4 border-orange-400 bg-white/90">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h3 className="font-bold text-lg">Day {day.day}: {day.title}</h3>
                        <p className="text-gray-600">{day.description}</p>
                      </div>
                      <span className="bg-orange-100 text-orange-800 text-xs font-semibold px-3 py-1 rounded-full">
                        {day.meals}
                      </span>
                    </div>
                    <div className="flex gap-3 text-sm text-gray-500 mt-1 flex-wrap">
                      {day.activities?.map((activity, i) => (
                        <span key={i} className="flex items-center">
                          <span className="w-2 h-2 bg-gray-300 rounded-full mr-1" />{activity}
                        </span>
                      ))}
                    </div>
                  </Card>
                ))}
              </motion.div>
            )}

            {activeTab === 'includes' && (
              <motion.div
                key="includes"
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -30 }}
                transition={{ duration: 0.3, type: 'tween' }}
                className="space-y-6"
              >
                <Card className="p-6 bg-green-50">
                  <h2 className="text-xl font-bold mb-2">What's Included</h2>
                  <ul className="space-y-2">
                    {trip.inclusions?.map((inc, idx) => (
                      <li key={idx} className="flex items-center gap-2">
                        <span className="text-green-500 font-bold"><FiCheck /></span> {inc}
                      </li>
                    ))}
                  </ul>
                </Card>
                <Card className="p-6 bg-red-50">
                  <h2 className="text-xl font-bold mb-2">Not Included</h2>
                  <ul className="space-y-2">
                    {trip.exclusions?.map((exc, idx) => (
                      <li key={idx} className="flex items-center gap-2">
                        <span className="text-red-500 font-bold">✕</span> {exc}
                      </li>
                    ))}
                  </ul>
                </Card>
              </motion.div>
            )}

            {activeTab === 'reviews' && (
              <motion.div
                key="reviews"
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 30 }}
                transition={{ duration: 0.3, type: 'tween' }}
                className="space-y-4"
              >
                <h2 className="text-2xl font-bold mb-6">Reviews ({trip.reviews})</h2>
                {trip.tripReviews?.length ? trip.tripReviews.map((review) => (
                  <Card key={review.id} className="p-6 bg-white/90 ring-1 ring-gray-200">
                    <div className="flex justify-between">
                      <div>
                        <h4 className="text-lg font-semibold">{review.author}</h4>
                        <p className="text-xs text-gray-500">{review.date}</p>
                      </div>
                      <div className="text-yellow-500 text-lg">{'⭐'.repeat(review.rating)}</div>
                    </div>
                    <p className="mt-3 text-gray-700">{review.text}</p>
                    {review.verified && (
                      <div className="mt-2 flex items-center gap-2 text-green-600 text-xs">
                        <FiCheck /> Verified Booking
                      </div>
                    )}
                  </Card>
                )) : (
                  <Card className="p-6 text-center">
                    <p className="text-gray-600">No reviews yet. Be the first to review!</p>
                  </Card>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Sidebar / Booking Card */}
        <motion.div
          initial={{ opacity: 0, x: 60 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3, duration: 0.7 }}
          className="absolute top-32 right-0 w-full max-w-xs hidden lg:block"
          style={{ zIndex: 30 }}
        >
          <Card className="p-6 sticky top-32 bg-gradient-to-tr from-orange-50 to-gray-50 shadow-xl">
            <div className="mb-6">
              <div className="text-3xl font-bold text-orange-500 mb-2">
                ₹{trip.price.toLocaleString()}
              </div>
              <p className="text-gray-800">Per person</p>
            </div>
            <div className="mb-6 space-y-2 text-sm">
              <div className="flex justify-between text-gray-700 font-semibold"><span>Dates:</span><span>{trip.startDate}</span></div>
              <div className="flex justify-between text-gray-700 font-semibold"><span>Difficulty:</span><span>{trip.difficulty}</span></div>
              <div className="flex justify-between text-gray-700 font-semibold"><span>Group Size:</span><span>{trip.groupSize}</span></div>
              <div className="flex justify-between font-bold"><span>Seats Left:</span>
                <span className={`${trip.availableSeats < 3 ? 'text-red-500' : 'text-green-600'}`}>{trip.availableSeats}</span>
              </div>
            </div>
            {user ? (
              <Button
                fullWidth
                onClick={() => navigate(`/booking/${trip.id}`)}
                className="mb-3"
              >Book Now</Button>
            ) : (
              <Button
                fullWidth
                onClick={() => navigate('/login')}
                className="mb-3"
              >Login to Book</Button>
            )}
            <div className="p-4 bg-green-50 border border-green-200 rounded-lg text-xs text-green-700 mb-3">
              ✓ Free Travel Insurance (up to ₹4.5 lakhs)
            </div>
            <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg text-xs text-blue-700">
              🧑‍🔬 Certified Leader (AMC/BMC, first-aid)
            </div>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}

export default TripDetail;
