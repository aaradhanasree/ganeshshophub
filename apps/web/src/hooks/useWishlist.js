import { useState, useEffect, useCallback } from 'react';
import pb from '@/lib/pocketbaseClient.js';
import { useAuth } from '@/contexts/AuthContext.jsx';
import { toast } from 'sonner';

// Global cache to share wishlist state across components without redundant fetching
let globalWishlist = null;
let globalWishlistSubscribers = new Set();

export const useWishlist = () => {
  const { currentUser } = useAuth();
  const [wishlist, setWishlist] = useState(globalWishlist || []);
  const [loading, setLoading] = useState(!globalWishlist);

  const notifySubscribers = (newList) => {
    globalWishlist = newList;
    globalWishlistSubscribers.forEach(set => set(newList));
  };

  const fetchWishlist = useCallback(async () => {
    if (!currentUser) {
      notifySubscribers([]);
      setLoading(false);
      return;
    }
    try {
      const records = await pb.collection('wishlist').getFullList({
        filter: `userId = "${currentUser.id}"`,
        $autoCancel: false
      });
      notifySubscribers(records);
    } catch (error) {
      console.error('Error fetching wishlist:', error);
    } finally {
      setLoading(false);
    }
  }, [currentUser]);

  useEffect(() => {
    globalWishlistSubscribers.add(setWishlist);
    if (!globalWishlist || globalWishlist.length === 0) {
      fetchWishlist();
    } else {
      setLoading(false);
    }
    return () => {
      globalWishlistSubscribers.delete(setWishlist);
    };
  }, [fetchWishlist]);

  const addToWishlist = async (productId) => {
    if (!currentUser) {
      toast.error('Please login to add items to your wishlist');
      return false;
    }
    try {
      const record = await pb.collection('wishlist').create({
        userId: currentUser.id,
        productId: productId
      }, { $autoCancel: false });
      
      notifySubscribers([...(globalWishlist || []), record]);
      toast.success('Added to wishlist');
      return true;
    } catch (error) {
      console.error('Error adding to wishlist:', error);
      toast.error('Failed to add to wishlist');
      return false;
    }
  };

  const removeFromWishlist = async (productId) => {
    if (!currentUser) return false;
    try {
      const item = (globalWishlist || []).find(w => w.productId === productId);
      if (item) {
        await pb.collection('wishlist').delete(item.id, { $autoCancel: false });
        notifySubscribers((globalWishlist || []).filter(w => w.id !== item.id));
        toast.success('Removed from wishlist');
        return true;
      }
    } catch (error) {
      console.error('Error removing from wishlist:', error);
      toast.error('Failed to remove from wishlist');
      return false;
    }
  };

  const toggleWishlist = async (productId) => {
    if (isInWishlist(productId)) {
      return await removeFromWishlist(productId);
    } else {
      return await addToWishlist(productId);
    }
  };

  const isInWishlist = (productId) => {
    return (wishlist || []).some(w => w.productId === productId);
  };

  return {
    wishlist: wishlist || [],
    loading,
    addToWishlist,
    removeFromWishlist,
    toggleWishlist,
    isInWishlist,
    getWishlistCount: () => (wishlist || []).length
  };
};