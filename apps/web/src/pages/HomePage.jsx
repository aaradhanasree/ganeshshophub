import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { ArrowRight, ShoppingBag, Truck, Shield, Headphones, Battery } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Header from '@/components/Header.jsx';
import Footer from '@/components/Footer.jsx';
import ProductCard from '@/components/ProductCard.jsx';
import { useProducts } from '@/hooks/useProducts.js';
import { useCart } from '@/hooks/useCart.js';
import { useAuth } from '@/contexts/AuthContext.jsx';
import { toast } from 'sonner';

const HomePage = () => {
  const { products, loading } = useProducts();
  const { currentUser, isAdmin } = useAuth();
  const { addToCart } = useCart(isAdmin ? null : currentUser?.id);
  const [featuredProducts, setFeaturedProducts] = useState([]);

  useEffect(() => {
    if (products.length > 0) {
      setFeaturedProducts(products.slice(0, 4));
    }
  }, [products]);

  const handleAddToCart = async (product) => {
    if (!currentUser) {
      toast.error('Please login to add items to cart');
      return;
    }
    if (isAdmin) {
      toast.error('Admin accounts cannot add items to cart');
      return;
    }
    try {
      await addToCart(product, 1);
      toast.success('Added to cart');
    } catch (err) {
      toast.error(err.message);
    }
  };

  const categories = [
    { name: 'Car Batteries', image: 'https://images.unsplash.com/photo-1620714223084-8fcacc6dfd8d?w=400&h=300&fit=crop', count: 50 },
    { name: 'Bike Batteries', image: 'https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=400&h=300&fit=crop', count: 40 },
    { name: 'Inverter Batteries', image: 'https://images.unsplash.com/photo-1609770231080-e321deccc34c?w=400&h=300&fit=crop', count: 35 },
    { name: 'UPS / Solar Batteries', image: 'https://images.unsplash.com/photo-1509391366360-2e959784a276?w=400&h=300&fit=crop', count: 20 }
  ];

  const features = [
    {
      icon: Truck,
      title: 'Free Delivery',
      description: 'Free delivery on orders above ₹5000 across the city'
    },
    {
      icon: Shield,
      title: 'Warranty Assured',
      description: 'All batteries come with manufacturer warranty'
    },
    {
      icon: Headphones,
      title: 'Expert Support',
      description: 'Get help choosing the right battery for your needs'
    }
  ];

  return (
    <>
      <Helmet>
        <title>Sri Ganesh Battery Center - Your Trusted Battery Store</title>
        <meta name="description" content="Shop all types of batteries — automotive, inverter, UPS, solar, and more at Sri Ganesh Battery Center. Quality products, best prices." />
      </Helmet>

      <Header />

      <main>
        <section className="relative min-h-[100dvh] flex items-center justify-center overflow-hidden">
          <div className="absolute inset-0 z-0">
            <img
              src="https://images.unsplash.com/photo-1620714223084-8fcacc6dfd8d"
              alt="Battery products and power solutions"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-black/40"></div>
          </div>

          <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="max-w-2xl">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight" style={{letterSpacing: '-0.02em', textWrap: 'balance'}}>
                Power Your World with Sri Ganesh Batteries
              </h1>
              <p className="text-xl text-white/90 mb-8 leading-relaxed max-w-prose">
                Your one-stop shop for automotive, inverter, UPS, solar, and all types of batteries. Trusted quality, best prices, and reliable service.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link to="/products">
                  <Button size="lg" className="text-lg px-8 transition-all duration-200 active:scale-[0.98]">
                    Shop Now
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </Button>
                </Link>
                <Link to="/products">
                  <Button size="lg" variant="outline" className="text-lg px-8 bg-white/10 backdrop-blur-sm border-white/20 text-white hover:bg-white/20 transition-all duration-200 active:scale-[0.98]">
                    Browse Categories
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>

        <section className="py-20 bg-background">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {features.map((feature, index) => {
                const Icon = feature.icon;
                return (
                  <div key={index} className="flex gap-4">
                    <div className="shrink-0">
                      <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                        <Icon className="w-6 h-6 text-primary" />
                      </div>
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg mb-2">{feature.title}</h3>
                      <p className="text-muted-foreground leading-relaxed">{feature.description}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        <section className="py-24 bg-muted/30">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-4" style={{letterSpacing: '-0.02em', textWrap: 'balance'}}>
                Featured products
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Handpicked items from our latest collection
              </p>
            </div>

            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="bg-card rounded-2xl p-4 space-y-4">
                    <div className="aspect-square bg-muted rounded-lg animate-pulse"></div>
                    <div className="h-4 bg-muted rounded animate-pulse"></div>
                    <div className="h-4 bg-muted rounded w-2/3 animate-pulse"></div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {featuredProducts.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    onAddToCart={handleAddToCart}
                  />
                ))}
              </div>
            )}

            <div className="text-center mt-12">
              <Link to="/products">
                <Button size="lg" variant="outline" className="transition-all duration-200 active:scale-[0.98]">
                  View All Products
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
            </div>
          </div>
        </section>

        <section className="py-24 bg-background">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-4" style={{letterSpacing: '-0.02em', textWrap: 'balance'}}>
                Shop by category
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Explore our wide range of product categories
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {categories.map((category, index) => (
                <Link
                  key={index}
                  to={`/products?category=${encodeURIComponent(category.name)}`}
                  className="group relative overflow-hidden rounded-2xl aspect-[4/3] transition-all duration-200 hover:shadow-xl"
                >
                  <img
                    src={category.image}
                    alt={`${category.name} category showcase`}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-black/20"></div>
                  <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                    <h3 className="text-2xl font-bold mb-1">{category.name}</h3>
                    <p className="text-white/80">{category.count} products</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
};

export default HomePage;