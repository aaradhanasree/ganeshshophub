import { useState, useEffect } from 'react';
import pb from '@/lib/pocketbaseClient.js';

export const useCart = (userId) => {
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (userId) {
      loadCart();
    } else {
      setCart(null);
      setLoading(false);
    }
  }, [userId]);

  const loadCart = async () => {
    try {
      const carts = await pb.collection('cart').getFullList({
        filter: `userId = "${userId}"`,
        sort: '-updated',
        $autoCancel: false
      });
      
      if (carts.length > 0) {
        setCart(carts[0]);
      } else {
        const newCart = await pb.collection('cart').create({
          userId,
          items: []
        }, { $autoCancel: false });
        setCart(newCart);
      }
    } catch (error) {
      console.error('Error loading cart:', error);
    } finally {
      setLoading(false);
    }
  };

  const addToCart = async (product, quantity = 1) => {
    if (!cart) return;

    const items = cart.items || [];
    const existingIndex = items.findIndex(item => item.productId === product.id);
    const currentQty = existingIndex >= 0 ? items[existingIndex].quantity : 0;
    const availableStock = product.stock || 0;

    if (currentQty + quantity > availableStock) {
      throw new Error(`Only ${availableStock} items available${currentQty > 0 ? ` (${currentQty} already in cart)` : ''}`);
    }

    let updatedItems;
    if (existingIndex >= 0) {
      updatedItems = [...items];
      updatedItems[existingIndex].quantity += quantity;
    } else {
      updatedItems = [...items, {
        productId: product.id,
        name: product.name,
        price: product.price,
        image: product.image,
        quantity,
        stock: availableStock
      }];
    }

    const updated = await pb.collection('cart').update(cart.id, {
      items: updatedItems
    }, { $autoCancel: false });

    setCart(updated);
  };

  const removeFromCart = async (productId) => {
    if (!cart) return;

    const updatedItems = cart.items.filter(item => item.productId !== productId);
    const updated = await pb.collection('cart').update(cart.id, {
      items: updatedItems
    }, { $autoCancel: false });

    setCart(updated);
  };

  const updateQuantity = async (productId, quantity) => {
    if (!cart) return;

    const updatedItems = cart.items.map(item => {
      if (item.productId === productId) {
        const maxQty = item.stock || Infinity;
        return { ...item, quantity: Math.min(quantity, maxQty) };
      }
      return item;
    });

    const updated = await pb.collection('cart').update(cart.id, {
      items: updatedItems
    }, { $autoCancel: false });

    setCart(updated);
  };

  const clearCart = async () => {
    if (!cart) return;

    const updated = await pb.collection('cart').update(cart.id, {
      items: []
    }, { $autoCancel: false });

    setCart(updated);
  };

  const getCartTotal = () => {
    if (!cart || !cart.items) return 0;
    return cart.items.reduce((total, item) => item ? total + (item.price * item.quantity) : total, 0);
  };

  const getItemCount = () => {
    if (!cart || !cart.items) return 0;
    return cart.items.reduce((count, item) => item ? count + item.quantity : count, 0);
  };

  return {
    cart,
    loading,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    getCartTotal,
    getItemCount
  };
};