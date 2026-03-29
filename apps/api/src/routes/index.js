import { Router } from 'express';
import healthCheck from './health-check.js';
import stripeRouter from './stripe.js';
import ordersRouter from './orders.js';

const router = Router();

export default () => {
    router.get('/health', healthCheck);
    router.use('/stripe', stripeRouter);
    router.use('/orders', ordersRouter);

    return router;
};