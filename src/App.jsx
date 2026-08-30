import React, { Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/common/Navbar';
import Footer from './components/common/Footer';
import SmoothScroll from './components/common/SmoothScroll';
import LoadingSpinner from './components/common/LoadingSpinner';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/auth/ProtectedRoute';
import AdminRoute from './components/auth/AdminRoute';
import './App.css';

// Lazy load pages for better performance
const Home = lazy(() => import('./pages/Home'));
const Trekking = lazy(() => import('./pages/Trekking'));
const Trips = lazy(() => import('./pages/Trips'));
const TripDetail = lazy(() => import('./pages/TripDetail'));
const About = lazy(() => import('./pages/About'));
const Login = lazy(() => import('./pages/Login'));
const Register = lazy(() => import('./pages/Register'));
const Community = lazy(() => import('./pages/Community'));
const Booking = lazy(() => import('./pages/Booking'));
const BookingConfirmation = lazy(() => import('./pages/BookingConfirmation'));
const Profile = lazy(() => import('./pages/Profile'));
const AdminDashboard = lazy(() => import('./pages/AdminDashboard'));
const AdminLogin = lazy(() => import('./pages/AdminLogin'));
const NotFound = lazy(() => import('./pages/NotFound'));
const Contact = lazy(() => import('./pages/Contact'));
const Terms = lazy(() => import('./pages/Terms'));
const Privacy = lazy(() => import('./pages/Privacy'));
const FAQ = lazy(() => import('./pages/FAQ'));

// Loading fallback component
const LoadingFallback = () => (
  <div className="min-h-screen flex items-center justify-center">
    <LoadingSpinner />
  </div>
);

function App() {
  return (
    <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <SmoothScroll />
      <AuthProvider>
        <div className="flex flex-col min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800">
          {/* Navbar - hidden on admin routes */}
          <Navbar />

          {/* Main Content */}
          <main className="flex-grow">
            <Suspense fallback={<LoadingFallback />}>
              <Routes>
                {/* ========== PUBLIC ROUTES ========== */}

                {/* Home */}
                <Route path="/" element={<Home />} />
                <Route path="/about" element={<About />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/terms" element={<Terms />} />
                <Route path="/privacy" element={<Privacy />} />
                <Route path="/faq" element={<FAQ />} />

                {/* Trips & Trekking */}
                <Route path="/trips" element={<Trips />} />
                <Route path="/trips/:id" element={<TripDetail />} />
                <Route path="/trekking" element={<Trekking />} />

                {/* Community */}
                <Route path="/community" element={<Community />} />

                {/* Authentication Routes */}
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />

                {/* ========== PROTECTED USER ROUTES ========== */}

                {/* User Profile */}
                <Route
                  path="/profile"
                  element={
                    <ProtectedRoute>
                      <Profile />
                    </ProtectedRoute>
                  }
                />

                {/* Booking Flow */}
                <Route
                  path="/booking/:tripId"
                  element={
                    <ProtectedRoute>
                      <Booking />
                    </ProtectedRoute>
                  }
                />

                {/* Booking Confirmation */}
                <Route
                  path="/booking-confirmation/:tripId"
                  element={
                    <ProtectedRoute>
                      <BookingConfirmation />
                    </ProtectedRoute>
                  }
                />

                {/* ========== ADMIN ROUTES ========== */}

                {/* Admin Login */}
                <Route path="/admin/login" element={<AdminLogin />} />

                {/* Admin Dashboard */}
                <Route
                  path="/admin/dashboard"
                  element={
                    <AdminRoute requiredRole="admin">
                      <AdminDashboard />
                    </AdminRoute>
                  }
                />

                {/* Admin Redirect */}
                <Route path="/admin" element={<Navigate to="/admin/dashboard" replace />} />
                <Route path="/admin/*" element={<Navigate to="/admin/dashboard" replace />} />

                {/* ========== 404 FALLBACK ========== */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </Suspense>
          </main>

          {/* Footer - hidden on admin routes */}
          <Footer />
        </div>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
