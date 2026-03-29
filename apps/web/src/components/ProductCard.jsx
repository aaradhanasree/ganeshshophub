import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart, Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import pb from '@/lib/pocketbaseClient.js';
import { useWishlist } from '@/hooks/useWishlist.js';

const ProductCard = ({ product, onAddToCart }) => {
  const { isInWishlist, toggleWishlist } = useWishlist();
  const [isToggling, setIsToggling] = useState(false);
  
  const isWishlisted = isInWishlist(product.id);

  const imageUrl = product.image 
    ? pb.files.getUrl(product, product.image, { thumb: '300x300' })
    : 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=300&h=300&fit=crop';

  const handleWishlistToggle = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsToggling(true);
    await toggleWishlist(product.id);
    setIsToggling(false);
  };

  return (
    <Card className="group overflow-hidden transition-all duration-200 hover:shadow-lg flex flex-col h-full relative">
      <Button
        variant="ghost"
        size="icon"
        className="absolute top-2 right-2 z-10 bg-background/50 backdrop-blur-sm hover:bg-background/80 transition-all duration-200"
        onClick={handleWishlistToggle}
        disabled={isToggling}
      >
        <Heart 
          className={`w-5 h-5 transition-colors duration-200 ${
            isWishlisted ? 'fill-destructive text-destructive' : 'text-foreground'
          }`} 
        />
      </Button>

      <Link to={`/product/${product.id}`} className="block">
        <div className="aspect-square overflow-hidden bg-muted">
          <img
            src={imageUrl}
            alt={product.name}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        </div>
      </Link>
      <CardContent className="p-4 flex-1 flex flex-col">
        <div className="flex items-start justify-between gap-2 mb-2">
          <Link to={`/product/${product.id}`}>
            <h3 className="font-semibold text-lg leading-tight hover:text-primary transition-colors">
              {product.name}
            </h3>
          </Link>
          {product.stock < 10 && product.stock > 0 && (
            <Badge variant="outline" className="text-xs shrink-0">
              Low stock
            </Badge>
          )}
        </div>
        <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
          {product.description}
        </p>
        {product.brand && (
          <p className="text-sm font-medium text-foreground mb-1">{product.brand}</p>
        )}
        {product.warranty && (
          <p className="text-xs text-muted-foreground mb-3">Warranty: {product.warranty}</p>
        )}
        <div className="mt-auto">
          <p className="text-2xl font-bold text-primary">
            ₹{product.price.toFixed(2)}
          </p>
          <p className={`text-sm mt-1 font-medium ${
            product.stock === 0 ? 'text-destructive' : product.stock < 10 ? 'text-orange-600' : 'text-green-600'
          }`}>
            {product.stock === 0 ? 'Out of Stock' : `${product.stock} left in stock`}
          </p>
        </div>
      </CardContent>
      <CardFooter className="p-4 pt-0">
        <Button
          onClick={() => onAddToCart(product)}
          disabled={product.stock === 0}
          className="w-full transition-all duration-200 active:scale-[0.98]"
        >
          <ShoppingCart className="w-4 h-4 mr-2" />
          {product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ProductCard;