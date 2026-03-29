import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import Header from '@/components/Header.jsx';
import Footer from '@/components/Footer.jsx';
import AdminHeader from '@/components/AdminHeader.jsx';
import pb from '@/lib/pocketbaseClient.js';

const CustomerManagementPage = () => {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadCustomers();
  }, []);

  const loadCustomers = async () => {
    try {
      const records = await pb.collection('users').getFullList({
        sort: '-created',
        $autoCancel: false
      });
      setCustomers(records);
    } catch (error) {
      console.error('Error loading customers:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <>
      <Helmet>
        <title>Customers - Sri Ganesh Battery Center</title>
        <meta name="description" content="Manage customer accounts" />
      </Helmet>

      <Header />
      <AdminHeader />

      <main className="py-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl md:text-4xl font-bold mb-8" style={{letterSpacing: '-0.02em'}}>
            Customer Management
          </h1>

          <div className="bg-card rounded-2xl border overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Joined</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center py-12">
                      Loading customers...
                    </TableCell>
                  </TableRow>
                ) : customers.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center py-12 text-muted-foreground">
                      No customers found
                    </TableCell>
                  </TableRow>
                ) : (
                  customers.map((customer) => (
                    <TableRow key={customer.id}>
                      <TableCell className="font-medium">
                        {customer.name || [customer.firstName, customer.lastName].filter(Boolean).join(' ').trim() || 'N/A'}
                      </TableCell>
                      <TableCell>{customer.email}</TableCell>
                      <TableCell>
                        <Badge variant={(customer.role || 'customer') === 'admin' ? 'default' : 'outline'}>
                          {customer.role || 'customer'}
                        </Badge>
                      </TableCell>
                      <TableCell>{formatDate(customer.created)}</TableCell>
                    </TableRow>
                  ))
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

export default CustomerManagementPage;