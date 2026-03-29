import React from 'react';
import { Route, Routes, BrowserRouter as Router } from 'react-router-dom';
import { Toaster } from '@/components/ui/sonner';
import ScrollToTop from './components/ScrollToTop.jsx';
import { AuthProvider } from './contexts/AuthContext.jsx';
import ProtectedRoute from './components/ProtectedRoute.jsx';

import HomePage from './pages/HomePage.jsx';
import ProductCatalogPage from './pages/ProductCatalogPage.jsx';
import ProductDetailPage from './pages/ProductDetailPage.jsx';
import CartPage from './pages/CartPage.jsx';
import CheckoutPage from './pages/CheckoutPage.jsx';
import OrderConfirmationPage from './pages/OrderConfirmationPage.jsx';
import UserProfilePage from './pages/UserProfilePage.jsx';
import WishlistPage from './pages/WishlistPage.jsx';
import LoginPage from './pages/LoginPage.jsx';
import SignupPage from './pages/SignupPage.jsx';

import AdminDashboard from './pages/AdminDashboard.jsx';
import ProductsManagementPage from './pages/ProductsManagementPage.jsx';
import OrdersManagementPage from './pages/OrdersManagementPage.jsx';
import InventoryPage from './pages/InventoryPage.jsx';
import CustomerManagementPage from './pages/CustomerManagementPage.jsx';
import CouponsManagementPage from './pages/CouponsManagementPage.jsx';
import ReviewsManagementPage from './pages/ReviewsManagementPage.jsx';
import AnalyticsPage from './pages/AnalyticsPage.jsx';

function App() {
  return (
    <Router>
      <AuthProvider>
        <ScrollToTop />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/products" element={<ProductCatalogPage />} />
          <Route path="/product/:id" element={<ProductDetailPage />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          
          <Route
            path="/checkout"
            element={
              <ProtectedRoute>
                <CheckoutPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/order-confirmation/:orderId"
            element={
              <ProtectedRoute>
                <OrderConfirmationPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <UserProfilePage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/wishlist"
            element={
              <ProtectedRoute>
                <WishlistPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin"
            element={
              <ProtectedRoute adminOnly>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/products"
            element={
              <ProtectedRoute adminOnly>
                <ProductsManagementPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/orders"
            element={
              <ProtectedRoute adminOnly>
                <OrdersManagementPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/inventory"
            element={
              <ProtectedRoute adminOnly>
                <InventoryPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/customers"
            element={
              <ProtectedRoute adminOnly>
                <CustomerManagementPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/coupons"
            element={
              <ProtectedRoute adminOnly>
                <CouponsManagementPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/reviews"
            element={
              <ProtectedRoute adminOnly>
                <ReviewsManagementPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/analytics"
            element={
              <ProtectedRoute adminOnly>
                <AnalyticsPage />
              </ProtectedRoute>
            }
          />
        </Routes>
        <Toaster />
      </AuthProvider>
    </Router>
  );
}

export default App;