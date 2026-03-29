import React from 'react';
import { Minus, Plus, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import pb from '@/lib/pocketbaseClient.js';

const CartItem = ({ item, onUpdateQuantity, onRemove }) => {
  const imageUrl = item.image 
    ? (item.image.startsWith('http') ? item.image : pb.files.getUrl({ collectionId: 'products', id: item.productId }, item.image, { thumb: '100x100' }))
    : 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=100&h=100&fit=crop';

  return (
    <div className="flex gap-4 py-4 border-b last:border-0">
      <div className="w-24 h-24 rounded-lg overflow-hidden bg-muted shrink-0">
        <img
          src={imageUrl}
          alt={item.name}
          className="w-full h-full object-cover"
        />
      </div>
      <div className="flex-1 min-w-0">
        <h3 className="font-semibold text-lg mb-1 truncate">{item.name}</h3>
        <p className="text-xl font-bold text-primary mb-3">
          ₹{item.price.toFixed(2)}
        </p>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="icon"
            className="h-8 w-8 transition-all duration-200 active:scale-[0.98]"
            onClick={() => onUpdateQuantity(item.productId, Math.max(1, item.quantity - 1))}
          >
            <Minus className="w-4 h-4" />
          </Button>
          <span className="w-12 text-center font-medium">{item.quantity}</span>
          <Button
            variant="outline"
            size="icon"
            className="h-8 w-8 transition-all duration-200 active:scale-[0.98]"
            onClick={() => onUpdateQuantity(item.productId, item.quantity + 1)}
            disabled={item.stock && item.quantity >= item.stock}
          >
            <Plus className="w-4 h-4" />
          </Button>
          {item.stock && (
            <span className="text-xs text-muted-foreground ml-1">/ {item.stock}</span>
          )}
        </div>
      </div>
      <div className="flex flex-col items-end justify-between">
        <Button
          variant="ghost"
          size="icon"
          className="text-destructive hover:text-destructive hover:bg-destructive/10 transition-all duration-200 active:scale-[0.98]"
          onClick={() => onRemove(item.productId)}
        >
          <Trash2 className="w-4 h-4" />
        </Button>
        <p className="text-lg font-bold">
          ₹{(item.price * item.quantity).toFixed(2)}
        </p>
      </div>
    </div>
  );
};

export default CartItem;