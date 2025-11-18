import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../hooks/useAuth';
import { FiMenu, FiX, FiUser, FiLogOut, FiSettings, FiChevronDown, FiHome, FiMapPin, FiUsers } from 'react-icons/fi';
import Button from './Button';

function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/');
    setIsOpen(false);
    setIsProfileOpen(false);
  };

  const handleNavClick = () => {
    setIsOpen(false);
  };

  // Check if user is admin
  const isAdmin = user?.email === 'admin@wravelcommunity.com' || 
                  user?.email === 'superadmin@wravelcommunity.com' ||
                  user?.email === 'moderator@wravelcommunity.com';

  const isAdminPage = location.pathname.startsWith('/admin');

  // Don't show navbar on admin pages
  if (isAdminPage) {
    return null;
  }

  const navItems = [
    { label: 'Home', path: '/', icon: FiHome },
    { label: 'Trips', path: '/trips', icon: FiMapPin },
    { label: 'Community', path: '/community', icon: FiUsers }
  ];

  const containerVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: -10 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <motion.nav
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="sticky top-0 z-50 backdrop-blur-xl bg-gradient-to-b from-white/10 to-white/5 border-b border-white/10 shadow-2xl"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Link 
              to="/" 
              className="flex items-center space-x-2 group cursor-pointer"
              onClick={handleNavClick}
            >
              <motion.div
                animate={{ rotate: [0, 10, -10, 0] }}
                transition={{ duration: 3, repeat: Infinity }}
                className="text-3xl"
              >
                ✈️
              </motion.div>
              <span className="text-xl font-black bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-400 group-hover:from-pink-400 group-hover:to-purple-400 transition-all">
                Wraveler
              </span>
            </Link>
          </motion.div>

          {/* Desktop Menu */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="hidden md:flex items-center space-x-8"
          >
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              return (
                <motion.div key={item.path} variants={itemVariants}>
                  <Link
                    to={item.path}
                    className={`flex items-center gap-1 font-semibold transition-all relative group ${
                      isActive
                        ? 'text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400'
                        : 'text-slate-300 hover:text-white'
                    }`}
                  >
                    <Icon size={18} />
                    {item.label}
                    <motion.div
                      layoutId="activeTab"
                      className={`absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-purple-400 to-pink-400 ${
                        isActive ? '' : 'hidden'
                      }`}
                      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                    />
                  </Link>
                </motion.div>
              );
            })}

            {user ? (
              <>
                {/* Admin Link */}
                {isAdmin && (
                  <motion.div variants={itemVariants}>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => navigate('/admin/dashboard')}
                      className="flex items-center gap-2 px-4 py-2 bg-orange-500/20 border border-orange-500/30 text-orange-300 rounded-lg hover:bg-orange-500/30 hover:border-orange-500/50 transition-all"
                    >
                      <FiSettings size={16} />
                      Admin
                    </motion.button>
                  </motion.div>
                )}

                {/* User Menu */}
                <motion.div variants={itemVariants} className="flex items-center space-x-4 border-l border-white/10 pl-8">
                  <div className="relative">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setIsProfileOpen(!isProfileOpen)}
                      className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all"
                    >
                      <div className="w-8 h-8 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center">
                        <FiUser className="text-white" size={16} />
                      </div>
                      <span className="text-white font-semibold text-sm hidden sm:inline">
                        {user.name?.split(' ')[0]}
                      </span>
                      <motion.div
                        animate={{ rotate: isProfileOpen ? 180 : 0 }}
                        transition={{ duration: 0.2 }}
                      >
                        <FiChevronDown size={16} className="text-slate-400" />
                      </motion.div>
                    </motion.button>

                    {/* Profile Dropdown */}
                    <AnimatePresence>
                      {isProfileOpen && (
                        <motion.div
                          initial={{ opacity: 0, y: -10, scale: 0.95 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: -10, scale: 0.95 }}
                          className="absolute right-0 mt-2 w-48 backdrop-blur-xl bg-gradient-to-br from-white/10 to-white/5 border border-white/10 rounded-lg shadow-2xl overflow-hidden"
                        >
                          <div className="p-4 border-b border-white/10">
                            <p className="text-white font-bold">{user.name}</p>
                            <p className="text-slate-400 text-sm">{user.email}</p>
                          </div>

                          <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ staggerChildren: 0.05 }}
                            className="py-2"
                          >
                            <motion.button
                              whileHover={{ x: 5 }}
                              onClick={() => {
                                navigate('/profile');
                                setIsProfileOpen(false);
                              }}
                              className="w-full text-left px-4 py-2 text-slate-300 hover:text-white hover:bg-white/5 transition-all flex items-center gap-2"
                            >
                              <FiUser size={16} /> My Profile
                            </motion.button>

                            <motion.button
                              whileHover={{ x: 5 }}
                              onClick={() => {
                                navigate('/');
                                setIsProfileOpen(false);
                              }}
                              className="w-full text-left px-4 py-2 text-slate-300 hover:text-white hover:bg-white/5 transition-all flex items-center gap-2"
                            >
                              <FiSettings size={16} /> Preferences
                            </motion.button>

                            <div className="border-t border-white/10 my-2"></div>

                            <motion.button
                              whileHover={{ x: 5 }}
                              onClick={handleLogout}
                              className="w-full text-left px-4 py-2 text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-all flex items-center gap-2"
                            >
                              <FiLogOut size={16} /> Logout
                            </motion.button>
                          </motion.div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </motion.div>
              </>
            ) : (
              <motion.div variants={itemVariants} className="flex space-x-3">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => navigate('/login')}
                  className="px-6 py-2 text-white font-semibold border border-white/20 rounded-lg hover:bg-white/10 transition-all"
                >
                  Login
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => navigate('/register')}
                  className="px-6 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold rounded-lg hover:shadow-lg transition-all"
                >
                  Sign Up
                </motion.button>
              </motion.div>
            )}
          </motion.div>

          {/* Mobile Menu Button */}
          <motion.div className="md:hidden">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsOpen(!isOpen)}
              className="text-white hover:text-purple-400 transition"
            >
              {isOpen ? <FiX size={28} /> : <FiMenu size={28} />}
            </motion.button>
          </motion.div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="md:hidden pb-4 space-y-2 border-t border-white/10"
            >
              {navItems.map((item, idx) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.path;
                return (
                  <motion.div
                    key={item.path}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.05 }}
                  >
                    <Link
                      to={item.path}
                      className={`block px-4 py-3 rounded-lg transition-all flex items-center gap-2 ${
                        isActive
                          ? 'bg-gradient-to-r from-purple-500/20 to-pink-500/20 text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400 border border-purple-500/30'
                          : 'text-slate-300 hover:bg-white/5 hover:text-white border border-white/10'
                      }`}
                      onClick={handleNavClick}
                    >
                      <Icon size={18} /> {item.label}
                    </Link>
                  </motion.div>
                );
              })}

              {user ? (
                <>
                  {/* Admin Link Mobile */}
                  {isAdmin && (
                    <motion.div
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.15 }}
                    >
                      <Link
                        to="/admin/dashboard"
                        className="block px-4 py-3 rounded-lg bg-orange-500/20 border border-orange-500/30 text-orange-300 hover:bg-orange-500/30 transition-all flex items-center gap-2"
                        onClick={handleNavClick}
                      >
                        <FiSettings size={18} /> Admin Panel
                      </Link>
                    </motion.div>
                  )}

                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: isAdmin ? 0.2 : 0.15 }}
                  >
                    <Link
                      to="/profile"
                      className="block px-4 py-3 rounded-lg text-slate-300 hover:bg-white/5 hover:text-white border border-white/10 transition-all flex items-center gap-2"
                      onClick={handleNavClick}
                    >
                      <FiUser size={18} /> My Profile
                    </Link>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: isAdmin ? 0.25 : 0.2 }}
                  >
                    <button
                      onClick={handleLogout}
                      className="block w-full text-left px-4 py-3 rounded-lg text-red-400 hover:bg-red-500/10 hover:text-red-300 border border-red-500/30 transition-all flex items-center gap-2"
                    >
                      <FiLogOut size={18} /> Logout
                    </button>
                  </motion.div>
                </>
              ) : (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.15 }}
                  className="space-y-2 pt-2"
                >
                  <button
                    onClick={() => {
                      navigate('/login');
                      handleNavClick();
                    }}
                    className="block w-full px-4 py-3 rounded-lg border border-white/20 text-white hover:bg-white/10 transition-all font-semibold"
                  >
                    Login
                  </button>
                  <button
                    onClick={() => {
                      navigate('/register');
                      handleNavClick();
                    }}
                    className="block w-full px-4 py-3 rounded-lg bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:shadow-lg transition-all font-semibold"
                  >
                    Sign Up
                  </button>
                </motion.div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.nav>
  );
}

export default Navbar;
