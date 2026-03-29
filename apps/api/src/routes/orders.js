import express from 'express';
import Stripe from 'stripe';
import pb from '../utils/pocketbaseClient.js';

const router = express.Router();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// Create order from Stripe checkout session
router.post('/create-from-stripe', async (req, res) => {
  const { sessionId, userId, items, shippingAddress } = req.body;

  if (!sessionId || !userId || !items || !shippingAddress) {
    return res.status(400).json({ error: 'Missing required fields: sessionId, userId, items, shippingAddress' });
  }

  // Verify session with Stripe
  const session = await stripe.checkout.sessions.retrieve(sessionId);

  if (!session) {
    throw new Error('Stripe session not found');
  }

  if (session.payment_status !== 'paid') {
    throw new Error('Payment not completed for this session');
  }

  // Create order record in PocketBase
  const order = await pb.collection('orders').create({
    userId,
    sessionId,
    items,
    shippingAddress,
    status: 'processing',
    amountTotal: session.amount_total,
    customerEmail: session.customer_details?.email,
  });

  res.json({ orderId: order.id });
});

export default router;