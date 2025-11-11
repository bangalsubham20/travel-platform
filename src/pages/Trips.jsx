import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../components/common/Button';

function Trips() {
  const navigate = useNavigate();
  const [trips] = useState([
    {
      id: 1,
      name: 'Winter Spiti Valley',
      destination: 'Spiti Valley',
      price: 21150,
      duration: 8,
      rating: 4.8,
      image: 'https://via.placeholder.com/300x200',
    },
    {
      id: 2,
      name: 'Leh Ladakh Adventure',
      destination: 'Ladakh',
      price: 34650,
      duration: 7,
      rating: 4.9,
      image: 'https://via.placeholder.com/300x200',
    },
    {
      id: 3,
      name: 'Kerala Backpacking',
      destination: 'Kerala',
      price: 16650,
      duration: 6,
      rating: 4.7,
      image: 'https://via.placeholder.com/300x200',
    },
  ]);

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-gray-800 mb-8">Explore Trips</h1>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {trips.map(trip => (
            <div key={trip.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition">
              <img src={trip.image} alt={trip.name} className="w-full h-48 object-cover" />
              <div className="p-6">
                <h3 className="text-lg font-bold mb-2">{trip.name}</h3>
                <p className="text-gray-600 mb-4">{trip.destination}</p>
                <div className="flex justify-between items-center mb-4">
                  <span className="text-orange-500 font-bold">₹{trip.price.toLocaleString()}</span>
                  <span className="text-yellow-500">⭐ {trip.rating}</span>
                </div>
                <Button fullWidth onClick={() => navigate(`/trips/${trip.id}`)}>
                  View Details
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Trips;
