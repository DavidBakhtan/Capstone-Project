import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
const HeroSection = () => {
  // Array of market-related images
  const heroImages = ["https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=600&h=400&fit=crop",
  // Shopping store
  "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=600&h=400&fit=crop",
  // Fresh food market
  "https://images.unsplash.com/photo-1518770660439-4636190af475?w=600&h=400&fit=crop",
  // Electronics
  "https://images.unsplash.com/photo-1445205170230-053b83016050?w=600&h=400&fit=crop",
  // Clothing store
  "https://images.unsplash.com/photo-1542838132-92c53300491e?w=600&h=400&fit=crop",
  // Grocery shopping
  "https://images.unsplash.com/photo-1531297484001-80022131f5a1?w=600&h=400&fit=crop",
  // Laptop/tech
  "https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?w=600&h=400&fit=crop",
  // Retail store
  "https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?w=600&h=400&fit=crop",
  // Technology/devices
  "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&h=400&fit=crop",
  // Fresh produce
  "https://images.unsplash.com/photo-1472851294608-062f824d29cc?w=600&h=400&fit=crop" // Shopping bags/retail
  ];

  // Array of hero content that changes every 2 images
  const heroContent = [{
    title: "Discover Premium Quality",
    subtitle: "at NokNuk Mart",
    description: "Experience the finest selection of products crafted for those who appreciate quality, style, and exceptional value. Your journey to premium shopping starts here."
  }, {
    title: "Fresh & Organic",
    subtitle: "Market Delights",
    description: "From farm to table, discover the freshest organic produce and gourmet foods. Nourish your family with the best nature has to offer."
  }, {
    title: "Latest Technology",
    subtitle: "Innovation Hub",
    description: "Stay ahead with cutting-edge electronics and gadgets. Explore the latest in tech innovation designed to enhance your digital lifestyle."
  }, {
    title: "Fashion Forward",
    subtitle: "Style Collection",
    description: "Express your unique style with our curated fashion collection. From casual comfort to elegant sophistication, find your perfect look."
  }, {
    title: "Everything You Need",
    subtitle: "One Marketplace",
    description: "Your one-stop destination for all lifestyle essentials. Quality, convenience, and value combined in every shopping experience."
  }];
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [currentContentIndex, setCurrentContentIndex] = useState(0);

  // Change image every 3 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex(prevIndex => prevIndex === heroImages.length - 1 ? 0 : prevIndex + 1);
    }, 3000);
    return () => clearInterval(interval);
  }, [heroImages.length]);

  // Change content every 2 images (6 seconds)
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentContentIndex(prevIndex => prevIndex === heroContent.length - 1 ? 0 : prevIndex + 1);
    }, 6000);
    return () => clearInterval(interval);
  }, [heroContent.length]);
  const scrollToProducts = () => {
    const element = document.getElementById('featured-products');
    element?.scrollIntoView({
      behavior: 'smooth'
    });
  };
  return <section className="relative overflow-hidden pt-24 pb-16">
      {/* Spotlight effect */}
      <div className="absolute inset-0">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1200px] h-[800px] bg-gradient-to-r from-sky-400/20 via-indigo-500/20 to-orange-500/20 rounded-full blur-3xl animate-spotlight"></div>
      </div>
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="animate-fade-in">
            <h1 className="text-4xl md:text-6xl font-bold leading-tight mb-6 transition-all duration-500">
              {heroContent[currentContentIndex].title}
              <span className="animated-gradient-text block my-[14px] py-[9px]">{heroContent[currentContentIndex].subtitle}</span>
            </h1>
            <p className="text-xl text-muted-foreground mb-8 leading-relaxed transition-all duration-500">
              {heroContent[currentContentIndex].description}
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button size="lg" className="bg-gradient-to-r from-sky-500 to-indigo-600 hover:from-sky-400 hover:to-indigo-500 transition-all duration-300 hover:scale-105 text-white border-0" onClick={scrollToProducts}>
                Shop Now
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Button size="lg" variant="outline" asChild className="glass-button border-sky-400/50 text-sky-400 hover:bg-sky-400/20 hover:text-sky-300 transition-all duration-300">
                <Link to="/about">Learn More</Link>
              </Button>
            </div>
          </div>
          
          <div className="relative animate-slide-up">
            <div className="relative">
              <img src={heroImages[currentImageIndex]} alt="Premium Shopping Experience" className="w-full h-[400px] object-cover rounded-2xl shadow-2xl glass-effect border-white/20 transition-all duration-500" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent rounded-2xl" />
              
              {/* Floating Elements */}
              <div className="absolute top-4 right-4 glass-effect rounded-lg p-3 animate-bounce-subtle">
                <Star className="h-6 w-6 text-orange-400" />
              </div>
              <div className="absolute bottom-4 left-4 glass-effect rounded-lg p-4">
                <p className="text-sm font-semibold text-white">Premium Quality</p>
                <p className="text-xs text-white/80">Guaranteed Excellence</p>
              </div>
              
              {/* Image indicators */}
              <div className="absolute bottom-4 right-4 flex space-x-2">
                {heroImages.map((_, index) => <div key={index} className={`w-2 h-2 rounded-full transition-all duration-300 ${index === currentImageIndex ? 'bg-sky-400 scale-125' : 'bg-white/50 hover:bg-white/80'}`} />)}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>;
};
export default HeroSection;