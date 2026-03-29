import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { CheckCircle, Package, MapPin, CreditCard } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import Header from '@/components/Header.jsx';
import Footer from '@/components/Footer.jsx';
import pb from '@/lib/pocketbaseClient.js';

const OrderConfirmationPage = () => {
  const { orderId } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadOrder();
  }, [orderId]);

  const loadOrder = async () => {
    try {
      const record = await pb.collection('orders').getOne(orderId, { $autoCancel: false });
      setOrder(record);
    } catch (error) {
      console.error('Error loading order:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <>
        <Header />
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading order details...</p>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  if (!order) {
    return (
      <>
        <Header />
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-4">Order not found</h2>
            <Link to="/">
              <Button>Back to Home</Button>
            </Link>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Helmet>
        <title>Order Confirmation - Sri Ganesh Battery Center</title>
        <meta name="description" content="Your order has been confirmed" />
      </Helmet>

      <Header />

      <main className="py-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-3xl">
          <div className="text-center mb-8">
            <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-10 h-10 text-green-600" />
            </div>
            <h1 className="text-3xl md:text-4xl font-bold mb-2" style={{letterSpacing: '-0.02em'}}>
              Order Confirmed
            </h1>
            <p className="text-muted-foreground">
              Thank you for your purchase. Your order has been received.
            </p>
          </div>

          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Package className="w-5 h-5" />
                Order Details
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 mb-4">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Order ID</span>
                  <span className="font-medium">#{order.id.slice(0, 8)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Status</span>
                  <span className="font-medium capitalize">{order.status}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Date</span>
                  <span className="font-medium">
                    {new Date(order.created).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </span>
                </div>
              </div>

              <Separator className="my-4" />

              <div className="space-y-3">
                {order.items?.map((item, index) => (
                  <div key={index} className="flex justify-between text-sm">
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
                <div className="flex justify-between">
                  <span className="text-lg font-bold">Total</span>
                  <span className="text-2xl font-bold text-primary">
                    ₹{order.totalAmount?.toFixed(2)}
                  </span>
                </div>
                {order.paymentMethod && (
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Payment Method</span>
                    <span className="font-medium capitalize">{order.paymentMethod === 'cod' ? 'Cash on Delivery' : order.paymentMethod === 'bank_transfer' ? 'Bank Transfer' : order.paymentMethod}</span>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {order.shippingAddress && (() => {
            let addr;
            try { addr = typeof order.shippingAddress === 'string' ? JSON.parse(order.shippingAddress) : order.shippingAddress; } catch { addr = null; }
            if (!addr) return null;
            return (
              <Card className="mb-6">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MapPin className="w-5 h-5" />
                    Shipping Address
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm leading-relaxed">
                    {addr.street}<br />
                    {addr.city}, {addr.state} {addr.zip}<br />
                    {addr.country}
                  </p>
                </CardContent>
              </Card>
            );
          })()}

          <div className="flex gap-4">
            <Link to="/profile" className="flex-1">
              <Button variant="outline" className="w-full transition-all duration-200 active:scale-[0.98]">
                View Order History
              </Button>
            </Link>
            <Link to="/products" className="flex-1">
              <Button className="w-full transition-all duration-200 active:scale-[0.98]">
                Continue Shopping
              </Button>
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
};

export default OrderConfirmationPage;