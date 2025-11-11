import React from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../components/common/Button';

function NotFound() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center px-4">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-gray-800 mb-4">404</h1>
        <p className="text-2xl font-semibold text-gray-700 mb-4">Page Not Found</p>
        <p className="text-gray-600 mb-8">Sorry, the page you're looking for doesn't exist.</p>
        <div className="flex gap-4 justify-center">
          <Button onClick={() => navigate('/')}>
            Go Home
          </Button>
          <Button variant="secondary" onClick={() => navigate('/trips')}>
            Explore Trips
          </Button>
        </div>
      </div>
    </div>
  );
}

export default NotFound;
