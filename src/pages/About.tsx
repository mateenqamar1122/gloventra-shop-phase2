import React, { useEffect, useRef, useState } from 'react';
import { Award, Users, Target, Lightbulb, Heart, ShoppingBag, TrendingUp, Globe, Shield, Zap, Star } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

const About = () => {
  const [visibleSections, setVisibleSections] = useState(new Set());
  const sectionRefs = useRef({});

  // Intersection Observer for scroll animations
  useEffect(() => {
    const observers = [];

    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    };

    const handleIntersection = (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setVisibleSections(prev => new Set([...prev, entry.target.id]));
        }
      });
    };

    // Create observers for each section
    const sectionIds = ['hero', 'story', 'mission', 'values', 'team', 'cta'];
    sectionIds.forEach(id => {
      const element = document.getElementById(id);
      if (element) {
        const observer = new IntersectionObserver(handleIntersection, observerOptions);
        observer.observe(element);
        observers.push(observer);
      }
    });

    return () => {
      observers.forEach(observer => observer.disconnect());
    };
  }, []);

  const getAnimationClass = (sectionId, delay = 0) => {
    const isVisible = visibleSections.has(sectionId);
    const baseClass = "transition-all duration-1000 ease-out";
    const delayClass = delay > 0 ? `delay-[${delay}ms]` : '';

    if (isVisible) {
      return `${baseClass} ${delayClass} opacity-100 translate-y-0 translate-x-0`;
    }
    return `${baseClass} ${delayClass} opacity-0 translate-y-8`;
  };

  const getSlideAnimationClass = (sectionId, direction = 'up', delay = 0) => {
    const isVisible = visibleSections.has(sectionId);
    const baseClass = "transition-all duration-1000 ease-out";
    const delayClass = delay > 0 ? `delay-[${delay}ms]` : '';

    if (isVisible) {
      return `${baseClass} ${delayClass} opacity-100 translate-y-0 translate-x-0`;
    }

    switch (direction) {
      case 'left': return `${baseClass} ${delayClass} opacity-0 -translate-x-8`;
      case 'right': return `${baseClass} ${delayClass} opacity-0 translate-x-8`;
      case 'up': return `${baseClass} ${delayClass} opacity-0 translate-y-8`;
      default: return `${baseClass} ${delayClass} opacity-0 translate-y-8`;
    }
  };

  const stats = [
    { number: '50K+', label: 'Happy Customers', icon: Users },
    { number: '10K+', label: 'Products Sold', icon: ShoppingBag },
    { number: '99.9%', label: 'Uptime Guarantee', icon: TrendingUp },
    { number: '24/7', label: 'Customer Support', icon: Shield },
  ];

  const values = [
    {
      icon: Users,
      title: 'Customer Centricity',
      description: 'Our customers are at the core of everything we do. We listen, adapt, and strive to exceed expectations at every touchpoint.',
    },
    {
      icon: Award,
      title: 'Quality Assurance',
      description: 'We are committed to offering only the highest quality products from reputable suppliers with rigorous testing.',
    },
    {
      icon: Shield,
      title: 'Integrity',
      description: 'We operate with transparency, honesty, and ethical practices in all our dealings, building trust every day.',
    },
    {
      icon: Lightbulb,
      title: 'Innovation',
      description: 'We embrace new technologies and ideas to enhance the shopping experience and stay ahead of trends.',
    },
    {
      icon: Heart,
      title: 'Community',
      description: 'We believe in building strong relationships with our customers, partners, and employees worldwide.',
    },
    {
      icon: Zap,
      title: 'Excellence',
      description: 'We pursue excellence in every aspect of our business, from product curation to customer service.',
    },
  ];

  const team = [
    { name: 'Sarah Johnson', role: 'CEO & Founder', image: '/placeholder.svg' },
    { name: 'Michael Chen', role: 'Head of Technology', image: '/placeholder.svg' },
    { name: 'Emily Rodriguez', role: 'Customer Experience Director', image: '/placeholder.svg' },
  ];

  return (
    <div className="min-h-screen">

      <div className="container mx-auto px-4 max-w-6xl py-16">
        {/* Story Section */}
        <section id="story" className="mb-20">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className={getSlideAnimationClass('story', 'left')}>
              <div className="inline-flex items-center justify-center w-12 h-12 bg-primary/10 rounded-full mb-6 hover:bg-primary/20 transition-colors">
                <Target className="w-6 h-6 text-primary" />
              </div>
              <h2 className="text-4xl font-bold mb-6 text-foreground">Our Story</h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                Gloventra was founded with a revolutionary vision: to create a seamless and enjoyable online shopping experience that empowers customers worldwide. We believe that premium products should be accessible, and exceptional customer satisfaction should be at the heart of everything we do.
              </p>
              <p className="text-muted-foreground leading-relaxed mb-6">
                Starting as an innovative venture, we've evolved into a trusted global platform, thanks to our unwavering dedication to quality, authenticity, and customer-centricity. Our journey is powered by passion for connecting people with products they love.
              </p>
              <div className="flex items-center gap-4">
                <div className="flex -space-x-2">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="w-8 h-8 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full border-2 border-white dark:border-gray-900 flex items-center justify-center">
                      <Star className="w-3 h-3 text-white" />
                    </div>
                  ))}
                </div>
                <span className="text-sm text-muted-foreground">Trusted by thousands</span>
              </div>
            </div>
            <div className={`relative ${getSlideAnimationClass('story', 'right', 200)}`}>
              <div className="bg-gradient-to-br from-blue-100 to-purple-100 dark:from-gray-800 dark:to-gray-700 rounded-2xl p-8 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105">
                <img
                  src="/placeholder.svg"
                  alt="Our Story"
                  className="w-full h-64 object-cover rounded-xl mb-4"
                />
                <div className="text-center">
                  <h3 className="font-semibold text-foreground mb-2">Since 2020</h3>
                  <p className="text-sm text-muted-foreground">Serving customers worldwide with excellence</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Mission Section */}
        <section id="mission" className="mb-20">
          <div className="text-center mb-12">
            <div className={`inline-flex items-center justify-center w-12 h-12 bg-primary/10 rounded-full mb-6 hover:bg-primary/20 transition-colors ${getAnimationClass('mission')}`}>
              <Lightbulb className="w-6 h-6 text-primary" />
            </div>
            <h2 className={`text-4xl font-bold mb-6 text-foreground ${getAnimationClass('mission', 200)}`}>Our Mission</h2>
            <div className="max-w-4xl mx-auto">
              <p className={`text-xl text-muted-foreground leading-relaxed mb-8 ${getAnimationClass('mission', 400)}`}>
                Our mission is to empower customers by offering an unparalleled selection of premium products, competitive pricing, and exceptional service. We're committed to fostering a global community where shopping transcends transactions to become an experience of discovery and delight.
              </p>
              <div className={`bg-gradient-to-r from-primary/5 to-purple-500/5 rounded-2xl p-8 border border-primary/10 hover:border-primary/20 transition-all duration-300 ${getAnimationClass('mission', 600)}`}>
                <p className="text-lg font-medium text-foreground italic">
                  "We continuously innovate to improve our platform, making it more intuitive, secure, and user-friendly while maintaining the highest standards of quality and authenticity."
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Values Section */}
        <section id="values" className="mb-20">
          <div className="text-center mb-12">
            <div className={`inline-flex items-center justify-center w-12 h-12 bg-primary/10 rounded-full mb-6 hover:bg-primary/20 transition-colors ${getAnimationClass('values')}`}>
              <Heart className="w-6 h-6 text-primary" />
            </div>
            <h2 className={`text-4xl font-bold mb-6 text-foreground ${getAnimationClass('values', 200)}`}>Our Values</h2>
            <p className={`text-xl text-muted-foreground max-w-3xl mx-auto ${getAnimationClass('values', 400)}`}>
              These core principles guide every decision we make and every interaction we have
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {values.map((value, index) => {
              const Icon = value.icon;
              return (
                <div key={index} className={`group p-6 bg-white dark:bg-gray-800 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-200 dark:border-gray-700 hover:border-primary/20 hover:scale-105 ${getAnimationClass('values', 600 + index * 100)}`}>
                  <div className="inline-flex items-center justify-center w-12 h-12 bg-primary/10 rounded-full mb-4 group-hover:bg-primary/20 transition-colors">
                    <Icon className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold mb-3 text-foreground">{value.title}</h3>
                  <p className="text-muted-foreground leading-relaxed">{value.description}</p>
                </div>
              );
            })}
          </div>
        </section>

        {/* Team Section */}
        <section id="team" className="mb-20">
          <div className="text-center mb-12">
            <h2 className={`text-4xl font-bold mb-6 text-foreground ${getAnimationClass('team')}`}>Meet Our Team</h2>
            <p className={`text-xl text-muted-foreground max-w-3xl mx-auto ${getAnimationClass('team', 200)}`}>
              Passionate professionals dedicated to delivering exceptional experiences
            </p>
          </div>
            <div className="grid md:grid-cols-3 gap-8">
            {team.map((member, index) => (
              <div key={index} className={`text-center group ${getAnimationClass('team', 400 + index * 200)}`}>
                <div className="relative mb-4">
                  <img
                    src={member.image}
                    alt={member.name}
                    className="w-32 h-32 rounded-full mx-auto object-cover shadow-lg group-hover:shadow-xl transition-shadow"
                  />
                  <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                    <Star className="w-4 h-4 text-white" />
                  </div>
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-1">{member.name}</h3>
                <p className="text-muted-foreground">{member.role}</p>
              </div>
            ))}
          </div>
        </section>

        {/* CTA Section */}
        <section id="cta" className="text-center py-16 bg-gradient-to-r from-primary/5 to-purple-500/5 rounded-3xl border border-primary/10 hover:border-primary/20 transition-all duration-300">
          <div className="max-w-3xl mx-auto px-8">
            <div className={`inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-full mb-6 hover:bg-primary/20 transition-colors ${getAnimationClass('cta')}`}>
              <ShoppingBag className="w-8 h-8 text-primary" />
            </div>
            <h2 className={`text-4xl font-bold mb-6 text-foreground ${getAnimationClass('cta', 200)}`}>Join Our Journey</h2>
            <p className={`text-xl text-muted-foreground leading-relaxed mb-8 ${getAnimationClass('cta', 400)}`}>
              Experience the Gloventra difference. Discover premium products, exceptional service,
              and become part of our growing global community of satisfied customers.
            </p>
            <div className={`flex flex-col sm:flex-row gap-4 justify-center ${getAnimationClass('cta', 600)}`}>
              <Link to="/products">
                <Button size="lg" className="px-8 py-3 text-lg">
                  <ShoppingBag className="w-5 h-5 mr-2" />
                  Explore Products
                </Button>
              </Link>
              <Link to="/contact-us">
                <Button variant="outline" size="lg" className="px-8 py-3 text-lg">
                  Get in Touch
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default About;