import { Link } from 'react-router-dom';
import { ShoppingCart, User, Search, Menu, Building2 } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { useB2B } from '@/context/B2BContext';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useState } from 'react';
import CurrencySelector from '@/features/phase2/currency/CurrencySelector';

const Navbar = () => {
  const { isB2BUser } = useB2B();
  const { getCartCount } = useCart();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const cartCount = getCartCount();

  return (
    <nav className="sticky top-0 z-50 bg-card/95 border-b border-border shadow-sm backdrop-blur-sm">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center space-x-2">
            {/* <div className="w-8 h-8 bg-gradient-hero rounded-lg"></div> */}
            <img src="/brandlogo.png" alt="Gloventra Logo" className="h-8 w-auto" />
            <span className="text-2xl font-bold text-primary">Gloventra</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link to="/" className="text-foreground hover:text-primary transition-colors">
              Home
            </Link>
            <Link to="/products" className="text-foreground hover:text-primary transition-colors">
              Products
            </Link>
            <Link to="/about" className="text-foreground hover:text-primary transition-colors">
              About
            </Link>
            <Link to="/marketplace" className="text-foreground hover:text-primary transition-colors">
            {isB2BUser && (
              <Link to="/bulk-order" className="text-foreground hover:text-primary transition-colors flex items-center gap-1">
                <Building2 className="w-4 h-4" />
                Bulk Order
              </Link>
            )}
              Marketplace
            </Link>
          </div>

          {/* Search Bar */}
          <div className="hidden md:flex items-center flex-1 max-w-md mx-8">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <input
                type="text"
                placeholder="Search products..."
                className="w-full pl-10 pr-4 py-2 rounded-2xl border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/20"
              />
            </div>
          </div>

          {/* Right Actions */}
          <div className="flex items-center space-x-4">
            <div className="hidden md:block">
              <CurrencySelector />
            </div>
            <Link to="/dashboard">
              <Button variant="ghost" size="icon" className="relative">
                <User className="w-5 h-5" />
              </Button>
            </Link>
            <Link to="/cart">
              <Button variant="ghost" size="icon" className="relative">
                <ShoppingCart className="w-5 h-5" />
                {cartCount > 0 && (
                  <Badge className="absolute -top-1 -right-1 bg-accent text-accent-foreground h-5 w-5 flex items-center justify-center p-0 text-xs">
                    {cartCount}
                  </Badge>
                )}
              </Button>
            </Link>
            <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
              <Menu className="w-5 h-5" />
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-border animate-fade-in">
            <div className="flex flex-col space-y-4">
              <div className="px-2">
                <CurrencySelector />
              </div>
              <Link to="/" className="text-foreground hover:text-primary transition-colors" onClick={() => setMobileMenuOpen(false)}>
                Home
              </Link>
              <Link to="/products" className="text-foreground hover:text-primary transition-colors" onClick={() => setMobileMenuOpen(false)}>
              {isB2BUser && (
                <Link to="/bulk-order" className="text-foreground hover:text-primary transition-colors flex items-center gap-2" onClick={() => setMobileMenuOpen(false)}>
                  <Building2 className="w-4 h-4" />
                  Bulk Order
                </Link>
              )}
                Products
              </Link>
              <Link to="/about" className="text-foreground hover:text-primary transition-colors" onClick={() => setMobileMenuOpen(false)}>
                About
              </Link>
              <Link to="/marketplace" className="text-foreground hover:text-primary transition-colors" onClick={() => setMobileMenuOpen(false)}>
                Marketplace
              </Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
