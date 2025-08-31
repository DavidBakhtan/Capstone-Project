
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

const CTASection = () => {
  return (
    <section className="py-16 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-r from-sky-600/20 via-indigo-600/20 to-orange-600/20"></div>
      <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-3xl font-bold mb-4 animated-gradient-text">
          Ready to Start Shopping?
        </h2>
        <p className="text-xl text-muted-foreground mb-8">
          Join thousands of satisfied customers who trust NokNuk Mart for their premium shopping needs.
        </p>
        <Button 
          size="lg" 
          className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-400 hover:to-orange-500 text-white transition-all duration-300 hover:scale-105 border-0"
          asChild
        >
          <Link to="/products">Explore Our Collection</Link>
        </Button>
      </div>
    </section>
  );
};

export default CTASection;
