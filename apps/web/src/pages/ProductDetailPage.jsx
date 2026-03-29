import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { Star, ShoppingCart, Minus, Plus, Package, Heart, ShieldCheck, ThumbsUp, ThumbsDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import Header from '@/components/Header.jsx';
import Footer from '@/components/Footer.jsx';
import { useProducts } from '@/hooks/useProducts.js';
import { useCart } from '@/hooks/useCart.js';
import { useWishlist } from '@/hooks/useWishlist.js';
import { useAuth } from '@/contexts/AuthContext.jsx';
import { toast } from 'sonner';
import pb from '@/lib/pocketbaseClient.js';

const ProductDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { fetchProductById } = useProducts();
  const { currentUser, isAdmin } = useAuth();
  const { addToCart } = useCart(isAdmin ? null : currentUser?.id);
  const { isInWishlist, toggleWishlist } = useWishlist();
  
  const [product, setProduct] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [isWishlistToggling, setIsWishlistToggling] = useState(false);
  
  const [reviewFilter, setReviewFilter] = useState('all');
  const [reviewSort, setReviewSort] = useState('recent');

  useEffect(() => {
    loadProduct();
    loadReviews();
  }, [id]);

  const loadProduct = async () => {
    const data = await fetchProductById(id);
    setProduct(data);
    setLoading(false);
  };

  const loadReviews = async () => {
    try {
      const records = await pb.collection('reviews').getFullList({
        filter: `productId = "${id}" && isModerated = true`,
        expand: 'userId',
        sort: '-created',
        $autoCancel: false
      });
      setReviews(records);
    } catch (error) {
      console.error('Error loading reviews:', error);
    }
  };

  const handleAddToCart = async () => {
    if (!currentUser) {
      toast.error('Please login to add items to cart');
      navigate('/login');
      return;
    }
    if (isAdmin) {
      toast.error('Admin accounts cannot add items to cart');
      return;
    }
    try {
      await addToCart(product, quantity);
      toast.success(`Added ${quantity} item(s) to cart`);
    } catch (err) {
      toast.error(err.message);
    }
  };

  const handleWishlistToggle = async () => {
    setIsWishlistToggling(true);
    await toggleWishlist(product.id);
    setIsWishlistToggling(false);
  };

  const handleVote = async (reviewId, type) => {
    if (!currentUser) {
      toast.error('Please login to vote');
      return;
    }
    try {
      const review = reviews.find(r => r.id === reviewId);
      const updateData = type === 'helpful' 
        ? { helpfulVotes: (review.helpfulVotes || 0) + 1 }
        : { unhelpfulVotes: (review.unhelpfulVotes || 0) + 1 };
        
      await pb.collection('reviews').update(reviewId, updateData, { $autoCancel: false });
      
      setReviews(reviews.map(r => 
        r.id === reviewId ? { ...r, ...updateData } : r
      ));
      toast.success('Vote recorded');
    } catch (error) {
      toast.error('Failed to record vote');
    }
  };

  if (loading) {
    return (
      <>
        <Header />
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading product...</p>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  if (!product) {
    return (
      <>
        <Header />
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-2">Product not found</h2>
            <Button onClick={() => navigate('/products')}>Back to Products</Button>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  const imageUrl = product.image 
    ? pb.files.getUrl(product, product.image)
    : 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&h=800&fit=crop';

  const isWishlisted = isInWishlist(product.id);

  // Filter and sort reviews
  let displayedReviews = [...reviews];
  if (reviewFilter !== 'all') {
    displayedReviews = displayedReviews.filter(r => r.rating === parseInt(reviewFilter));
  }
  if (reviewSort === 'helpful') {
    displayedReviews.sort((a, b) => (b.helpfulVotes || 0) - (a.helpfulVotes || 0));
  } else {
    displayedReviews.sort((a, b) => new Date(b.created) - new Date(a.created));
  }

  return (
    <>
      <Helmet>
        <title>{`${product.name} - Sri Ganesh Battery Center`}</title>
        <meta name="description" content={product.description} />
      </Helmet>

      <Header />

      <main className="py-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
            <div className="aspect-square rounded-2xl overflow-hidden bg-muted relative">
              <img
                src={imageUrl}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            </div>

            <div className="flex flex-col">
              <div className="mb-4">
                <div className="flex justify-between items-start">
                  <Badge variant="outline" className="mb-3">{product.category}</Badge>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={handleWishlistToggle}
                    disabled={isWishlistToggling}
                    className="rounded-full hover:bg-muted transition-all duration-200"
                  >
                    <Heart className={`w-6 h-6 ${isWishlisted ? 'fill-destructive text-destructive' : 'text-muted-foreground'}`} />
                  </Button>
                </div>
                <h1 className="text-3xl md:text-4xl font-bold mb-4" style={{letterSpacing: '-0.02em'}}>
                  {product.name}
                </h1>
                <div className="flex items-center gap-2 mb-4">
                  <div className="flex items-center gap-1">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-5 h-5 ${
                          i < Math.floor(product.rating || 0)
                            ? 'fill-yellow-400 text-yellow-400'
                            : 'text-gray-300'
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-sm text-muted-foreground">
                    ({reviews.length} verified reviews)
                  </span>
                </div>
              </div>

              <p className="text-4xl font-bold text-primary mb-6">
                ₹{product.price.toFixed(2)}
              </p>

              {(product.brand || product.warranty) && (
                <div className="flex flex-wrap gap-3 mb-4">
                  {product.brand && (
                    <Badge variant="secondary" className="text-sm">Brand: {product.brand}</Badge>
                  )}
                  {product.warranty && (
                    <Badge variant="secondary" className="text-sm">Warranty: {product.warranty}</Badge>
                  )}
                </div>
              )}

              <p className="text-muted-foreground leading-relaxed mb-6">
                {product.description}
              </p>

              <div className="flex items-center gap-2 mb-6">
                <Package className="w-5 h-5 text-muted-foreground" />
                <span className={`font-medium ${product.stock > 0 ? 'text-green-600' : 'text-destructive'}`}>
                  {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
                </span>
              </div>

              <Separator className="my-6" />

              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <span className="font-medium">Quantity:</span>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      disabled={product.stock === 0}
                      className="transition-all duration-200 active:scale-[0.98]"
                    >
                      <Minus className="w-4 h-4" />
                    </Button>
                    <span className="w-12 text-center font-medium">{quantity}</span>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                      disabled={product.stock === 0}
                      className="transition-all duration-200 active:scale-[0.98]"
                    >
                      <Plus className="w-4 h-4" />
                    </Button>
                  </div>
                </div>

                <Button
                  size="lg"
                  onClick={handleAddToCart}
                  disabled={product.stock === 0}
                  className="w-full transition-all duration-200 active:scale-[0.98]"
                >
                  <ShoppingCart className="w-5 h-5 mr-2" />
                  {product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
                </Button>
              </div>
            </div>
          </div>

          <div className="border-t pt-12">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
              <h2 className="text-2xl font-bold">Customer Reviews</h2>
              
              <div className="flex gap-4">
                <Select value={reviewFilter} onValueChange={setReviewFilter}>
                  <SelectTrigger className="w-[140px]">
                    <SelectValue placeholder="Filter by rating" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Ratings</SelectItem>
                    <SelectItem value="5">5 Stars</SelectItem>
                    <SelectItem value="4">4 Stars</SelectItem>
                    <SelectItem value="3">3 Stars</SelectItem>
                    <SelectItem value="2">2 Stars</SelectItem>
                    <SelectItem value="1">1 Star</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={reviewSort} onValueChange={setReviewSort}>
                  <SelectTrigger className="w-[140px]">
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="recent">Most Recent</SelectItem>
                    <SelectItem value="helpful">Most Helpful</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {displayedReviews.length === 0 ? (
              <div className="text-center py-12 bg-muted/30 rounded-2xl">
                <p className="text-muted-foreground">No reviews match your criteria.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {displayedReviews.map((review) => (
                  <div key={review.id} className="bg-card border rounded-2xl p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-semibold">
                            {review.expand?.userId?.firstName} {review.expand?.userId?.lastName}
                          </span>
                          {review.verifiedPurchase && (
                            <Badge variant="secondary" className="text-xs bg-green-100 text-green-800 hover:bg-green-100">
                              <ShieldCheck className="w-3 h-3 mr-1" /> Verified
                            </Badge>
                          )}
                        </div>
                        <div className="flex items-center gap-1">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`w-4 h-4 ${
                                i < review.rating
                                  ? 'fill-yellow-400 text-yellow-400'
                                  : 'text-gray-300'
                              }`}
                            />
                          ))}
                        </div>
                      </div>
                      <span className="text-sm text-muted-foreground">
                        {new Date(review.created).toLocaleDateString()}
                      </span>
                    </div>
                    
                    <p className="text-sm leading-relaxed mb-4">{review.comment}</p>
                    
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <span className="font-medium">Helpful?</span>
                      <button 
                        onClick={() => handleVote(review.id, 'helpful')}
                        className="flex items-center gap-1 hover:text-primary transition-colors"
                      >
                        <ThumbsUp className="w-4 h-4" /> {review.helpfulVotes || 0}
                      </button>
                      <button 
                        onClick={() => handleVote(review.id, 'unhelpful')}
                        className="flex items-center gap-1 hover:text-destructive transition-colors"
                      >
                        <ThumbsDown className="w-4 h-4" /> {review.unhelpfulVotes || 0}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
};

export default ProductDetailPage;