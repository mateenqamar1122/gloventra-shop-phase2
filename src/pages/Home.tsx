import { Link, useNavigate } from 'react-router-dom';
import { ArrowRight, Package, Truck, Shield, Search } from 'lucide-react';
import ProductCard from '@/components/ProductCard';
import { Button } from '@/components/ui/button';
import { mockProducts } from '@/data/mockProducts';
import heroBanner from '@/assets/hero-banner.jpg';
import { useState, useEffect } from 'react';

const Home = () => {
  const navigate = useNavigate();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isSliding, setIsSliding] = useState(false);
  const [heroSearchQuery, setHeroSearchQuery] = useState('');
  const productsPerPage = 4;
  const totalProducts = mockProducts.length;

  const handleHeroSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (heroSearchQuery.trim()) {
      navigate(`/products?search=${encodeURIComponent(heroSearchQuery.trim())}`);
    }
  };

  const getCurrentProducts = () => {
    const startIndex = currentIndex;
    const endIndex = startIndex + productsPerPage;

    if (endIndex <= totalProducts) {
      return mockProducts.slice(startIndex, endIndex);
    } else {
      // Loop back to beginning if we've reached the end
      const remainingFromEnd = mockProducts.slice(startIndex);
      const fromStart = mockProducts.slice(0, endIndex - totalProducts);
      return [...remainingFromEnd, ...fromStart];
    }
  };

  const [featuredProducts, setFeaturedProducts] = useState(getCurrentProducts());

  const handleSlideNext = () => {
    if (isSliding) return;

    setIsSliding(true);

    // Calculate next index
    const nextIndex = (currentIndex + productsPerPage) % totalProducts;
    setCurrentIndex(nextIndex);

    // Reset sliding state after animation
    setTimeout(() => {
      setIsSliding(false);
    }, 500);
  };

  useEffect(() => {
    setFeaturedProducts(getCurrentProducts());
  }, [currentIndex]);

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative h-[700px] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <img src={heroBanner} alt="Hero" className="w-full h-full object-cover scale-105 animate-slow-zoom" />
          <div className="absolute inset-0 bg-gradient-to-br from-black/70 via-black/50 to-transparent"></div>
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent"></div>
        </div>
        
        <div className="relative z-10 container mx-auto px-4 text-center text-white">
          <div className="max-w-5xl mx-auto">
            <h1 className="text-6xl md:text-8xl font-extrabold mb-6 tracking-tight animate-fade-in bg-clip-text text-transparent bg-gradient-to-r from-white via-white to-gray-300">
              Discover Your World
            </h1>
            <p className="text-xl md:text-2xl mb-8 font-light text-white/95 max-w-3xl mx-auto animate-fade-in leading-relaxed">
              Experience the pinnacle of luxury and innovation. Premium products that elevate your everyday lifestyle with unparalleled elegance and sophistication.
            </p>

            {/* Hero Search Bar */}
            <div className="max-w-2xl mx-auto mb-10 animate-fade-in">
              <form onSubmit={handleHeroSearch} className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search for products..."
                  value={heroSearchQuery}
                  onChange={(e) => setHeroSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-white/30 focus:border-transparent text-lg"
                />
                <Button
                  type="submit"
                  className="absolute right-2 top-2 bg-white/20 hover:bg-white/30 text-white border-0 rounded-xl px-6 py-2 transition-all duration-200"
                >
                  Search
                </Button>
              </form>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center animate-scale-in">
              <Link to="/products">
                <Button size="lg" className="bg-white hover:bg-white/95 text-gray-900 rounded-full px-12 py-6 text-lg font-semibold shadow-2xl transition-all duration-300 ease-in-out transform hover:-translate-y-1 hover:scale-105 hover:shadow-white/20">
                  Shop Now
                  <ArrowRight className="ml-3 w-5 h-5" />
                </Button>
              </Link>
              <Link to="/b2b-register">
                <Button size="lg" variant="outline" className="bg-transparent hover:bg-white/10 text-white border-2 border-white/80 rounded-full px-12 py-6 text-lg font-semibold shadow-xl transition-all duration-300 ease-in-out transform hover:-translate-y-1 hover:scale-105 backdrop-blur-sm">
                  B2B Solutions
                </Button>
              </Link>
            </div>
          </div>
        </div>

        {/* Decorative elements */}
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent"></div>
      </section>

        {/* Featured Products */}
        <section className="py-16">
            <div className="container mx-auto px-4">
                <div className="flex justify-between items-center mb-8">
                    <h2 className="text-3xl font-bold text-foreground">Featured Products</h2>
                    <Link to="/products">
                        <Button variant="ghost" className="text-primary hover:text-primary/80">
                            View All
                            <ArrowRight className="ml-2 w-4 h-4" />
                        </Button>
                    </Link>
                </div>

                <div className="overflow-hidden">
                    <div className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 transition-all duration-500 ease-in-out ${
                        isSliding ? 'transform -translate-x-full opacity-0' : 'transform translate-x-0 opacity-100'
                    }`}>
                        {featuredProducts.map((product, index) => (
                            <div
                                key={`${product.id}-${currentIndex}-${index}`}
                                className={`transition-all duration-500 ease-in-out ${
                                    isSliding ? 'transform translate-x-8 opacity-0' : 'transform translate-x-0 opacity-100'
                                }`}
                                style={{ transitionDelay: `${index * 100}ms` }}
                            >
                                <ProductCard product={product} />
                            </div>
                        ))}
                    </div>
                </div>

                {/* Circular Arrow Button to Show More Products */}
                <div className="flex justify-center mt-12">
                    <div className="group relative">
                        <button
                            onClick={handleSlideNext}
                            disabled={isSliding}
                            className="w-16 h-16 bg-primary rounded-full flex items-center justify-center shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-110 hover:bg-primary/90 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <ArrowRight className={`w-6 h-6 text-white group-hover:translate-x-1 transition-transform duration-300 ${
                                isSliding ? 'animate-pulse' : ''
                            }`} />
                        </button>
                        <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                            <span className="text-sm text-muted-foreground whitespace-nowrap">
                                {isSliding ? 'Loading...' : 'Next Products'}
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </section>

      {/* Features Section */}
      <section className="py-16 bg-card">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="flex flex-col items-center text-center p-6 rounded-2xl bg-gradient-card animate-fade-in">
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                <Package className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2 text-foreground">Quality Products</h3>
              <p className="text-muted-foreground">Carefully curated premium items</p>
            </div>

            <div className="flex flex-col items-center text-center p-6 rounded-2xl bg-gradient-card animate-fade-in">
              <div className="w-16 h-16 rounded-full bg-secondary/10 flex items-center justify-center mb-4">
                <Truck className="w-8 h-8 text-secondary" />
              </div>
              <h3 className="text-xl font-semibold mb-2 text-foreground">Fast Shipping</h3>
              <p className="text-muted-foreground">Free delivery on orders over $100</p>
            </div>

            <div className="flex flex-col items-center text-center p-6 rounded-2xl bg-gradient-card animate-fade-in">
              <div className="w-16 h-16 rounded-full bg-accent/10 flex items-center justify-center mb-4">
                <Shield className="w-8 h-8 text-accent" />
              </div>
              <h3 className="text-xl font-semibold mb-2 text-foreground">Secure Payment</h3>
              <p className="text-muted-foreground">100% secure transactions</p>
            </div>
          </div>
        </div>
      </section>



      {/* CTA Section */}
      <section className="py-20 bg-gradient-hero text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-4">Join Our Community</h2>
          <p className="text-xl mb-8 text-white/90">Sign up for exclusive deals and updates</p>
          <Link to="/signup">
            <Button size="lg" className="bg-accent hover:bg-accent/90 text-accent-foreground rounded-full px-8">
              Get Started
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Home;
