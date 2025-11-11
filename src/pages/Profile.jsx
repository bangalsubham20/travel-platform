import React, { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import Button from '../components/common/Button';
import Card from '../components/common/Card';
import { FiEdit2, FiLogOut, FiBookmark, FiStar } from 'react-icons/fi';

function Profile() {
  const { user, logout } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [bookings, setBookings] = useState([]);
  const [tab, setTab] = useState('bookings');

  useEffect(() => {
    // Load user bookings from API
    const mockBookings = [
      {
        id: 1,
        tripName: 'Winter Spiti Valley',
        destination: 'Spiti Valley',
        startDate: '2025-01-15',
        status: 'confirmed',
        price: 21150,
      },
      {
        id: 2,
        tripName: 'Leh Ladakh Adventure',
        destination: 'Ladakh',
        startDate: '2025-02-20',
        status: 'pending',
        price: 34650,
      },
    ];
    setBookings(mockBookings);
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Profile Card */}
          <div className="lg:col-span-1">
            <Card className="p-6 text-center">
              <img
                src={user?.profileImage || 'https://via.placeholder.com/150'}
                alt={user?.name}
                className="w-24 h-24 rounded-full mx-auto mb-4 object-cover"
              />
              <h2 className="text-2xl font-bold text-gray-800">{user?.name}</h2>
              <p className="text-gray-600 mb-1">{user?.email}</p>
              <p className="text-gray-600 mb-4">{user?.phone}</p>

              <div className="flex gap-2 mb-4">
                <Button
                  variant="outline"
                  size="sm"
                  fullWidth
                  onClick={() => setIsEditing(!isEditing)}
                >
                  <FiEdit2 className="inline mr-1" />
                  Edit
                </Button>
              </div>

              <Button
                variant="secondary"
                fullWidth
                onClick={logout}
              >
                <FiLogOut className="inline mr-1" />
                Logout
              </Button>

              <div className="mt-6 pt-6 border-t space-y-3">
                <div>
                  <p className="text-sm text-gray-600">Total Trips</p>
                  <p className="text-2xl font-bold text-orange-500">{bookings.length}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Average Rating</p>
                  <p className="text-2xl font-bold text-orange-500">4.5⭐</p>
                </div>
              </div>
            </Card>
          </div>

          {/* Profile Content */}
          <div className="lg:col-span-2">
            {isEditing ? (
              <Card className="p-6 mb-6">
                <h3 className="text-lg font-bold text-gray-800 mb-4">Edit Profile</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Name</label>
                    <input
                      type="text"
                      defaultValue={user?.name}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Email</label>
                    <input
                      type="email"
                      defaultValue={user?.email}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Phone</label>
                    <input
                      type="tel"
                      defaultValue={user?.phone}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                    />
                  </div>
                  <div className="flex gap-2">
                    <Button fullWidth>Save Changes</Button>
                    <Button variant="secondary" fullWidth onClick={() => setIsEditing(false)}>
                      Cancel
                    </Button>
                  </div>
                </div>
              </Card>
            ) : null}

            {/* Tabs */}
            <div className="flex gap-4 mb-6 border-b">
              <button
                onClick={() => setTab('bookings')}
                className={`pb-4 font-semibold ${
                  tab === 'bookings'
                    ? 'border-b-2 border-orange-500 text-orange-500'
                    : 'text-gray-600 hover:text-gray-800'
                }`}
              >
                <FiBookmark className="inline mr-2" />
                My Bookings
              </button>
              <button
                onClick={() => setTab('reviews')}
                className={`pb-4 font-semibold ${
                  tab === 'reviews'
                    ? 'border-b-2 border-orange-500 text-orange-500'
                    : 'text-gray-600 hover:text-gray-800'
                }`}
              >
                <FiStar className="inline mr-2" />
                My Reviews
              </button>
            </div>

            {/* Bookings Tab */}
            {tab === 'bookings' && (
              <div className="space-y-4">
                {bookings.length > 0 ? (
                  bookings.map(booking => (
                    <Card key={booking.id} className="p-6">
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <h3 className="text-lg font-bold text-gray-800">{booking.tripName}</h3>
                          <p className="text-gray-600">{booking.destination}</p>
                        </div>
                        <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                          booking.status === 'confirmed'
                            ? 'bg-green-100 text-green-800'
                            : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <p className="text-gray-600">Starts: {new Date(booking.startDate).toLocaleDateString()}</p>
                        <p className="text-lg font-bold text-orange-500">₹{booking.price.toLocaleString()}</p>
                      </div>
                    </Card>
                  ))
                ) : (
                  <Card className="p-6 text-center">
                    <p className="text-gray-600">No bookings yet. Start exploring trips!</p>
                  </Card>
                )}
              </div>
            )}

            {/* Reviews Tab */}
            {tab === 'reviews' && (
              <Card className="p-6 text-center">
                <p className="text-gray-600">No reviews yet. Complete a trip to leave a review!</p>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Profile;
