import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet';
import { Plus, Edit, Trash2, Tag, Percent, IndianRupee } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import Header from '@/components/Header.jsx';
import Footer from '@/components/Footer.jsx';
import AdminHeader from '@/components/AdminHeader.jsx';
import MetricCard from '@/components/MetricCard.jsx';
import pb from '@/lib/pocketbaseClient.js';
import { toast } from 'sonner';

const CouponsManagementPage = () => {
  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingCoupon, setEditingCoupon] = useState(null);
  const [formData, setFormData] = useState({
    code: '',
    discountType: 'percentage',
    discountValue: '',
    expiryDate: '',
    minOrderAmount: '',
    maxUses: '100',
    isActive: true
  });

  useEffect(() => {
    loadCoupons();
  }, []);

  const loadCoupons = async () => {
    try {
      const records = await pb.collection('coupons').getFullList({
        sort: '-created',
        $autoCancel: false
      });
      setCoupons(records);
    } catch (error) {
      console.error('Error loading coupons:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = {
        ...formData,
        code: formData.code.toUpperCase(),
        discountValue: parseFloat(formData.discountValue),
        minOrderAmount: formData.minOrderAmount ? parseFloat(formData.minOrderAmount) : 0,
        maxUses: parseInt(formData.maxUses),
        currentUses: editingCoupon ? editingCoupon.currentUses : 0
      };

      if (editingCoupon) {
        await pb.collection('coupons').update(editingCoupon.id, data, { $autoCancel: false });
        toast.success('Coupon updated successfully');
      } else {
        await pb.collection('coupons').create(data, { $autoCancel: false });
        toast.success('Coupon created successfully');
      }

      setDialogOpen(false);
      resetForm();
      loadCoupons();
    } catch (error) {
      console.error('Error saving coupon:', error);
      toast.error(error.response?.data?.code?.message || 'Failed to save coupon. Code might already exist.');
    }
  };

  const handleEdit = (coupon) => {
    setEditingCoupon(coupon);
    setFormData({
      code: coupon.code,
      discountType: coupon.discountType,
      discountValue: coupon.discountValue.toString(),
      expiryDate: coupon.expiryDate.split('T')[0],
      minOrderAmount: coupon.minOrderAmount?.toString() || '',
      maxUses: coupon.maxUses.toString(),
      isActive: coupon.isActive
    });
    setDialogOpen(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this coupon?')) {
      try {
        await pb.collection('coupons').delete(id, { $autoCancel: false });
        toast.success('Coupon deleted');
        loadCoupons();
      } catch (error) {
        console.error('Error deleting coupon:', error);
        toast.error('Failed to delete coupon');
      }
    }
  };

  const toggleStatus = async (coupon) => {
    try {
      await pb.collection('coupons').update(coupon.id, { isActive: !coupon.isActive }, { $autoCancel: false });
      toast.success(`Coupon ${!coupon.isActive ? 'activated' : 'deactivated'}`);
      loadCoupons();
    } catch (error) {
      toast.error('Failed to update status');
    }
  };

  const resetForm = () => {
    setEditingCoupon(null);
    setFormData({
      code: '',
      discountType: 'percentage',
      discountValue: '',
      expiryDate: '',
      minOrderAmount: '',
      maxUses: '100',
      isActive: true
    });
  };

  const activeCoupons = coupons.filter(c => c.isActive).length;
  const totalUses = coupons.reduce((sum, c) => sum + c.currentUses, 0);

  return (
    <>
      <Helmet>
        <title>Coupons Management - Sri Ganesh Battery Center</title>
        <meta name="description" content="Manage discount codes and promotions" />
      </Helmet>

      <Header />
      <AdminHeader />

      <main className="py-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-3xl md:text-4xl font-bold" style={{letterSpacing: '-0.02em'}}>
              Coupons Management
            </h1>
            <Dialog open={dialogOpen} onOpenChange={(open) => {
              setDialogOpen(open);
              if (!open) resetForm();
            }}>
              <DialogTrigger asChild>
                <Button className="transition-all duration-200 active:scale-[0.98]">
                  <Plus className="w-4 h-4 mr-2" />
                  Create Coupon
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-md">
                <DialogHeader>
                  <DialogTitle>
                    {editingCoupon ? 'Edit Coupon' : 'Create New Coupon'}
                  </DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4 mt-4">
                  <div>
                    <Label htmlFor="code">Coupon Code</Label>
                    <Input
                      id="code"
                      name="code"
                      value={formData.code}
                      onChange={handleInputChange}
                      placeholder="e.g. SUMMER20"
                      required
                      className="uppercase text-foreground"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="discountType">Discount Type</Label>
                      <Select
                        value={formData.discountType}
                        onValueChange={(value) => setFormData({ ...formData, discountType: value })}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="percentage">Percentage (%)</SelectItem>
                          <SelectItem value="fixed">Fixed Amount ($)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="discountValue">Value</Label>
                      <Input
                        id="discountValue"
                        name="discountValue"
                        type="number"
                        step="0.01"
                        value={formData.discountValue}
                        onChange={handleInputChange}
                        required
                        className="text-foreground"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="expiryDate">Expiry Date</Label>
                      <Input
                        id="expiryDate"
                        name="expiryDate"
                        type="date"
                        value={formData.expiryDate}
                        onChange={handleInputChange}
                        required
                        className="text-foreground"
                      />
                    </div>
                    <div>
                      <Label htmlFor="maxUses">Max Uses</Label>
                      <Input
                        id="maxUses"
                        name="maxUses"
                        type="number"
                        min="1"
                        value={formData.maxUses}
                        onChange={handleInputChange}
                        required
                        className="text-foreground"
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="minOrderAmount">Minimum Order Amount ($) - Optional</Label>
                    <Input
                      id="minOrderAmount"
                      name="minOrderAmount"
                      type="number"
                      step="0.01"
                      value={formData.minOrderAmount}
                      onChange={handleInputChange}
                      className="text-foreground"
                    />
                  </div>

                  <div className="flex items-center justify-between pt-2">
                    <Label htmlFor="isActive" className="cursor-pointer">Active Status</Label>
                    <Switch
                      id="isActive"
                      checked={formData.isActive}
                      onCheckedChange={(checked) => setFormData({ ...formData, isActive: checked })}
                    />
                  </div>

                  <div className="flex gap-4 pt-4">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => {
                        setDialogOpen(false);
                        resetForm();
                      }}
                      className="flex-1 transition-all duration-200 active:scale-[0.98]"
                    >
                      Cancel
                    </Button>
                    <Button type="submit" className="flex-1 transition-all duration-200 active:scale-[0.98]">
                      {editingCoupon ? 'Update' : 'Create'}
                    </Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <MetricCard
              title="Total Coupons"
              value={coupons.length}
              icon={Tag}
            />
            <MetricCard
              title="Active Coupons"
              value={activeCoupons}
              icon={Percent}
            />
            <MetricCard
              title="Total Uses"
              value={totalUses}
              icon={IndianRupee}
            />
          </div>

          <div className="bg-card rounded-2xl border overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Code</TableHead>
                  <TableHead>Discount</TableHead>
                  <TableHead>Usage</TableHead>
                  <TableHead>Expiry</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-12">
                      Loading coupons...
                    </TableCell>
                  </TableRow>
                ) : coupons.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-12 text-muted-foreground">
                      No coupons found
                    </TableCell>
                  </TableRow>
                ) : (
                  coupons.map((coupon) => {
                    const isExpired = new Date(coupon.expiryDate) < new Date();
                    return (
                      <TableRow key={coupon.id}>
                        <TableCell className="font-bold">{coupon.code}</TableCell>
                        <TableCell>
                          {coupon.discountType === 'percentage' 
                            ? `${coupon.discountValue}%` 
                            : `₹${coupon.discountValue.toFixed(2)}`}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <div className="w-full bg-muted rounded-full h-2 max-w-[60px]">
                              <div 
                                className="bg-primary h-2 rounded-full" 
                                style={{ width: `${Math.min(100, (coupon.currentUses / coupon.maxUses) * 100)}%` }}
                              />
                            </div>
                            <span className="text-xs text-muted-foreground">
                              {coupon.currentUses}/{coupon.maxUses}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <span className={isExpired ? 'text-destructive' : ''}>
                            {new Date(coupon.expiryDate).toLocaleDateString()}
                          </span>
                        </TableCell>
                        <TableCell>
                          <Badge variant={coupon.isActive && !isExpired ? 'default' : 'secondary'}>
                            {isExpired ? 'Expired' : coupon.isActive ? 'Active' : 'Inactive'}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end items-center gap-2">
                            <Switch
                              checked={coupon.isActive}
                              onCheckedChange={() => toggleStatus(coupon)}
                              disabled={isExpired}
                            />
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleEdit(coupon)}
                              className="transition-all duration-200 active:scale-[0.98]"
                            >
                              <Edit className="w-4 h-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleDelete(coupon.id)}
                              className="text-destructive hover:text-destructive transition-all duration-200 active:scale-[0.98]"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </TableCell>
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

export default CouponsManagementPage;