
import React from 'react';
import { Award, Users, Heart, Zap } from 'lucide-react';

const About = () => {
  const values = [
    {
      icon: Award,
      title: 'Excellence',
      description: 'We are committed to delivering products and services of the highest quality, exceeding customer expectations at every turn.'
    },
    {
      icon: Users,
      title: 'Community',
      description: 'We believe in building strong relationships with our customers, suppliers, and the communities we serve.'
    },
    {
      icon: Heart,
      title: 'Passion',
      description: 'Our passion for quality and innovation drives everything we do, from product selection to customer service.'
    },
    {
      icon: Zap,
      title: 'Innovation',
      description: 'We constantly seek new ways to improve and innovate, staying ahead of trends and customer needs.'
    }
  ];

  const timeline = [
    {
      year: '2020',
      title: 'The Beginning',
      description: 'NokNuk Mart was founded with a simple mission: to provide premium quality products at accessible prices.'
    },
    {
      year: '2021',
      title: 'Rapid Growth',
      description: 'Expanded our product range and established partnerships with leading brands worldwide.'
    },
    {
      year: '2022',
      title: 'Customer-Centric',
      description: 'Launched our 24/7 customer support and introduced our quality guarantee program.'
    },
    {
      year: '2023',
      title: 'Global Reach',
      description: 'Expanded internationally and reached over 100,000 satisfied customers worldwide.'
    },
    {
      year: '2024',
      title: 'Innovation',
      description: 'Launched our new website with enhanced shopping experience and faster delivery options.'
    }
  ];

  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Hero Section */}
        <section className="text-center mb-16 animate-fade-in">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            About <span className="text-gradient">NokNuk Mart</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            We're more than just an e-commerce platform. We're a community of passionate individuals 
            dedicated to bringing you the finest products and exceptional shopping experiences.
          </p>
        </section>

        {/* Story Section */}
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-20">
          <div className="animate-slide-up">
            <h2 className="text-3xl font-bold mb-6">Our Story</h2>
            <div className="space-y-4 text-muted-foreground leading-relaxed">
              <p>
                Founded in 2020, NokNuk Mart began as a small venture with big dreams. Our founders 
                recognized a gap in the market for a platform that combined premium quality products 
                with exceptional customer service and accessible pricing.
              </p>
              <p>
                What started as a passion project has grown into a trusted destination for customers 
                worldwide. We've built our reputation on three core principles: quality, reliability, 
                and customer satisfaction.
              </p>
              <p>
                Today, we partner with leading brands and artisans from around the world to bring 
                you a carefully curated selection of products that meet our exacting standards. 
                Every item in our catalog is chosen for its quality, design, and value.
              </p>
            </div>
          </div>
          <div className="animate-fade-in">
            <img
              src="https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=600&h=400&fit=crop"
              alt="Our Team"
              className="w-full h-[400px] object-cover rounded-2xl shadow-lg"
            />
          </div>
        </section>

        {/* Values Section */}
        <section className="mb-20">
          <h2 className="text-3xl font-bold text-center mb-12">Our Values</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <div
                key={value.title}
                className="text-center group animate-fade-in"
                style={{ animationDelay: `${index * 0.2}s` }}
              >
                <div className="bg-nokNuk-blue/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-nokNuk-blue/20 transition-colors duration-200">
                  <value.icon className="h-8 w-8 text-nokNuk-blue" />
                </div>
                <h3 className="text-xl font-semibold mb-3">{value.title}</h3>
                <p className="text-muted-foreground leading-relaxed">
                  {value.description}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Timeline Section */}
        <section className="mb-20">
          <h2 className="text-3xl font-bold text-center mb-12">Our Journey</h2>
          <div className="relative">
            <div className="absolute left-1/2 transform -translate-x-1/2 w-0.5 h-full bg-nokNuk-blue/20"></div>
            <div className="space-y-12">
              {timeline.map((item, index) => (
                <div
                  key={item.year}
                  className={`flex items-center ${
                    index % 2 === 0 ? 'lg:flex-row' : 'lg:flex-row-reverse'
                  } animate-fade-in`}
                  style={{ animationDelay: `${index * 0.2}s` }}
                >
                  <div className="flex-1 lg:px-8">
                    <div className={`bg-gradient-to-r from-nokNuk-blue/5 to-nokNuk-gold/5 p-6 rounded-xl shadow-lg border ${
                      index % 2 === 0 ? 'lg:text-right' : 'lg:text-left'
                    }`}>
                      <span className="text-nokNuk-blue font-bold text-lg">{item.year}</span>
                      <h3 className="text-xl font-semibold mt-2 mb-3">{item.title}</h3>
                      <p className="text-muted-foreground">{item.description}</p>
                    </div>
                  </div>
                  <div className="relative z-10 w-4 h-4 bg-nokNuk-blue rounded-full border-4 border-white shadow-lg"></div>
                  <div className="flex-1 lg:px-8"></div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Mission Section */}
        <section className="bg-gradient-to-r from-nokNuk-blue/5 to-nokNuk-gold/5 rounded-2xl p-8 md:p-12 text-center">
          <h2 className="text-3xl font-bold mb-6">Our Mission</h2>
          <p className="text-xl text-muted-foreground max-w-4xl mx-auto leading-relaxed">
            To create exceptional shopping experiences by connecting customers with premium quality 
            products, while building lasting relationships based on trust, innovation, and excellence. 
            We strive to make quality accessible to everyone, everywhere.
          </p>
        </section>
      </div>
    </div>
  );
};

export default About;
