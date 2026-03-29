import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import Header from '@/components/Header.jsx';
import Footer from '@/components/Footer.jsx';
import AdminHeader from '@/components/AdminHeader.jsx';
import StockAlertBanner from '@/components/StockAlertBanner.jsx';
import pb from '@/lib/pocketbaseClient.js';

const InventoryPage = () => {
  const [products, setProducts] = useState([]);
  const [lowStockProducts, setLowStockProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadInventory();
  }, []);

  const loadInventory = async () => {
    try {
      const records = await pb.collection('products').getFullList({
        sort: 'stock',
        $autoCancel: false
      });
      setProducts(records);
      setLowStockProducts(records.filter(p => p.stock < 10));
    } catch (error) {
      console.error('Error loading inventory:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStockStatus = (stock) => {
    if (stock === 0) return { label: 'Out of Stock', className: 'bg-red-100 text-red-800 border-red-200' };
    if (stock < 10) return { label: 'Low Stock', className: 'bg-orange-100 text-orange-800 border-orange-200' };
    return { label: 'In Stock', className: 'bg-green-100 text-green-800 border-green-200' };
  };

  return (
    <>
      <Helmet>
        <title>Inventory - Sri Ganesh Battery Center</title>
        <meta name="description" content="Monitor product stock levels" />
      </Helmet>

      <Header />
      <AdminHeader />

      <main className="py-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl md:text-4xl font-bold mb-8" style={{letterSpacing: '-0.02em'}}>
            Inventory Management
          </h1>

          <div className="mb-6">
            <StockAlertBanner lowStockProducts={lowStockProducts} />
          </div>

          <div className="bg-card rounded-2xl border overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Product Name</TableHead>
                  <TableHead>Brand</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Stock Level</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Warranty</TableHead>
                  <TableHead>Price</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-12">
                      Loading inventory...
                    </TableCell>
                  </TableRow>
                ) : products.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-12 text-muted-foreground">
                      No products found
                    </TableCell>
                  </TableRow>
                ) : (
                  products.map((product) => {
                    const status = getStockStatus(product.stock);
                    return (
                      <TableRow key={product.id}>
                        <TableCell className="font-medium">{product.name}</TableCell>
                        <TableCell>{product.brand || '—'}</TableCell>
                        <TableCell>{product.category}</TableCell>
                        <TableCell className="font-medium">{product.stock} units</TableCell>
                        <TableCell>
                          <Badge className={status.className}>
                            {status.label}
                          </Badge>
                        </TableCell>
                        <TableCell>{product.warranty || '—'}</TableCell>
                        <TableCell>₹{product.price.toFixed(2)}</TableCell>
                      </TableRow>
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

export default InventoryPage;