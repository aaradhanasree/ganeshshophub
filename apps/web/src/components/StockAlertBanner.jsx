import React from 'react';
import { AlertTriangle } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

const StockAlertBanner = ({ lowStockProducts }) => {
  if (!lowStockProducts || lowStockProducts.length === 0) return null;

  return (
    <Alert className="border-orange-200 bg-orange-50">
      <AlertTriangle className="h-4 w-4 text-orange-600" />
      <AlertTitle className="text-orange-900">Low Stock Alert</AlertTitle>
      <AlertDescription className="text-orange-800">
        {lowStockProducts.length} product{lowStockProducts.length !== 1 ? 's' : ''} running low on stock
      </AlertDescription>
    </Alert>
  );
};

export default StockAlertBanner;