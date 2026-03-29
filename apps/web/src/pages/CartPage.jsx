import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { ShoppingBag, ArrowRight, Tag } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Input } from '@/components/ui/input';
import Header from '@/components/Header.jsx';
import Footer from '@/components/Footer.jsx';
import CartItem from '@/components/CartItem.jsx';
import { useCart } from '@/hooks/useCart.js';
import { useCoupon } from '@/hooks/useCoupon.js';
import { useAuth } from '@/contexts/AuthContext.jsx';
import { toast } from 'sonner';

const CartPage = () => {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const { cart, loading, updateQuantity, removeFromCart, getCartTotal } = useCart(currentUser?.id);
  const { validateCoupon, loading: validatingCoupon } = useCoupon();
  
  const [couponInput, setCouponInput] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [discountAmount, setDiscountAmount] = useState(0);

  if (!currentUser) {
    return (
      <>
        <Header />
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-4">Please login to view your cart</h2>
            <Link to="/login">
              <Button>Login</Button>
            </Link>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  const items = cart?.items || [];
  const subtotal = getCartTotal();
  const tax = (subtotal - discountAmount) * 0.08;
  const shipping = subtotal > 50 ? 0 : 8.99;
  const total = Math.max(0, subtotal - discountAmount) + tax + shipping;

  const handleApplyCoupon = async () => {
    if (!couponInput.trim()) return;
    
    const result = await validateCoupon(couponInput, subtotal);
    if (result.valid) {
      setAppliedCoupon(result.coupon);
      setDiscountAmount(result.discountAmount);
      toast.success('Coupon applied successfully!');
    } else {
      toast.error(result.error);
      setAppliedCoupon(null);
      setDiscountAmount(0);
    }
  };

  const handleRemoveCoupon = () => {
    setAppliedCoupon(null);
    setDiscountAmount(0);
    setCouponInput('');
    toast.success('Coupon removed');
  };

  const handleProceedToCheckout = () => {
    navigate('/checkout', { 
      state: { 
        couponCode: appliedCoupon?.code || null,
        discountAmount: discountAmount
      } 
    });
  };

  return (
    <>
      <Helmet>
        <title>Shopping Cart - Sri Ganesh Battery Center</title>
        <meta name="description" content="Review your shopping cart and proceed to checkout" />
      </Helmet>

      <Header />

      <main className="py-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl md:text-4xl font-bold mb-8" style={{letterSpacing: '-0.02em'}}>
            Shopping Cart
          </h1>

          {loading ? (
            <div className="text-center py-20">
              <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-muted-foreground">Loading cart...</p>
            </div>
          ) : items.length === 0 ? (
            <div className="text-center py-20">
              <div className="w-20 h-20 rounded-full bg-muted flex items-center justify-center mx-auto mb-6">
                <ShoppingBag className="w-10 h-10 text-muted-foreground" />
              </div>
              <h2 className="text-2xl font-bold mb-2">Your cart is empty</h2>
              <p className="text-muted-foreground mb-6">
                Start shopping to add items to your cart
              </p>
              <Link to="/products">
                <Button size="lg" className="transition-all duration-200 active:scale-[0.98]">
                  Browse Products
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2">
                <Card>
                  <CardContent className="p-6">
                    {items.map((item) => (
                      <CartItem
                        key={item.productId}
                        item={item}
                        onUpdateQuantity={updateQuantity}
                        onRemove={removeFromCart}
                      />
                    ))}
                  </CardContent>
                </Card>
              </div>

              <div>
                <Card className="sticky top-20">
                  <CardContent className="p-6">
                    <h2 className="text-xl font-bold mb-4">Order Summary</h2>
                    
                    <div className="space-y-3 mb-4">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Subtotal</span>
                        <span className="font-medium">₹{subtotal.toFixed(2)}</span>
                      </div>
                      
                      {appliedCoupon && (
                        <div className="flex justify-between text-sm text-green-600">
                          <span>Discount ({appliedCoupon.code})</span>
                          <span className="font-medium">-₹{discountAmount.toFixed(2)}</span>
                        </div>
                      )}

                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Tax (8%)</span>
                        <span className="font-medium">₹{tax.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Shipping</span>
                        <span className="font-medium">
                          {shipping === 0 ? 'FREE' : `₹${shipping.toFixed(2)}`}
                        </span>
                      </div>
                      {subtotal < 50 && (
                        <p className="text-xs text-muted-foreground">
                          Add ₹{(50 - subtotal).toFixed(2)} more for free shipping
                        </p>
                      )}
                    </div>

                    <Separator className="my-4" />

                    <div className="mb-6">
                      {!appliedCoupon ? (
                        <div className="flex gap-2">
                          <Input 
                            placeholder="Coupon code" 
                            value={couponInput}
                            onChange={(e) => setCouponInput(e.target.value)}
                            className="text-foreground uppercase"
                          />
                          <Button 
                            variant="secondary" 
                            onClick={handleApplyCoupon}
                            disabled={validatingCoupon || !couponInput.trim()}
                          >
                            Apply
                          </Button>
                        </div>
                      ) : (
                        <div className="flex items-center justify-between bg-green-50 border border-green-200 p-3 rounded-lg">
                          <div className="flex items-center gap-2 text-green-800">
                            <Tag className="w-4 h-4" />
                            <span className="font-medium text-sm">{appliedCoupon.code} applied</span>
                          </div>
                          <Button variant="ghost" size="sm" onClick={handleRemoveCoupon} className="h-auto py-1 px-2 text-green-800 hover:bg-green-100">
                            Remove
                          </Button>
                        </div>
                      )}
                    </div>

                    <Separator className="my-4" />

                    <div className="flex justify-between mb-6">
                      <span className="text-lg font-bold">Total</span>
                      <span className="text-2xl font-bold text-primary">
                        ₹{total.toFixed(2)}
                      </span>
                    </div>

                    <Button
                      size="lg"
                      className="w-full transition-all duration-200 active:scale-[0.98]"
                      onClick={handleProceedToCheckout}
                    >
                      Proceed to Checkout
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>

                    <Link to="/products">
                      <Button
                        variant="ghost"
                        className="w-full mt-3 transition-all duration-200 active:scale-[0.98]"
                      >
                        Continue Shopping
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </>
  );
};

export default CartPage;