import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet';
import { IndianRupee, ShoppingBag, Package, TrendingUp } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import Header from '@/components/Header.jsx';
import Footer from '@/components/Footer.jsx';
import AdminHeader from '@/components/AdminHeader.jsx';
import MetricCard from '@/components/MetricCard.jsx';
import pb from '@/lib/pocketbaseClient.js';

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalRevenue: 0,
    totalOrders: 0,
    totalProducts: 0,
    revenueGrowth: 0
  });
  const [chartData, setChartData] = useState([]);

  useEffect(() => {
    loadStats();
    loadChartData();
  }, []);

  const loadStats = async () => {
    try {
      const orders = await pb.collection('orders').getFullList({ $autoCancel: false });
      const products = await pb.collection('products').getFullList({ $autoCancel: false });

      const totalRevenue = orders.reduce((sum, order) => sum + (order.totalAmount || 0), 0);

      setStats({
        totalRevenue,
        totalOrders: orders.length,
        totalProducts: products.length,
        revenueGrowth: 12.4
      });
    } catch (error) {
      console.error('Error loading stats:', error);
    }
  };

  const loadChartData = async () => {
    const data = [
      { month: 'Jan', revenue: 4247 },
      { month: 'Feb', revenue: 5832 },
      { month: 'Mar', revenue: 7194 },
      { month: 'Apr', revenue: 6521 },
      { month: 'May', revenue: 8943 },
      { month: 'Jun', revenue: 12847 }
    ];
    setChartData(data);
  };

  return (
    <>
      <Helmet>
        <title>Admin Dashboard - Sri Ganesh Battery Center</title>
        <meta name="description" content="Manage your e-commerce store" />
      </Helmet>

      <Header />
      <AdminHeader />

      <main className="py-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl md:text-4xl font-bold mb-8" style={{letterSpacing: '-0.02em'}}>
            Dashboard
          </h1>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <MetricCard
              title="Total Revenue"
              value={`₹${stats.totalRevenue.toFixed(2)}`}
              icon={IndianRupee}
              trend="up"
              trendValue={`+${stats.revenueGrowth}%`}
            />
            <MetricCard
              title="Total Orders"
              value={stats.totalOrders}
              icon={ShoppingBag}
            />
            <MetricCard
              title="Products"
              value={stats.totalProducts}
              icon={Package}
            />
            <MetricCard
              title="Growth"
              value={`+${stats.revenueGrowth}%`}
              icon={TrendingUp}
              trend="up"
              trendValue="vs last month"
            />
          </div>

          <div className="bg-card rounded-2xl p-6 border">
            <h2 className="text-xl font-bold mb-6">Revenue Overview</h2>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" />
                <YAxis stroke="hsl(var(--muted-foreground))" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'hsl(var(--card))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px'
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="revenue"
                  stroke="hsl(var(--primary))"
                  strokeWidth={2}
                  dot={{ fill: 'hsl(var(--primary))' }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
};

export default AdminDashboard;