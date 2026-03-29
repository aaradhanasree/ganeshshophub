import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { Heart, ArrowRight, ShoppingCart, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import Header from '@/components/Header.jsx';
import Footer from '@/components/Footer.jsx';
import { useWishlist } from '@/hooks/useWishlist.js';
import { useCart } from '@/hooks/useCart.js';
import { useAuth } from '@/contexts/AuthContext.jsx';
import pb from '@/lib/pocketbaseClient.js';
import { toast } from 'sonner';

const WishlistPage = () => {
  const { currentUser } = useAuth();
  const { wishlist, loading: wishlistLoading, removeFromWishlist } = useWishlist();
  const { addToCart } = useCart(currentUser?.id);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchWishlistProducts = async () => {
      if (wishlistLoading) return;
      
      if (wishlist.length === 0) {
        setProducts([]);
        setLoading(false);
        return;
      }

      try {
        const filterConditions = wishlist.map(w => `id = "${w.productId}"`).join(' || ');
        const records = await pb.collection('products').getFullList({
          filter: filterConditions,
          $autoCancel: false
        });
        setProducts(records);
      } catch (error) {
        console.error('Error fetching wishlist products:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchWishlistProducts();
  }, [wishlist, wishlistLoading]);

  const handleAddToCart = async (product) => {
    await addToCart(product, 1);
    toast.success('Added to cart');
  };

  const handleRemove = async (productId) => {
    await removeFromWishlist(productId);
    setProducts(products.filter(p => p.id !== productId));
  };

  return (
    <>
      <Helmet>
        <title>My Wishlist - Sri Ganesh Battery Center</title>
        <meta name="description" content="View your saved products" />
      </Helmet>

      <Header />

      <main className="py-12 min-h-[70vh]">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3 mb-8">
            <Heart className="w-8 h-8 text-primary" />
            <h1 className="text-3xl md:text-4xl font-bold" style={{letterSpacing: '-0.02em'}}>
              My Wishlist
            </h1>
          </div>

          {loading || wishlistLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="bg-card rounded-2xl p-4 space-y-4 border">
                  <div className="aspect-square bg-muted rounded-lg animate-pulse"></div>
                  <div className="h-4 bg-muted rounded animate-pulse"></div>
                  <div className="h-4 bg-muted rounded w-2/3 animate-pulse"></div>
                </div>
              ))}
            </div>
          ) : products.length === 0 ? (
            <div className="text-center py-20 bg-muted/30 rounded-3xl border border-dashed">
              <div className="w-20 h-20 rounded-full bg-background flex items-center justify-center mx-auto mb-6 shadow-sm">
                <Heart className="w-10 h-10 text-muted-foreground" />
              </div>
              <h2 className="text-2xl font-bold mb-2">Your wishlist is empty</h2>
              <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                Save items you love to your wishlist. Review them anytime and easily move them to your cart.
              </p>
              <Link to="/products">
                <Button size="lg" className="transition-all duration-200 active:scale-[0.98]">
                  Explore Products
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {products.map((product) => {
                const imageUrl = product.image 
                  ? pb.files.getUrl(product, product.image, { thumb: '300x300' })
                  : 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=300&h=300&fit=crop';

                return (
                  <Card key={product.id} className="group overflow-hidden transition-all duration-200 hover:shadow-lg flex flex-col h-full">
                    <Link to={`/product/${product.id}`} className="block">
                      <div className="aspect-square overflow-hidden bg-muted">
                        <img
                          src={imageUrl}
                          alt={product.name}
                          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                        />
                      </div>
                    </Link>
                    <CardContent className="p-4 flex-1 flex flex-col">
                      <Link to={`/product/${product.id}`}>
                        <h3 className="font-semibold text-lg leading-tight hover:text-primary transition-colors mb-2">
                          {product.name}
                        </h3>
                      </Link>
                      <div className="mt-auto">
                        <p className="text-2xl font-bold text-primary">
                          ₹{product.price.toFixed(2)}
                        </p>
                      </div>
                    </CardContent>
                    <div className="p-4 pt-0 flex gap-2">
                      <Button
                        onClick={() => handleAddToCart(product)}
                        disabled={product.stock === 0}
                        className="flex-1 transition-all duration-200 active:scale-[0.98]"
                      >
                        <ShoppingCart className="w-4 h-4 mr-2" />
                        Add
                      </Button>
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => handleRemove(product.id)}
                        className="text-destructive hover:text-destructive hover:bg-destructive/10 transition-all duration-200 active:scale-[0.98]"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </Card>
                );
              })}
            </div>
          )}
        </div>
      </main>

      <Footer />
    </>
  );
};

export default WishlistPage;