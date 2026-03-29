import React from 'react';
import { Link } from 'react-router-dom';
import { Facebook, Twitter, Instagram, Mail, MapPin } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="border-t bg-muted/30 mt-20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div>
            <h3 className="font-bold text-lg mb-4">Sri Ganesh Battery Center</h3>
            <p className="text-sm text-muted-foreground leading-relaxed mb-3">
              Your trusted store for all types of batteries — car, bike, inverter, UPS, solar, and more.
            </p>
            <div className="flex items-start gap-2 text-sm text-muted-foreground">
              <MapPin className="w-4 h-4 mt-0.5 shrink-0" />
              <span>G44F+9CP, CC Road, near SBI Bank, Polur, Tamil Nadu 606803</span>
            </div>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Quick Links</h4>
            <div className="flex flex-col gap-2">
              <Link to="/" className="text-sm text-muted-foreground hover:text-primary transition-colors duration-200">
                Home
              </Link>
              <Link to="/products" className="text-sm text-muted-foreground hover:text-primary transition-colors duration-200">
                Products
              </Link>
              <Link to="/cart" className="text-sm text-muted-foreground hover:text-primary transition-colors duration-200">
                Cart
              </Link>
            </div>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Customer Service</h4>
            <div className="flex flex-col gap-2">
              <Link to="#" className="text-sm text-muted-foreground hover:text-primary transition-colors duration-200">
                Contact Us
              </Link>
              <Link to="#" className="text-sm text-muted-foreground hover:text-primary transition-colors duration-200">
                Shipping Info
              </Link>
              <Link to="#" className="text-sm text-muted-foreground hover:text-primary transition-colors duration-200">
                Returns
              </Link>
            </div>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Connect With Us</h4>
            <div className="flex gap-3">
              <a href="#" className="w-9 h-9 rounded-lg bg-muted flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-all duration-200">
                <Facebook className="w-4 h-4" />
              </a>
              <a href="#" className="w-9 h-9 rounded-lg bg-muted flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-all duration-200">
                <Twitter className="w-4 h-4" />
              </a>
              <a href="#" className="w-9 h-9 rounded-lg bg-muted flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-all duration-200">
                <Instagram className="w-4 h-4" />
              </a>
              <a href="#" className="w-9 h-9 rounded-lg bg-muted flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-all duration-200">
                <Mail className="w-4 h-4" />
              </a>
            </div>
          </div>
        </div>

        <div className="pt-8 border-t flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-muted-foreground">
            © 2026 Sri Ganesh Battery Center. All rights reserved.
          </p>
          <div className="flex gap-6">
            <Link to="#" className="text-sm text-muted-foreground hover:text-primary transition-colors duration-200">
              Privacy Policy
            </Link>
            <Link to="#" className="text-sm text-muted-foreground hover:text-primary transition-colors duration-200">
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;