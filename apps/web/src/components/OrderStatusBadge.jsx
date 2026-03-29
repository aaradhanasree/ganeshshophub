
import React from 'react';
import { Badge } from '@/components/ui/badge';

const OrderStatusBadge = ({ status }) => {
  const statusConfig = {
    pending: {
      label: 'Pending',
      className: 'bg-yellow-100 text-yellow-800 border-yellow-200'
    },
    confirmed: {
      label: 'Confirmed',
      className: 'bg-blue-100 text-blue-800 border-blue-200'
    },
    shipped: {
      label: 'Shipped',
      className: 'bg-purple-100 text-purple-800 border-purple-200'
    },
    delivered: {
      label: 'Delivered',
      className: 'bg-green-100 text-green-800 border-green-200'
    },
    cancelled: {
      label: 'Cancelled',
      className: 'bg-red-100 text-red-800 border-red-200'
    }
  };

  const config = statusConfig[status] || statusConfig.pending;

  return (
    <Badge className={config.className}>
      {config.label}
    </Badge>
  );
};

export default OrderStatusBadge;