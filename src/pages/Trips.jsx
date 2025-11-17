import React, { useState, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import Button from '../components/common/Button';
import Card from '../components/common/Card';
import TripFilters from '../components/trips/TripFilters';
import TripSort from '../components/trips/TripSort';
import TripSearch from '../components/trips/TripSearch';
import LoadingSpinner from '../components/common/LoadingSpinner';
import tripService from '../services/tripService';
import { FiGrid, FiList } from 'react-icons/fi';

// --- Mock Data for Fallback ---
const mockTrips = [
  {
    id: 1,
    name: 'Winter Spiti Valley',
    destination: 'Spiti Valley',
    price: 21150,
    duration: '8 days',
    durationDays: 8,
    rating: 4.8,
    reviews: 245,
    difficulty: 'Moderate',
    season: 'Winter',
    groupSize: 'Small Group (3-5)',
    description: 'Experience the frozen beauty of Spiti Valley with stunning monasteries and breathtaking landscapes.',
    tags: ['monastery', 'trek', 'mountains', 'winter'],
    image: 'https://images.pexels.com/photos/31307356/pexels-photo-31307356/free-photo-of-spectacular-view-of-key-monastery-in-winter.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
  },
  {
    id: 2,
    name: 'Leh Ladakh Adventure',
    destination: 'Ladakh',
    price: 34650,
    duration: '7 days',
    durationDays: 7,
    rating: 4.9,
    reviews: 312,
    difficulty: 'Moderate-Hard',
    season: 'Summer',
    groupSize: 'Large Group (6+)',
    description: 'Experience the raw beauty of Ladakh with high altitude deserts and ancient monasteries.',
    tags: ['adventure', 'desert', 'monastery', 'mountains'],
    image: 'https://images.pexels.com/photos/34555164/pexels-photo-34555164/free-photo-of-adventurer-resting-with-motorcycle-by-scenic-lake.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
  },
  {
    id: 3,
    name: 'Kerala Backpacking',
    destination: 'Kerala',
    price: 16650,
    duration: '6 days',
    durationDays: 6,
    rating: 4.7,
    reviews: 189,
    difficulty: 'Easy',
    season: 'Monsoon',
    groupSize: 'Solo',
    description: 'Relax in Kerala\'s backwaters, beaches, and lush green landscapes.',
    tags: ['backpack', 'beach', 'relax', 'backwater'],
    image: 'https://images.pexels.com/photos/12144055/pexels-photo-12144055.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
  },
  {
    id: 4,
    name: 'Goa Beach Escape',
    destination: 'Goa',
    price: 12500,
    duration: '5 days',
    durationDays: 5,
    rating: 4.6,
    reviews: 456,
    difficulty: 'Easy',
    season: 'Winter',
    groupSize: 'Couple',
    description: 'Relax, surf, and party at India\'s most vibrant coastal paradise.',
    tags: ['beach', 'party', 'surf', 'relaxation'],
    image: 'https://images.pexels.com/photos/3552472/pexels-photo-3552472.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
  },
  {
    id: 5,
    name: 'Himachal Trekking',
    destination: 'Himalayas',
    price: 18900,
    duration: '7 days',
    durationDays: 7,
    rating: 4.8,
    reviews: 234,
    difficulty: 'Hard',
    season: 'Spring',
    groupSize: 'Small Group (3-5)',
    description: 'Trek through scenic mountain trails and experience the thrill of nature.',
    tags: ['trek', 'mountains', 'adventure', 'hiking'],
    image: 'https://images.pexels.com/photos/2161499/pexels-photo-2161499.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
  },
  {
    id: 6,
    name: 'Northeast Adventure',
    destination: 'Northeast',
    price: 24500,
    duration: '10 days',
    durationDays: 10,
    rating: 4.9,
    reviews: 178,
    difficulty: 'Moderate',
    season: 'Fall',
    groupSize: 'Large Group (6+)',
    description: 'Explore the exotic landscapes and culture of Northeast India.',
    tags: ['adventure', 'culture', 'nature', 'wildlife'],
    image: 'https://images.pexels.com/photos/33527/monkeys-forest-bali-wildlife.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
  },
];

function Trips() {
  const navigate = useNavigate();
  const [viewMode, setViewMode] = useState('grid');
  const [sortBy, setSortBy] = useState('recommended');
  const [searchTerm, setSearchTerm] = useState('');
  const [tripsLoading, setTripsLoading] = useState(true);
  const [tripsError, setTripsError] = useState(null);
  const [allTrips, setAllTrips] = useState([]);
  const [filters, setFilters] = useState({
    priceRange: [0, 50000],
    difficulty: [],
    duration: [],
    destination: [],
    season: [],
    rating: 0,
    groupSize: [],
  });

  // Animated background blur
  const Blurs = () => (
    <>
      <motion.div className="fixed -top-40 -right-32 w-96 h-96 rounded-full bg-gradient-to-br from-purple-400/20 to-fuchsia-400/30 blur-3xl -z-10"
        animate={{ y: [0, 30, 0] }}
        transition={{ duration: 8, repeat: Infinity }} />
      <motion.div className="fixed -bottom-40 -left-24 w-80 h-80 rounded-full bg-gradient-to-tr from-blue-400/20 to-orange-200/30 blur-3xl -z-10"
        animate={{ x: [0, 80, 0] }}
        transition={{ duration: 10, repeat: Infinity }} />
    </>
  );

  // Fetch trips from backend on mount
  useEffect(() => {
    const fetchTrips = async () => {
      try {
        setTripsLoading(true);
        setTripsError(null);
        const trips = await tripService.getAllTrips();
        setAllTrips(trips);
      } catch (err) {
        setAllTrips(mockTrips);
      } finally {
        setTripsLoading(false);
      }
    };
    fetchTrips();
    // eslint-disable-next-line
  }, []);

  // Apply search filter
  const searchedTrips = useMemo(() => {
    if (!searchTerm.trim()) return allTrips;
    const term = searchTerm.toLowerCase();
    return allTrips.filter((trip) => (
      trip.name.toLowerCase().includes(term) ||
      trip.destination.toLowerCase().includes(term) ||
      trip.description.toLowerCase().includes(term) ||
      (trip.tags && trip.tags.some(tag => tag.toLowerCase().includes(term))) ||
      trip.difficulty.toLowerCase().includes(term)
    ));
  }, [searchTerm, allTrips]);

  // Apply filters
  const filteredTrips = useMemo(() => {
    return searchedTrips.filter((trip) => {
      if (trip.price < filters.priceRange[0] || trip.price > filters.priceRange[1]) return false;
      if (filters.difficulty.length > 0 && !filters.difficulty.includes(trip.difficulty)) return false;
      if (filters.duration.length > 0) {
        const durationMatch = filters.duration.some((dur) => {
          if (dur === '3-5 days') return trip.durationDays >= 3 && trip.durationDays <= 5;
          if (dur === '5-7 days') return trip.durationDays >= 5 && trip.durationDays <= 7;
          if (dur === '7-10 days') return trip.durationDays >= 7 && trip.durationDays <= 10;
          if (dur === '10+ days') return trip.durationDays >= 10;
          return false;
        });
        if (!durationMatch) return false;
      }
      if (filters.destination.length > 0 && !filters.destination.includes(trip.destination)) return false;
      if (filters.season.length > 0 && !filters.season.includes(trip.season)) return false;
      if (filters.rating > 0 && trip.rating < filters.rating) return false;
      if (filters.groupSize.length > 0 && !filters.groupSize.includes(trip.groupSize)) return false;
      return true;
    });
  }, [searchedTrips, filters]);

  // --------- THIS BLOCK WAS MISSING: ---------
  // Apply sorting
  const sortedTrips = useMemo(() => {
    const trips = [...filteredTrips];
    switch (sortBy) {
      case 'priceLowToHigh':
        return trips.sort((a, b) => a.price - b.price);
      case 'priceHighToLow':
        return trips.sort((a, b) => b.price - a.price);
      case 'ratingHighToLow':
        return trips.sort((a, b) => b.rating - a.rating);
      case 'ratingLowToHigh':
        return trips.sort((a, b) => a.rating - b.rating);
      case 'durationShortToLong':
        return trips.sort((a, b) => a.durationDays - b.durationDays);
      case 'durationLongToShort':
        return trips.sort((a, b) => b.durationDays - a.durationDays);
      case 'nameAZ':
        return trips.sort((a, b) => a.name.localeCompare(b.name));
      case 'nameZA':
        return trips.sort((a, b) => b.name.localeCompare(a.name));
      case 'recommended':
      default:
        return trips.sort((a, b) => b.rating - a.rating || b.reviews - a.reviews);
    }
  }, [filteredTrips, sortBy]);
  // -------------------------------------------

  const handleFilterChange = (newFilters) => setFilters(newFilters);

  const handleReset = () => {
    setFilters({
      priceRange: [0, 50000],
      difficulty: [],
      duration: [],
      destination: [],
      season: [],
      rating: 0,
      groupSize: [],
    });
    setSearchTerm('');
  };

  if (tripsLoading) return <LoadingSpinner />;

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-slate-100 via-indigo-50 to-orange-50 pb-24">
      <Blurs />
      <div className="max-w-7xl mx-auto px-4">
        {/* Animated Heading */}
        <motion.div
          initial={{ opacity: 0, y: -32 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="pt-10 mb-8"
        >
          <h1 className="text-5xl font-black mb-2 bg-clip-text text-transparent bg-gradient-to-r from-blue-500 via-purple-500 to-fuchsia-500">
            Explore All Trips
          </h1>
          <p className="text-slate-500 text-lg">
            Found <span className="font-bold text-orange-500">{sortedTrips.length}</span> adventures for you
          </p>
        </motion.div>
        {/* Animated Controls Row */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-10 flex flex-col md:flex-row gap-8 justify-between items-start md:items-center"
        >
          <TripSearch
            onSearch={setSearchTerm}
            placeholder="🔍 Search adventure, destination, tag, difficulty..."
          />
          <div className="w-full md:w-auto">
            <TripSort sortBy={sortBy} onSortChange={setSortBy} />
          </div>
          <div className="flex gap-2">
            <motion.button
              whileHover={{ scale: 1.11 }}
              whileTap={{ scale: 0.90 }}
              onClick={() => setViewMode('grid')}
              className={`p-3 rounded-xl shadow transition-all border-2 ${
                viewMode === 'grid'
                  ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white border-purple-500'
                  : 'bg-white text-slate-700 border-gray-200'
              }`}
            >
              <FiGrid size={20} />
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.11 }}
              whileTap={{ scale: 0.90 }}
              onClick={() => setViewMode('list')}
              className={`p-3 rounded-xl shadow transition-all border-2 ${
                viewMode === 'list'
                  ? 'bg-gradient-to-r from-orange-400 to-pink-500 text-white border-pink-500'
                  : 'bg-white text-slate-700 border-gray-200'
              }`}
            >
              <FiList size={20} />
            </motion.button>
          </div>
        </motion.div>
        {/* Filters & Main */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7 }}
          >
            <TripFilters onFilterChange={handleFilterChange} onReset={handleReset} />
          </motion.div>
          <div className="md:col-span-3">
            {sortedTrips.length > 0 ? (
              <motion.div
                initial="hidden"
                animate="visible"
                variants={{
                  visible: { transition: { staggerChildren: 0.08 } },
                  hidden: {},
                }}
                className={
                  viewMode === 'grid'
                    ? 'grid grid-cols-1 md:grid-cols-2 gap-8'
                    : 'space-y-4'
                }
              >
                {sortedTrips.map((trip, index) => (
                  <motion.div
                    key={trip.id}
                    initial={{ opacity: 0, y: 20, scale: 0.98 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    transition={{ delay: index * 0.07 }}
                    whileHover={{ scale: 1.03, y: -5 }}
                    onClick={() => navigate(`/trips/${trip.id}`)}
                    className="cursor-pointer"
                  >
                    {viewMode === 'grid' ? (
                      <Card className="overflow-hidden relative shadow-lg rounded-2xl hover:ring-2 hover:ring-purple-500 bg-white/90 backdrop-blur transition">
                        <motion.img
                          src={trip.image}
                          alt={trip.name}
                          className="w-full h-48 object-cover"
                          whileHover={{ scale: 1.07 }}
                          transition={{ duration: 0.5 }}
                          loading="lazy"
                        />
                        <div className="absolute bottom-0 w-full p-4 bg-gradient-to-t from-black/70 to-transparent flex justify-between items-end">
                          <span className="text-xs bg-orange-500 px-2 py-1 text-white rounded-full">{trip.difficulty}</span>
                          <span className="font-bold text-lg text-white">₹{trip.price.toLocaleString()}</span>
                        </div>
                        <div className="p-6">
                          <h3 className="text-xl font-bold text-slate-900 mb-1">{trip.name}</h3>
                          <p className="text-gray-600 text-sm mb-2">📍 {trip.destination}</p>
                          <p className="text-gray-400 text-xs mb-4 line-clamp-2">{trip.description}</p>
                          <div className="flex gap-2 text-xs text-fuchsia-500">
                            {(trip.tags || []).slice(0, 4).map(tag => (
                              <span key={tag} className="bg-fuchsia-50 rounded-full px-2">{tag}</span>
                            ))}
                          </div>
                        </div>
                      </Card>
                    ) : (
                      <Card className="flex gap-6 p-6 overflow-hidden hover:ring-2 hover:ring-orange-400 bg-white/90">
                        <img
                          src={trip.image}
                          alt={trip.name}
                          className="w-32 h-32 rounded-xl object-cover"
                        />
                        <div className="flex-1">
                          <div className="flex justify-between">
                            <div>
                              <h3 className="text-xl font-bold text-slate-900">{trip.name}</h3>
                              <p className="text-gray-600 text-sm mb-1">📍 {trip.destination}</p>
                              <p className="text-gray-400 text-xs mb-2">{trip.description}</p>
                              <div className="flex gap-2 text-xs">
                                <span className="bg-blue-50 px-2 rounded">{trip.duration}</span>
                                <span className="bg-green-50 px-2 rounded">{trip.difficulty}</span>
                                <span className="bg-yellow-50 px-2 rounded">{trip.season}</span>
                              </div>
                            </div>
                            <div className="text-right">
                              <div className="font-bold text-orange-500 text-xl">₹{trip.price.toLocaleString()}</div>
                              <div className="text-yellow-500">⭐ {trip.rating}</div>
                            </div>
                          </div>
                        </div>
                      </Card>
                    )}
                  </motion.div>
                ))}
              </motion.div>
            ) : (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <Card className="p-16 text-center">
                  <h2 className="text-2xl text-fuchsia-600 mb-3">😔 No trips found</h2>
                  <p className="text-gray-500 mb-6">
                    {searchTerm
                      ? `No trips match "${searchTerm}". Try different keywords or adjust filters.`
                      : 'Try adjusting your filters to find more trips'}
                  </p>
                  <Button onClick={handleReset}>Clear All Filters & Search</Button>
                </Card>
              </motion.div>
            )}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="mt-8 text-center text-sm text-gray-600"
            >
              <p>
                Showing <span className="font-bold text-orange-500">{sortedTrips.length}</span> trips
                {searchTerm && <span> for &quot;{searchTerm}&quot;</span>}
                {' '}sorted by <span className="font-bold">{sortBy === 'recommended' ? 'recommendation' : sortBy}</span>
              </p>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Trips;
