
import React from 'react';
import { Shield, Truck, HeadphonesIcon } from 'lucide-react';

const FeaturesSection = () => {
  return (
    <section className="py-16 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold text-center mb-12 animated-gradient-text">Why Choose NokNuk Mart?</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-center group">
            <div className="glass-effect w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-all duration-300 border-sky-400/30">
              <Shield className="h-8 w-8 text-sky-400" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Quality Guarantee</h3>
            <p className="text-muted-foreground">
              Every product is carefully selected and tested to meet our high-quality standards.
            </p>
          </div>
          <div className="text-center group">
            <div className="glass-effect w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-all duration-300 border-orange-400/30">
              <Truck className="h-8 w-8 text-orange-400" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Fast Delivery</h3>
            <p className="text-muted-foreground">
              Quick and reliable shipping to get your products to you as soon as possible.
            </p>
          </div>
          <div className="text-center group">
            <div className="glass-effect w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-all duration-300 border-indigo-400/30">
              <HeadphonesIcon className="h-8 w-8 text-indigo-400" />
            </div>
            <h3 className="text-xl font-semibold mb-2">24/7 Support</h3>
            <p className="text-muted-foreground">
              Our dedicated support team is always here to help you with any questions.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
