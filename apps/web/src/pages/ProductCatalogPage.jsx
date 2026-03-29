import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import Header from '@/components/Header.jsx';
import Footer from '@/components/Footer.jsx';
import ProductCard from '@/components/ProductCard.jsx';
import FilterSidebar from '@/components/FilterSidebar.jsx';
import { useProducts } from '@/hooks/useProducts.js';
import { useCart } from '@/hooks/useCart.js';
import { useAuth } from '@/contexts/AuthContext.jsx';
import { toast } from 'sonner';

const ProductCatalogPage = () => {
  const [searchParams] = useSearchParams();
  const { products, loading, fetchProducts } = useProducts();
  const { currentUser, isAdmin } = useAuth();
  const { addToCart } = useCart(isAdmin ? null : currentUser?.id);
  const [filters, setFilters] = useState({});

  useEffect(() => {
    const initialFilters = {};
    const category = searchParams.get('category');
    const search = searchParams.get('search');
    
    if (category) initialFilters.category = category;
    if (search) initialFilters.search = search;
    
    setFilters(initialFilters);
    fetchProducts(initialFilters);
  }, [searchParams]);

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
    fetchProducts(newFilters);
  };

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

  return (
    <>
      <Helmet>
        <title>Products - Sri Ganesh Battery Center</title>
        <meta name="description" content="Browse our complete catalog of quality products across all categories" />
      </Helmet>

      <Header />

      <main className="py-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <h1 className="text-3xl md:text-4xl font-bold mb-2" style={{letterSpacing: '-0.02em'}}>
              All Products
            </h1>
            <p className="text-muted-foreground">
              {loading ? 'Loading...' : `${products.length} products found`}
            </p>
          </div>

          <div className="flex gap-8">
            <aside className="hidden lg:block w-64 shrink-0">
              <FilterSidebar onFilterChange={handleFilterChange} />
            </aside>

            <div className="flex-1">
              <div className="lg:hidden mb-6">
                <FilterSidebar onFilterChange={handleFilterChange} isMobile />
              </div>

              {loading ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {[...Array(6)].map((_, i) => (
                    <div key={i} className="bg-card rounded-2xl p-4 space-y-4 border">
                      <div className="aspect-square bg-muted rounded-lg animate-pulse"></div>
                      <div className="h-4 bg-muted rounded animate-pulse"></div>
                      <div className="h-4 bg-muted rounded w-2/3 animate-pulse"></div>
                    </div>
                  ))}
                </div>
              ) : products.length === 0 ? (
                <div className="text-center py-20">
                  <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
                    <span className="text-3xl">📦</span>
                  </div>
                  <h3 className="text-xl font-semibold mb-2">No products found</h3>
                  <p className="text-muted-foreground mb-6">
                    Try adjusting your filters or search terms
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {products.map((product) => (
                    <ProductCard
                      key={product.id}
                      product={product}
                      onAddToCart={handleAddToCart}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
};

export default ProductCatalogPage;