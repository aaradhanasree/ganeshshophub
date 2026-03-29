import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet';
import { User, Package } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Header from '@/components/Header.jsx';
import Footer from '@/components/Footer.jsx';
import OrderCard from '@/components/OrderCard.jsx';
import { useAuth } from '@/contexts/AuthContext.jsx';
import pb from '@/lib/pocketbaseClient.js';

const UserProfilePage = () => {
  const { currentUser } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const fullName = currentUser?.name || [currentUser?.firstName, currentUser?.lastName].filter(Boolean).join(' ').trim() || 'N/A';
  const role = currentUser?.role || (currentUser?.collectionName === '_superusers' ? 'admin' : 'customer');

  useEffect(() => {
    if (currentUser) {
      loadOrders();
    }
  }, [currentUser]);

  const loadOrders = async () => {
    try {
      const records = await pb.collection('orders').getFullList({
        filter: `userId = "${currentUser.id}"`,
        sort: '-created',
        $autoCancel: false
      });
      setOrders(records);
    } catch (error) {
      console.error('Error loading orders:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Helmet>
        <title>My Profile - Sri Ganesh Battery Center</title>
        <meta name="description" content="Manage your account and view order history" />
      </Helmet>

      <Header />

      <main className="py-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-5xl">
          <h1 className="text-3xl md:text-4xl font-bold mb-8" style={{letterSpacing: '-0.02em'}}>
            My Profile
          </h1>

          <Tabs defaultValue="account" className="space-y-6">
            <TabsList>
              <TabsTrigger value="account">Account</TabsTrigger>
              <TabsTrigger value="orders">Orders</TabsTrigger>
            </TabsList>

            <TabsContent value="account">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <User className="w-5 h-5" />
                    Account Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Name</p>
                    <p className="font-medium">{fullName}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Email</p>
                    <p className="font-medium">{currentUser?.email}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Role</p>
                    <p className="font-medium capitalize">{role}</p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="orders">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Package className="w-5 h-5" />
                    Order History
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {loading ? (
                    <div className="space-y-4">
                      {[...Array(3)].map((_, i) => (
                        <div key={i} className="h-32 bg-muted rounded-lg animate-pulse"></div>
                      ))}
                    </div>
                  ) : orders.length === 0 ? (
                    <div className="text-center py-12">
                      <Package className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                      <p className="text-muted-foreground">No orders yet</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {orders.map((order) => (
                        <OrderCard key={order.id} order={order} />
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>

      <Footer />
    </>
  );
};

export default UserProfilePage;