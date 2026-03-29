import { useState } from 'react';
import pb from '@/lib/pocketbaseClient.js';

export const useCoupon = () => {
  const [loading, setLoading] = useState(false);

  const validateCoupon = async (code, orderTotal) => {
    setLoading(true);
    try {
      const records = await pb.collection('coupons').getFullList({
        filter: `code = "${code.toUpperCase()}" && isActive = true`,
        $autoCancel: false
      });

      if (records.length === 0) {
        throw new Error('Invalid or inactive coupon code');
      }

      const coupon = records[0];

      if (new Date(coupon.expiryDate) < new Date()) {
        throw new Error('This coupon has expired');
      }

      if (coupon.currentUses >= coupon.maxUses) {
        throw new Error('This coupon has reached its usage limit');
      }

      if (coupon.minOrderAmount && orderTotal < coupon.minOrderAmount) {
        throw new Error(`Minimum order amount of ₹${coupon.minOrderAmount.toFixed(2)} required`);
      }

      let discountAmount = 0;
      if (coupon.discountType === 'percentage') {
        discountAmount = orderTotal * (coupon.discountValue / 100);
      } else {
        discountAmount = coupon.discountValue;
      }

      // Ensure discount doesn't exceed order total
      discountAmount = Math.min(discountAmount, orderTotal);

      return {
        valid: true,
        coupon,
        discountAmount
      };
    } catch (error) {
      return {
        valid: false,
        error: error.message
      };
    } finally {
      setLoading(false);
    }
  };

  return { validateCoupon, loading };
};