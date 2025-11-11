import React from 'react';
import TripCard from '../trips/TripCard';

function FeaturedTrips() {
  const trips = [
    {
      id: 1,
      name: 'Winter Spiti Valley',
      destination: 'Spiti Valley',
      price: 21150,
      duration: 8,
      availableSeats: 15,
      rating: 4.8,
      difficulty: 'Moderate',
      image: 'https://via.placeholder.com/400x300',
    },
    {
      id: 2,
      name: 'Leh Ladakh Adventure',
      destination: 'Ladakh',
      price: 34650,
      duration: 7,
      availableSeats: 8,
      rating: 4.9,
      difficulty: 'Moderate',
      image: 'https://via.placeholder.com/400x300',
    },
    {
      id: 3,
      name: 'Kerala Backpacking',
      destination: 'Kerala',
      price: 16650,
      duration: 6,
      availableSeats: 20,
      rating: 4.7,
      difficulty: 'Easy',
      image: 'https://via.placeholder.com/400x300',
    },
  ];

  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4">
        <h2 className="text-4xl font-bold text-gray-800 mb-4 text-center">Featured Trips</h2>
        <p className="text-gray-600 text-center mb-12">Curated experiences from our most popular destinations</p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {trips.map(trip => (
            <TripCard key={trip.id} trip={trip} />
          ))}
        </div>
      </div>
    </section>
  );
}

export default FeaturedTrips;
