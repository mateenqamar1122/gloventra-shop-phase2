import React from 'react';
import { Truck, Zap, Clock, Globe, Shield, Package, MapPin, CheckCircle } from 'lucide-react';

// Add CSS for continuous scrolling animation
const scrollAnimationStyles = `
  @keyframes scroll {
    0% {
      transform: translateX(0);
    }
    100% {
      transform: translateX(-100%);
    }
  }
  
  .animate-scroll {
    animation: scroll 30s linear infinite;
    width: calc(200% + 4rem);
  }
  
  .animate-scroll:hover {
    animation-play-state: paused;
  }
`;

// Inject styles
if (typeof document !== 'undefined' && !document.getElementById('scroll-animation-styles')) {
  const styleElement = document.createElement('style');
  styleElement.id = 'scroll-animation-styles';
  styleElement.textContent = scrollAnimationStyles;
  document.head.appendChild(styleElement);
}

const ShippingInfo = () => {
  const logisticsPartners = [
    { name: 'FedEx', logo: '/Fedex.png' },
    { name: 'UPS', logo: '/USPs.png' },
    { name: 'DHL', logo: '/Dhl.png' },
    { name: 'USPS', logo: '/USPs.png' },
    { name: 'Amazon Logistics', logo: '/Amazon logistics .png' },
    { name: 'Canada Post', logo: '/Canaada post .png' },
    { name: 'Royal Mail', logo: '/Royal mail .png' },
    { name: 'TNT', logo: '/TNT.png' }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section>



        {/* Decorative Elements */}

      </section>

      {/* Logistics Partners Carousel */}
      <section className="">
        <div className="container mx-auto px-4 max-w-6xl mb-8">
          <h2 className="text-5xl font-bold text-center text-foreground mb-2 mt-7">Trusted Logistics Partners</h2>
          <p className="text-center text-muted-foreground">Working with industry leaders to deliver excellence</p>
        </div>

        {/* Continuous Scrolling Carousel */}
        <div className="relative">
          <div className="flex animate-scroll">
            {[...logisticsPartners, ...logisticsPartners].map((partner, index) => (
              <div key={index} className="flex-shrink-0 mx-8 flex items-center justify-center">
                <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 min-w-[180px] text-center border border-gray-200 dark:border-gray-700">
                  <div className="flex items-center justify-center mb-2 h-12">
                    <img 
                      src={partner.logo} 
                      alt={`${partner.name} logo`}
                      className="max-h-full max-w-full object-contain"
                    />
                  </div>
                  <div className="text-sm font-medium text-foreground">{partner.name}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 max-w-6xl py-16">

        <div className="space-y-16">
          {/* Domestic Shipping */}
          <section>
            <div className="text-center mb-12">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-primary/10 rounded-full mb-6">
                <MapPin className="w-6 h-6 text-primary" />
              </div>
              <h2 className="text-4xl font-bold mb-4 text-foreground">Domestic Shipping</h2>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                Fast, reliable delivery options within your country with real-time tracking
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="group bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-200 dark:border-gray-700 hover:border-primary/20 hover:scale-105">
                <div className="flex items-center mb-4">
                  <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-full mr-4">
                    <Package className="w-6 h-6 text-green-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-foreground">Standard Shipping</h3>
                </div>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Cost:</span>
                    <span className="font-semibold text-foreground">$5.99</span>
                  </div>
                  <div className="text-sm text-green-600 font-medium">FREE for orders over $50</div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Delivery:</span>
                    <span className="font-semibold text-foreground">5-7 days</span>
                  </div>
                  <p className="text-sm text-muted-foreground mt-4">
                    Reliable and cost-effective option for non-urgent deliveries with full tracking.
                  </p>
                </div>
              </div>

              <div className="group bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-200 dark:border-gray-700 hover:border-primary/20 hover:scale-105">
                <div className="flex items-center mb-4">
                  <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-full mr-4">
                    <Zap className="w-6 h-6 text-blue-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-foreground">Express Shipping</h3>
                </div>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Cost:</span>
                    <span className="font-semibold text-foreground">$12.99</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Delivery:</span>
                    <span className="font-semibold text-foreground">2-3 days</span>
                  </div>
                  <div className="text-sm text-blue-600 font-medium">Priority handling</div>
                  <p className="text-sm text-muted-foreground mt-4">
                    Faster delivery for when you need your items sooner with premium tracking.
                  </p>
                </div>
              </div>

              <div className="group bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-200 dark:border-gray-700 hover:border-primary/20 hover:scale-105">
                <div className="flex items-center mb-4">
                  <div className="p-3 bg-purple-100 dark:bg-purple-900/30 rounded-full mr-4">
                    <Clock className="w-6 h-6 text-purple-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-foreground">Overnight Shipping</h3>
                </div>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Cost:</span>
                    <span className="font-semibold text-foreground">$24.99</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Delivery:</span>
                    <span className="font-semibold text-foreground">Next day</span>
                  </div>
                  <div className="text-sm text-purple-600 font-medium">Order before 2 PM EST</div>
                  <p className="text-sm text-muted-foreground mt-4">
                    Our fastest option for urgent deliveries with live tracking updates.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* International Shipping */}
          <section>
            <div className="text-center mb-12">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-primary/10 rounded-full mb-6">
                <Globe className="w-6 h-6 text-primary" />
              </div>
              <h2 className="text-4xl font-bold mb-4 text-foreground">International Shipping</h2>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                Worldwide delivery to 180+ countries with customs handling and tracking
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-gray-800 dark:to-gray-900 p-8 rounded-2xl border border-blue-200 dark:border-gray-700">
                <div className="flex items-center mb-6">
                  <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-full mr-4">
                    <Globe className="w-6 h-6 text-blue-600" />
                  </div>
                  <h3 className="text-2xl font-semibold text-foreground">International Standard</h3>
                </div>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Pricing:</span>
                    <span className="font-semibold text-foreground">Varies by destination</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Delivery Time:</span>
                    <span className="font-semibold text-foreground">7-21 business days</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Tracking:</span>
                    <span className="font-semibold text-green-600">✓ Full tracking</span>
                  </div>
                  <div className="bg-white/50 dark:bg-gray-800/50 p-4 rounded-lg">
                    <p className="text-sm text-muted-foreground">
                      Customs duties and taxes may apply and are the responsibility of the recipient.
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700">
                <h3 className="text-xl font-semibold mb-6 text-foreground">Shipping Coverage</h3>
                <div className="space-y-4">
                  <div className="flex items-center">
                    <CheckCircle className="w-5 h-5 text-green-500 mr-3" />
                    <span className="text-foreground">North America (2-5 days)</span>
                  </div>
                  <div className="flex items-center">
                    <CheckCircle className="w-5 h-5 text-green-500 mr-3" />
                    <span className="text-foreground">Europe (5-10 days)</span>
                  </div>
                  <div className="flex items-center">
                    <CheckCircle className="w-5 h-5 text-green-500 mr-3" />
                    <span className="text-foreground">Asia Pacific (7-14 days)</span>
                  </div>
                  <div className="flex items-center">
                    <CheckCircle className="w-5 h-5 text-green-500 mr-3" />
                    <span className="text-foreground">Rest of World (10-21 days)</span>
                  </div>
                </div>
                <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                  <p className="text-sm text-blue-700 dark:text-blue-300">
                    <Shield className="w-4 h-4 inline mr-2" />
                    All international shipments include insurance up to $1000
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Important Information */}
          <section>
            <div className="text-center mb-12">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-primary/10 rounded-full mb-6">
                <Shield className="w-6 h-6 text-primary" />
              </div>
              <h2 className="text-4xl font-bold mb-4 text-foreground">Shipping Guidelines</h2>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                Important information to ensure smooth delivery of your orders
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0 w-8 h-8 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground mb-2">Order Processing</h3>
                    <p className="text-muted-foreground">Orders are typically processed within 1-2 business days before shipping.</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0 w-8 h-8 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center">
                    <Clock className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground mb-2">Delivery Estimates</h3>
                    <p className="text-muted-foreground">Delivery times are estimates and may vary due to weather, customs delays, or other circumstances.</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0 w-8 h-8 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center">
                    <Package className="w-5 h-5 text-purple-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground mb-2">Tracking Information</h3>
                    <p className="text-muted-foreground">You'll receive a shipping confirmation email with tracking details once your order is dispatched.</p>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-primary/5 to-purple-500/5 p-8 rounded-2xl border border-primary/10">
                <h3 className="text-xl font-semibold mb-4 text-foreground flex items-center">
                  <Shield className="w-5 h-5 mr-2 text-primary" />
                  Our Shipping Promise
                </h3>
                <ul className="space-y-3">
                  <li className="flex items-center text-muted-foreground">
                    <CheckCircle className="w-4 h-4 text-green-500 mr-3" />
                    Secure packaging for all items
                  </li>
                  <li className="flex items-center text-muted-foreground">
                    <CheckCircle className="w-4 h-4 text-green-500 mr-3" />
                    Real-time tracking updates
                  </li>
                  <li className="flex items-center text-muted-foreground">
                    <CheckCircle className="w-4 h-4 text-green-500 mr-3" />
                    Insurance on all shipments
                  </li>
                  <li className="flex items-center text-muted-foreground">
                    <CheckCircle className="w-4 h-4 text-green-500 mr-3" />
                    24/7 customer support
                  </li>
                </ul>
                <div className="mt-6 p-4 bg-white/50 dark:bg-gray-800/50 rounded-lg">
                  <p className="text-sm text-muted-foreground text-center">
                    Need help? Contact our support team for any shipping-related inquiries.
                  </p>
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default ShippingInfo;