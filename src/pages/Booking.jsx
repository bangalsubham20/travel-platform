import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import Button from '../components/common/Button';
import Card from '../components/common/Card';
import LoadingSpinner from '../components/common/LoadingSpinner';
import { motion, AnimatePresence } from 'framer-motion';
import { FiUser, FiCheck, FiX, FiArrowRight, FiLock } from 'react-icons/fi';
import bookingService from '../services/bookingService';
import tripService from '../services/tripService';

function Booking() {
  const { tripId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [tripLoading, setTripLoading] = useState(true);
  const [error, setError] = useState(null);
  const [trip, setTrip] = useState(null);
  const [errors, setErrors] = useState({});

  const [formData, setFormData] = useState({
    numTravelers: 1,
    travelers: [
      {
        id: 1,
        fullName: '',
        age: '',
        gender: 'Male',
        phone: user?.phone || '',
        email: user?.email || '',
        emergencyContact: '',
        dietaryRestrictions: 'None'
      }
    ],
    paymentMethod: 'card',
    termsAccepted: false,
  });

  const mockTrips = {
    1: {
      id: 1,
      name: 'Winter Spiti Valley',
      destination: 'Spiti Valley',
      price: 21150,
      duration: 8,
      startDate: '2025-01-15',
      image: 'https://images.pexels.com/photos/31307356/pexels-photo-31307356/free-photo-of-spectacular-view-of-key-monastery-in-winter.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    },
    2: {
      id: 2,
      name: 'Leh Ladakh Adventure',
      destination: 'Ladakh',
      price: 34650,
      duration: 7,
      startDate: '2025-02-20',
      image: 'https://images.pexels.com/photos/34555164/pexels-photo-34555164/free-photo-of-adventurer-resting-with-motorcycle-by-scenic-lake.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    }
  };

  useEffect(() => {
    const fetchTrip = async () => {
      try {
        setTripLoading(true);
        setError(null);
        const tripData = await tripService.getTripById(tripId);
        setTrip(tripData);
      } catch (err) {
        const mockTrip = mockTrips[tripId];
        if (mockTrip) {
          setTrip(mockTrip);
        } else {
          setError('Trip not found');
        }
      } finally {
        setTripLoading(false);
      }
    };
    if (tripId) fetchTrip();
  }, [tripId]);

  const addTraveler = () => {
    if (formData.travelers.length < 10) {
      const newTraveler = {
        id: formData.travelers.length + 1,
        fullName: '',
        age: '',
        gender: 'Male',
        phone: '',
        email: '',
        emergencyContact: '',
        dietaryRestrictions: 'None'
      };
      setFormData(prev => ({
        ...prev,
        travelers: [...prev.travelers, newTraveler],
        numTravelers: prev.numTravelers + 1
      }));
    }
  };

  const removeTraveler = (id) => {
    if (formData.travelers.length > 1) {
      setFormData(prev => ({
        ...prev,
        travelers: prev.travelers.filter(t => t.id !== id),
        numTravelers: prev.numTravelers - 1
      }));
    }
  };

  const updateTraveler = (id, field, value) => {
    setFormData(prev => ({
      ...prev,
      travelers: prev.travelers.map(t =>
        t.id === id ? { ...t, [field]: value } : t
      )
    }));
  };

  const validateStep1 = () => {
    const newErrors = {};
    formData.travelers.forEach((traveler, index) => {
      if (!traveler.fullName.trim()) newErrors[`traveler${index}Name`] = 'Full name required';
      if (!traveler.age) newErrors[`traveler${index}Age`] = 'Age required';
      if (!traveler.phone.trim()) newErrors[`traveler${index}Phone`] = 'Phone required';
      if (!traveler.email.trim()) newErrors[`traveler${index}Email`] = 'Email required';
    });
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (step === 1) {
      if (!validateStep1()) return;
      setStep(2);
    } else if (step === 2) {
      if (!formData.termsAccepted) {
        setErrors({ terms: 'Please accept terms' });
        return;
      }
      setErrors({});
      setStep(3);
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
      setErrors({});
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const bookingData = {
        tripId: parseInt(tripId),
        travelers: formData.travelers,
        numTravelers: formData.numTravelers,
        totalPrice: calculateTotal(),
        paymentMethod: formData.paymentMethod,
        termsAccepted: formData.termsAccepted,
      };
      const booking = await bookingService.createBooking(bookingData);
      navigate(`/booking-confirmation/${booking.id}`);
    } catch (err) {
      setErrors({ submit: err.message || 'Booking failed' });
      setLoading(false);
    }
  };

  const calculateSubtotal = () => trip ? trip.price * formData.numTravelers : 0;
  const calculateServiceFee = () => 500;
  const calculateGST = () => Math.round(calculateSubtotal() * 0.05);
  const calculateTotal = () => calculateSubtotal() + calculateServiceFee() + calculateGST();

  const subtotal = calculateSubtotal();
  const serviceFee = calculateServiceFee();
  const gst = calculateGST();
  const total = calculateTotal();

  if (tripLoading) return <LoadingSpinner />;

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800 flex items-center justify-center px-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-8 max-w-md w-full shadow-2xl"
        >
          <h2 className="text-2xl font-bold text-white mb-4">Login Required</h2>
          <p className="text-slate-300 mb-6">You need to login to book a trip.</p>
          <Button fullWidth onClick={() => navigate('/login')}>Go to Login</Button>
        </motion.div>
      </div>
    );
  }

  if (error || !trip) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800 flex items-center justify-center px-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-8 max-w-md w-full shadow-2xl"
        >
          <h2 className="text-2xl font-bold text-white mb-4">Trip Not Found</h2>
          <p className="text-slate-300 mb-6">{error || 'The trip does not exist.'}</p>
          <Button fullWidth onClick={() => navigate('/trips')}>Browse Trips</Button>
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
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          className="pt-12 mb-8"
        >
          <p className="text-sm font-semibold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500 uppercase tracking-widest mb-2">
            🎫 Secure Booking
          </p>
          <h1 className="text-5xl font-black text-white">Complete Your Booking</h1>
        </motion.div>

        {/* Error Message */}
        <AnimatePresence>
          {errors.submit && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="mb-6 backdrop-blur-xl bg-red-500/10 border border-red-500/30 text-red-300 px-4 py-4 rounded-xl"
            >
              {errors.submit}
            </motion.div>
          )}
        </AnimatePresence>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Step Indicator */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="mb-10 backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-6 shadow-2xl"
            >
              <div className="flex items-center justify-between">
                {[1, 2, 3].map((stepNum, idx) => (
                  <div key={stepNum} className="flex items-center flex-1">
                    <motion.div
                      whileHover={{ scale: 1.1 }}
                      className={`w-12 h-12 rounded-full flex items-center justify-center font-bold transition-all ${
                        step >= stepNum
                          ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg'
                          : 'bg-white/10 text-slate-400'
                      }`}
                    >
                      {step > stepNum ? <FiCheck size={24} /> : stepNum}
                    </motion.div>
                    {idx < 2 && (
                      <motion.div
                        className={`flex-1 h-1 mx-4 ${step > stepNum ? 'bg-gradient-to-r from-blue-500 to-purple-600' : 'bg-white/10'}`}
                        initial={{ scaleX: 0 }}
                        animate={{ scaleX: step > stepNum ? 1 : 0 }}
                        transition={{ duration: 0.5 }}
                      />
                    )}
                  </div>
                ))}
              </div>
              <div className="flex justify-between text-xs font-semibold mt-4 text-slate-400">
                <span>Travelers</span>
                <span>Review</span>
                <span>Payment</span>
              </div>
            </motion.div>

            {/* Step 1 */}
            <AnimatePresence mode="wait">
              {step === 1 && (
                <motion.div
                  key="step1"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                  className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-8 shadow-2xl space-y-6"
                >
                  <h2 className="text-3xl font-black text-white">Add Travelers</h2>

                  {formData.travelers.map((traveler, index) => (
                    <motion.div
                      key={traveler.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="backdrop-blur-lg bg-white/5 border border-white/10 rounded-xl p-6 hover:bg-white/8 transition-all"
                    >
                      <div className="flex justify-between items-center mb-6">
                        <h3 className="text-lg font-bold text-white">Traveler {index + 1}</h3>
                        {formData.travelers.length > 1 && (
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            onClick={() => removeTraveler(traveler.id)}
                            className="text-red-400 hover:text-red-300 transition"
                          >
                            <FiX size={20} />
                          </motion.button>
                        )}
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="text-sm font-semibold text-slate-300 mb-2 block">Full Name *</label>
                          <input
                            type="text"
                            value={traveler.fullName}
                            onChange={(e) => updateTraveler(traveler.id, 'fullName', e.target.value)}
                            className={`w-full bg-white/5 border rounded-lg px-4 py-2 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-500 transition ${
                              errors[`traveler${index}Name`] ? 'border-red-500' : 'border-white/10'
                            }`}
                            placeholder="John Doe"
                          />
                          {errors[`traveler${index}Name`] && (
                            <p className="text-red-400 text-xs mt-1">{errors[`traveler${index}Name`]}</p>
                          )}
                        </div>

                        <div>
                          <label className="text-sm font-semibold text-slate-300 mb-2 block">Age *</label>
                          <input
                            type="number"
                            value={traveler.age}
                            onChange={(e) => updateTraveler(traveler.id, 'age', e.target.value)}
                            className={`w-full bg-white/5 border rounded-lg px-4 py-2 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-500 transition ${
                              errors[`traveler${index}Age`] ? 'border-red-500' : 'border-white/10'
                            }`}
                            placeholder="25"
                          />
                          {errors[`traveler${index}Age`] && (
                            <p className="text-red-400 text-xs mt-1">{errors[`traveler${index}Age`]}</p>
                          )}
                        </div>

                        <div>
                          <label className="text-sm font-semibold text-slate-300 mb-2 block">Gender</label>
                          <select
                            value={traveler.gender}
                            onChange={(e) => updateTraveler(traveler.id, 'gender', e.target.value)}
                            className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-purple-500 transition"
                          >
                            <option className="bg-slate-900">Male</option>
                            <option className="bg-slate-900">Female</option>
                            <option className="bg-slate-900">Other</option>
                          </select>
                        </div>

                        <div>
                          <label className="text-sm font-semibold text-slate-300 mb-2 block">Phone *</label>
                          <input
                            type="tel"
                            value={traveler.phone}
                            onChange={(e) => updateTraveler(traveler.id, 'phone', e.target.value)}
                            className={`w-full bg-white/5 border rounded-lg px-4 py-2 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-500 transition ${
                              errors[`traveler${index}Phone`] ? 'border-red-500' : 'border-white/10'
                            }`}
                            placeholder="+91 98765 43210"
                          />
                          {errors[`traveler${index}Phone`] && (
                            <p className="text-red-400 text-xs mt-1">{errors[`traveler${index}Phone`]}</p>
                          )}
                        </div>

                        <div className="md:col-span-2">
                          <label className="text-sm font-semibold text-slate-300 mb-2 block">Email *</label>
                          <input
                            type="email"
                            value={traveler.email}
                            onChange={(e) => updateTraveler(traveler.id, 'email', e.target.value)}
                            className={`w-full bg-white/5 border rounded-lg px-4 py-2 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-500 transition ${
                              errors[`traveler${index}Email`] ? 'border-red-500' : 'border-white/10'
                            }`}
                            placeholder="john@example.com"
                          />
                          {errors[`traveler${index}Email`] && (
                            <p className="text-red-400 text-xs mt-1">{errors[`traveler${index}Email`]}</p>
                          )}
                        </div>

                        <div className="md:col-span-2">
                          <label className="text-sm font-semibold text-slate-300 mb-2 block">Dietary Restrictions</label>
                          <select
                            value={traveler.dietaryRestrictions}
                            onChange={(e) => updateTraveler(traveler.id, 'dietaryRestrictions', e.target.value)}
                            className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-purple-500 transition"
                          >
                            <option className="bg-slate-900">None</option>
                            <option className="bg-slate-900">Vegetarian</option>
                            <option className="bg-slate-900">Vegan</option>
                          </select>
                        </div>
                      </div>
                    </motion.div>
                  ))}

                  {formData.travelers.length < 10 && (
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={addTraveler}
                      className="text-purple-400 hover:text-purple-300 font-semibold transition"
                    >
                      + Add Another Traveler
                    </motion.button>
                  )}

                  <div className="flex gap-4 pt-6">
                    <Button fullWidth variant="secondary" onClick={() => navigate(`/trips/${tripId}`)}>
                      Cancel
                    </Button>
                    <Button fullWidth onClick={handleNext}>
                      Continue <FiArrowRight className="inline ml-2" size={18} />
                    </Button>
                  </div>
                </motion.div>
              )}

              {/* Step 2 */}
              {step === 2 && (
                <motion.div
                  key="step2"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="space-y-6"
                >
                  <div className="backdrop-blur-xl bg-gradient-to-br from-purple-500/10 to-pink-500/10 border border-purple-500/20 rounded-2xl p-8 shadow-2xl">
                    <h2 className="text-3xl font-black text-white mb-6">Review & Confirm</h2>
                    <div className="space-y-3 text-slate-200">
                      <p><span className="font-semibold text-purple-400">Trip:</span> {trip.name}</p>
                      <p><span className="font-semibold text-purple-400">Duration:</span> {trip.duration} days</p>
                      <p><span className="font-semibold text-purple-400">Travelers:</span> {formData.numTravelers}</p>
                    </div>
                  </div>

                  <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-8 shadow-2xl">
                    <h3 className="text-xl font-bold text-white mb-4">Travelers List</h3>
                    <div className="space-y-3">
                      {formData.travelers.map((t, i) => (
                        <div key={t.id} className="flex items-center text-slate-200">
                          <FiUser className="text-purple-400 mr-3" /> {i + 1}. {t.fullName} ({t.age})
                        </div>
                      ))}
                    </div>
                  </div>

                  <label className="flex items-start p-6 backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl cursor-pointer hover:border-white/20 transition">
                    <input
                      type="checkbox"
                      checked={formData.termsAccepted}
                      onChange={(e) => {
                        setFormData(prev => ({ ...prev, termsAccepted: e.target.checked }));
                        if (errors.terms) setErrors(prev => ({ ...prev, terms: '' }));
                      }}
                      className="mt-1 mr-3 w-5 h-5 accent-purple-500"
                    />
                    <div>
                      <p className="font-semibold text-white">I agree to Terms & Conditions</p>
                      <p className="text-sm text-slate-400">Cancellation, safety & all details reviewed</p>
                    </div>
                  </label>
                  {errors.terms && <p className="text-red-400 text-xs">{errors.terms}</p>}

                  <div className="flex gap-4 pt-6">
                    <Button fullWidth variant="secondary" onClick={handleBack}>
                      Back
                    </Button>
                    <Button fullWidth onClick={handleNext}>
                      Payment <FiArrowRight className="inline ml-2" size={18} />
                    </Button>
                  </div>
                </motion.div>
              )}

              {/* Step 3 */}
              {step === 3 && (
                <motion.div
                  key="step3"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-8 shadow-2xl space-y-6"
                >
                  <h2 className="text-3xl font-black text-white">Payment Method</h2>

                  <div className="space-y-4">
                    {[
                      { id: 'card', title: '💳 Credit/Debit Card', desc: 'Visa, Mastercard, Amex' },
                      { id: 'upi', title: '📱 UPI', desc: 'Google Pay, PhonePe, Paytm' },
                      { id: 'netbanking', title: '🏦 Net Banking', desc: 'All major banks' }
                    ].map(method => (
                      <motion.label
                        key={method.id}
                        whileHover={{ scale: 1.02 }}
                        className="flex items-center p-4 backdrop-blur-lg bg-white/5 border border-white/10 rounded-xl cursor-pointer hover:bg-white/8 hover:border-white/20 transition"
                      >
                        <input
                          type="radio"
                          name="payment"
                          value={method.id}
                          checked={formData.paymentMethod === method.id}
                          onChange={(e) => setFormData(prev => ({ ...prev, paymentMethod: e.target.value }))}
                          className="mr-4 w-5 h-5 accent-purple-500"
                        />
                        <div>
                          <p className="font-semibold text-white">{method.title}</p>
                          <p className="text-sm text-slate-400">{method.desc}</p>
                        </div>
                      </motion.label>
                    ))}
                  </div>

                  <div className="backdrop-blur-lg bg-green-500/10 border border-green-500/30 rounded-xl p-4 flex items-start gap-3">
                    <FiLock className="text-green-400 flex-shrink-0 mt-1" />
                    <p className="text-green-300 text-sm"><span className="font-semibold">Secure Payment</span> - Encrypted & PCI Compliant</p>
                  </div>

                  <div className="flex gap-4 pt-6">
                    <Button fullWidth variant="secondary" onClick={handleBack} disabled={loading}>
                      Back
                    </Button>
                    <Button fullWidth onClick={handleSubmit} disabled={loading}>
                      {loading ? 'Processing...' : `Pay ₹${total.toLocaleString()}`}
                    </Button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Order Summary */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-1"
          >
            <div className="sticky top-20 backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-6 shadow-2xl space-y-6">
              <h3 className="text-2xl font-black text-white">Summary</h3>

              <div className="space-y-3 pb-6 border-b border-white/10">
                <div className="flex justify-between text-slate-300">
                  <span>{trip.name}</span>
                  <span className="font-semibold">₹{trip.price.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-slate-300">
                  <span>× {formData.numTravelers} traveler{formData.numTravelers > 1 ? 's' : ''}</span>
                  <span className="font-semibold">₹{subtotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-slate-400 text-sm">
                  <span>Service Fee</span>
                  <span>₹{serviceFee.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-slate-400 text-sm">
                  <span>GST (5%)</span>
                  <span>₹{gst.toLocaleString()}</span>
                </div>
              </div>

              <div className="flex justify-between text-xl font-black">
                <span className="text-white">Total</span>
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-pink-400">₹{total.toLocaleString()}</span>
              </div>

              <div className="space-y-3">
                {[
                  { icon: '✓', text: 'Free Insurance', color: 'green' },
                  { icon: '✓', text: 'Certified Leader', color: 'blue' },
                  { icon: '✓', text: 'Money-back Guarantee', color: 'orange' }
                ].map((item, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.1 }}
                    className={`flex items-center gap-2 p-3 rounded-lg bg-${item.color}-500/10 border border-${item.color}-500/30 text-${item.color}-300`}
                  >
                    <span>{item.icon}</span> <span className="text-sm font-semibold">{item.text}</span>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

export default Booking;
