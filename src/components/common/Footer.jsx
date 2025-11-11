import React from 'react';
import { Link } from 'react-router-dom';
import { FiMail, FiPhone, FiMapPin } from 'react-icons/fi';
import { FaFacebook, FaInstagram, FaTwitter, FaYoutube } from 'react-icons/fa';

function Footer() {
  return (
    <footer className="bg-gray-900 text-white py-12">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div>
            <h3 className="text-lg font-bold mb-4">WravelCommunity</h3>
            <p className="text-gray-300 text-sm">
              India's leading social travel community connecting adventure seekers.
            </p>
          </div>

          <div>
            <h3 className="text-lg font-bold mb-4">Quick Links</h3>
            <ul className="space-y-2 text-gray-300 text-sm">
              <li><Link to="/trips" className="hover:text-orange-500">Explore Trips</Link></li>
              <li><Link to="/community" className="hover:text-orange-500">Community</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-bold mb-4">Contact</h3>
            <div className="space-y-2 text-gray-300 text-sm">
              <div className="flex items-center space-x-2">
                <FiPhone />
                <span>+91 97 97 97 21 75</span>
              </div>
              <div className="flex items-center space-x-2">
                <FiMail />
                <span>support@wravelcommunity.com</span>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-bold mb-4">Follow Us</h3>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-300 hover:text-orange-500"><FaFacebook size={24} /></a>
              <a href="#" className="text-gray-300 hover:text-orange-500"><FaInstagram size={24} /></a>
              <a href="#" className="text-gray-300 hover:text-orange-500"><FaTwitter size={24} /></a>
              <a href="#" className="text-gray-300 hover:text-orange-500"><FaYoutube size={24} /></a>
            </div>
          </div>
        </div>

        <hr className="border-gray-700 mb-8" />
        <p className="text-center text-gray-400 text-sm">&copy; 2025 WravelCommunity. All rights reserved.</p>
      </div>
    </footer>
  );
}

export default Footer;
