import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingCart, User, Menu, Search, LogOut, LayoutDashboard, Heart, Battery } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { useAuth } from '@/contexts/AuthContext.jsx';
import { useCart } from '@/hooks/useCart.js';
import { useWishlist } from '@/hooks/useWishlist.js';

const Header = () => {
  const navigate = useNavigate();
  const { currentUser, isAuthenticated, isAdmin, logout } = useAuth();
  const { getItemCount } = useCart(isAdmin ? null : currentUser?.id);
  const { getWishlistCount, loading: wishlistLoading } = useWishlist();
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchQuery)}`);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const NavLinks = ({ mobile = false }) => (
    <div className={mobile ? 'flex flex-col gap-4' : 'hidden md:flex items-center gap-6'}>
      <Link
        to="/"
        className="text-foreground hover:text-primary transition-colors duration-200 font-medium"
      >
        Home
      </Link>
      <Link
        to="/products"
        className="text-foreground hover:text-primary transition-colors duration-200 font-medium"
      >
        Products
      </Link>
      {isAuthenticated && !isAdmin && (
        <>
          <Link
            to="/cart"
            className="text-foreground hover:text-primary transition-colors duration-200 font-medium"
          >
            Cart
          </Link>
          <Link
            to="/wishlist"
            className="text-foreground hover:text-primary transition-colors duration-200 font-medium"
          >
            Wishlist
          </Link>
          <Link
            to="/profile"
            className="text-foreground hover:text-primary transition-colors duration-200 font-medium"
          >
            Profile
          </Link>
        </>
      )}
      {isAdmin && (
        <Link
          to="/admin"
          className="text-foreground hover:text-primary transition-colors duration-200 font-medium"
        >
          Admin Dashboard
        </Link>
      )}
    </div>
  );

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between gap-4">
          <div className="flex items-center gap-6">
            <Link to="/" className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
                <Battery className="w-5 h-5 text-primary-foreground" />
              </div>
              <span className="font-bold text-xl">Sri Ganesh Battery Center</span>
            </Link>
            <NavLinks />
          </div>

          <form onSubmit={handleSearch} className="hidden md:flex flex-1 max-w-md">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-muted/50 border-0 focus-visible:ring-1"
              />
            </div>
          </form>

          <div className="flex items-center gap-2">
            {isAuthenticated ? (
              <>
                {!isAdmin && (
                  <>
                    <Link to="/wishlist" className="relative">
                      <Button variant="ghost" size="icon" className="transition-all duration-200 active:scale-[0.98]">
                        <Heart className="w-5 h-5" />
                        {!wishlistLoading && getWishlistCount() > 0 && (
                          <span className="absolute -top-1 -right-1 w-5 h-5 bg-primary text-primary-foreground text-xs rounded-full flex items-center justify-center">
                            {getWishlistCount()}
                          </span>
                        )}
                      </Button>
                    </Link>
                    <Link to="/cart" className="relative">
                      <Button variant="ghost" size="icon" className="transition-all duration-200 active:scale-[0.98]">
                        <ShoppingCart className="w-5 h-5" />
                        {getItemCount() > 0 && (
                          <span className="absolute -top-1 -right-1 w-5 h-5 bg-primary text-primary-foreground text-xs rounded-full flex items-center justify-center">
                            {getItemCount()}
                          </span>
                        )}
                      </Button>
                    </Link>
                  </>
                )}
                {isAdmin && (
                  <Link to="/admin">
                    <Button variant="ghost" size="icon" className="transition-all duration-200 active:scale-[0.98]">
                      <LayoutDashboard className="w-5 h-5" />
                    </Button>
                  </Link>
                )}
                <Link to="/profile">
                  <Button variant="ghost" size="icon" className="transition-all duration-200 active:scale-[0.98]">
                    <User className="w-5 h-5" />
                  </Button>
                </Link>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleLogout}
                  className="transition-all duration-200 active:scale-[0.98]"
                >
                  <LogOut className="w-5 h-5" />
                </Button>
              </>
            ) : (
              <>
                <Link to="/login">
                  <Button variant="ghost" className="transition-all duration-200 active:scale-[0.98]">
                    Login
                  </Button>
                </Link>
                <Link to="/signup">
                  <Button className="transition-all duration-200 active:scale-[0.98]">
                    Sign Up
                  </Button>
                </Link>
              </>
            )}

            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="md:hidden transition-all duration-200 active:scale-[0.98]">
                  <Menu className="w-5 h-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right">
                <div className="flex flex-col gap-6 mt-6">
                  <form onSubmit={handleSearch} className="md:hidden">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <Input
                        type="search"
                        placeholder="Search products..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                  </form>
                  <NavLinks mobile />
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;