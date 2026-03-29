import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { CreditCard, MapPin, Tag, Banknote, Building2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import Header from '@/components/Header.jsx';
import Footer from '@/components/Footer.jsx';
import { useCart } from '@/hooks/useCart.js';
import { useAuth } from '@/contexts/AuthContext.jsx';
import pb from '@/lib/pocketbaseClient.js';
import { toast } from 'sonner';

const CheckoutPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { currentUser } = useAuth();
  const { cart, getCartTotal, clearCart } = useCart(currentUser?.id);
  const [loading, setLoading] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('cod');
  
  const couponCode = location.state?.couponCode || null;
  const discountAmount = location.state?.discountAmount || 0;

  const [shippingAddress, setShippingAddress] = useState({
    street: '',
    city: '',
    state: '',
    zip: '',
    country: 'IN'
  });

  const items = cart?.items || [];
  const subtotal = getCartTotal();
  const tax = Math.max(0, subtotal - discountAmount) * 0.08;
  const shipping = subtotal > 50 ? 0 : 8.99;
  const total = Math.max(0, subtotal - discountAmount) + tax + shipping;

  const handleInputChange = (e) => {
    setShippingAddress({
      ...shippingAddress,
      [e.target.name]: e.target.value
    });
  };

  const handleCheckout = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Create order with payment method
      const order = await pb.collection('orders').create({
        userId: currentUser.id,
        items: items,
        totalAmount: total,
        status: 'pending',
        shippingAddress: JSON.stringify(shippingAddress),
        paymentMethod: paymentMethod
      }, { $autoCancel: false });

      // Increment coupon usage if a coupon was used
      if (couponCode) {
        try {
          const coupons = await pb.collection('coupons').getFullList({
            filter: `code = "${couponCode}"`,
            $autoCancel: false
          });
          if (coupons.length > 0) {
            await pb.collection('coupons').update(coupons[0].id, {
              currentUses: coupons[0].currentUses + 1
            }, { $autoCancel: false });
          }
        } catch (err) {
          console.error('Failed to update coupon usage:', err);
        }
      }

      // Clear the cart after successful order
      if (clearCart) {
        await clearCart();
      }

      toast.success('Order placed successfully!');
      navigate(`/order-confirmation/${order.id}`);

    } catch (error) {
      console.error('Checkout error:', error);
      toast.error('Failed to process checkout. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (!currentUser) {
    navigate('/login');
    return null;
  }

  if (items.length === 0) {
    navigate('/cart');
    return null;
  }

  return (
    <>
      <Helmet>
        <title>Checkout - Sri Ganesh Battery Center</title>
        <meta name="description" content="Complete your purchase securely" />
      </Helmet>

      <Header />

      <main className="py-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
          <h1 className="text-3xl md:text-4xl font-bold mb-8" style={{letterSpacing: '-0.02em'}}>
            Checkout
          </h1>

          <form onSubmit={handleCheckout} className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="w-5 h-5" />
                  Shipping Address
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="street">Street Address</Label>
                  <Input
                    id="street"
                    name="street"
                    value={shippingAddress.street}
                    onChange={handleInputChange}
                    required
                    className="text-foreground"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="city">City</Label>
                    <Input
                      id="city"
                      name="city"
                      value={shippingAddress.city}
                      onChange={handleInputChange}
                      required
                      className="text-foreground"
                    />
                  </div>
                  <div>
                    <Label htmlFor="state">State</Label>
                    <Input
                      id="state"
                      name="state"
                      value={shippingAddress.state}
                      onChange={handleInputChange}
                      required
                      className="text-foreground"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="zip">ZIP Code</Label>
                    <Input
                      id="zip"
                      name="zip"
                      value={shippingAddress.zip}
                      onChange={handleInputChange}
                      required
                      className="text-foreground"
                    />
                  </div>
                  <div>
                    <Label htmlFor="country">Country</Label>
                    <Input
                      id="country"
                      name="country"
                      value={shippingAddress.country}
                      onChange={handleInputChange}
                      required
                      className="text-foreground"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Order Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 mb-4">
                  {items.map((item) => (
                    <div key={item.productId} className="flex justify-between text-sm">
                      <span className="text-muted-foreground">
                        {item.name} × {item.quantity}
                      </span>
                      <span className="font-medium">
                        ₹{(item.price * item.quantity).toFixed(2)}
                      </span>
                    </div>
                  ))}
                </div>

                <Separator className="my-4" />

                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span className="font-medium">₹{subtotal.toFixed(2)}</span>
                  </div>
                  
                  {couponCode && (
                    <div className="flex justify-between text-sm text-green-600">
                      <span className="flex items-center gap-1">
                        <Tag className="w-3 h-3" /> Discount ({couponCode})
                      </span>
                      <span className="font-medium">-₹{discountAmount.toFixed(2)}</span>
                    </div>
                  )}

                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Tax</span>
                    <span className="font-medium">₹{tax.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Shipping</span>
                    <span className="font-medium">
                      {shipping === 0 ? 'FREE' : `₹${shipping.toFixed(2)}`}
                    </span>
                  </div>
                </div>

                <Separator className="my-4" />

                <div className="flex justify-between">
                  <span className="text-lg font-bold">Total</span>
                  <span className="text-2xl font-bold text-primary">
                    ₹{total.toFixed(2)}
                  </span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CreditCard className="w-5 h-5" />
                  Payment Method
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <label
                  className={`flex items-center gap-3 p-4 rounded-lg border-2 cursor-pointer transition-all ${paymentMethod === 'cod' ? 'border-primary bg-primary/5' : 'border-muted hover:border-muted-foreground/30'}`}
                  onClick={() => setPaymentMethod('cod')}
                >
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="cod"
                    checked={paymentMethod === 'cod'}
                    onChange={() => setPaymentMethod('cod')}
                    className="accent-primary"
                  />
                  <Banknote className="w-5 h-5 text-muted-foreground" />
                  <div>
                    <p className="font-medium">Cash on Delivery</p>
                    <p className="text-sm text-muted-foreground">Pay when your order is delivered</p>
                  </div>
                </label>

                <label
                  className={`flex items-center gap-3 p-4 rounded-lg border-2 cursor-pointer transition-all ${paymentMethod === 'bank_transfer' ? 'border-primary bg-primary/5' : 'border-muted hover:border-muted-foreground/30'}`}
                  onClick={() => setPaymentMethod('bank_transfer')}
                >
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="bank_transfer"
                    checked={paymentMethod === 'bank_transfer'}
                    onChange={() => setPaymentMethod('bank_transfer')}
                    className="accent-primary"
                  />
                  <Building2 className="w-5 h-5 text-muted-foreground" />
                  <div>
                    <p className="font-medium">Bank Transfer</p>
                    <p className="text-sm text-muted-foreground">Transfer to our bank account after placing order</p>
                  </div>
                </label>
              </CardContent>
            </Card>

            <Button
              type="submit"
              size="lg"
              className="w-full transition-all duration-200 active:scale-[0.98]"
              disabled={loading}
            >
              {paymentMethod === 'cod' ? (
                <Banknote className="w-5 h-5 mr-2" />
              ) : (
                <Building2 className="w-5 h-5 mr-2" />
              )}
              {loading ? 'Placing Order...' : `Place Order — ₹${total.toFixed(2)}`}
            </Button>
          </form>
        </div>
      </main>

      <Footer />
    </>
  );
};

export default CheckoutPage;