
import React, { useState } from 'react';
import { Mail, Phone, MapPin, Clock, Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate form submission
    await new Promise(resolve => setTimeout(resolve, 1000));

    toast({
      title: "Message sent!",
      description: "Thank you for your message. We'll get back to you soon.",
    });

    setFormData({ name: '', email: '', subject: '', message: '' });
    setIsSubmitting(false);
  };

  const contactInfo = [
    {
      icon: Mail,
      title: 'Email Us',
      details: 'hello@nokNukmart.com',
      subtitle: 'We reply within 24 hours'
    },
    {
      icon: Phone,
      title: 'Call Us',
      details: '+1 (555) 123-4567',
      subtitle: 'Mon-Fri, 9AM-6PM EST'
    },
    {
      icon: MapPin,
      title: 'Visit Us',
      details: '123 Commerce Street',
      subtitle: 'New York, NY 10001'
    },
    {
      icon: Clock,
      title: 'Business Hours',
      details: 'Monday - Friday',
      subtitle: '9:00 AM - 6:00 PM EST'
    }
  ];

  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <section className="text-center mb-16 animate-fade-in">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            Get in <span className="text-gradient">Touch</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Have a question, suggestion, or just want to say hello? We'd love to hear from you. 
            Our team is here to help and support you.
          </p>
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Contact Information */}
          <div className="lg:col-span-1 space-y-8">
            <div className="animate-slide-up">
              <h2 className="text-2xl font-bold mb-6">Contact Information</h2>
              <div className="space-y-6">
                {contactInfo.map((info, index) => (
                  <div
                    key={info.title}
                    className="flex items-start space-x-4 p-4 rounded-lg hover:bg-muted/50 transition-colors duration-200"
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    <div className="bg-nokNuk-blue/10 p-3 rounded-lg">
                      <info.icon className="h-6 w-6 text-nokNuk-blue" />
                    </div>
                    <div>
                      <h3 className="font-semibold mb-1">{info.title}</h3>
                      <p className="text-muted-foreground">{info.details}</p>
                      <p className="text-sm text-muted-foreground">{info.subtitle}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Map Placeholder */}
            <div className="animate-fade-in">
              <div className="bg-muted/30 rounded-lg p-8 text-center">
                <MapPin className="h-12 w-12 text-nokNuk-blue mx-auto mb-4" />
                <h3 className="font-semibold mb-2">Find Us</h3>
                <p className="text-muted-foreground">
                  Located in the heart of New York City, easily accessible by public transport.
                </p>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-2">
            <div className="bg-background rounded-2xl shadow-lg border p-8 animate-scale-in">
              <h2 className="text-2xl font-bold mb-6">Send us a Message</h2>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium mb-2">
                      Full Name *
                    </label>
                    <Input
                      id="name"
                      name="name"
                      type="text"
                      required
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="Your full name"
                      className="transition-all duration-200 focus:ring-2 focus:ring-nokNuk-blue"
                    />
                  </div>
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium mb-2">
                      Email Address *
                    </label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      required
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="your@email.com"
                      className="transition-all duration-200 focus:ring-2 focus:ring-nokNuk-blue"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="subject" className="block text-sm font-medium mb-2">
                    Subject *
                  </label>
                  <Input
                    id="subject"
                    name="subject"
                    type="text"
                    required
                    value={formData.subject}
                    onChange={handleChange}
                    placeholder="What is this about?"
                    className="transition-all duration-200 focus:ring-2 focus:ring-nokNuk-blue"
                  />
                </div>

                <div>
                  <label htmlFor="message" className="block text-sm font-medium mb-2">
                    Message *
                  </label>
                  <Textarea
                    id="message"
                    name="message"
                    required
                    rows={6}
                    value={formData.message}
                    onChange={handleChange}
                    placeholder="Tell us more about your inquiry..."
                    className="transition-all duration-200 focus:ring-2 focus:ring-nokNuk-blue resize-none"
                  />
                </div>

                <Button
                  type="submit"
                  size="lg"
                  className="w-full bg-nokNuk-blue hover:bg-nokNuk-blue/90 transition-all duration-200 hover:scale-105"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    "Sending..."
                  ) : (
                    <>
                      <Send className="h-5 w-5 mr-2" />
                      Send Message
                    </>
                  )}
                </Button>

                <p className="text-sm text-muted-foreground text-center">
                  By sending this message, you agree to our privacy policy and terms of service.
                </p>
              </form>
            </div>
          </div>
        </div>

        {/* FAQ Section */}
        <section className="mt-20">
          <h2 className="text-3xl font-bold text-center mb-12">Frequently Asked Questions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="animate-fade-in">
              <h3 className="text-lg font-semibold mb-2">What are your shipping options?</h3>
              <p className="text-muted-foreground">
                We offer free standard shipping on orders over $100, with express shipping options available. 
                Most orders are processed within 1-2 business days.
              </p>
            </div>
            <div className="animate-fade-in" style={{ animationDelay: '0.1s' }}>
              <h3 className="text-lg font-semibold mb-2">What is your return policy?</h3>
              <p className="text-muted-foreground">
                We offer a 30-day return policy for all unused items in their original packaging. 
                Return shipping is free for defective items.
              </p>
            </div>
            <div className="animate-fade-in" style={{ animationDelay: '0.2s' }}>
              <h3 className="text-lg font-semibold mb-2">Do you offer international shipping?</h3>
              <p className="text-muted-foreground">
                Yes! We ship to over 50 countries worldwide. International shipping rates and 
                delivery times vary by destination.
              </p>
            </div>
            <div className="animate-fade-in" style={{ animationDelay: '0.3s' }}>
              <h3 className="text-lg font-semibold mb-2">How can I track my order?</h3>
              <p className="text-muted-foreground">
                Once your order ships, you'll receive a tracking number via email. You can track 
                your package using this number on our website or the carrier's site.
              </p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Contact;
