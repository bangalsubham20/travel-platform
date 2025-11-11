import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiSearch, FiCalendar, FiMapPin } from 'react-icons/fi';
import Button from '../common/Button';

function SearchBar() {
  const [destination, setDestination] = useState('');
  const [startDate, setStartDate] = useState('');
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    const query = new URLSearchParams({
      destination: destination || '',
      startDate: startDate || '',
    }).toString();
    navigate(`/trips?${query}`);
  };

  return (
    <form onSubmit={handleSearch} className="bg-white p-6 rounded-lg shadow-lg">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="flex items-center space-x-2 border-b-2 pb-2">
          <FiMapPin className="text-gray-400" />
          <input
            type="text"
            placeholder="Where to?"
            value={destination}
            onChange={(e) => setDestination(e.target.value)}
            className="flex-1 outline-none text-gray-700"
          />
        </div>

        <div className="flex items-center space-x-2 border-b-2 pb-2">
          <FiCalendar className="text-gray-400" />
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="flex-1 outline-none text-gray-700"
          />
        </div>

        <Button type="submit" fullWidth>
          <FiSearch className="inline mr-2" />
          Search
        </Button>
      </div>
    </form>
  );
}

export default SearchBar;
