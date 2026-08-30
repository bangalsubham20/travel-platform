import React, { useState, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import Button from '../components/common/Button';
import TripSearch from '../components/trips/TripSearch';
import LoadingSpinner from '../components/common/LoadingSpinner';
import tripService from '../services/tripService';
import TripCard from '../components/trips/TripCard';
import { TRIP_DESTINATIONS } from '../constants/tripOptions';



function Trips() {
  const navigate = useNavigate();
  const [activeCategory, setActiveCategory] = useState('All tours');
  const [searchTerm, setSearchTerm] = useState('');
  const [tripsLoading, setTripsLoading] = useState(true);
  const [allTrips, setAllTrips] = useState([]);

  // Categories for the pill menu
  const categories = ['All tours', ...TRIP_DESTINATIONS];

  useEffect(() => {
    const fetchTrips = async () => {
      try {
        setTripsLoading(true);
        const trips = await tripService.getAllTrips();
        setAllTrips(trips);
      } catch (err) {
        console.error('Error fetching trips:', err);
        setAllTrips([]);
      } finally {
        setTripsLoading(false);
      }
    };
    fetchTrips();
  }, []);

  const filteredTrips = useMemo(() => {
    let trips = allTrips;

    // Search Filter
    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      trips = trips.filter(trip =>
        trip.name.toLowerCase().includes(term) ||
        trip.destination.toLowerCase().includes(term)
      );
    }

    // Category Filter
    if (activeCategory !== 'All tours') {
      trips = trips.filter(trip => trip.destination.includes(activeCategory));
    }

    return trips;
  }, [searchTerm, activeCategory, allTrips]);

  // Framer Motion Variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } }
  };

  if (tripsLoading) return <LoadingSpinner />;

  return (
    <div className="min-h-screen bg-slate-950 text-white pb-24 font-sans selection:bg-cyan-500 selection:text-slate-950 pt-24 px-6 md:px-12 bg-fixed">

      {/* Header Section */}
      <div className="max-w-[1600px] mx-auto mb-12">
        <div className="flex flex-col md:flex-row justify-between items-end gap-8 mb-12">

          {/* Title */}
          <div className="flex items-center gap-8">
            <div className="w-1.5 h-32 bg-gradient-to-b from-cyan-500 to-teal-500 hidden md:block rounded-full shadow-neon-primary" />
            <div>
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="flex gap-8 mb-4 text-xs font-bold text-cyan-400 uppercase tracking-[0.2em]"
              >
                <span>Expeditions</span>
              </motion.div>
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="text-4xl md:text-8xl font-display font-normal text-white leading-[0.9] uppercase tracking-wide drop-shadow-lg"
              >
                Plan Your <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 to-teal-200">Next Trip</span>
              </motion.h1>
            </div>
          </div>

          {/* Search */}
          <div className="w-full md:w-[400px]">
            <TripSearch onSearch={setSearchTerm} placeholder="Where is your next adventure?" />
          </div>
        </div>

        {/* Category Pills & Filters */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 mb-10">
          <div className="flex items-center gap-3 overflow-x-auto pb-4 md:pb-0 w-full md:w-auto custom-scrollbar">
            {categories.map((cat, index) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-6 py-2.5 rounded-full text-xs font-bold uppercase tracking-widest transition-all whitespace-nowrap border ${activeCategory === cat
                  ? 'bg-cyan-500 border-cyan-500 text-teal-900 shadow-neon-secondary scale-105'
                  : 'bg-teal-900/40 backdrop-blur-sm border-white/10 text-grey-400 hover:text-white hover:bg-white/5 hover:border-cyan-500/30'
                  }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="text-xs font-bold text-teal-200/60 uppercase tracking-widest">
            Showing {filteredTrips.length} Expeditions
          </div>
        </div>

        {/* Trips Bento Grid */}
        <AnimatePresence mode="wait">
          {filteredTrips.length > 0 ? (
            <motion.div
              key={activeCategory + searchTerm} // Trigger re-animation on filter change
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 auto-rows-min"
            >
              {filteredTrips.map((trip, index) => {
                let variant = 'compact';
                // Custom logic to make layout interesting
                if (index === 0 && !searchTerm && activeCategory === 'All tours') variant = 'featured';
                else if (index === 1 && !searchTerm && activeCategory === 'All tours') variant = 'wide';

                return (
                  <motion.div key={trip.id} variants={itemVariants} className={
                    variant === 'featured' ? 'col-span-1 md:col-span-2 lg:col-span-2 row-span-2' :
                      variant === 'wide' ? 'col-span-1 md:col-span-2' :
                        'col-span-1'
                  }>
                    <TripCard trip={trip} variant={variant} />
                  </motion.div>
                );
              })}
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="py-24 text-center border border-white/5 rounded-[3rem] bg-teal-900/40 backdrop-blur-md border-dashed"
            >
              <h3 className="text-3xl font-display font-bold text-white mb-2">No expeditions found</h3>
              <p className="text-grey-400 mb-6">We couldn't find any trips matching your criteria.</p>
              <Button onClick={() => { setActiveCategory('All tours'); setSearchTerm(''); }} className="btn-primary">
                Clear Filters
              </Button>
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </div>
  );
}

export default Trips;
