import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Header from '@/components/Header.jsx';
import Footer from '@/components/Footer.jsx';
import AdminHeader from '@/components/AdminHeader.jsx';

const AnalyticsPage = () => {
  const [salesData] = useState([
    { month: 'Jan', sales: 4247, orders: 47 },
    { month: 'Feb', sales: 5832, orders: 63 },
    { month: 'Mar', sales: 7194, orders: 78 },
    { month: 'Apr', sales: 6521, orders: 71 },
    { month: 'May', sales: 8943, orders: 94 },
    { month: 'Jun', sales: 12847, orders: 127 }
  ]);

  const [categoryData] = useState([
    { category: 'Electronics', revenue: 18432 },
    { category: 'Clothing', revenue: 12847 },
    { category: 'Home & Garden', revenue: 9234 },
    { category: 'Sports', revenue: 6521 },
    { category: 'Books', revenue: 4892 }
  ]);

  return (
    <>
      <Helmet>
        <title>Analytics - Sri Ganesh Battery Center</title>
        <meta name="description" content="View sales analytics and trends" />
      </Helmet>

      <Header />
      <AdminHeader />

      <main className="py-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl md:text-4xl font-bold mb-8" style={{letterSpacing: '-0.02em'}}>
            Analytics
          </h1>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Sales Trend</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={salesData}>
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
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey="sales"
                      stroke="hsl(var(--primary))"
                      strokeWidth={2}
                      name="Revenue ($)"
                    />
                    <Line
                      type="monotone"
                      dataKey="orders"
                      stroke="hsl(var(--secondary))"
                      strokeWidth={2}
                      name="Orders"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Revenue by Category</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={categoryData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis dataKey="category" stroke="hsl(var(--muted-foreground))" />
                    <YAxis stroke="hsl(var(--muted-foreground))" />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: 'hsl(var(--card))',
                        border: '1px solid hsl(var(--border))',
                        borderRadius: '8px'
                      }}
                    />
                    <Bar dataKey="revenue" fill="hsl(var(--primary))" name="Revenue ($)" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
};

export default AnalyticsPage;