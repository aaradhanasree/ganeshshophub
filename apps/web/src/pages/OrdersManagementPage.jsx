import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet';
import { CheckCircle, XCircle, Truck, PackageCheck, ChevronDown, ChevronUp, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import Header from '@/components/Header.jsx';
import Footer from '@/components/Footer.jsx';
import AdminHeader from '@/components/AdminHeader.jsx';
import OrderStatusBadge from '@/components/OrderStatusBadge.jsx';
import pb from '@/lib/pocketbaseClient.js';
import { toast } from 'sonner';

const OrdersManagementPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedOrder, setExpandedOrder] = useState(null);
  const [actionLoading, setActionLoading] = useState(null);

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    try {
      const records = await pb.collection('orders').getFullList({
        sort: '-created',
        expand: 'userId',
        $autoCancel: false
      });
      setOrders(records);
    } catch (error) {
      console.error('Error loading orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const reduceStock = async (items) => {
    for (const item of items) {
      try {
        const product = await pb.collection('products').getOne(item.productId, { $autoCancel: false });
        const newStock = Math.max(0, (product.stock || 0) - (item.quantity || 1));
        await pb.collection('products').update(item.productId, { stock: newStock }, { $autoCancel: false });
      } catch (err) {
        console.error('Failed to update stock for', item.productId, err);
      }
    }
  };

  const restoreStock = async (items) => {
    for (const item of items) {
      try {
        const product = await pb.collection('products').getOne(item.productId, { $autoCancel: false });
        const newStock = (product.stock || 0) + (item.quantity || 1);
        await pb.collection('products').update(item.productId, { stock: newStock }, { $autoCancel: false });
      } catch (err) {
        console.error('Failed to restore stock for', item.productId, err);
      }
    }
  };

  const handleConfirm = async (order) => {
    setActionLoading(order.id);
    try {
      await pb.collection('orders').update(order.id, { status: 'confirmed' }, { $autoCancel: false });
      await reduceStock(order.items || []);
      toast.success('Order confirmed & stock updated');
      loadOrders();
    } catch (error) {
      console.error('Error confirming order:', error);
      toast.error('Failed to confirm order');
    } finally {
      setActionLoading(null);
    }
  };

  const handleReject = async (order) => {
    if (!window.confirm('Are you sure you want to reject this order?')) return;
    setActionLoading(order.id);
    try {
      await pb.collection('orders').update(order.id, { status: 'cancelled' }, { $autoCancel: false });
      toast.success('Order rejected');
      loadOrders();
    } catch (error) {
      console.error('Error rejecting order:', error);
      toast.error('Failed to reject order');
    } finally {
      setActionLoading(null);
    }
  };

  const handleShipped = async (order) => {
    setActionLoading(order.id);
    try {
      await pb.collection('orders').update(order.id, { status: 'shipped' }, { $autoCancel: false });
      toast.success('Order marked as shipped');
      loadOrders();
    } catch (error) {
      console.error('Error updating order:', error);
      toast.error('Failed to update order');
    } finally {
      setActionLoading(null);
    }
  };

  const handleDelivered = async (order) => {
    setActionLoading(order.id);
    try {
      await pb.collection('orders').update(order.id, { status: 'delivered' }, { $autoCancel: false });
      toast.success('Order marked as delivered');
      loadOrders();
    } catch (error) {
      console.error('Error updating order:', error);
      toast.error('Failed to update order');
    } finally {
      setActionLoading(null);
    }
  };

  const handleCancelConfirmed = async (order) => {
    if (!window.confirm('Cancel this confirmed order? Stock will be restored.')) return;
    setActionLoading(order.id);
    try {
      await pb.collection('orders').update(order.id, { status: 'cancelled' }, { $autoCancel: false });
      await restoreStock(order.items || []);
      toast.success('Order cancelled & stock restored');
      loadOrders();
    } catch (error) {
      console.error('Error cancelling order:', error);
      toast.error('Failed to cancel order');
    } finally {
      setActionLoading(null);
    }
  };

  const parseAddress = (addr) => {
    if (!addr) return null;
    try { return typeof addr === 'string' ? JSON.parse(addr) : addr; } catch { return null; }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const renderActions = (order) => {
    const isLoading = actionLoading === order.id;
    const btnClass = "transition-all duration-200 active:scale-[0.98]";

    switch (order.status) {
      case 'pending':
        return (
          <div className="flex gap-2">
            <Button size="sm" className={`bg-green-600 hover:bg-green-700 ${btnClass}`} onClick={() => handleConfirm(order)} disabled={isLoading}>
              <CheckCircle className="w-4 h-4 mr-1" /> Confirm
            </Button>
            <Button size="sm" variant="destructive" className={btnClass} onClick={() => handleReject(order)} disabled={isLoading}>
              <XCircle className="w-4 h-4 mr-1" /> Reject
            </Button>
          </div>
        );
      case 'confirmed':
        return (
          <div className="flex gap-2">
            <Button size="sm" className={`bg-purple-600 hover:bg-purple-700 ${btnClass}`} onClick={() => handleShipped(order)} disabled={isLoading}>
              <Truck className="w-4 h-4 mr-1" /> Mark Shipped
            </Button>
            <Button size="sm" variant="outline" className={`text-destructive hover:text-destructive ${btnClass}`} onClick={() => handleCancelConfirmed(order)} disabled={isLoading}>
              <XCircle className="w-4 h-4 mr-1" /> Cancel
            </Button>
          </div>
        );
      case 'shipped':
        return (
          <Button size="sm" className={`bg-green-600 hover:bg-green-700 ${btnClass}`} onClick={() => handleDelivered(order)} disabled={isLoading}>
            <PackageCheck className="w-4 h-4 mr-1" /> Mark Delivered
          </Button>
        );
      case 'delivered':
        return <span className="text-sm text-green-600 font-medium">Completed</span>;
      case 'cancelled':
        return <span className="text-sm text-red-600 font-medium">Cancelled</span>;
      default:
        return null;
    }
  };

  return (
    <>
      <Helmet>
        <title>Orders Management - Sri Ganesh Battery Center</title>
        <meta name="description" content="Manage customer orders" />
      </Helmet>

      <Header />
      <AdminHeader />

      <main className="py-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl md:text-4xl font-bold mb-8" style={{letterSpacing: '-0.02em'}}>
            Orders Management
          </h1>

          <div className="bg-card rounded-2xl border overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead></TableHead>
                  <TableHead>Order ID</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Items</TableHead>
                  <TableHead>Total</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-12">
                      Loading orders...
                    </TableCell>
                  </TableRow>
                ) : orders.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-12 text-muted-foreground">
                      No orders found
                    </TableCell>
                  </TableRow>
                ) : (
                  orders.map((order) => {
                    const isExpanded = expandedOrder === order.id;
                    const addr = parseAddress(order.shippingAddress);
                    return (
                      <React.Fragment key={order.id}>
                        <TableRow className="cursor-pointer hover:bg-muted/50" onClick={() => setExpandedOrder(isExpanded ? null : order.id)}>
                          <TableCell>
                            {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                          </TableCell>
                          <TableCell className="font-medium">#{order.id.slice(0, 8)}</TableCell>
                          <TableCell>
                            {order.expand?.userId?.name || order.expand?.userId?.email || 'N/A'}
                          </TableCell>
                          <TableCell>{formatDate(order.created)}</TableCell>
                          <TableCell>{order.items?.length || 0} items</TableCell>
                          <TableCell className="font-medium">₹{order.totalAmount?.toFixed(2)}</TableCell>
                          <TableCell>
                            <OrderStatusBadge status={order.status} />
                          </TableCell>
                          <TableCell onClick={(e) => e.stopPropagation()}>
                            {renderActions(order)}
                          </TableCell>
                        </TableRow>
                        {isExpanded && (
                          <TableRow>
                            <TableCell colSpan={8} className="bg-muted/30 p-0">
                              <div className="p-6 space-y-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                  <Card>
                                    <CardContent className="p-4">
                                      <h4 className="font-semibold mb-3">Order Items</h4>
                                      <div className="space-y-2">
                                        {order.items?.map((item, idx) => (
                                          <div key={idx} className="flex justify-between text-sm">
                                            <span className="text-muted-foreground">
                                              {item.name} × {item.quantity}
                                            </span>
                                            <span className="font-medium">₹{(item.price * item.quantity).toFixed(2)}</span>
                                          </div>
                                        ))}
                                        <Separator className="my-2" />
                                        <div className="flex justify-between font-bold">
                                          <span>Total</span>
                                          <span>₹{order.totalAmount?.toFixed(2)}</span>
                                        </div>
                                      </div>
                                    </CardContent>
                                  </Card>

                                  <Card>
                                    <CardContent className="p-4">
                                      <h4 className="font-semibold mb-3">Order Info</h4>
                                      <div className="space-y-2 text-sm">
                                        <div className="flex justify-between">
                                          <span className="text-muted-foreground">Payment</span>
                                          <span className="font-medium capitalize">
                                            {order.paymentMethod === 'cod' ? 'Cash on Delivery' : order.paymentMethod === 'bank_transfer' ? 'Bank Transfer' : order.paymentMethod || 'N/A'}
                                          </span>
                                        </div>
                                        <div className="flex justify-between">
                                          <span className="text-muted-foreground">Status</span>
                                          <span className="font-medium capitalize">{order.status}</span>
                                        </div>
                                        {addr && (
                                          <>
                                            <Separator className="my-2" />
                                            <div className="flex items-start gap-2">
                                              <MapPin className="w-4 h-4 text-muted-foreground mt-0.5 shrink-0" />
                                              <div>
                                                <p>{addr.street}</p>
                                                <p>{addr.city}, {addr.state} {addr.zip}</p>
                                                <p>{addr.country}</p>
                                              </div>
                                            </div>
                                          </>
                                        )}
                                      </div>
                                    </CardContent>
                                  </Card>
                                </div>
                              </div>
                            </TableCell>
                          </TableRow>
                        )}
                      </React.Fragment>
                    );
                  })
                )}
              </TableBody>
            </Table>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
};

export default OrdersManagementPage;