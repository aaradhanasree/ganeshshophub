import { useState, useEffect } from 'react';
import pb from '@/lib/pocketbaseClient.js';

export const useProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchProducts = async (filters = {}) => {
    setLoading(true);
    try {
      let filterString = '';
      const conditions = [];

      if (filters.category) {
        conditions.push(`category = "${filters.category}"`);
      }
      if (filters.minPrice !== undefined) {
        conditions.push(`price >= ${filters.minPrice}`);
      }
      if (filters.maxPrice !== undefined) {
        conditions.push(`price <= ${filters.maxPrice}`);
      }
      if (filters.minRating !== undefined) {
        conditions.push(`rating >= ${filters.minRating}`);
      }
      if (filters.search) {
        conditions.push(`(name ~ "${filters.search}" || description ~ "${filters.search}")`);
      }

      if (conditions.length > 0) {
        filterString = conditions.join(' && ');
      }

      const records = await pb.collection('products').getFullList({
        filter: filterString,
        sort: filters.sort || '-created',
        $autoCancel: false
      });

      setProducts(records);
      return records;
    } catch (error) {
      console.error('Error fetching products:', error);
      return [];
    } finally {
      setLoading(false);
    }
  };

  const fetchProductById = async (id) => {
    try {
      const record = await pb.collection('products').getOne(id, { $autoCancel: false });
      return record;
    } catch (error) {
      console.error('Error fetching product:', error);
      return null;
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  return {
    products,
    loading,
    fetchProducts,
    fetchProductById
  };
};