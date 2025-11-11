import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FiMapPin, FiCalendar, FiUsers, FiStar, FiDollarSign, FiClock } from 'react-icons/fi';
import { useAuth } from '../hooks/useAuth';
import Button from '../components/common/Button';
import LoadingSpinner from '../components/common/LoadingSpinner';
import * as tripsService from '../services/trips';

function TripDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [trip, setTrip] = useState(null);
  const [loading, setLoading] = useState(true);
  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    const loadTrip = async () => {
      try {
        const data = await tripsService.getTripById(id);
        setTrip(data);
        const reviewsData = await tripsService.getReviews(id);
        setReviews(reviewsData);
      } catch (error) {
        console.error('Error loading trip:', error);
      } finally {
        setLoading(false);
      }
    };

    loadTrip();
  }, [id]);

  if (loading) return <LoadingSpinner />;
  if (!trip) return <div className="text-center py-12">Trip not found</div>;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Image */}
      <div className="h-96 bg-gray-200 overflow-hidden">
        <img
          src={trip.image || 'https://via.placeholder.com/1200x400'}
          alt={trip.name}
          className="w-full h-full object-cover"
        />
      </div>

      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Header */}
            <h1 className="text-4xl font-bold text-gray-800 mb-4">{trip.name}</h1>

            {/* Quick Info */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              <div className="bg-white p-4 rounded-lg shadow">
                <div className="flex items-center text-orange-500 mb-2">
                  <FiMapPin size={20} />
                  <span className="ml-2 font-semibold">Location</span>
                </div>
                <p className="text-gray-700">{trip.destination}</p>
              </div>

              <div className="bg-white p-4 rounded-lg shadow">
                <div className="flex items-center text-orange-500 mb-2">
                  <FiClock size={20} />
                  <span className="ml-2 font-semibold">Duration</span>
                </div>
                <p className="text-gray-700">{trip.duration} Days</p>
              </div>

              <div className="bg-white p-4 rounded-lg shadow">
                <div className="flex items-center text-orange-500 mb-2">
                  <FiUsers size={20} />
                  <span className="ml-2 font-semibold">Seats Left</span>
                </div>
                <p className="text-gray-700">{trip.availableSeats}</p>
              </div>

              <div className="bg-white p-4 rounded-lg shadow">
                <div className="flex items-center text-orange-500 mb-2">
                  <FiStar size={20} />
                  <span className="ml-2 font-semibold">Rating</span>
                </div>
                <p className="text-gray-700">{trip.rating?.toFixed(1)}/5</p>
              </div>
            </div>

            {/* Description */}
            <div className="bg-white p-6 rounded-lg shadow mb-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">About This Trip</h2>
              <p className="text-gray-600 leading-relaxed">{trip.description}</p>
            </div>

            {/* Itinerary */}
            <div className="bg-white p-6 rounded-lg shadow mb-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">Itinerary</h2>
              <div className="space-y-4">
                {trip.itinerary?.map((item, index) => (
                  <div key={index} className="border-l-4 border-orange-500 pl-4">
                    <h3 className="font-bold text-gray-800">Day {index + 1}: {item.title}</h3>
                    <p className="text-gray-600 mt-1">{item.description}</p>
                    {item.meals && <p className="text-sm text-gray-500 mt-1">Meals: {item.meals}</p>}
                  </div>
                ))}
              </div>
            </div>

            {/* Inclusions */}
            <div className="bg-white p-6 rounded-lg shadow mb-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">What's Included</h2>
              <div className="grid grid-cols-2 gap-4">
                {trip.inclusions?.map((item, index) => (
                  <div key={index} className="flex items-start">
                    <span className="text-orange-500 mr-2">✓</span>
                    <span className="text-gray-700">{item}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Reviews */}
            <div className="bg-white p-6 rounded-lg shadow">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">Reviews ({reviews.length})</h2>
              <div className="space-y-4">
                {reviews.map((review) => (
                  <div key={review.id} className="border-b pb-4 last:border-b-0">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-semibold text-gray-800">{review.userName}</span>
                      <span className="text-yellow-500">{'⭐'.repeat(review.rating)}</span>
                    </div>
                    <p className="text-gray-600">{review.comment}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white p-6 rounded-lg shadow sticky top-20">
              <div className="mb-6">
                <div className="text-4xl font-bold text-orange-500 mb-2">
                  ₹{trip.price?.toLocaleString()}
                </div>
                <p className="text-gray-600 text-sm">Per person</p>
              </div>

              <div className="mb-6 space-y-2">
                <div className="flex justify-between text-gray-600">
                  <span>Dates Available:</span>
                  <span className="font-semibold">{trip.startDate}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Difficulty:</span>
                  <span className="font-semibold">{trip.difficulty}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Group Size:</span>
                  <span className="font-semibold">{trip.groupSize}</span>
                </div>
              </div>

              {user ? (
                <Button
                  fullWidth
                  onClick={() => navigate(`/booking/${id}`)}
                >
                  Book Now
                </Button>
              ) : (
                <Button
                  fullWidth
                  onClick={() => navigate('/login')}
                >
                  Login to Book
                </Button>
              )}

              <div className="mt-4 p-4 bg-blue-50 rounded">
                <p className="text-sm text-gray-600">
                  <span className="font-semibold">Certified Guide:</span> All trip leaders are certified with AMC/BMC and first-aid training
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default TripDetail;
