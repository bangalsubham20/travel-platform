import React from 'react';
import { useNavigate } from 'react-router-dom';
import SearchBar from '../components/home/SearchBar';
import Button from '../components/common/Button';

function Home() {
  const navigate = useNavigate();

  return (
    <div>
      {/* Hero Section */}
      <div className="relative h-96 bg-gradient-to-r from-blue-600 to-blue-800 overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-30"
          style={{
            backgroundImage: 'url("https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=1200")',
          }}
        />
        
        <div className="relative h-full flex flex-col items-center justify-center px-4 text-center">
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-4">
            Wander. Travel. Connect. Repeat.
          </h1>
          <p className="text-xl md:text-2xl text-blue-100 mb-8 max-w-2xl">
            Join a community of adventure seekers and explore hidden gems with like-minded travelers
          </p>
          
          <div className="w-full max-w-2xl mb-12">
            <SearchBar />
          </div>

          <div className="flex flex-col md:flex-row gap-4">
            <Button onClick={() => navigate('/trips')}>
              Explore Trips
            </Button>
            <Button variant="outline" onClick={() => navigate('/community')}>
              Join Community
            </Button>
          </div>
        </div>
      </div>

      {/* Featured Trips Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-4xl font-bold text-gray-800 mb-12 text-center">Featured Trips</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-gray-50 p-6 rounded-lg shadow">
                <div className="h-40 bg-gray-200 rounded-lg mb-4"></div>
                <h3 className="font-bold text-lg mb-2">Amazing Trip {i}</h3>
                <p className="text-gray-600 text-sm mb-4">Explore beautiful destinations with us</p>
                <div className="flex justify-between items-center">
                  <span className="text-orange-500 font-bold">₹18,500</span>
                  <Button size="sm" onClick={() => navigate(`/trips/${i}`)}>View</Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-4xl font-bold text-gray-800 mb-12 text-center">Explore by Category</h2>
          <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
            {['⛰️ Trekking', '🎒 Backpacking', '👩‍👩‍👩 All Girls', '🏍️ Biking', '🏕️ Weekend', '✈️ International'].map((cat, i) => (
              <div key={i} className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition cursor-pointer text-center">
                <div className="text-3xl mb-2">{cat.split(' ')}</div>
                <p className="font-semibold text-gray-800">{cat.split(' ').slice(1).join(' ')}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

export default Home;
