import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { FiMenu, FiX, FiUser, FiLogOut } from 'react-icons/fi';
import Button from './Button';

function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
    setIsOpen(false);
  };

  return (
    <nav className="bg-white shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="flex items-center space-x-2">
            <div className="text-2xl font-bold text-orange-500">✈️</div>
            <span className="text-xl font-bold text-gray-800">WravelCommunity</span>
          </Link>

          <div className="hidden md:flex items-center space-x-8">
            <Link to="/trips" className="text-gray-700 hover:text-orange-500 transition">
              Explore Trips
            </Link>
            <Link to="/community" className="text-gray-700 hover:text-orange-500 transition">
              Community
            </Link>
            {user ? (
              <div className="flex items-center space-x-4">
                <Link to="/profile" className="flex items-center space-x-1 text-gray-700 hover:text-orange-500">
                  <FiUser size={20} />
                  <span>{user.name}</span>
                </Link>
                <button
                  onClick={handleLogout}
                  className="flex items-center space-x-1 text-gray-700 hover:text-orange-500"
                >
                  <FiLogOut size={20} />
                  <span>Logout</span>
                </button>
              </div>
            ) : (
              <div className="flex space-x-2">
                <Button variant="secondary" onClick={() => navigate('/login')}>
                  Login
                </Button>
                <Button onClick={() => navigate('/login')}>
                  Sign Up
                </Button>
              </div>
            )}
          </div>

          <div className="md:hidden">
            <button onClick={() => setIsOpen(!isOpen)} className="text-gray-700">
              {isOpen ? <FiX size={24} /> : <FiMenu size={24} />}
            </button>
          </div>
        </div>

        {isOpen && (
          <div className="md:hidden pb-4 space-y-2">
            <Link to="/trips" className="block px-2 py-2 text-gray-700 hover:bg-orange-50">
              Explore Trips
            </Link>
            <Link to="/community" className="block px-2 py-2 text-gray-700 hover:bg-orange-50">
              Community
            </Link>
            {user ? (
              <>
                <Link to="/profile" className="block px-2 py-2 text-gray-700 hover:bg-orange-50">
                  My Profile
                </Link>
                <button
                  onClick={handleLogout}
                  className="block w-full text-left px-2 py-2 text-gray-700 hover:bg-orange-50"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Button variant="secondary" fullWidth onClick={() => navigate('/login')}>
                  Login
                </Button>
                <Button fullWidth onClick={() => navigate('/login')}>
                  Sign Up
                </Button>
              </>
            )}
          </div>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
