import React, { useEffect, useState, useRef } from 'react';
import { Helmet } from 'react-helmet';
import { Plus, Edit, Trash2, Upload, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import Header from '@/components/Header.jsx';
import Footer from '@/components/Footer.jsx';
import AdminHeader from '@/components/AdminHeader.jsx';
import pb from '@/lib/pocketbaseClient.js';
import { toast } from 'sonner';

const ProductsManagementPage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    category: '',
    stock: '',
    brand: '',
    warranty: '',
    rating: '0'
  });
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const fileInputRef = useRef(null);

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      const records = await pb.collection('products').getFullList({
        sort: '-created',
        $autoCancel: false
      });
      setProducts(records);
    } catch (error) {
      console.error('Error loading products:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => setImagePreview(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const clearImage = () => {
    setImageFile(null);
    setImagePreview(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = new FormData();
      data.append('name', formData.name);
      data.append('description', formData.description);
      data.append('price', parseFloat(formData.price));
      data.append('stock', parseInt(formData.stock));
      data.append('category', formData.category);
      data.append('brand', formData.brand);
      data.append('warranty', formData.warranty);
      data.append('rating', parseFloat(formData.rating));
      if (imageFile) {
        data.append('image', imageFile);
      }

      if (editingProduct) {
        await pb.collection('products').update(editingProduct.id, data, { $autoCancel: false });
        toast.success('Product updated');
      } else {
        await pb.collection('products').create(data, { $autoCancel: false });
        toast.success('Product created');
      }

      setDialogOpen(false);
      resetForm();
      loadProducts();
    } catch (error) {
      console.error('Error saving product:', error);
      toast.error('Failed to save product');
    }
  };

  const handleEdit = (product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      description: product.description,
      price: product.price.toString(),
      category: product.category,
      stock: product.stock.toString(),
      brand: product.brand || '',
      warranty: product.warranty || '',
      rating: product.rating?.toString() || '0'
    });
    setImageFile(null);
    if (product.image) {
      setImagePreview(pb.files.getUrl(product, product.image, { thumb: '200x200' }));
    } else {
      setImagePreview(null);
    }
    setDialogOpen(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        await pb.collection('products').delete(id, { $autoCancel: false });
        toast.success('Product deleted');
        loadProducts();
      } catch (error) {
        console.error('Error deleting product:', error);
        toast.error('Failed to delete product');
      }
    }
  };

  const resetForm = () => {
    setEditingProduct(null);
    setFormData({
      name: '',
      description: '',
      price: '',
      category: '',
      stock: '',
      brand: '',
      warranty: '',
      rating: '0'
    });
    setImageFile(null);
    setImagePreview(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <>
      <Helmet>
        <title>Products Management - Sri Ganesh Battery Center</title>
        <meta name="description" content="Manage your product catalog" />
      </Helmet>

      <Header />
      <AdminHeader />

      <main className="py-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-3xl md:text-4xl font-bold" style={{letterSpacing: '-0.02em'}}>
              Products Management
            </h1>
            <Dialog open={dialogOpen} onOpenChange={(open) => {
              setDialogOpen(open);
              if (!open) resetForm();
            }}>
              <DialogTrigger asChild>
                <Button className="transition-all duration-200 active:scale-[0.98]">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Product
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>
                    {editingProduct ? 'Edit Product' : 'Add New Product'}
                  </DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <Label htmlFor="name">Product Name</Label>
                    <Input
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      required
                      className="text-foreground"
                    />
                  </div>

                  <div>
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      name="description"
                      value={formData.description}
                      onChange={handleInputChange}
                      required
                      rows={3}
                      className="text-foreground"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="price">Price (₹)</Label>
                      <Input
                        id="price"
                        name="price"
                        type="number"
                        step="0.01"
                        value={formData.price}
                        onChange={handleInputChange}
                        required
                        className="text-foreground"
                      />
                    </div>
                    <div>
                      <Label htmlFor="stock">Stock</Label>
                      <Input
                        id="stock"
                        name="stock"
                        type="number"
                        value={formData.stock}
                        onChange={handleInputChange}
                        required
                        className="text-foreground"
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="category">Category</Label>
                    <Select
                      value={formData.category}
                      onValueChange={(value) => setFormData({ ...formData, category: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Car Batteries">Car Batteries</SelectItem>
                        <SelectItem value="Bike Batteries">Bike Batteries</SelectItem>
                        <SelectItem value="Inverter Batteries">Inverter Batteries</SelectItem>
                        <SelectItem value="UPS / Solar Batteries">UPS / Solar Batteries</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="brand">Brand</Label>
                      <Select
                        value={formData.brand}
                        onValueChange={(value) => setFormData({ ...formData, brand: value })}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select brand" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Exide">Exide</SelectItem>
                          <SelectItem value="Amaron">Amaron</SelectItem>
                          <SelectItem value="Luminous">Luminous</SelectItem>
                          <SelectItem value="Livguard">Livguard</SelectItem>
                          <SelectItem value="Microtek">Microtek</SelectItem>
                          <SelectItem value="SF Sonic">SF Sonic</SelectItem>
                          <SelectItem value="Okaya">Okaya</SelectItem>
                          <SelectItem value="Other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="warranty">Warranty</Label>
                      <Select
                        value={formData.warranty}
                        onValueChange={(value) => setFormData({ ...formData, warranty: value })}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select warranty" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="6 months">6 months</SelectItem>
                          <SelectItem value="12 months">12 months</SelectItem>
                          <SelectItem value="18 months">18 months</SelectItem>
                          <SelectItem value="24 months">24 months</SelectItem>
                          <SelectItem value="36 months">36 months</SelectItem>
                          <SelectItem value="48 months">48 months</SelectItem>
                          <SelectItem value="60 months">60 months</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div>
                    <Label>Product Image</Label>
                    <div className="mt-2">
                      {imagePreview && (
                        <div className="relative inline-block mb-3">
                          <img
                            src={imagePreview}
                            alt="Preview"
                            className="w-32 h-32 object-cover rounded-lg border"
                          />
                          <button
                            type="button"
                            onClick={clearImage}
                            className="absolute -top-2 -right-2 bg-destructive text-destructive-foreground rounded-full p-1 hover:bg-destructive/90"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </div>
                      )}
                      <div
                        onClick={() => fileInputRef.current?.click()}
                        className="border-2 border-dashed rounded-lg p-4 text-center cursor-pointer hover:border-primary/50 transition-colors"
                      >
                        <Upload className="w-6 h-6 mx-auto mb-2 text-muted-foreground" />
                        <p className="text-sm text-muted-foreground">
                          {imageFile ? imageFile.name : 'Click to upload image'}
                        </p>
                      </div>
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                        className="hidden"
                      />
                    </div>
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
                      {editingProduct ? 'Update' : 'Create'}
                    </Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>
          </div>

          <div className="bg-card rounded-2xl border overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Image</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Brand</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead>Stock</TableHead>
                  <TableHead>Warranty</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-12">
                      Loading products...
                    </TableCell>
                  </TableRow>
                ) : products.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-12 text-muted-foreground">
                      No products found
                    </TableCell>
                  </TableRow>
                ) : (
                  products.map((product) => (
                    <TableRow key={product.id}>
                      <TableCell>
                        {product.image ? (
                          <img
                            src={pb.files.getUrl(product, product.image, { thumb: '50x50' })}
                            alt={product.name}
                            className="w-10 h-10 rounded object-cover"
                          />
                        ) : (
                          <div className="w-10 h-10 rounded bg-muted flex items-center justify-center text-xs text-muted-foreground">N/A</div>
                        )}
                      </TableCell>
                      <TableCell className="font-medium">{product.name}</TableCell>
                      <TableCell>{product.brand || '—'}</TableCell>
                      <TableCell>{product.category}</TableCell>
                      <TableCell>₹{product.price.toFixed(2)}</TableCell>
                      <TableCell>{product.stock}</TableCell>
                      <TableCell>{product.warranty || '—'}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleEdit(product)}
                            className="transition-all duration-200 active:scale-[0.98]"
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleDelete(product.id)}
                            className="text-destructive hover:text-destructive transition-all duration-200 active:scale-[0.98]"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </TableCell>
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

export default ProductsManagementPage;