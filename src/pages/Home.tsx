
import React from 'react';
import HeroSection from '@/components/HeroSection';
import FeaturesSection from '@/components/FeaturesSection';
import FeaturedProductsSection from '@/components/FeaturedProductsSection';
import CTASection from '@/components/CTASection';

const Home = () => {
  return (
    <div className="min-h-screen">
      <HeroSection />
      <FeaturesSection />
      <FeaturedProductsSection />
      <CTASection />
    </div>
  );
};

export default Home;
