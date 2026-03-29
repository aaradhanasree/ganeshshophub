import express from 'express';
import Stripe from 'stripe';

const router = express.Router();

const STRIPE_KEY = process.env.STRIPE_SECRET_KEY;
const isStripeConfigured = STRIPE_KEY && !STRIPE_KEY.includes('your_stripe');
const stripe = isStripeConfigured ? new Stripe(STRIPE_KEY) : null;

// Create Checkout Session
router.post('/create-checkout', async (req, res) => {
  if (!isStripeConfigured) {
    return res.status(503).json({ error: 'Stripe is not configured. Set STRIPE_SECRET_KEY in apps/api/.env' });
  }

  const { amount, items, successUrl, cancelUrl } = req.body;

  if (!amount || !items || !successUrl || !cancelUrl) {
    return res.status(400).json({ error: 'Missing required fields: amount, items, successUrl, cancelUrl' });
  }

  try {
    const lineItems = items.map(item => ({
      price_data: {
        currency: 'inr',
        product_data: {
          name: item.name,
        },
        unit_amount: Math.round(item.price * 100),
      },
      quantity: item.quantity || 1,
    }));

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: lineItems,
      mode: 'payment',
      success_url: successUrl,
      cancel_url: cancelUrl,
    });

    res.json({ url: session.url });
  } catch (error) {
    console.error('Stripe create-checkout error:', error.message);
    res.status(500).json({ error: 'Failed to create checkout session' });
  }
});

// Retrieve Checkout Session
router.get('/session/:sessionId', async (req, res) => {
  if (!isStripeConfigured) {
    return res.status(503).json({ error: 'Stripe is not configured' });
  }

  const { sessionId } = req.params;

  if (!sessionId) {
    return res.status(400).json({ error: 'sessionId is required' });
  }

  try {
    const session = await stripe.checkout.sessions.retrieve(sessionId);

    res.json({
      id: session.id,
      status: session.payment_status,
      amountTotal: session.amount_total,
      customerEmail: session.customer_details?.email,
    });
  } catch (error) {
    console.error('Stripe session retrieve error:', error.message);
    res.status(500).json({ error: 'Failed to retrieve session' });
  }
});

export default router;