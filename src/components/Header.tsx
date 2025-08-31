
import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ShoppingCart, Menu, X } from 'lucide-react';
import { useCart } from '@/contexts/CartContext';
import { Button } from '@/components/ui/button';
import { CartDropdown } from './CartDropdown';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const { getTotalItems, toggleCart } = useCart();
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navigation = [
    { name: 'Home', href: '/' },
    { name: 'Products', href: '/products' },
    { name: 'About', href: '/about' },
    { name: 'Contact', href: '/contact' },
  ];

  const totalItems = getTotalItems();

  return (
    <>
      <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? 'glass-effect shadow-2xl' : 'bg-background/80 backdrop-blur-sm'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link to="/" className="flex items-center space-x-2 group">
              <div className="w-8 h-8 bg-gradient-to-r from-sky-800 via-indigo-500 to-orange-800 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <span className="text-white font-bold text-sm">N</span>
              </div>
              <span className="text-xl font-bold animated-gradient-text">NokNuk Mart</span>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-8">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`text-sm font-medium transition-all duration-300 relative group ${
                    location.pathname === item.href
                      ? 'text-sky-400'
                      : 'text-foreground hover:text-sky-400'
                  }`}
                >
                  {item.name}
                  {location.pathname === item.href && (
                    <div className="absolute -bottom-1 left-0 right-0 h-0.5 bg-gradient-to-r from-sky-400 to-indigo-500 animate-scale-in" />
                  )}
                  <div className="absolute -bottom-1 left-0 right-0 h-0.5 bg-gradient-to-r from-sky-400 to-indigo-500 scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />
                </Link>
              ))}
            </nav>

            {/* Cart and Mobile Menu */}
            <div className="flex items-center space-x-4">
              {/* Cart Button */}
              <Button
                variant="ghost"
                size="sm"
                className="relative glass-button hover:scale-105 transition-all duration-300"
                onClick={toggleCart}
              >
                <ShoppingCart className="h-5 w-5" />
                {totalItems > 0 && (
                  <span className="absolute -top-2 -right-2 bg-gradient-to-r from-orange-500 to-orange-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center animate-pulse-soft">
                    {totalItems}
                  </span>
                )}
              </Button>

              {/* Mobile Menu Button */}
              <Button
                variant="ghost"
                size="sm"
                className="md:hidden glass-button"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
              >
                {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </Button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation */}
        <div className={`md:hidden transition-all duration-300 ease-in-out ${
          isMenuOpen ? 'max-h-64 opacity-100' : 'max-h-0 opacity-0'
        } overflow-hidden glass-effect border-t border-white/10`}>
          <div className="px-4 py-4 space-y-4">
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className={`block text-sm font-medium transition-colors duration-200 ${
                  location.pathname === item.href
                    ? 'text-sky-400'
                    : 'text-foreground hover:text-sky-400'
                }`}
                onClick={() => setIsMenuOpen(false)}
              >
                {item.name}
              </Link>
            ))}
          </div>
        </div>
      </header>

      <CartDropdown />
    </>
  );
};

export default Header;
