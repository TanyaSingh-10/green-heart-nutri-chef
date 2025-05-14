
import React, { useState } from 'react';
import SectionHeading from '../ui/SectionHeading';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Mail, Phone, MapPin } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const ContactSection: React.FC = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [message, setMessage] = useState('');
  const [newsletter, setNewsletter] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "Message sent!",
      description: "We'll get back to you as soon as possible.",
    });
    setName('');
    setEmail('');
    setMessage('');
  };

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "Subscribed!",
      description: "You've been added to our newsletter.",
    });
    setNewsletter('');
  };

  const handleBookConsultation = () => {
    toast({
      title: "Consultation Request Received",
      description: "Our team will contact you to schedule your consultation.",
    });
    navigate('/auth');
  };

  return (
    <section id="contact" className="py-20">
      <div className="container mx-auto px-4 md:px-6">
        <SectionHeading 
          label="Contact" 
          heading="Let's get in touch" 
          subheading="Start your healthy journey today" 
          centered
        />

        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Contact Form */}
            <div className="bg-white rounded-xl shadow-lg p-8">
              <h3 className="text-xl font-semibold text-gray-800 mb-6">Send us a message</h3>
              <form onSubmit={handleSubmit}>
                <div className="space-y-4">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                      Name
                    </label>
                    <Input
                      id="name"
                      type="text"
                      placeholder="Your name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                      className="w-full"
                    />
                  </div>
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                      Email
                    </label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="Your email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="w-full"
                    />
                  </div>
                  <div>
                    <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
                      Message
                    </label>
                    <Textarea
                      id="message"
                      placeholder="How can we help you?"
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      required
                      className="w-full h-32"
                    />
                  </div>
                  <Button 
                    type="submit" 
                    className="w-full bg-nutrition-600 hover:bg-nutrition-700 text-white"
                  >
                    Send Message
                  </Button>
                </div>
              </form>
            </div>

            {/* Contact Info and Newsletter */}
            <div className="flex flex-col">
              {/* Contact Info */}
              <div className="bg-nutrition-50 rounded-xl p-8 mb-8">
                <h3 className="text-xl font-semibold text-gray-800 mb-6">Contact Information</h3>
                <div className="space-y-4">
                  <div className="flex items-start">
                    <Mail className="h-5 w-5 text-nutrition-600 mt-0.5 mr-3 flex-shrink-0" />
                    <div>
                      <p className="text-sm font-medium text-gray-500 mb-1">Email</p>
                      <p className="text-gray-700">contact@nutrichef.com</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <Phone className="h-5 w-5 text-nutrition-600 mt-0.5 mr-3 flex-shrink-0" />
                    <div>
                      <p className="text-sm font-medium text-gray-500 mb-1">Phone</p>
                      <p className="text-gray-700">+1 (555) 123-4567</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <MapPin className="h-5 w-5 text-nutrition-600 mt-0.5 mr-3 flex-shrink-0" />
                    <div>
                      <p className="text-sm font-medium text-gray-500 mb-1">Address</p>
                      <p className="text-gray-700">123 Wellness Street<br />Healthy City, HC 12345</p>
                    </div>
                  </div>
                </div>
                <div className="mt-8">
                  <Button 
                    className="w-full bg-nutrition-600 hover:bg-nutrition-700 text-white"
                    onClick={handleBookConsultation}
                  >
                    Book a Free Consultation
                  </Button>
                </div>
              </div>

              {/* Newsletter */}
              <div className="bg-nutrition-600 text-white rounded-xl p-8">
                <h3 className="text-xl font-semibold mb-4 font-sans tracking-wide">Subscribe to Our Newsletter</h3>
                <p className="mb-6 text-white font-medium">Get the latest nutrition tips, recipes, and updates delivered to your inbox.</p>
                <form onSubmit={handleNewsletterSubmit} className="space-y-4 md:space-y-0">
                  <div className="flex flex-col sm:flex-row gap-3">
                    <Input
                      type="email"
                      placeholder="Your email address"
                      value={newsletter}
                      onChange={(e) => setNewsletter(e.target.value)}
                      required
                      className="flex-grow bg-nutrition-500 text-white placeholder:text-nutrition-100 border-nutrition-500"
                    />
                    <Button 
                      type="submit" 
                      className="bg-white text-nutrition-600 hover:bg-nutrition-100 font-medium"
                    >
                      Subscribe
                    </Button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
