import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FiMapPin, FiCalendar, FiUsers, FiStar, FiClock, FiCheck, FiX, FiShield, FiAward, FiHeart } from 'react-icons/fi';
import { useAuth } from '../hooks/useAuth';
import Button from '../components/common/Button';
import LoadingSpinner from '../components/common/LoadingSpinner';
import Card from '../components/common/Card';
import tripService from '../services/tripService';

function TripDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [trip, setTrip] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');
  const [isFavorite, setIsFavorite] = useState(false);

  // Mock trips data with complete information
  const mockTrips = {
    1: {
      id: 1,
      name: 'Winter Spiti Valley Expedition',
      destination: 'Spiti Valley, Himachal Pradesh',
      price: 21150,
      duration: 8,
      startDate: 'Jan 15 - Jan 22, 2025',
      availableSeats: 4,
      groupSize: 16,
      rating: 4.8,
      reviews: 124,
      difficulty: 'Moderate',
      bestSeason: 'October - March',
      altitude: '14,000 ft',
      image: 'https://images.pexels.com/photos/31307356/pexels-photo-31307356/free-photo-of-spectacular-view-of-key-monastery-in-winter.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
      description: 'Experience the magical winter wonderland of Spiti Valley. Trek through snow-covered landscapes, visit ancient monasteries, and witness the breathtaking beauty of the frozen desert.',
      highlights: [
        'Key Monastery visit',
        'Frozen Spiti River walk',
        'Traditional Spitian cuisine',
        'Stargazing in clear skies',
        'Local homestay experience',
        'Photography opportunities'
      ],
      itinerary: [
        {
          day: 1,
          title: 'Arrival in Shimla',
          description: 'Meet the group and acclimatize',
          meals: 'Dinner',
          activities: ['Group Introduction', 'Orientation', 'Equipment Check']
        },
        {
          day: 2,
          title: 'Shimla to Kalpa',
          description: 'Scenic drive through the mountains',
          meals: 'Breakfast, Lunch, Dinner',
          activities: ['Mountain Drive', 'Village Visit', 'Sunset Views']
        },
        {
          day: 3,
          title: 'Kalpa to Nako',
          description: 'Cross Khab Bridge and reach Nako',
          meals: 'Breakfast, Lunch, Dinner',
          activities: ['Khab Village', 'Nako Lake', 'Monastery Visit']
        },
        {
          day: 4,
          title: 'Nako to Kaza',
          description: 'Journey to the capital of Spiti',
          meals: 'Breakfast, Lunch, Dinner',
          activities: ['Tabo Monastery', 'Valley Views', 'Local Market']
        },
        {
          day: 5,
          title: 'Kaza Exploration',
          description: 'Visit Key Monastery and Kibber Village',
          meals: 'Breakfast, Lunch, Dinner',
          activities: ['Key Monastery', 'Kibber Village', 'Wildlife Spotting']
        },
        {
          day: 6,
          title: 'Langza & Hikkim',
          description: 'Visit highest villages',
          meals: 'Breakfast, Lunch, Dinner',
          activities: ['Langza Buddha', 'Hikkim Post Office', 'Fossil Hunting']
        },
        {
          day: 7,
          title: 'Return Journey',
          description: 'Start the journey back',
          meals: 'Breakfast, Lunch, Dinner',
          activities: ['Scenic Drive', 'Photography', 'Farewell Dinner']
        },
        {
          day: 8,
          title: 'Departure',
          description: 'Reach Shimla and depart',
          meals: 'Breakfast',
          activities: ['Final Goodbyes', 'Memories Shared']
        }
      ],
      inclusions: [
        'Accommodation (hotels/homestays)',
        'All meals (breakfast, lunch, dinner)',
        'Transportation (Delhi to Delhi)',
        'Experienced trek leader',
        'First-aid medical kit',
        'Forest permits & camping charges',
        'Travel insurance (up to ₹4.5 lakhs)',
        'Safety equipment'
      ],
      exclusions: [
        'Personal expenses',
        'Porter charges',
        'Any meals not mentioned',
        'Travel to Delhi',
        'Additional activities',
        'Tips & gratuities'
      ],
      tripReviews: [
        {
          id: 1,
          author: 'Rahul Sharma',
          date: 'December 2024',
          rating: 5,
          text: 'Absolutely incredible experience! The winter landscape was magical, and the team was very professional. Highly recommend!',
          verified: true
        },
        {
          id: 2,
          author: 'Priya Mehta',
          date: 'November 2024',
          rating: 5,
          text: 'Best trip ever! The monasteries, the people, the food - everything was perfect. The trek leader was knowledgeable and friendly.',
          verified: true
        },
        {
          id: 3,
          author: 'Amit Patel',
          date: 'October 2024',
          rating: 4,
          text: 'Great trip overall. A bit challenging due to altitude but totally worth it. Make sure you acclimatize properly!',
          verified: true
        }
      ]
    },
    2: {
      id: 2,
      name: 'Leh Ladakh Adventure',
      destination: 'Ladakh',
      price: 34650,
      duration: 7,
      startDate: 'Feb 20 - Feb 26, 2025',
      availableSeats: 6,
      groupSize: 14,
      rating: 4.9,
      reviews: 89,
      difficulty: 'Hard',
      bestSeason: 'May - September',
      altitude: '18,000 ft',
      image: 'https://images.pexels.com/photos/34555164/pexels-photo-34555164/free-photo-of-adventurer-resting-with-motorcycle-by-scenic-lake.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
      description: 'Explore the rugged beauty of Ladakh with its high-altitude passes, pristine lakes, and ancient monasteries.',
      highlights: [
        'Pangong Lake visit',
        'Khardung La Pass',
        'Nubra Valley camping',
        'Magnetic Hill experience',
        'Monasteries tour',
        'Bike ride option'
      ],
      itinerary: [],
      inclusions: [],
      exclusions: [],
      tripReviews: []
    }
  };

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
        setTrip(tripData);
      } catch (err) {
        console.warn('Backend unavailable, using mock data:', err);
        setTrip(mockTrips[id]);
        if (!mockTrips[id]) setError('Trip not found');
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchTripData();
  }, [id]);

  if (loading) return <LoadingSpinner />;

  if (error || !trip) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800 flex items-center justify-center px-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-12 max-w-md text-center shadow-2xl"
        >
          <FiX size={64} className="text-red-400 mx-auto mb-4" />
          <p className="text-2xl text-white font-bold mb-2">{error || 'Trip not found'}</p>
          <p className="text-slate-400 mb-6">The trip you're looking for doesn't exist</p>
          <Button onClick={() => navigate('/trips')}>Back to Trips</Button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800 text-white overflow-x-hidden">
      {/* Animated Background Orbs */}
      <motion.div
        className="fixed -top-96 -right-96 w-[500px] h-[500px] rounded-full bg-gradient-to-br from-purple-600/20 via-indigo-600/15 to-transparent blur-3xl -z-10"
        animate={{ y: [0, 60, 0], x: [0, 30, 0] }}
        transition={{ duration: 12, repeat: Infinity }}
      />
      <motion.div
        className="fixed -bottom-96 -left-96 w-[500px] h-[500px] rounded-full bg-gradient-to-tr from-blue-600/20 via-cyan-500/15 to-transparent blur-3xl -z-10"
        animate={{ y: [0, -50, 0], x: [0, -30, 0] }}
        transition={{ duration: 15, repeat: Infinity }}
      />

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
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/50 to-transparent" />
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
                className="inline-block px-4 py-2 bg-orange-500/20 border border-orange-500/30 rounded-full text-orange-300 text-sm font-bold mb-4 backdrop-blur-lg"
                whileHover={{ scale: 1.05 }}
              >
                {trip.difficulty} • {trip.duration} Days
              </motion.div>

              <h1 className="text-5xl md:text-7xl font-black mb-4 bg-clip-text text-transparent bg-gradient-to-r from-white via-purple-200 to-pink-200">
                {trip.name}
              </h1>

              <div className="flex flex-wrap items-center gap-6 text-slate-300">
                <div className="flex items-center gap-2">
                  <FiMapPin className="text-purple-400" size={20} />
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
          className="absolute top-8 right-8 p-4 backdrop-blur-xl bg-white/10 border border-white/20 rounded-full shadow-2xl"
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
                { icon: FiClock, label: 'Duration', value: `${trip.duration} days`, color: 'purple' },
                { icon: FiCalendar, label: 'Start Date', value: trip.startDate.split(',')[0], color: 'blue' },
                { icon: FiMapPin, label: 'Altitude', value: trip.altitude, color: 'green' },
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
                    <Card variant="elevated" className="p-4">
                      <Icon className={`text-${stat.color}-400 mb-2`} size={24} />
                      <p className="text-slate-400 text-xs mb-1">{stat.label}</p>
                      <p className="text-white font-bold">{stat.value}</p>
                    </Card>
                  </motion.div>
                );
              })}
            </motion.div>

            {/* Tabs */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-2"
            >
              <div className="flex gap-2 mb-6">
                {tabs.map((tab) => {
                  const Icon = tab.icon;
                  return (
                    <motion.button
                      key={tab.key}
                      onClick={() => setActiveTab(tab.key)}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl font-bold transition-all ${activeTab === tab.key
                        ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg'
                        : 'text-slate-400 hover:text-white hover:bg-white/5'
                        }`}
                    >
                      <Icon size={18} />
                      <span className="hidden sm:inline">{tab.label}</span>
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
                    className="space-y-6 p-6"
                  >
                    <div>
                      <h2 className="text-2xl font-bold mb-4 text-white">About This Trip</h2>
                      <p className="text-slate-300 leading-relaxed">{trip.description}</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                      <div className="p-4 bg-white/5 rounded-lg">
                        <strong className="text-purple-400">Difficulty:</strong>
                        <span className={`ml-2 px-3 py-1 rounded-full text-xs font-bold ${trip.difficulty === 'Easy' ? 'bg-green-500/20 text-green-300'
                          : trip.difficulty?.includes('Moderate') ? 'bg-yellow-500/20 text-yellow-300'
                            : 'bg-red-500/20 text-red-300'
                          }`}>
                          {trip.difficulty}
                        </span>
                      </div>
                      <div className="p-4 bg-white/5 rounded-lg">
                        <strong className="text-blue-400">Best Season:</strong>
                        <span className="ml-2 text-white">{trip.bestSeason}</span>
                      </div>
                    </div>

                    {trip.highlights && (
                      <div>
                        <h3 className="text-xl font-bold mb-4 text-white">Trip Highlights</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          {trip.highlights.map((highlight, idx) => (
                            <motion.div
                              key={idx}
                              initial={{ opacity: 0, x: -20 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: idx * 0.05 }}
                              className="flex items-center gap-2 p-3 bg-gradient-to-r from-purple-500/10 to-pink-500/5 border border-purple-500/20 rounded-lg"
                            >
                              <FiCheck className="text-green-400 flex-shrink-0" size={18} />
                              <span className="text-slate-200">{highlight}</span>
                            </motion.div>
                          ))}
                        </div>
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
                    className="space-y-4 p-6"
                  >
                    <h2 className="text-2xl font-bold mb-6 text-white">Day-by-Day Itinerary</h2>
                    {trip.itinerary?.map((day, idx) => (
                      <motion.div
                        key={idx}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: idx * 0.1 }}
                      >
                        <Card variant="elevated" className="p-6 border-l-4 border-purple-500">
                          <div className="flex items-start justify-between mb-3">
                            <div className="flex-1">
                              <h3 className="text-lg font-bold text-white mb-1">
                                Day {day.day}: {day.title}
                              </h3>
                              <p className="text-slate-400">{day.description}</p>
                            </div>
                            <span className="px-3 py-1 bg-orange-500/20 border border-orange-500/30 text-orange-300 text-xs font-bold rounded-full whitespace-nowrap ml-4">
                              {day.meals}
                            </span>
                          </div>
                          {day.activities && (
                            <div className="flex flex-wrap gap-2 mt-3">
                              {day.activities.map((activity, i) => (
                                <span
                                  key={i}
                                  className="px-2 py-1 bg-white/5 text-slate-300 text-xs rounded-full"
                                >
                                  {activity}
                                </span>
                              ))}
                            </div>
                          )}
                        </Card>
                      </motion.div>
                    ))}
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
                    <Card variant="gradient" className="p-6">
                      <h2 className="text-xl font-bold mb-4 text-white flex items-center gap-2">
                        <FiCheck className="text-green-400" /> What's Included
                      </h2>
                      <ul className="space-y-3">
                        {trip.inclusions?.map((inc, idx) => (
                          <motion.li
                            key={idx}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: idx * 0.05 }}
                            className="flex items-center gap-3 text-slate-200"
                          >
                            <FiCheck className="text-green-400 flex-shrink-0" size={18} />
                            {inc}
                          </motion.li>
                        ))}
                      </ul>
                    </Card>

                    <Card variant="elevated" className="p-6 border-l-4 border-red-500">
                      <h2 className="text-xl font-bold mb-4 text-white flex items-center gap-2">
                        <FiX className="text-red-400" /> Not Included
                      </h2>
                      <ul className="space-y-3">
                        {trip.exclusions?.map((exc, idx) => (
                          <motion.li
                            key={idx}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: idx * 0.05 }}
                            className="flex items-center gap-3 text-slate-200"
                          >
                            <FiX className="text-red-400 flex-shrink-0" size={18} />
                            {exc}
                          </motion.li>
                        ))}
                      </ul>
                    </Card>
                  </motion.div>
                )}

                {activeTab === 'reviews' && (
                  <motion.div
                    key="reviews"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="space-y-4 p-6"
                  >
                    <h2 className="text-2xl font-bold mb-6 text-white">
                      Reviews ({trip.reviews})
                    </h2>
                    {trip.tripReviews?.length ? (
                      trip.tripReviews.map((review, idx) => (
                        <motion.div
                          key={review.id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: idx * 0.1 }}
                        >
                          <Card variant="elevated" className="p-6">
                            <div className="flex justify-between items-start mb-3">
                              <div>
                                <h4 className="text-lg font-bold text-white">{review.author}</h4>
                                <p className="text-xs text-slate-400">{review.date}</p>
                              </div>
                              <div className="text-yellow-400 text-lg">
                                {'⭐'.repeat(review.rating)}
                              </div>
                            </div>
                            <p className="text-slate-300 mb-3">{review.text}</p>
                            {review.verified && (
                              <div className="flex items-center gap-2 text-green-400 text-xs">
                                <FiCheck /> Verified Booking
                              </div>
                            )}
                          </Card>
                        </motion.div>
                      ))
                    ) : (
                      <Card variant="subtle" className="p-12 text-center">
                        <FiStar size={48} className="text-slate-600 mx-auto mb-4" />
                        <p className="text-slate-400">No reviews yet. Be the first to review!</p>
                      </Card>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          </div>

          {/* Right Sidebar - Booking Card */}
          <div className="lg:col-span-1 relative z-30">
            <div className="sticky top-24">
              <Card variant="elevated" className="p-6 border-2 border-purple-500/30">
                <div className="mb-6">
                  <div className="text-4xl font-black bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-400 mb-2">
                    ₹{trip.price.toLocaleString()}
                  </div>
                  <p className="text-slate-400">Per person</p>
                </div>

                <div className="space-y-3 mb-6 text-sm">
                  <div className="flex justify-between text-slate-300">
                    <span className="font-semibold">Dates:</span>
                    <span className="text-white">{trip.startDate}</span>
                  </div>
                  <div className="flex justify-between text-slate-300">
                    <span className="font-semibold">Difficulty:</span>
                    <span className="text-white">{trip.difficulty}</span>
                  </div>
                  <div className="flex justify-between text-slate-300">
                    <span className="font-semibold">Group Size:</span>
                    <span className="text-white">{trip.groupSize}</span>
                  </div>
                  <div className="flex justify-between font-bold">
                    <span className="text-slate-300">Seats Left:</span>
                    <span className={trip.availableSeats < 3 ? 'text-red-400' : 'text-green-400'}>
                      {trip.availableSeats}
                    </span>
                  </div>
                </div>

                {user ? (
                  <Button
                    fullWidth
                    size="lg"
                    onClick={() => navigate(`/booking/${trip.id}`)}
                    className="mb-4"
                  >
                    Book Now
                  </Button>
                ) : (
                  <Button
                    fullWidth
                    size="lg"
                    onClick={() => navigate('/login')}
                    className="mb-4"
                  >
                    Login to Book
                  </Button>
                )}

                <div className="space-y-3">
                  <div className="p-4 bg-green-500/10 border border-green-500/30 rounded-lg">
                    <div className="flex items-start gap-3">
                      <FiShield className="text-green-400 flex-shrink-0 mt-0.5" size={20} />
                      <div>
                        <p className="text-green-300 font-bold text-sm mb-1">Free Travel Insurance</p>
                        <p className="text-green-400/70 text-xs">Coverage up to ₹4.5 lakhs</p>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 bg-blue-500/10 border border-blue-500/30 rounded-lg">
                    <div className="flex items-start gap-3">
                      <FiAward className="text-blue-400 flex-shrink-0 mt-0.5" size={20} />
                      <div>
                        <p className="text-blue-300 font-bold text-sm mb-1">Certified Leader</p>
                        <p className="text-blue-400/70 text-xs">AMC/BMC qualified with first-aid</p>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </div>
      {/* Mobile Booking Bar */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-slate-900/90 backdrop-blur-xl border-t border-white/10 lg:hidden z-40">
        <div className="flex items-center justify-between max-w-7xl mx-auto">
          <div>
            <p className="text-slate-400 text-xs">Price per person</p>
            <p className="text-2xl font-bold text-white">₹{trip.price.toLocaleString()}</p>
          </div>
          <Button
            size="md"
            onClick={() => user ? navigate(`/booking/${trip.id}`) : navigate('/login')}
            className="px-8"
          >
            {user ? 'Book Now' : 'Login to Book'}
          </Button>
        </div>
      </div>
    </div>
  );
}

export default TripDetail;
