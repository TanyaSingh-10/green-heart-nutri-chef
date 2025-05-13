
import React from 'react';
import { Instagram, Youtube, Heart } from 'lucide-react';
import GreenHeartLogo from '../../assets/GreenHeartLogo';

const Footer: React.FC = () => {
  return (
    <footer className="bg-nutrition-50 pt-16 pb-8">
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          {/* Logo and Description */}
          <div className="col-span-1 md:col-span-1">
            <div className="flex items-center space-x-2 mb-4">
              <GreenHeartLogo size={32} />
              <span className="font-bold text-xl text-nutrition-600">GreenHeart</span>
            </div>
            <p className="text-gray-600 mb-4">
              Empowering you to achieve optimal health through personalized nutrition and wellness strategies.
            </p>
            <div className="flex space-x-4 text-nutrition-600">
              <a href="#" className="hover:text-nutrition-500 transition-colors">
                <Instagram size={20} />
              </a>
              <a href="#" className="hover:text-nutrition-500 transition-colors">
                <Youtube size={20} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="col-span-1">
            <h3 className="font-bold text-gray-800 mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li><a href="#about" className="text-gray-600 hover:text-nutrition-600 transition-colors">About</a></li>
              <li><a href="#services" className="text-gray-600 hover:text-nutrition-600 transition-colors">Services</a></li>
              <li><a href="#testimonials" className="text-gray-600 hover:text-nutrition-600 transition-colors">Testimonials</a></li>
              <li><a href="#blog" className="text-gray-600 hover:text-nutrition-600 transition-colors">Blog</a></li>
            </ul>
          </div>

          {/* Services */}
          <div className="col-span-1">
            <h3 className="font-bold text-gray-800 mb-4">Services</h3>
            <ul className="space-y-2">
              <li><a href="#" className="text-gray-600 hover:text-nutrition-600 transition-colors">Detox Programs</a></li>
              <li><a href="#" className="text-gray-600 hover:text-nutrition-600 transition-colors">Nutrition Coaching</a></li>
              <li><a href="#" className="text-gray-600 hover:text-nutrition-600 transition-colors">Custom Diet Plans</a></li>
              <li><a href="#" className="text-gray-600 hover:text-nutrition-600 transition-colors">Corporate Wellness</a></li>
            </ul>
          </div>

          {/* Contact */}
          <div className="col-span-1">
            <h3 className="font-bold text-gray-800 mb-4">Contact</h3>
            <ul className="space-y-2">
              <li className="text-gray-600">email@greenheartnutrition.com</li>
              <li className="text-gray-600">+1 (555) 123-4567</li>
              <li className="text-gray-600">123 Wellness Street, Healthy City</li>
            </ul>
          </div>
        </div>

        {/* Bottom Footer */}
        <div className="pt-8 border-t border-gray-200">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-600 text-sm mb-4 md:mb-0">
              © {new Date().getFullYear()} GreenHeart Nutrition. All rights reserved.
            </p>
            <div className="flex items-center text-sm text-gray-600">
              <a href="#" className="hover:text-nutrition-600 transition-colors mr-6">Privacy Policy</a>
              <a href="#" className="hover:text-nutrition-600 transition-colors mr-6">Terms of Service</a>
              <span className="flex items-center">
                Made with <Heart size={14} className="mx-1 text-nutrition-600" /> by GreenHeart Team
              </span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
