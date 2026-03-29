import React, { useState } from 'react';
import { Calendar, Package, ChevronDown, ChevronUp, MapPin, CreditCard } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';

const OrderCard = ({ order }) => {
  const [expanded, setExpanded] = useState(false);

  const statusColors = {
    pending: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    confirmed: 'bg-blue-100 text-blue-800 border-blue-200',
    shipped: 'bg-purple-100 text-purple-800 border-purple-200',
    delivered: 'bg-green-100 text-green-800 border-green-200',
    cancelled: 'bg-red-100 text-red-800 border-red-200'
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const parseAddress = (addr) => {
    if (!addr) return null;
    try { return typeof addr === 'string' ? JSON.parse(addr) : addr; } catch { return null; }
  };

  const addr = parseAddress(order.shippingAddress);

  return (
    <Card className="transition-all duration-200 hover:shadow-md cursor-pointer" onClick={() => setExpanded(!expanded)}>
      <CardHeader>
        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center gap-2">
              <CardTitle className="text-lg">Order #{order.id.slice(0, 8)}</CardTitle>
              {expanded ? <ChevronUp className="w-4 h-4 text-muted-foreground" /> : <ChevronDown className="w-4 h-4 text-muted-foreground" />}
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
              <Calendar className="w-4 h-4" />
              <span>{formatDate(order.created)}</span>
            </div>
          </div>
          <Badge className={statusColors[order.status] || statusColors.pending}>
            {order.status}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm">
            <Package className="w-4 h-4 text-muted-foreground" />
            <span className="text-muted-foreground">
              {order.items?.length || 0} item{order.items?.length !== 1 ? 's' : ''}
            </span>
          </div>
          <div className="flex items-center justify-between pt-2 border-t">
            <span className="font-medium">Total</span>
            <span className="text-xl font-bold text-primary">
              ₹{order.totalAmount?.toFixed(2) || '0.00'}
            </span>
          </div>
        </div>

        {expanded && (
          <div className="mt-4 space-y-4" onClick={(e) => e.stopPropagation()}>
            <Separator />

            <div>
              <h4 className="font-semibold text-sm mb-2">Items</h4>
              <div className="space-y-2">
                {order.items?.map((item, idx) => (
                  <div key={idx} className="flex justify-between text-sm">
                    <span className="text-muted-foreground">{item.name} × {item.quantity}</span>
                    <span className="font-medium">₹{(item.price * item.quantity).toFixed(2)}</span>
                  </div>
                ))}
              </div>
            </div>

            {order.paymentMethod && (
              <>
                <Separator />
                <div className="flex items-center gap-2 text-sm">
                  <CreditCard className="w-4 h-4 text-muted-foreground" />
                  <span className="text-muted-foreground">Payment:</span>
                  <span className="font-medium capitalize">
                    {order.paymentMethod === 'cod' ? 'Cash on Delivery' : order.paymentMethod === 'bank_transfer' ? 'Bank Transfer' : order.paymentMethod}
                  </span>
                </div>
              </>
            )}

            {addr && (
              <>
                <Separator />
                <div className="flex items-start gap-2 text-sm">
                  <MapPin className="w-4 h-4 text-muted-foreground mt-0.5 shrink-0" />
                  <div>
                    <p className="font-medium mb-1">Shipping Address</p>
                    <p className="text-muted-foreground">
                      {addr.street}<br />
                      {addr.city}, {addr.state} {addr.zip}<br />
                      {addr.country}
                    </p>
                  </div>
                </div>
              </>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default OrderCard;