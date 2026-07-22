import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Toaster, toast } from 'react-hot-toast';
import {
  FiEdit2, FiTrash2, FiPlus, FiEye, FiSearch, FiFilter, FiDownload, FiCheck, FiX, FiUsers, FiDollarSign, FiClock, FiCalendar, FiMapPin, FiGift, FiHome
} from 'react-icons/fi';
import Lenis from 'lenis';

// Services
import tripService from '../services/tripService';
import bookingService from '../services/bookingService';
import userService from '../services/userService';
import offerService from '../services/offerService';

// Components
import Sidebar from '../components/admin/Sidebar';
import StatsGrid from '../components/admin/StatsGrid';
import RevenueChart from '../components/admin/RevenueChart';
import BookingOverview from '../components/admin/BookingOverview';
import RecentActivity from '../components/admin/RecentActivity';
import Button from '../components/common/Button';
import Card from '../components/common/Card';

function AdminDashboard() {
  const navigate = useNavigate();

  // Smooth Scroll
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      direction: 'vertical',
      gestureDirection: 'vertical',
      smooth: true,
      mouseMultiplier: 1,
      smoothTouch: false,
      touchMultiplier: 2,
    });

    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);

    return () => {
      lenis.destroy();
    };
  }, []);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isLoading, setIsLoading] = useState(true);

  // Data States
  const [trips, setTrips] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [users, setUsers] = useState([]);
  const [offers, setOffers] = useState([]);
  const [activities, setActivities] = useState([]);

  // Current Time State
  const [currentTime, setCurrentTime] = useState(new Date());

  // Modal State
  const [showModal, setShowModal] = useState(null); // 'createOffer', 'editTrip', etc.

  // Forms
  const initialTripForm = {
    name: '', destination: '', price: '', duration: '', startDate: '', endDate: '',
    status: 'active', groupSize: '', difficulty: 'Moderate',
    description: '', image: '', latitude: '', longitude: '',
    season: '', bestSeason: '', altitude: '',
    highlights: '', itinerary: '', inclusions: '', exclusions: ''
  };

  const [tripForm, setTripForm] = useState(initialTripForm);

  const [offerForm, setOfferForm] = useState({
    code: '', discount: '', type: 'PERCENTAGE', minAmount: '', validUntil: '', usageLimit: ''
  });

  // Fetch Data
  useEffect(() => {
    fetchData();
    const timer = setInterval(() => setCurrentTime(new Date()), 60000);
    return () => clearInterval(timer);
  }, []);

  const fetchData = async () => {
    try {
      setIsLoading(true);
      const [tripsData, bookingsData, usersData, offersData] = await Promise.all([
        tripService.getAllTrips(),
        bookingService.getAllBookings(),
        userService.getAllUsers(),
        offerService.getAllOffers()
      ]);

      setTrips(tripsData);
      setBookings(bookingsData);
      setUsers(usersData || []);
      setOffers(offersData || []);

      // Mock Recent Activity based on bookings
      const recent = bookingsData.slice(0, 5).map(b => ({
        id: b.id,
        user: b.user?.fullName || 'Unknown',
        action: 'booked',
        target: b.trip?.name || 'Trip',
        time: new Date(b.bookingDate).toLocaleDateString(),
        avatar: b.user?.avatar // Removed external fallback
      }));
      setActivities(recent);

    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      toast.error('Failed to load dashboard data');
    } finally {
      setIsLoading(false);
    }
  };

  const handleEditTrip = (trip) => {
    setTripForm({
      ...trip,
      startDate: trip.startDate ? trip.startDate.split('T')[0] : '',
      endDate: trip.endDate ? trip.endDate.split('T')[0] : '',
      highlights: trip.highlights || '',
      itinerary: trip.itinerary || '',
      inclusions: trip.inclusions || '',
      exclusions: trip.exclusions || '',
      category: trip.category || '' // field might be missing in form but good to have
    });
    setShowModal('editTrip');
  };

  const handleSaveTrip = async (e) => {
    e.preventDefault();
    try {
      const payload = { ...tripForm };
      // Ensure numeric values
      payload.price = parseFloat(payload.price);
      payload.duration = parseInt(payload.duration);
      payload.groupSize = parseInt(payload.groupSize);
      payload.latitude = payload.latitude ? parseFloat(payload.latitude) : null;
      payload.longitude = payload.longitude ? parseFloat(payload.longitude) : null;
      payload.availableSeats = parseInt(payload.groupSize); // Sync seats with group size for now

      if (showModal === 'createTrip') {
        await tripService.createTrip(payload);
        toast.success('Trip created successfully');
      } else {
        await tripService.updateTrip(payload.id, payload);
        toast.success('Trip updated successfully');
      }
      setShowModal(null);
      fetchData();
    } catch (err) {
      console.error(err);
      toast.error('Failed to save trip');
    }
  };

  const handleDeleteTrip = async (id) => {
    if (window.confirm('Are you sure you want to delete this trip?')) {
      try {
        await tripService.deleteTrip(id);
        toast.success('Trip deleted');
        fetchData();
      } catch (err) {
        toast.error('Failed to delete trip');
      }
    }
  };

  // derived stats...
  const stats = {
    revenue: bookings.reduce((sum, b) => sum + (b.totalPrice || 0), 0),
    bookings: bookings.length,
    users: users.length,
    trips: trips.filter(t => t.active).length
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  const user = JSON.parse(localStorage.getItem('user') || '{ }');

  // --- Render Helpers ---
  // ... (renderDashboard is unchanged unless we jump to renderUsers)

  // skipping renderDashboard...

  // ...

  // To apply modifications to multiple places, I will use MultiReplace if possible, or distinct Replace calls.
  // Since I hit the line count limit for this specific Replace call if I try to do too much, I will break it down.
  // This specific call will focus on the fetchData part.

  // --- Render Helpers ---

  // Dashboard Overview Tab
  const renderDashboard = () => (
    <div className="space-y-8">
      {/* Welcome Header */}
      <div className="flex flex-col md:flex-row justify-between items-end md:items-center bg-gradient-to-r from-teal-900/40 to-transparent p-6 rounded-2xl border border-white/5 backdrop-blur-sm">
        <div>
          <h1 className="text-3xl font-display font-black text-white mb-2">
            Welcome back, <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-teal-400">{user.fullName || 'Admin'}</span>
          </h1>
          <p className="text-grey-400 text-sm">Here's what's happening with your platform today.</p>
        </div>
        <div className="text-right mt-4 md:mt-0 flex gap-6">
          <div className="flex flex-col items-end">
            <span className="text-xs text-grey-500 uppercase tracking-wider font-bold mb-1 flex items-center gap-1"><FiCalendar /> Date</span>
            <span className="text-white font-bold font-mono">{currentTime.toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' })}</span>
          </div>
          <div className="flex flex-col items-end">
            <span className="text-xs text-grey-500 uppercase tracking-wider font-bold mb-1 flex items-center gap-1"><FiClock /> Time</span>
            <span className="text-white font-bold font-mono">{currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
          </div>
        </div>
      </div>

      <StatsGrid stats={stats} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <RevenueChart />
        </div>
        <div>
          <BookingOverview bookings={bookings} />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <RecentActivity activities={activities} />

        <div className="bg-teal-900/40 backdrop-blur-xl border border-white/10 p-8 rounded-2xl h-full shadow-xl">
          <div className="flex justify-between items-center mb-8">
            <h3 className="text-xl font-bold text-white">Quick Actions</h3>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Button onClick={() => setActiveTab('bookings')} variant="secondary" className="h-32 flex flex-col items-center justify-center gap-3 bg-white/5 hover:bg-white/10 border border-white/5 group transition-all duration-300 hover:-translate-y-1">
              <div className="p-3 bg-teal-500/20 rounded-full text-teal-400 group-hover:scale-110 transition-transform">
                <FiCheck size={24} />
              </div>
              <span className="font-bold">Verify Bookings</span>
            </Button>
            <Button onClick={() => setActiveTab('trips')} variant="secondary" className="h-32 flex flex-col items-center justify-center gap-3 bg-white/5 hover:bg-white/10 border border-white/5 group transition-all duration-300 hover:-translate-y-1">
              <div className="p-3 bg-cyan-500/20 rounded-full text-cyan-400 group-hover:scale-110 transition-transform">
                <FiPlus size={24} />
              </div>
              <span className="font-bold">Add New Trip</span>
            </Button>
            <Button onClick={() => setActiveTab('users')} variant="secondary" className="h-32 flex flex-col items-center justify-center gap-3 bg-white/5 hover:bg-white/10 border border-white/5 group transition-all duration-300 hover:-translate-y-1">
              <div className="p-3 bg-purple-500/20 rounded-full text-purple-400 group-hover:scale-110 transition-transform">
                <FiUsers size={24} />
              </div>
              <span className="font-bold">Manage Users</span>
            </Button>
            <Button onClick={() => setShowModal('createOffer')} variant="secondary" className="h-32 flex flex-col items-center justify-center gap-3 bg-white/5 hover:bg-white/10 border border-white/5 group transition-all duration-300 hover:-translate-y-1">
              <div className="p-3 bg-emerald-500/20 rounded-full text-emerald-400 group-hover:scale-110 transition-transform">
                <FiDollarSign size={24} />
              </div>
              <span className="font-bold">Create Offer</span>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );

  // Bookings Tab
  const renderBookings = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center bg-teal-900/40 p-6 rounded-2xl border border-white/10 backdrop-blur-md">
        <h2 className="text-2xl font-bold text-white">All Bookings</h2>
        <div className="flex gap-3">
          <Button variant="secondary" className="bg-black/20 border-white/10"><FiFilter className="mr-2" /> Filter</Button>
          <Button variant="secondary" className="bg-black/20 border-white/10"><FiDownload className="mr-2" /> Export</Button>
        </div>
      </div>

      <Card className="overflow-hidden bg-teal-900/40 backdrop-blur-xl border border-white/10 shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-black/20 border-b border-white/10 text-grey-400 font-bold uppercase text-xs tracking-wider">
              <tr>
                <th className="px-6 py-5">ID</th>
                <th className="px-6 py-5">User</th>
                <th className="px-6 py-5">Trip</th>
                <th className="px-6 py-5">Date</th>
                <th className="px-6 py-5">Status</th>
                <th className="px-6 py-5">Amount</th>
                <th className="px-6 py-5">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {bookings.map((booking) => (
                <tr key={booking.id} className="hover:bg-white/5 transition-colors group">
                  <td className="px-6 py-4 text-cyan-400 font-mono font-bold">#{booking.id}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-cyan-500 to-teal-500 flex items-center justify-center text-xs font-bold shadow-lg text-white">
                        {booking.user?.fullName?.charAt(0) || 'U'}
                      </div>
                      <div>
                        <p className="font-bold text-white text-sm">{booking.user?.fullName}</p>
                        <p className="text-xs text-grey-400">{booking.user?.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-white text-sm font-medium">{booking.trip?.name}</td>
                  <td className="px-6 py-4 text-grey-400 text-sm">{new Date(booking.bookingDate).toLocaleDateString()}</td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold border ${booking.status === 'confirmed' ? 'bg-green-500/10 text-green-400 border-green-500/20' :
                      booking.status === 'pending' ? 'bg-amber-500/10 text-amber-400 border-amber-500/20' : 'bg-red-500/10 text-red-400 border-red-500/20'
                      }`}>
                      {booking.status || 'Pending'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-white font-bold font-mono">₹{(booking.totalPrice || 0).toLocaleString()}</td>
                  <td className="px-6 py-4 flex gap-2 opacity-60 group-hover:opacity-100 transition-opacity">
                    <button className="p-2 hover:bg-cyan-500/20 rounded-lg text-cyan-400 transition-colors"><FiEye /></button>
                    <button className="p-2 hover:bg-red-500/20 rounded-lg text-red-400 transition-colors"><FiTrash2 /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );

  // Users Tab
  const renderUsers = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center bg-teal-900/40 p-6 rounded-2xl border border-white/10 backdrop-blur-md">
        <h2 className="text-2xl font-bold text-white">Registered Users</h2>
        <div className="relative">
          <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-grey-400" />
          <input type="text" placeholder="Search users..." className="bg-black/20 border border-white/10 rounded-xl pl-10 pr-4 py-2 text-sm text-white focus:border-cyan-400 outline-none w-64 transition-all" />
        </div>
      </div>

      <Card className="overflow-hidden backdrop-blur-xl bg-teal-900/60 border border-white/10 shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-black/20 border-b border-white/10">
              <tr>
                {['ID', 'Name', 'Email', 'Phone', 'Role', 'Joined Date'].map(header => (
                  <th key={header} className="px-6 py-4 text-left text-sm font-bold text-grey-300 uppercase tracking-wider">{header}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-white/10">
              {users.map((user, idx) => (
                <motion.tr
                  key={user.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  className="hover:bg-white/5 transition-all group"
                >
                  <td className="px-6 py-4 text-sm font-bold text-cyan-400 font-mono">#{user.id}</td>
                  <td className="px-6 py-4 text-sm font-bold text-white flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full border border-white/10 shadow-sm bg-gradient-to-tr from-purple-500 to-indigo-500 flex items-center justify-center text-xs font-bold text-white">
                      {user.name?.charAt(0) || 'U'}
                    </div>
                    {user.name}
                  </td>
                  <td className="px-6 py-4 text-sm text-grey-300">{user.email}</td>
                  <td className="px-6 py-4 text-sm text-grey-300">{user.phone}</td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 text-xs font-bold rounded-full border ${user.role === 'ADMIN' ? 'bg-purple-500/20 text-purple-300 border-purple-500/30' : 'bg-blue-500/20 text-blue-300 border-blue-500/30'}`}>
                      {user.role}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-grey-400">{new Date(user.createdAt).toLocaleDateString()}</td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );

  // Trips Tab
  const renderTrips = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center bg-teal-900/40 p-6 rounded-2xl border border-white/10 backdrop-blur-md">
        <h2 className="text-2xl font-bold text-white">Manage Trips</h2>
        <Button onClick={() => { setTripForm(initialTripForm); setShowModal('createTrip'); }} className="shadow-lg shadow-cyan-500/20"><FiPlus className="mr-2" /> Add Trip</Button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {trips.map(trip => (
          <Card key={trip.id} className="p-0 overflow-hidden group border border-white/10 hover:border-cyan-500/30 hover:shadow-2xl hover:shadow-cyan-900/20 transition-all duration-300">
            <div className="h-48 relative overflow-hidden bg-teal-900">
              {trip.image ? (
                <img src={trip.image} alt={trip.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" onError={(e) => e.target.style.display = 'none'} />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-teal-800 to-black flex items-center justify-center transition-transform duration-700 group-hover:scale-110">
                  <FiMapPin className="text-white/20 w-16 h-16" />
                </div>
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
              <div className="absolute top-3 right-3 px-2 py-1 bg-black/60 backdrop-blur-md rounded-lg text-xs font-bold text-white border border-white/10">
                {trip.active ? 'Active' : 'Inactive'}
              </div>
            </div>
            <div className="p-5 relative">
              <h3 className="text-xl font-bold text-white mb-1 group-hover:text-cyan-400 transition-colors">{trip.name}</h3>
              <p className="text-grey-400 text-sm mb-4 flex items-center gap-2"><FiMapPin size={12} className="text-cyan-500" /> {trip.destination} • <FiClock size={12} className="text-cyan-500" /> {trip.duration} Days</p>

              <div className="flex justify-between items-center mb-6 p-3 bg-black/20 rounded-xl border border-white/5">
                <span className="text-cyan-400 font-bold text-lg">₹{trip.price.toLocaleString()}</span>
                <span className="text-xs text-grey-500 font-medium">{trip.bookings?.length || 0} Bookings</span>
              </div>

              <div className="flex gap-2">
                <Button size="sm" variant="secondary" fullWidth className="hover:bg-cyan-500/10 hover:text-cyan-400 hover:border-cyan-500/30" onClick={() => handleEditTrip(trip)}><FiEdit2 /> Edit</Button>
                <Button size="sm" className="bg-red-500/10 text-red-400 hover:bg-red-500/20 border border-red-500/20" onClick={() => handleDeleteTrip(trip.id)}><FiTrash2 /></Button>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );

  // Offers Tab
  const renderOffers = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center bg-teal-900/40 p-6 rounded-2xl border border-white/10 backdrop-blur-md">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-emerald-500/20 rounded-xl text-emerald-400">
            <FiGift size={24} />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-white">Offers & Promos</h2>
            <p className="text-xs text-grey-400">Manage your discount codes</p>
          </div>
        </div>
        <Button onClick={() => setShowModal('createOffer')} className="shadow-lg shadow-cyan-500/20"><FiPlus className="mr-2" /> Create Offer</Button>
      </div>

      <Card className="overflow-hidden backdrop-blur-xl bg-teal-900/60 border border-white/10 shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-black/20 border-b border-white/10">
              <tr>
                {['Code', 'Discount', 'Type', 'Min Amount', 'Valid Until', 'Usage', 'Status', 'Actions'].map(header => (
                  <th key={header} className="px-6 py-5 text-left text-sm font-bold text-grey-300 uppercase tracking-wider">{header}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-white/10">
              {offers.map((offer) => (
                <tr key={offer.id} className="hover:bg-white/5 transition-all group">
                  <td className="px-6 py-4 text-cyan-400 font-bold font-mono text-lg">{offer.code}</td>
                  <td className="px-6 py-4 text-white font-bold">
                    {offer.type === 'PERCENTAGE' ? (
                      <span className="flex items-center gap-1 text-emerald-400 bg-emerald-500/10 px-2 py-1 rounded-lg w-fit"><FiDollarSign size={12} /> {offer.discount}%</span>
                    ) : (
                      <span className="flex items-center gap-1 text-cyan-400 bg-cyan-500/10 px-2 py-1 rounded-lg w-fit">₹{offer.discount}</span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-xs font-bold text-grey-400 uppercase tracking-wide">{offer.type}</td>
                  <td className="px-6 py-4 text-sm text-grey-300 font-mono">₹{offer.minAmount}</td>
                  <td className="px-6 py-4 text-sm text-grey-300">{offer.validUntil}</td>
                  <td className="px-6 py-4">
                    <div className="w-24 bg-black/30 rounded-full h-2 overflow-hidden mb-1">
                      <div className="bg-cyan-500 h-full rounded-full" style={{ width: `${Math.min((offer.usedCount / offer.usageLimit) * 100, 100)}%` }}></div>
                    </div>
                    <span className="text-xs text-grey-400">{offer.usedCount} / {offer.usageLimit}</span>
                  </td>
                  <td className="px-6 py-4">
                    <button
                      onClick={async () => {
                        try {
                          await offerService.toggleOfferActive(offer.id);
                          fetchData();
                          toast.success('Offer status updated');
                        } catch (err) {
                          toast.error('Failed to update status');
                        }
                      }}
                      className={`px-3 py-1 text-xs font-bold rounded-full border transition-all ${offer.active ? 'bg-green-500/10 text-green-400 border-green-500/20 hover:bg-green-500/20' : 'bg-red-500/10 text-red-400 border-red-500/20 hover:bg-red-500/20'}`}>
                      {offer.active ? 'Active' : 'Inactive'}
                    </button>
                  </td>
                  <td className="px-6 py-4 flex gap-2 opacity-60 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={async () => {
                        if (window.confirm('Delete this offer?')) {
                          try {
                            await offerService.deleteOffer(offer.id);
                            fetchData();
                            toast.success('Offer deleted');
                          } catch (err) {
                            toast.error('Failed to delete offer');
                          }
                        }
                      }}
                      className="p-2 hover:bg-red-500/20 rounded-lg text-red-400 transition-colors"
                    >
                      <FiTrash2 />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );


  if (isLoading) {
    return (
      <div className="min-h-screen bg-teal-950 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-cyan-400"></div>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen bg-[#020617] font-body text-white selection:bg-cyan-500 selection:text-teal-900">
      {/* Background Gradients */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 left-0 w-full h-[500px] bg-gradient-to-b from-teal-900/20 to-transparent" />
        <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-cyan-900/10 rounded-full blur-[100px]" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-teal-900/5 rounded-full blur-[120px]" />
      </div>

      <Toaster position="top-right" toastOptions={{
        style: {
          background: '#0f172a',
          color: '#fff',
          border: '1px solid rgba(255,255,255,0.1)'
        }
      }} />

      {/* Sidebar */}
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} onLogout={handleLogout} />

      {/* Main Content */}
      <div className="flex-1 ml-64 p-8 relative z-10">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
          >
            {activeTab === 'dashboard' && renderDashboard()}
            {activeTab === 'bookings' && renderBookings()}
            {activeTab === 'users' && renderUsers()}
            {activeTab === 'trips' && renderTrips()}
            {activeTab === 'offers' && renderOffers()}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Modals */}
      <AnimatePresence>
        {/* Create Offer Modal */}
        {showModal === 'createOffer' && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              className="bg-teal-950 border border-white/10 rounded-2xl p-8 w-full max-w-lg shadow-2xl relative overflow-hidden"
            >
              {/* Modal Glow */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/10 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2" />

              <div className="flex justify-between items-center mb-8 relative z-10">
                <div>
                  <h3 className="text-2xl font-bold text-white">Create Offer</h3>
                  <p className="text-sm text-grey-400">Set up a new discount code</p>
                </div>
                <button onClick={() => setShowModal(null)} className="p-2 hover:bg-white/10 rounded-full transition-colors"><FiX className="text-grey-400 hover:text-white" /></button>
              </div>

              <form onSubmit={async (e) => {
                e.preventDefault();
                try {
                  await offerService.createOffer(offerForm);
                  setShowModal(null);
                  fetchData();
                  toast.success('Offer created!');
                  setOfferForm({ code: '', discount: '', type: 'PERCENTAGE', minAmount: '', validUntil: '', usageLimit: '' });
                } catch (err) {
                  alert('Failed to create offer: ' + err.message);
                }
              }} className="space-y-6 relative z-10">
                <div className="group">
                  <label className="block text-xs font-bold text-cyan-400 uppercase tracking-wider mb-2">Offer Code</label>
                  <input
                    type="text"
                    required
                    value={offerForm.code}
                    onChange={e => setOfferForm({ ...offerForm, code: e.target.value.toUpperCase() })}
                    className="w-full bg-black/30 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-cyan-400 outline-none transition-all focus:bg-black/50 font-mono text-lg tracking-wider"
                    placeholder="e.g. SUMMER2024"
                  />
                </div>

                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <label className="block text-xs font-bold text-grey-400 uppercase tracking-wider mb-2">Discount Type</label>
                    <div className="relative">
                      <select
                        value={offerForm.type}
                        onChange={e => setOfferForm({ ...offerForm, type: e.target.value })}
                        className="w-full bg-black/30 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-cyan-400 outline-none appearance-none"
                      >
                        <option value="PERCENTAGE">Percentage (%)</option>
                        <option value="FIXED">Fixed Amount (₹)</option>
                      </select>
                      <FiCheck className="absolute right-4 top-1/2 -translate-y-1/2 text-grey-500 pointer-events-none" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-grey-400 uppercase tracking-wider mb-2">Value</label>
                    <input
                      type="number"
                      required
                      value={offerForm.discount}
                      onChange={e => setOfferForm({ ...offerForm, discount: e.target.value })}
                      className="w-full bg-black/30 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-cyan-400 outline-none"
                      placeholder="e.g. 10"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <label className="block text-xs font-bold text-grey-400 uppercase tracking-wider mb-2">Min Order (₹)</label>
                    <input
                      type="number"
                      value={offerForm.minAmount}
                      onChange={e => setOfferForm({ ...offerForm, minAmount: e.target.value })}
                      className="w-full bg-black/30 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-cyan-400 outline-none"
                      placeholder="e.g. 5000"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-grey-400 uppercase tracking-wider mb-2">Usage Limit</label>
                    <input
                      type="number"
                      value={offerForm.usageLimit}
                      onChange={e => setOfferForm({ ...offerForm, usageLimit: e.target.value })}
                      className="w-full bg-black/30 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-cyan-400 outline-none"
                      placeholder="e.g. 100"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-grey-400 uppercase tracking-wider mb-2">Valid Until</label>
                  <input
                    type="date"
                    required
                    value={offerForm.validUntil}
                    onChange={e => setOfferForm({ ...offerForm, validUntil: e.target.value })}
                    className="w-full bg-black/30 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-cyan-400 outline-none"
                  />
                </div>

                <Button type="submit" fullWidth className="bg-gradient-to-r from-cyan-500 to-teal-500 hover:from-cyan-400 hover:to-teal-400 text-white font-bold py-4 rounded-xl shadow-lg shadow-cyan-900/50 mt-4">
                  Create Offer
                </Button>
              </form>
            </motion.div>
          </div>
        )}

        {/* Create/Edit Trip Modal */}
        {(showModal === 'createTrip' || showModal === 'editTrip') && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              className="bg-teal-950 border border-white/10 rounded-2xl w-full max-w-4xl shadow-2xl relative flex flex-col max-h-[90vh]"
            >
              <div className="p-6 border-b border-white/10 flex justify-between items-center bg-teal-900/40">
                <h3 className="text-2xl font-bold text-white">
                  {showModal === 'createTrip' ? 'Create New Trip' : 'Edit Trip'}
                </h3>
                <button onClick={() => setShowModal(null)} className="p-2 hover:bg-white/10 rounded-full transition-colors">
                  <FiX className="text-grey-400 hover:text-white" />
                </button>
              </div>

              <div className="overflow-y-auto p-8 custom-scrollbar">
                <form id="tripForm" onSubmit={handleSaveTrip} className="space-y-8">
                  {/* Basic Info */}
                  <div className="space-y-4">
                    <h4 className="text-lg font-bold text-cyan-400 border-b border-white/10 pb-2">Basic Information</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-xs font-bold text-grey-400 uppercase tracking-wider mb-2">Trip Name</label>
                        <input type="text" value={tripForm.name} onChange={e => setTripForm({ ...tripForm, name: e.target.value })} className="w-full bg-black/30 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-cyan-400 outline-none" required />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-grey-400 uppercase tracking-wider mb-2">Destination</label>
                        <input type="text" value={tripForm.destination} onChange={e => setTripForm({ ...tripForm, destination: e.target.value })} className="w-full bg-black/30 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-cyan-400 outline-none" required />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-grey-400 uppercase tracking-wider mb-2">Price (₹)</label>
                        <input type="number" value={tripForm.price} onChange={e => setTripForm({ ...tripForm, price: e.target.value })} className="w-full bg-black/30 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-cyan-400 outline-none" required />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-grey-400 uppercase tracking-wider mb-2">Duration (Days)</label>
                        <input type="number" value={tripForm.duration} onChange={e => setTripForm({ ...tripForm, duration: e.target.value })} className="w-full bg-black/30 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-cyan-400 outline-none" required />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-grey-400 uppercase tracking-wider mb-2">Start Date</label>
                        <input type="date" value={tripForm.startDate} onChange={e => setTripForm({ ...tripForm, startDate: e.target.value })} className="w-full bg-black/30 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-cyan-400 outline-none" required />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-grey-400 uppercase tracking-wider mb-2">End Date</label>
                        <input type="date" value={tripForm.endDate} onChange={e => setTripForm({ ...tripForm, endDate: e.target.value })} className="w-full bg-black/30 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-cyan-400 outline-none" required />
                      </div>
                    </div>
                  </div>

                  {/* Location & Details */}
                  <div className="space-y-4">
                    <h4 className="text-lg font-bold text-cyan-400 border-b border-white/10 pb-2">Location & Details</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-xs font-bold text-grey-400 uppercase tracking-wider mb-2">Latitude</label>
                        <input type="number" step="any" value={tripForm.latitude} onChange={e => setTripForm({ ...tripForm, latitude: e.target.value })} className="w-full bg-black/30 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-cyan-400 outline-none" placeholder="e.g. 31.1048" />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-grey-400 uppercase tracking-wider mb-2">Longitude</label>
                        <input type="number" step="any" value={tripForm.longitude} onChange={e => setTripForm({ ...tripForm, longitude: e.target.value })} className="w-full bg-black/30 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-cyan-400 outline-none" placeholder="e.g. 77.1734" />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-grey-400 uppercase tracking-wider mb-2">Difficulty</label>
                        <select value={tripForm.difficulty} onChange={e => setTripForm({ ...tripForm, difficulty: e.target.value })} className="w-full bg-black/30 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-cyan-400 outline-none">
                          <option value="Easy">Easy</option>
                          <option value="Moderate">Moderate</option>
                          <option value="Hard">Hard</option>
                          <option value="Expert">Expert</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-grey-400 uppercase tracking-wider mb-2">Group Size</label>
                        <input type="number" value={tripForm.groupSize} onChange={e => setTripForm({ ...tripForm, groupSize: e.target.value })} className="w-full bg-black/30 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-cyan-400 outline-none" required />
                      </div>
                    </div>
                  </div>

                  {/* Description & Media */}
                  <div className="space-y-4">
                    <h4 className="text-lg font-bold text-cyan-400 border-b border-white/10 pb-2">Description & Media</h4>
                    <div>
                      <label className="block text-xs font-bold text-grey-400 uppercase tracking-wider mb-2">Description</label>
                      <textarea rows="4" value={tripForm.description} onChange={e => setTripForm({ ...tripForm, description: e.target.value })} className="w-full bg-black/30 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-cyan-400 outline-none" required />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-grey-400 uppercase tracking-wider mb-2">Image URL</label>
                      <input type="text" value={tripForm.image} onChange={e => setTripForm({ ...tripForm, image: e.target.value })} className="w-full bg-black/30 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-cyan-400 outline-none" />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-grey-400 uppercase tracking-wider mb-2">Highlights (newline separated)</label>
                      <textarea rows="3" value={tripForm.highlights} onChange={e => setTripForm({ ...tripForm, highlights: e.target.value })} className="w-full bg-black/30 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-cyan-400 outline-none" />
                    </div>
                  </div>
                </form>
              </div>

              <div className="p-6 border-t border-white/10 bg-teal-900/40 flex justify-end gap-4">
                <Button variant="secondary" onClick={() => setShowModal(null)}>Cancel</Button>
                <Button type="submit" form="tripForm">Save Trip</Button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div >
  );
}

export default AdminDashboard;
