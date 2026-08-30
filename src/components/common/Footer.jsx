import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiHeart } from 'react-icons/fi';
import { FaFacebook, FaInstagram, FaTwitter, FaYoutube } from 'react-icons/fa';

function Footer() {
  const location = useLocation();
  const isAdminPage = location.pathname.startsWith('/admin');

  // Don't show footer on admin pages
  if (isAdminPage) {
    return null;
  }

  const currentYear = new Date().getFullYear();

  const socialLinks = [
    { icon: FaInstagram, label: 'Instagram', href: 'https://instagram.com' },
    { icon: FaFacebook, label: 'Facebook', href: 'https://facebook.com' },
    { icon: FaTwitter, label: 'Twitter', href: 'https://twitter.com' },
    { icon: FaYoutube, label: 'YouTube', href: 'https://youtube.com' }
  ];

  const quickLinks = [
    { label: 'Expeditions', path: '/trips' },
    { label: 'Community', path: '/community' },
    { label: 'About', path: '/about' },
    { label: 'Contact', path: '/contact' },
    { label: 'FAQ', path: '/faq' }
  ];

  return (
    <footer className="relative font-sans text-gray-400 overflow-hidden bg-slate-950 border-t border-white/10">

      {/* Abstract Background Design */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
        {/* Large Gradient Blob */}
        <div className="absolute -top-[50%] -left-[10%] w-[80%] h-[200%] bg-teal-800/30 blur-[120px] rounded-full transform rotate-12" />

        {/* Accent Shapes */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-cyan-500/5 blur-[80px] rounded-full translate-x-1/3 -translate-y-1/3" />

        {/* Subtle Grid Pattern */}
        <div className="absolute inset-0 bg-[url('/patterns/grid.svg')] opacity-[0.03]" />

        {/* Decorative Lines */}
        <svg className="absolute bottom-0 left-0 w-full h-[120%] opacity-10 pointer-events-none" viewBox="0 0 100 100" preserveAspectRatio="none">
          <path d="M0 100 C 30 50 70 50 100 100 L 100 0 L 0 0 Z" fill="none" stroke="url(#gradient)" strokeWidth="0.5" />
          <defs>
            <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#2DD4BF" stopOpacity="0" />
              <stop offset="50%" stopColor="#2DD4BF" stopOpacity="0.5" />
              <stop offset="100%" stopColor="#2DD4BF" stopOpacity="0" />
            </linearGradient>
          </defs>
        </svg>
      </div>

      <div className="relative z-10 max-w-[1440px] mx-auto px-6 md:px-12 py-10">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 md:gap-8">

          {/* Left: Brand & Nav */}
          <div className="flex flex-col md:flex-row items-center gap-6 md:gap-8">
            <Link to="/" className="group">
              <h2 className="text-2xl font-display text-white group-hover:text-cyan-400 transition-colors">SundaySoul</h2>
            </Link>

            <div className="h-px w-8 bg-white/10 hidden md:block" />

            <nav className="flex gap-6 text-sm font-medium">
              {quickLinks.map(link => (
                <Link key={link.path} to={link.path} className="text-grey-400 hover:text-white hover:underline decoration-cyan-500 decoration-2 underline-offset-4 transition-all">
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>

          {/* Right: Socials & Disclaimer */}
          <div className="flex flex-col md:flex-row items-center gap-6">
            <div className="flex gap-3">
              {socialLinks.map((social, index) => {
                const Icon = social.icon;
                return (
                  <motion.a
                    key={index}
                    href={social.href}
                    target="_blank"
                    rel="noreferrer"
                    whileHover={{ y: -2 }}
                    whileTap={{ scale: 0.95 }}
                    className="w-8 h-8 rounded-full bg-white/5 border border-white/5 flex items-center justify-center text-grey-400 hover:bg-cyan-500/20 hover:text-cyan-400 hover:border-cyan-500/30 transition-all"
                  >
                    <Icon size={14} />
                  </motion.a>
                );
              })}
            </div>

            <div className="text-xs text-grey-500 font-mono">
              <span>© {currentYear} SundaySoul</span>
              <span className="mx-2">•</span>
              <Link to="/terms" className="hover:text-cyan-400 transition-colors">Terms</Link>
              <span className="mx-2">•</span>
              <Link to="/privacy" className="hover:text-cyan-400 transition-colors">Privacy</Link>
            </div>
          </div>

        </div>
      </div>
    </footer>
  );
}

export default Footer;
