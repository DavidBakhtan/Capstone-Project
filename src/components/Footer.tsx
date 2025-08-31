
import React from 'react';
import { Link } from 'react-router-dom';
import { Mail, Phone, MapPin, Facebook, Twitter, Instagram } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="glass-effect border-t border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-8 h-8 bg-gradient-to-r from-sky-400 via-indigo-500 to-orange-500 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">N</span>
              </div>
              <span className="text-xl font-bold animated-gradient-text">NokNuk Mart</span>
            </div>
            <p className="text-muted-foreground mb-6 max-w-md">
              Your destination for premium quality products. We believe in delivering excellence 
              and creating exceptional shopping experiences for our valued customers.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-muted-foreground hover:text-sky-400 transition-colors duration-200 glass-button p-2 rounded-lg">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="#" className="text-muted-foreground hover:text-indigo-400 transition-colors duration-200 glass-button p-2 rounded-lg">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="#" className="text-muted-foreground hover:text-orange-400 transition-colors duration-200 glass-button p-2 rounded-lg">
                <Instagram className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold mb-4 text-sky-400">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-muted-foreground hover:text-sky-400 transition-colors duration-200">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/products" className="text-muted-foreground hover:text-sky-400 transition-colors duration-200">
                  Products
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-muted-foreground hover:text-sky-400 transition-colors duration-200">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-muted-foreground hover:text-sky-400 transition-colors duration-200">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="font-semibold mb-4 text-sky-400">Contact Info</h3>
            <ul className="space-y-3">
              <li className="flex items-center space-x-2">
                <Mail className="h-4 w-4 text-orange-400" />
                <span className="text-muted-foreground text-sm">hello@nokNukmart.com</span>
              </li>
              <li className="flex items-center space-x-2">
                <Phone className="h-4 w-4 text-orange-400" />
                <span className="text-muted-foreground text-sm">+1 (555) 123-4567</span>
              </li>
              <li className="flex items-center space-x-2">
                <MapPin className="h-4 w-4 text-orange-400" />
                <span className="text-muted-foreground text-sm">123 Commerce St, City, State 12345</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/10 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-muted-foreground text-sm">
            © 2024 NokNuk Mart. All rights reserved.
          </p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <a href="#" className="text-muted-foreground hover:text-sky-400 text-sm transition-colors duration-200">
              Privacy Policy
            </a>
            <a href="#" className="text-muted-foreground hover:text-sky-400 text-sm transition-colors duration-200">
              Terms of Service
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
