import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, Package, ShoppingBag, Warehouse, Users, BarChart3, Tag, Star } from 'lucide-react';
import { cn } from '@/lib/utils';

const AdminHeader = () => {
  const location = useLocation();

  const navItems = [
    { path: '/admin', label: 'Dashboard', icon: LayoutDashboard },
    { path: '/admin/products', label: 'Products', icon: Package },
    { path: '/admin/orders', label: 'Orders', icon: ShoppingBag },
    { path: '/admin/inventory', label: 'Inventory', icon: Warehouse },
    { path: '/admin/customers', label: 'Customers', icon: Users },
    { path: '/admin/coupons', label: 'Coupons', icon: Tag },
    { path: '/admin/reviews', label: 'Reviews', icon: Star },
    { path: '/admin/analytics', label: 'Analytics', icon: BarChart3 }
  ];

  return (
    <div className="border-b bg-card">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <nav className="flex gap-1 overflow-x-auto py-2 scrollbar-hide">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            
            return (
              <Link
                key={item.path}
                to={item.path}
                className={cn(
                  'flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 whitespace-nowrap',
                  isActive
                    ? 'bg-primary text-primary-foreground'
                    : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                )}
              >
                <Icon className="w-4 h-4" />
                {item.label}
              </Link>
            );
          })}
        </nav>
      </div>
    </div>
  );
};

export default AdminHeader;