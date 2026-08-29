import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiSearch, FiCalendar, FiMapPin, FiUser, FiChevronDown, FiPlus, FiMinus, FiX } from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';

function SearchBar() {
  const navigate = useNavigate();

  // State
  const [destination, setDestination] = useState('');
  const [startDate, setStartDate] = useState('');
  const [adults, setAdults] = useState(2);
  const [childrenCount, setChildrenCount] = useState(0);

  // Popover controls
  const [activePopover, setActivePopover] = useState(null); // 'dest' | 'date' | 'travelers' | null
  const searchBarRef = useRef(null);

  const popularDestinations = [
    'Himalayas, HP',
    'Goa Beaches',
    'Spiti Valley',
    'Manali & Solang',
    'Kerala Backwaters',
    'Leh Ladakh',
  ];

  // Close popover when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (searchBarRef.current && !searchBarRef.current.contains(event.target)) {
        setActivePopover(null);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearch = (e) => {
    if (e) e.preventDefault();
    const totalTravelers = adults + childrenCount;
    const query = new URLSearchParams({
      destination: destination || '',
      startDate: startDate || '',
      travelers: totalTravelers.toString(),
    }).toString();
    navigate(`/trips?${query}`);
    setActivePopover(null);
  };

  const travelersSummary = `${adults + childrenCount} Traveler${(adults + childrenCount) > 1 ? 's' : ''}, Any age`;

  return (
    <div ref={searchBarRef} className="relative w-full max-w-4xl mx-auto z-30 px-2 sm:px-4">
      {/* Container: Responsive Pill Bar */}
      <form
        onSubmit={handleSearch}
        className="relative flex flex-col md:flex-row items-stretch md:items-center bg-slate-900/60 md:bg-white/10 backdrop-blur-2xl border border-white/20 rounded-3xl md:rounded-[2.5rem] p-2 sm:p-2.5 shadow-[0_20px_50px_rgba(0,0,0,0.5)] transition-all duration-300 hover:border-white/30 divide-y divide-white/10 md:divide-y-0"
      >
        {/* SECTION 1: DESTINATION */}
        <div
          onClick={() => setActivePopover(activePopover === 'dest' ? null : 'dest')}
          className={`flex-1 flex items-center gap-3 px-3 sm:px-5 py-2.5 sm:py-3 rounded-2xl md:rounded-full cursor-pointer transition-colors ${
            activePopover === 'dest' ? 'bg-white/15' : 'hover:bg-white/5'
          }`}
        >
          <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-white/10 flex items-center justify-center text-white/90 shrink-0 border border-white/10">
            <FiMapPin className="text-base sm:text-lg text-cyan-300" />
          </div>
          <div className="flex-1 text-left min-w-0">
            <span className="block text-[10px] sm:text-xs uppercase tracking-wider font-semibold text-gray-300/90 leading-tight">
              Destination
            </span>
            <span className="block text-xs sm:text-sm md:text-base font-serif font-medium text-white truncate">
              {destination ? destination : 'Where to?'}
            </span>
          </div>
          <FiChevronDown
            className={`text-white/60 text-xs sm:text-sm transition-transform duration-300 ${
              activePopover === 'dest' ? 'rotate-180 text-cyan-400' : ''
            }`}
          />
        </div>

        {/* Desktop Vertical Divider 1 */}
        <div className="hidden md:block w-px h-10 bg-white/15 shrink-0" />

        {/* SECTION 2: DATES */}
        <div
          onClick={() => setActivePopover(activePopover === 'date' ? null : 'date')}
          className={`flex-1 flex items-center gap-3 px-3 sm:px-5 py-2.5 sm:py-3 rounded-2xl md:rounded-full cursor-pointer transition-colors ${
            activePopover === 'date' ? 'bg-white/15' : 'hover:bg-white/5'
          }`}
        >
          <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-white/10 flex items-center justify-center text-white/90 shrink-0 border border-white/10">
            <FiCalendar className="text-base sm:text-lg text-cyan-300" />
          </div>
          <div className="flex-1 text-left min-w-0">
            <span className="block text-[10px] sm:text-xs uppercase tracking-wider font-semibold text-gray-300/90 leading-tight">
              Dates
            </span>
            <span className="block text-xs sm:text-sm md:text-base font-serif font-medium text-white truncate">
              {startDate ? startDate : 'Add dates'}
            </span>
          </div>
          <FiChevronDown
            className={`text-white/60 text-xs sm:text-sm transition-transform duration-300 ${
              activePopover === 'date' ? 'rotate-180 text-cyan-400' : ''
            }`}
          />
        </div>

        {/* Desktop Vertical Divider 2 */}
        <div className="hidden md:block w-px h-10 bg-white/15 shrink-0" />

        {/* SECTION 3: TRAVELERS */}
        <div
          onClick={() => setActivePopover(activePopover === 'travelers' ? null : 'travelers')}
          className={`flex-1 flex items-center gap-3 px-3 sm:px-5 py-2.5 sm:py-3 rounded-2xl md:rounded-full cursor-pointer transition-colors ${
            activePopover === 'travelers' ? 'bg-white/15' : 'hover:bg-white/5'
          }`}
        >
          <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-white/10 flex items-center justify-center text-white/90 shrink-0 border border-white/10">
            <FiUser className="text-base sm:text-lg text-cyan-300" />
          </div>
          <div className="flex-1 text-left min-w-0">
            <span className="block text-[10px] sm:text-xs uppercase tracking-wider font-semibold text-gray-300/90 leading-tight">
              Travelers
            </span>
            <span className="block text-xs sm:text-sm md:text-base font-serif font-medium text-white truncate">
              {travelersSummary}
            </span>
          </div>
          <FiChevronDown
            className={`text-white/60 text-xs sm:text-sm transition-transform duration-300 ${
              activePopover === 'travelers' ? 'rotate-180 text-cyan-400' : ''
            }`}
          />
        </div>

        {/* SEARCH ACTION BUTTON */}
        <div className="pt-2 md:pt-0 p-1">
          <motion.button
            type="submit"
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            className="w-full md:w-auto px-6 sm:px-8 py-3.5 sm:py-4 rounded-2xl md:rounded-full bg-gradient-to-r from-[#ff6b4a] to-[#ff884b] hover:from-[#ff5833] hover:to-[#ff7938] text-white font-medium text-sm sm:text-base shadow-[0_8px_25px_rgba(255,107,74,0.4)] hover:shadow-[0_12px_30px_rgba(255,107,74,0.6)] flex items-center justify-center gap-2.5 transition-all duration-300 cursor-pointer"
          >
            <FiSearch className="text-base sm:text-lg stroke-[2.5]" />
            <span className="font-serif tracking-wide">Search</span>
          </motion.button>
        </div>
      </form>

      {/* POPOVERS */}
      <AnimatePresence>
        {/* DESTINATION POPOVER */}
        {activePopover === 'dest' && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="absolute left-0 right-0 md:right-auto top-full mt-3 w-full md:w-80 bg-slate-900/95 backdrop-blur-2xl border border-white/20 rounded-3xl p-4 sm:p-5 shadow-2xl z-50 text-left"
          >
            <div className="flex justify-between items-center mb-3">
              <span className="text-xs uppercase tracking-wider font-semibold text-cyan-400">
                Destination
              </span>
              <button
                type="button"
                onClick={() => setActivePopover(null)}
                className="text-white/60 hover:text-white"
              >
                <FiX size={16} />
              </button>
            </div>
            <div className="mb-3">
              <input
                type="text"
                placeholder="Search destination (e.g. Manali, Goa)..."
                value={destination}
                onChange={(e) => setDestination(e.target.value)}
                autoFocus
                className="w-full bg-white/10 border border-white/20 rounded-xl px-3.5 py-2 text-sm text-white placeholder-gray-400 outline-none focus:border-cyan-400"
              />
            </div>
            <span className="block text-[10px] uppercase tracking-wider font-semibold text-gray-400 mb-1.5">
              Popular Places
            </span>
            <div className="space-y-1 max-h-48 overflow-y-auto">
              {popularDestinations
                .filter((dest) => dest.toLowerCase().includes(destination.toLowerCase()))
                .map((dest) => (
                  <div
                    key={dest}
                    onClick={() => {
                      setDestination(dest);
                      setActivePopover(null);
                    }}
                    className="flex items-center gap-3 px-3 py-2 rounded-xl text-sm text-gray-200 hover:bg-white/10 hover:text-white cursor-pointer transition-colors"
                  >
                    <FiMapPin className="text-cyan-400 text-xs" />
                    <span>{dest}</span>
                  </div>
                ))}
            </div>
          </motion.div>
        )}

        {/* DATE POPOVER */}
        {activePopover === 'date' && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="absolute left-0 right-0 md:right-auto md:left-1/3 top-full mt-3 w-full md:w-80 bg-slate-900/95 backdrop-blur-2xl border border-white/20 rounded-3xl p-4 sm:p-5 shadow-2xl z-50 text-left"
          >
            <div className="flex justify-between items-center mb-3">
              <span className="text-xs uppercase tracking-wider font-semibold text-cyan-400">
                Select Departure Date
              </span>
              <button
                type="button"
                onClick={() => setActivePopover(null)}
                className="text-white/60 hover:text-white"
              >
                <FiX size={16} />
              </button>
            </div>
            <input
              type="date"
              value={startDate}
              onChange={(e) => {
                setStartDate(e.target.value);
                setActivePopover(null);
              }}
              className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white outline-none focus:border-cyan-400 [color-scheme:dark]"
            />
          </motion.div>
        )}

        {/* TRAVELERS POPOVER */}
        {activePopover === 'travelers' && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="absolute left-0 right-0 md:left-auto md:right-0 top-full mt-3 w-full md:w-80 bg-slate-900/95 backdrop-blur-2xl border border-white/20 rounded-3xl p-4 sm:p-5 shadow-2xl z-50 text-left"
          >
            <div className="flex justify-between items-center mb-4">
              <span className="text-xs uppercase tracking-wider font-semibold text-cyan-400">
                Select Travelers
              </span>
              <button
                type="button"
                onClick={() => setActivePopover(null)}
                className="text-white/60 hover:text-white"
              >
                <FiX size={16} />
              </button>
            </div>

            {/* Adults */}
            <div className="flex items-center justify-between py-2 border-b border-white/10">
              <div>
                <p className="text-sm font-semibold text-white">Adults</p>
                <p className="text-xs text-gray-400">Age 13+</p>
              </div>
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setAdults(Math.max(1, adults - 1))}
                  className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-white/20 disabled:opacity-40"
                  disabled={adults <= 1}
                >
                  <FiMinus size={14} />
                </button>
                <span className="text-white font-bold w-4 text-center">{adults}</span>
                <button
                  type="button"
                  onClick={() => setAdults(adults + 1)}
                  className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-white/20"
                >
                  <FiPlus size={14} />
                </button>
              </div>
            </div>

            {/* Children */}
            <div className="flex items-center justify-between py-2 mt-2">
              <div>
                <p className="text-sm font-semibold text-white">Children</p>
                <p className="text-xs text-gray-400">Ages 0 - 12</p>
              </div>
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setChildrenCount(Math.max(0, childrenCount - 1))}
                  className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-white/20 disabled:opacity-40"
                  disabled={childrenCount <= 0}
                >
                  <FiMinus size={14} />
                </button>
                <span className="text-white font-bold w-4 text-center">{childrenCount}</span>
                <button
                  type="button"
                  onClick={() => setChildrenCount(childrenCount + 1)}
                  className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-white/20"
                >
                  <FiPlus size={14} />
                </button>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setActivePopover(null)}
              className="w-full mt-4 py-2 bg-cyan-500 hover:bg-cyan-400 text-slate-900 font-bold rounded-xl text-sm transition-colors"
            >
              Done
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default SearchBar;
