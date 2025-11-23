import { Link } from 'react-router-dom';
import { Facebook, Instagram, Twitter } from 'lucide-react';
import React from "react";

const Footer = () => {
  return (
    <footer className="bg-card border-t border-border mt-auto">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-8 h-8 bg-gradient-hero rounded-lg"></div>
              <span className="text-xl font-bold text-primary">Gloventra</span>
            </div>
            <p className="text-muted-foreground text-sm">
              Your premium destination for modern lifestyle products.
            </p>
          </div>

          <div>
            <h3 className="font-semibold mb-4 text-foreground">Shop</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/products" className="text-muted-foreground hover:text-primary transition-colors text-sm">
                  All Products
                </Link>
              </li>
              <li>
                <Link to="/electronics" className="text-muted-foreground hover:text-primary transition-colors text-sm">
                  Electronics
                </Link>
              </li>
              <li>
                <Link to="/fashion" className="text-muted-foreground hover:text-primary transition-colors text-sm">
                  Fashion
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-4 text-foreground">Support</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/contact-us" className="text-muted-foreground hover:text-primary transition-colors text-sm">
                  Contact Us
                </Link>
              </li>
              <li>
                <Link to="/faq" className="text-muted-foreground hover:text-primary transition-colors text-sm">
                  FAQ
                </Link>
              </li>
              <li>
                <Link to="/shipping-info" className="text-muted-foreground hover:text-primary transition-colors text-sm">
                  Shipping Info
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-4 text-foreground">Follow Us</h3>
            <div className="flex space-x-4">
              <a href="https://www.facebook.com" className="text-muted-foreground hover:text-primary transition-colors">
                <Facebook className="w-5 h-5" />
              </a>
              <a href="https://www.instagram.com"  className="text-muted-foreground hover:text-primary transition-colors">
                <Instagram className="w-5 h-5" />
              </a>
              <a href="https://www.x.com"  className="text-muted-foreground hover:text-primary transition-colors">
                <Twitter className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-border mt-8 pt-8 text-center text-muted-foreground text-sm">
          <p>&copy; 2024 Gloventra. All rights reserved.</p>
          <p><strong>Phone:</strong> +1 (555) 123-4567</p>
          <p className='ml-14'><strong>Email:</strong> support@gloventrashop.com</p>

        </div>
      </div>
    </footer>
  );
};

export default Footer;
