import api from './api';

export const getTrips = async (params) => {
  const response = await api.get('/trips', { params });
  return response.data;
};

export const getTripById = async (id) => {
  const response = await api.get(`/trips/${id}`);
  return response.data;
};

export const createBooking = async (bookingData) => {
  const response = await api.post('/bookings', bookingData);
  return response.data;
};

export const getReviews = async (tripId) => {
  const response = await api.get(`/reviews/trip/${tripId}`);
  return response.data;
};
