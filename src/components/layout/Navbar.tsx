
import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";
import { useAuth } from '@/contexts/AuthContext';
import NutriChefLogo from '@/assets/NutriChefLogo';

const Navbar = () => {
  const { user, signOut } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const isActive = (path: string) => {
    return location.pathname === path;
  };
  
  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  const navLinks = [
    { name: "Home", path: "/" },
    ...(user ? [
      { name: "Dashboard", path: "/dashboard" },
      { name: "Preferences", path: "/preferences" },
      { name: "Recipe Generator", path: "/recipe-generator" },
      { name: "My Recipes", path: "/saved-recipes" },
    ] : []),
  ];

  return (
    <nav className="bg-white shadow-sm">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <NutriChefLogo />
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            <div className="flex items-center gap-6">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`text-base hover:text-nutrition-600 transition-colors ${
                    isActive(link.path) ? 'font-medium text-nutrition-600' : 'text-gray-600'
                  }`}
                >
                  {link.name}
                </Link>
              ))}
            </div>
            
            {user ? (
              <div className="flex items-center gap-4">
                <Button
                  onClick={handleSignOut}
                  variant="outline"
                  className="border-nutrition-600 text-nutrition-600 hover:bg-nutrition-50"
                >
                  Sign Out
                </Button>
              </div>
            ) : (
              <div className="flex items-center gap-4">
                <Link to="/auth">
                  <Button variant="outline" className="border-nutrition-600 text-nutrition-600 hover:bg-nutrition-50">
                    Sign In
                  </Button>
                </Link>
                <Link to="/auth">
                  <Button className="bg-nutrition-600 hover:bg-nutrition-700 text-white">
                    Sign Up
                  </Button>
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden border-t mt-3 py-2">
            <div className="flex flex-col gap-2">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`py-2 px-4 rounded-md ${
                    isActive(link.path)
                      ? 'bg-nutrition-50 text-nutrition-600 font-medium'
                      : 'text-gray-600 hover:bg-gray-50'
                  }`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  {link.name}
                </Link>
              ))}
              
              {user ? (
                <Button
                  onClick={() => {
                    handleSignOut();
                    setIsMenuOpen(false);
                  }}
                  variant="outline"
                  className="mt-2 border-nutrition-600 text-nutrition-600 hover:bg-nutrition-50"
                >
                  Sign Out
                </Button>
              ) : (
                <>
                  <Link to="/auth" onClick={() => setIsMenuOpen(false)}>
                    <Button
                      variant="outline"
                      className="w-full mt-2 border-nutrition-600 text-nutrition-600 hover:bg-nutrition-50"
                    >
                      Sign In
                    </Button>
                  </Link>
                  <Link to="/auth" onClick={() => setIsMenuOpen(false)}>
                    <Button className="w-full mt-2 bg-nutrition-600 hover:bg-nutrition-700 text-white">
                      Sign Up
                    </Button>
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
