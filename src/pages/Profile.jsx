import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import Button from '../components/common/Button';
import Card from '../components/common/Card';
import LoadingSpinner from '../components/common/LoadingSpinner';
import { motion, AnimatePresence } from 'framer-motion';
import { FiEdit2, FiLogOut, FiBookmark, FiStar, FiX, FiCheck, FiCamera, FiBell, FiLock, FiTrash2 } from 'react-icons/fi';
import bookingService from '../services/bookingService';
import reviewService from '../services/reviewService';

function Profile() {
  const { user, logout, updateProfile } = useAuth();
  const navigate = useNavigate();
  
  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState('bookings');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userBookings, setUserBookings] = useState([]);
  const [userReviews, setUserReviews] = useState([]);
  const [isSaving, setIsSaving] = useState(false);

  const [formData, setFormData] = useState({
    name: user?.name || 'User',
    email: user?.email || '',
    phone: user?.phone || '',
    bio: user?.bio || 'Adventure enthusiast! 🌍',
    avatar: user?.avatar || 'https://i.pravatar.cc/150?img=1'
  });

  const mockBookings = [
    {
      id: 1,
      tripName: 'Winter Spiti Valley',
      destination: 'Spiti Valley',
      startDate: '2025-01-15',
      endDate: '2025-01-22',
      status: 'confirmed',
      price: 21150,
      travelers: 2,
      bookingDate: '2024-12-01',
      image: 'https://images.pexels.com/photos/31307356/pexels-photo-31307356/free-photo-of-spectacular-view-of-key-monastery-in-winter.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2'
    },
    {
      id: 2,
      tripName: 'Leh Ladakh Adventure',
      destination: 'Ladakh',
      startDate: '2025-02-20',
      endDate: '2025-02-26',
      status: 'pending',
      price: 34650,
      travelers: 1,
      bookingDate: '2024-11-20',
      image: 'https://images.pexels.com/photos/34555164/pexels-photo-34555164/free-photo-of-adventurer-resting-with-motorcycle-by-scenic-lake.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2'
    },
    {
      id: 3,
      tripName: 'Kerala Backpacking',
      destination: 'Kerala',
      startDate: '2025-03-10',
      endDate: '2025-03-16',
      status: 'completed',
      price: 16650,
      travelers: 3,
      bookingDate: '2024-10-15',
      image: 'https://images.pexels.com/photos/12144055/pexels-photo-12144055.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2'
    }
  ];

  const mockReviews = [
    {
      id: 1,
      tripName: 'Kerala Backpacking',
      rating: 5,
      title: 'Absolutely Amazing!',
      text: 'Had the best time of my life. The team was incredible, food was delicious, and the itinerary was perfectly planned.',
      date: '2024-11-30',
      helpful: 45
    },
    {
      id: 2,
      tripName: 'Kashmir Great Lakes Trek',
      rating: 4,
      title: 'Great Adventure',
      text: 'Beautiful trek with amazing views. One day had bad weather but the team handled it well.',
      date: '2024-09-15',
      helpful: 28
    }
  ];

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setLoading(true);
        setError(null);

        if (user) {
          setFormData(prev => ({
            ...prev,
            name: user.name || prev.name,
            email: user.email || prev.email,
            phone: user.phone || prev.phone,
            bio: user.bio || prev.bio,
            avatar: user.avatar || prev.avatar
          }));

          try {
            const bookings = await bookingService.getUserBookings();
            setUserBookings(bookings);
          } catch (err) {
            setUserBookings(mockBookings);
          }

          try {
            const reviews = await reviewService.getUserReviews();
            setUserReviews(reviews);
          } catch (err) {
            setUserReviews(mockReviews);
          }
        } else {
          setError('Please log in to view your profile');
        }
      } catch (err) {
        console.error('Error fetching user data:', err);
        setUserBookings(mockBookings);
        setUserReviews(mockReviews);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [user]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSaveProfile = async () => {
    try {
      setIsSaving(true);
      await updateProfile(formData);
      setIsEditing(false);
    } catch (err) {
      setError('Failed to update profile');
    } finally {
      setIsSaving(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const getStatusBadge = (status) => {
    const styles = {
      confirmed: 'from-green-500/10 to-green-600/10 border-green-500/30 text-green-300',
      pending: 'from-yellow-500/10 to-yellow-600/10 border-yellow-500/30 text-yellow-300',
      completed: 'from-blue-500/10 to-blue-600/10 border-blue-500/30 text-blue-300',
      cancelled: 'from-red-500/10 to-red-600/10 border-red-500/30 text-red-300'
    };
    return styles[status] || styles.pending;
  };

  const calculateDaysUntil = (date) => {
    const tripDate = new Date(date);
    const today = new Date();
    const daysLeft = Math.ceil((tripDate - today) / (1000 * 60 * 60 * 24));
    return daysLeft;
  };

  const totalBookings = userBookings.length;
  const completedTrips = userBookings.filter(b => b.status === 'completed').length;
  const upcomingTrips = userBookings.filter(b => b.status === 'confirmed' || b.status === 'pending').length;
  const avgRating = userReviews.length > 0 
    ? (userReviews.reduce((sum, r) => sum + r.rating, 0) / userReviews.length).toFixed(1) 
    : 0;

  if (loading) return <LoadingSpinner />;

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800 flex items-center justify-center px-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-12 max-w-md w-full text-center shadow-2xl"
        >
          <p className="text-2xl text-slate-300 mb-6">Please log in to view your profile</p>
          <Button fullWidth onClick={() => navigate('/login')}>Go to Login</Button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800 text-white pb-16 overflow-hidden">
      {/* Animated Background */}
      <motion.div className="fixed -top-96 -right-96 w-[500px] h-[500px] rounded-full bg-gradient-to-br from-purple-600/20 via-indigo-600/15 to-transparent blur-3xl -z-10"
        animate={{ y: [0, 60, 0] }}
        transition={{ duration: 12, repeat: Infinity }} />
      <motion.div className="fixed -bottom-96 -left-96 w-[500px] h-[500px] rounded-full bg-gradient-to-tr from-blue-600/20 via-cyan-500/15 to-transparent blur-3xl -z-10"
        animate={{ y: [0, -50, 0] }}
        transition={{ duration: 15, repeat: Infinity }} />

      <div className="max-w-7xl mx-auto px-4 relative z-10">
        {/* Error Alert */}
        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="mt-4 mb-6 backdrop-blur-xl bg-red-500/10 border border-red-500/30 text-red-300 px-4 py-4 rounded-xl"
            >
              {error}
            </motion.div>
          )}
        </AnimatePresence>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-8">
          {/* Sidebar - Profile Card */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-1"
          >
            <div className="sticky top-20 backdrop-blur-xl bg-gradient-to-br from-white/10 to-white/5 border border-white/10 rounded-2xl p-8 shadow-2xl hover:border-white/20 transition-all">
              {/* Avatar */}
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2 }}
                className="mb-6 relative w-fit mx-auto"
              >
                <img
                  src={formData.avatar}
                  alt={formData.name}
                  className="w-28 h-28 rounded-full object-cover ring-4 ring-purple-500/50 shadow-lg"
                />
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  className="absolute bottom-0 right-0 bg-gradient-to-r from-purple-500 to-pink-500 p-2 rounded-full text-white shadow-lg"
                >
                  <FiCamera size={16} />
                </motion.button>
              </motion.div>

              <h2 className="text-3xl font-black text-white text-center mb-2">{formData.name}</h2>
              <p className="text-sm text-slate-400 text-center mb-1">{formData.email}</p>
              <p className="text-sm text-slate-500 text-center italic line-clamp-2">{formData.bio}</p>

              {/* Stats */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="grid grid-cols-3 gap-4 my-8 py-6 border-t border-b border-white/10"
              >
                <div className="text-center hover:scale-110 transition cursor-pointer">
                  <p className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-pink-400">
                    {totalBookings}
                  </p>
                  <p className="text-xs text-slate-400 mt-1">Trips</p>
                </div>
                <div className="text-center hover:scale-110 transition cursor-pointer">
                  <p className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-emerald-400">
                    {completedTrips}
                  </p>
                  <p className="text-xs text-slate-400 mt-1">Completed</p>
                </div>
                <div className="text-center hover:scale-110 transition cursor-pointer">
                  <p className="text-2xl font-black">⭐{avgRating}</p>
                  <p className="text-xs text-slate-400 mt-1">Rating</p>
                </div>
              </motion.div>

              {/* Actions */}
              <div className="space-y-3 mb-6">
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button
                    fullWidth
                    onClick={() => setIsEditing(!isEditing)}
                    className={isEditing ? 'bg-white/10' : 'bg-gradient-to-r from-purple-500 to-pink-500'}
                  >
                    <FiEdit2 className="inline mr-2" size={16} />
                    {isEditing ? 'Cancel' : 'Edit Profile'}
                  </Button>
                </motion.div>
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button
                    fullWidth
                    onClick={handleLogout}
                    className="bg-red-500/20 border border-red-500/30 text-red-300 hover:bg-red-500/30"
                  >
                    <FiLogOut className="inline mr-2" size={16} />
                    Logout
                  </Button>
                </motion.div>
              </div>

              {/* Member Badge */}
              <div className="pt-6 border-t border-white/10 text-center">
                <p className="text-xs text-slate-400">Member since</p>
                <p className="text-sm font-bold text-purple-400 mt-1">
                  {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'Recently'}
                </p>
                <p className="text-xs text-slate-500 mt-2">WravelerForLife 🌍</p>
              </div>
            </div>
          </motion.div>

          {/* Main Content */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-2 space-y-8"
          >
            {/* Edit Profile Form */}
            <AnimatePresence>
              {isEditing && (
                <motion.div
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="backdrop-blur-xl bg-gradient-to-br from-white/10 to-white/5 border border-purple-500/30 rounded-2xl p-8 shadow-2xl"
                >
                  <h2 className="text-3xl font-bold text-white mb-6">Edit Profile</h2>

                  <div className="space-y-5">
                    <div>
                      <label className="text-sm font-semibold text-slate-300 mb-2 block">Full Name</label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-500 transition"
                      />
                    </div>

                    <div>
                      <label className="text-sm font-semibold text-slate-300 mb-2 block">Email</label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        disabled
                        className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-slate-500 cursor-not-allowed opacity-60"
                      />
                      <p className="text-xs text-slate-500 mt-1">Email cannot be changed</p>
                    </div>

                    <div>
                      <label className="text-sm font-semibold text-slate-300 mb-2 block">Phone</label>
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-500 transition"
                      />
                    </div>

                    <div>
                      <label className="text-sm font-semibold text-slate-300 mb-2 block">Bio</label>
                      <textarea
                        name="bio"
                        value={formData.bio}
                        onChange={handleInputChange}
                        rows="4"
                        className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-500 transition resize-none"
                        placeholder="Tell us about yourself..."
                      />
                    </div>

                    <div className="flex gap-3 pt-4">
                      <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="flex-1">
                        <Button fullWidth onClick={handleSaveProfile} disabled={isSaving}>
                          <FiCheck className="inline mr-2" size={16} />
                          {isSaving ? 'Saving...' : 'Save Changes'}
                        </Button>
                      </motion.div>
                      <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="flex-1">
                        <Button fullWidth onClick={() => setIsEditing(false)} className="bg-white/10 border border-white/20">
                          <FiX className="inline mr-2" size={16} />
                          Cancel
                        </Button>
                      </motion.div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Tabs */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-6 shadow-2xl"
            >
              <div className="flex gap-6 border-b border-white/10 overflow-x-auto">
                {[
                  { id: 'bookings', label: 'Bookings', icon: FiBookmark },
                  { id: 'reviews', label: 'Reviews', icon: FiStar },
                  { id: 'settings', label: 'Settings', icon: FiBell }
                ].map(tab => {
                  const Icon = tab.icon;
                  return (
                    <motion.button
                      key={tab.id}
                      whileHover={{ y: -2 }}
                      onClick={() => setActiveTab(tab.id)}
                      className={`pb-4 font-semibold capitalize whitespace-nowrap flex items-center gap-2 transition ${
                        activeTab === tab.id
                          ? 'text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400 border-b-2 border-purple-500'
                          : 'text-slate-400 hover:text-slate-300'
                      }`}
                    >
                      <Icon size={18} /> {tab.label}
                    </motion.button>
                  );
                })}
              </div>

              {/* Bookings Tab */}
              <AnimatePresence mode="wait">
                {activeTab === 'bookings' && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="pt-6 space-y-4"
                  >
                    <div className="flex justify-between items-center mb-6">
                      <h2 className="text-2xl font-bold text-white">My Bookings</h2>
                      <Button onClick={() => navigate('/trips')} size="sm">Book New Trip</Button>
                    </div>

                    {userBookings.length > 0 ? (
                      userBookings.map((booking, idx) => {
                        const daysLeft = calculateDaysUntil(booking.startDate);
                        const isUpcoming = daysLeft > 0;

                        return (
                          <motion.div
                            key={booking.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: idx * 0.1 }}
                            className="backdrop-blur-lg bg-white/5 border border-white/10 rounded-xl overflow-hidden hover:border-white/20 hover:bg-white/8 transition-all"
                          >
                            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                              <div className="md:col-span-1 h-40 overflow-hidden">
                                <motion.img
                                  src={booking.image}
                                  alt={booking.tripName}
                                  className="w-full h-full object-cover"
                                  whileHover={{ scale: 1.1 }}
                                  transition={{ duration: 0.5 }}
                                />
                              </div>

                              <div className="md:col-span-3 p-6">
                                <div className="flex justify-between items-start mb-3">
                                  <div>
                                    <h3 className="text-lg font-bold text-white">{booking.tripName}</h3>
                                    <p className="text-slate-400 text-sm">📍 {booking.destination}</p>
                                  </div>
                                  <motion.span
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    className={`text-xs font-bold px-3 py-1 rounded-full backdrop-blur-lg bg-gradient-to-r ${getStatusBadge(booking.status)}`}
                                  >
                                    {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                                  </motion.span>
                                </div>

                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4 text-sm">
                                  {[
                                    { label: 'Check-in', value: booking.startDate },
                                    { label: 'Check-out', value: booking.endDate },
                                    { label: 'Travelers', value: booking.travelers },
                                    { label: 'Price', value: `₹${booking.price.toLocaleString()}` }
                                  ].map((item, i) => (
                                    <div key={i}>
                                      <p className="text-slate-500 text-xs">{item.label}</p>
                                      <p className="font-semibold text-white">{item.value}</p>
                                    </div>
                                  ))}
                                </div>

                                <div className="flex items-center justify-between gap-2">
                                  <div>
                                    {isUpcoming ? (
                                      <p className="text-sm text-green-400 font-semibold">
                                        ✓ Starts in {daysLeft} days
                                      </p>
                                    ) : (
                                      <p className="text-sm text-slate-400">
                                        Completed on {booking.endDate}
                                      </p>
                                    )}
                                  </div>
                                  <Button size="sm" className="bg-white/10 border border-white/20">
                                    View Details
                                  </Button>
                                </div>
                              </div>
                            </div>
                          </motion.div>
                        );
                      })
                    ) : (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="backdrop-blur-lg bg-white/5 border border-white/10 rounded-xl p-12 text-center"
                      >
                        <p className="text-slate-400 mb-4">No bookings yet</p>
                        <Button onClick={() => navigate('/trips')}>Start Exploring</Button>
                      </motion.div>
                    )}
                  </motion.div>
                )}

                {/* Reviews Tab */}
                {activeTab === 'reviews' && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="pt-6 space-y-4"
                  >
                    <h2 className="text-2xl font-bold text-white mb-6">My Reviews ({userReviews.length})</h2>

                    {userReviews.length > 0 ? (
                      userReviews.map((review, idx) => (
                        <motion.div
                          key={review.id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: idx * 0.1 }}
                          className="backdrop-blur-lg bg-white/5 border border-white/10 rounded-xl p-6 hover:border-white/20 transition-all"
                        >
                          <div className="flex justify-between items-start mb-3">
                            <div>
                              <h3 className="text-lg font-bold text-white">{review.tripName}</h3>
                              <p className="text-sm text-slate-500">Reviewed on {review.date}</p>
                            </div>
                            <div className="text-lg">{'⭐'.repeat(review.rating)}</div>
                          </div>

                          <h4 className="font-bold text-white mb-2">{review.title}</h4>
                          <p className="text-slate-300 mb-4">{review.text}</p>

                          <div className="flex items-center justify-between pt-4 border-t border-white/10">
                            <p className="text-sm text-slate-500">{review.helpful} travelers found this helpful</p>
                            <div className="flex gap-2">
                              <Button size="sm" className="bg-white/10">Edit</Button>
                              <Button size="sm" className="bg-red-500/10 text-red-400">Delete</Button>
                            </div>
                          </div>
                        </motion.div>
                      ))
                    ) : (
                      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="backdrop-blur-lg bg-white/5 border border-white/10 rounded-xl p-12 text-center">
                        <p className="text-slate-400 mb-4">No reviews yet</p>
                        <Button onClick={() => navigate('/trips')}>Explore Trips</Button>
                      </motion.div>
                    )}
                  </motion.div>
                )}

                {/* Settings Tab */}
                {activeTab === 'settings' && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="pt-6 space-y-6"
                  >
                    <div className="backdrop-blur-lg bg-white/5 border border-white/10 rounded-xl p-6">
                      <h3 className="text-xl font-bold text-white mb-4">Notifications</h3>

                      <div className="space-y-3">
                        {[
                          { label: 'Email Notifications', desc: 'Booking updates', defaultChecked: true },
                          { label: 'SMS Notifications', desc: 'Important alerts', defaultChecked: true },
                          { label: 'Marketing Emails', desc: 'Special offers', defaultChecked: false },
                          { label: 'Community Updates', desc: 'Messages from WravelForLife', defaultChecked: true }
                        ].map((item, i) => (
                          <motion.div
                            key={i}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: i * 0.05 }}
                            className="flex items-center justify-between p-4 bg-white/5 border border-white/10 rounded-lg hover:bg-white/8 transition"
                          >
                            <div>
                              <p className="font-semibold text-white">{item.label}</p>
                              <p className="text-sm text-slate-500">{item.desc}</p>
                            </div>
                            <input type="checkbox" defaultChecked={item.defaultChecked} className="w-5 h-5 accent-purple-500" />
                          </motion.div>
                        ))}
                      </div>
                    </div>

                    <div className="backdrop-blur-lg bg-red-500/10 border border-red-500/30 rounded-xl p-6">
                      <h3 className="text-lg font-bold text-red-300 mb-4">Danger Zone</h3>

                      <div className="space-y-3">
                        <Button fullWidth size="sm" className="bg-red-500/20 border border-red-500/30 text-red-300">
                          <FiLock className="inline mr-2" size={16} /> Change Password
                        </Button>
                        <Button fullWidth size="sm" className="bg-red-600/20 border border-red-600/30 text-red-300">
                          <FiTrash2 className="inline mr-2" size={16} /> Delete Account
                        </Button>
                      </div>

                      <p className="text-sm text-red-400/70 mt-4">
                        Deleting your account will permanently remove all your data. This action cannot be undone.
                      </p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

export default Profile;
