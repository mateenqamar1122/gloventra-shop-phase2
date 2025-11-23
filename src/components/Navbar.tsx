import { Link, useNavigate } from 'react-router-dom';
import { ShoppingCart, User, Search, Menu, Building2, ChevronDown, Laptop, Shirt, Home, Gamepad, Watch, BookOpen, Car, Heart } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { useB2B } from '@/context/B2BContext';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

import { useState } from 'react';
import CurrencySelector from '@/features/phase2/currency/CurrencySelector';
import { useSearch } from '@/hooks/useSearch';

const Navbar = () => {
  const { isB2BUser } = useB2B();
  const { getCartCount } = useCart();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [mobileSearchQuery, setMobileSearchQuery] = useState('');
  const [showProductsDropdown, setShowProductsDropdown] = useState(false);
  const [dropdownTimeout, setDropdownTimeout] = useState<NodeJS.Timeout | null>(null);
  const cartCount = getCartCount();

  // Product categories for dropdown
  const productCategories = [
    { name: 'Electronics', icon: Laptop, description: 'Gadgets & Tech' },
    { name: 'Fashion', icon: Shirt, description: 'Clothing & Accessories' },
    { name: 'Home & Garden', icon: Home, description: 'Home Decor & Tools' },
    { name: 'Sports & Outdoors', icon: Gamepad, description: 'Fitness & Recreation' },
    { name: 'Watches', icon: Watch, description: 'Timepieces & Jewelry' },
    { name: 'Books & Media', icon: BookOpen, description: 'Literature & Entertainment' },
    { name: 'Automotive', icon: Car, description: 'Car Parts & Accessories' },
    { name: 'Health & Beauty', icon: Heart, description: 'Wellness & Skincare' },
  ];

  const { addRecentSearch } = useSearch();

  const handleDropdownEnter = () => {
    if (dropdownTimeout) {
      clearTimeout(dropdownTimeout);
      setDropdownTimeout(null);
    }
    setShowProductsDropdown(true);
  };

  const handleDropdownLeave = () => {
    const timeout = setTimeout(() => {
      setShowProductsDropdown(false);
    }, 150);
    setDropdownTimeout(timeout);
  };

  const handleSearch = (query: string) => {
    if (query.trim()) {
      addRecentSearch(query.trim());
      navigate(`/products?search=${encodeURIComponent(query.trim())}`);
      setSearchQuery('');
      setMobileSearchQuery('');
      setMobileMenuOpen(false);
    }
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSearch(searchQuery);
  };

  const handleMobileSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSearch(mobileSearchQuery);
  };

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
            {/* Products Dropdown */}
            <div
              className="relative group"
              onMouseEnter={handleDropdownEnter}
              onMouseLeave={handleDropdownLeave}
            >
              <Button variant="ghost" className="flex items-center gap-1 text-foreground hover:text-foreground hover:bg-transparent transition-colors p-2">
                Products
                <ChevronDown className="w-4 h-4" />
              </Button>

              {/* Invisible bridge area to prevent dropdown from closing */}
              {showProductsDropdown && (
                <div className="absolute top-full left-0 w-64 h-2 bg-transparent z-40"></div>
              )}

              {/* Dropdown Content */}
              {showProductsDropdown && (
                <div
                  className="absolute top-full left-0 mt-2 w-64 bg-white/90 dark:bg-gray-900/90 backdrop-blur-md border border-gray-200/50 dark:border-gray-700/50 rounded-xl shadow-2xl z-50 overflow-hidden transform opacity-100 scale-100 transition-all duration-300 ease-out animate-in fade-in slide-in-from-top-2 p-2"
                  onMouseEnter={handleDropdownEnter}
                  onMouseLeave={handleDropdownLeave}
                >
                  <div className="px-2 py-2 text-sm font-semibold text-muted-foreground border-b border-gray-200 dark:border-gray-600 mb-2">
                    Shop by Category
                  </div>

                  {/* All Products */}
                  <Link to="/products" className="flex items-center gap-3 p-3 text-gray-700 dark:text-gray-300 hover:bg-white/80 dark:hover:bg-gray-800/80 rounded-lg transition-all duration-200 hover:shadow-sm border border-transparent">
                    <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                      <Search className="w-4 h-4 text-primary" />
                    </div>
                    <div>
                      <div className="font-medium">All Products</div>
                      <div className="text-xs text-muted-foreground">Browse everything</div>
                    </div>
                  </Link>

                  <div className="border-b border-gray-200 dark:border-gray-600 my-2"></div>

                  {/* Category Items */}
                  {productCategories.map((category) => {
                    const IconComponent = category.icon;
                    return (
                      <Link
                        key={category.name}
                        to={`/products?category=${encodeURIComponent(category.name.toLowerCase())}`}
                        className="flex items-center gap-3 p-3 text-gray-700 dark:text-gray-300 hover:bg-white/80 dark:hover:bg-gray-800/80 rounded-lg transition-all duration-200 hover:shadow-sm border border-transparent"
                      >
                        <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                          <IconComponent className="w-4 h-4 text-primary" />
                        </div>
                        <div>
                          <div className="font-medium">{category.name}</div>
                          <div className="text-xs text-muted-foreground">{category.description}</div>
                        </div>
                      </Link>
                    );
                  })}
                </div>
              )}
            </div>

            <Link to="/about" className="text-foreground hover:text-primary transition-colors">
              About
            </Link>
            <Link to="/marketplace" className="text-foreground hover:text-primary transition-colors">
              Marketplace
            </Link>
            {isB2BUser && (
              <Link to="/bulk-order" className="text-foreground hover:text-primary transition-colors flex items-center gap-1">
                <Building2 className="w-4 h-4" />
                Bulk Order
              </Link>
            )}
          </div>

          {/* Search Bar */}
          <div className="hidden md:flex items-center flex-1 max-w-md mx-8">
            <form onSubmit={handleSearchSubmit} className="relative w-full">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <input
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-12 py-2 rounded-2xl border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/20"
              />
              <Button
                type="submit"
                variant="ghost"
                size="sm"
                className="absolute right-1 top-1/2 transform -translate-y-1/2 h-8 px-2"
              >
              </Button>
            </form>
          </div>

          {/* Right Actions */}
          <div className="flex items-center space-x-4">
            <div className="hidden md:block">
              <CurrencySelector />
            </div>
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
            <Link to="/dashboard">
              <Button variant="ghost" size="icon" className="relative">
                <User className="w-5 h-5" />
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
              {/* Mobile Search */}
              <div className="px-2">
                <form onSubmit={handleMobileSearchSubmit} className="relative">
                  <Search className="absolute left-5 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                  <input
                    type="text"
                    placeholder="Search products..."
                    value={mobileSearchQuery}
                    onChange={(e) => setMobileSearchQuery(e.target.value)}
                    className="w-full pl-12 pr-12 py-2 rounded-2xl border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/20"
                  />
                  <Button
                    type="submit"
                    variant="ghost"
                    size="sm"
                    className="absolute right-1 top-1/2 transform -translate-y-1/2 h-8 px-2"
                  >
                    <Search className="w-4 h-4" />
                  </Button>
                </form>
              </div>
              <Link to="/" className="text-foreground hover:text-primary transition-colors" onClick={() => setMobileMenuOpen(false)}>
                Home
              </Link>
              <Link to="/products" className="text-foreground hover:text-primary transition-colors" onClick={() => setMobileMenuOpen(false)}>
                Products
              </Link>
              <Link to="/about" className="text-foreground hover:text-primary transition-colors" onClick={() => setMobileMenuOpen(false)}>
                About
              </Link>
              <Link to="/marketplace" className="text-foreground hover:text-primary transition-colors" onClick={() => setMobileMenuOpen(false)}>
                Marketplace
              </Link>
              {isB2BUser && (
                <Link to="/bulk-order" className="text-foreground hover:text-primary transition-colors flex items-center gap-2" onClick={() => setMobileMenuOpen(false)}>
                  <Building2 className="w-4 h-4" />
                  Bulk Order
                </Link>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
