\# E-Commerce Platform



A comprehensive full-stack e-commerce application built with modern web technologies. This platform provides a complete shopping experience for customers and powerful management tools for administrators.



\## Overview



ShopHub is a production-ready e-commerce platform featuring a responsive customer storefront, secure payment processing, and an intuitive admin dashboard. Built with React, Vite, and PocketBase, it delivers fast performance and seamless user experience across all devices.



\## Features



\### Customer Features



\*\*Product Browsing\*\*

\- Browse all products with detailed information

\- Filter by category, price range, and customer ratings

\- Full-text search functionality

\- Responsive grid layout with product cards

\- Product detail pages with images, descriptions, and specifications



\*\*Shopping Cart\*\*

\- Add/remove items from cart

\- Update item quantities

\- Persistent cart storage using PocketBase

\- Real-time cart summary with subtotals

\- Free shipping on orders over $50



\*\*Checkout \& Payment\*\*

\- Shipping address form with validation

\- Order review before payment

\- Secure Stripe payment integration

\- Multiple payment methods support

\- Order confirmation with details



\*\*Wishlist\*\*

\- Save favorite products for later

\- View all wishlisted items

\- Add items to cart directly from wishlist

\- Remove items from wishlist

\- Real-time wishlist count in header



\*\*Product Reviews\*\*

\- View customer reviews with ratings

\- Submit reviews for purchased products

\- Helpful/unhelpful voting system

\- Verified purchase badges

\- Review filtering and sorting

\- Admin moderation of reviews



\*\*User Account\*\*

\- User profile management

\- Order history with status tracking

\- Saved addresses

\- Account settings and preferences

\- Password management



\### Admin Features



\*\*Dashboard\*\*

\- Key metrics overview (total sales, orders, products, growth)

\- Sales trend charts

\- Recent orders list

\- Inventory status summary

\- Revenue analytics



\*\*Product Management\*\*

\- Create, edit, and delete products

\- Bulk product operations

\- Image upload and management

\- Inventory tracking

\- Category and pricing management

\- Product search and filtering



\*\*Order Management\*\*

\- View all customer orders

\- Update order status (pending → processing → shipped → delivered)

\- Order detail view with customer info

\- Shipment tracking

\- Order history and analytics



\*\*Inventory Management\*\*

\- Real-time stock level tracking

\- Low stock alerts and notifications

\- Inventory reports

\- Stock adjustment tools

\- Reorder point management



\*\*Coupon Management\*\*

\- Create and manage discount codes

\- Set discount type (percentage or fixed amount)

\- Configure expiry dates and usage limits

\- Track coupon usage statistics

\- Activate/deactivate coupons

\- Minimum order amount requirements



\*\*Review Moderation\*\*

\- Approve/reject customer reviews

\- Manage review visibility

\- View review statistics

\- Filter reviews by status

\- Respond to reviews



\*\*Analytics\*\*

\- Sales reports and trends

\- Customer insights and behavior

\- Product performance metrics

\- Revenue tracking and forecasting

\- Customer acquisition data



\### Authentication \& Security



\- Secure user registration with email verification

\- Password hashing and encryption

\- Role-based access control (customer/admin)

\- Protected routes and admin-only pages

\- Session management

\- Secure password reset functionality



\### Payment Processing



\- Stripe integration for secure payments

\- PCI compliance

\- Multiple payment methods

\- Payment confirmation emails

\- Automatic order confirmation



\### Email Notifications



\- Welcome emails on signup

\- Order confirmation emails

\- Shipping notifications

\- Review request emails

\- Promotional email support



\## Tech Stack



\### Frontend

\- \*\*React 18\*\* - UI library

\- \*\*Vite\*\* - Build tool and dev server

\- \*\*TailwindCSS\*\* - Utility-first CSS framework

\- \*\*shadcn/ui\*\* - High-quality React components

\- \*\*React Router\*\* - Client-side routing

\- \*\*Framer Motion\*\* - Animation library

\- \*\*Recharts\*\* - Data visualization

\- \*\*Lucide React\*\* - Icon library



\### Backend

\- \*\*Express.js\*\* - Node.js web framework

\- \*\*PocketBase\*\* - Backend-as-a-service with database

\- \*\*Stripe\*\* - Payment processing

\- \*\*Node.js\*\* - JavaScript runtime



\### Database

\- \*\*PocketBase\*\* - SQLite-based database with REST API

\- Collections: users, products, orders, cart, reviews, coupons, wishlist



\### Deployment

\- \*\*Vite\*\* for frontend bundling

\- \*\*Express.js\*\* for API server

\- \*\*PocketBase\*\* for database and authentication



\## Installation



\### Prerequisites

\- Node.js 16 or higher

\- npm 8 or higher

\- Git

\- Stripe account (for payment processing)

\- PocketBase (for database)



\### Clone Repository

```bash
git clone <your-repo-url>
cd E-com-main
```

\### PocketBase Admin Account

Use these default admin credentials for local development:

\- Admin Panel: http://127.0.0.1:8090/_/

\- Email: admin@example.com

\- Password: SecureAdmin@123

These defaults are defined in:

\- setup-auto.mjs (`PB_ADMIN_EMAIL`, `PB_ADMIN_PASSWORD` fallback values)

\- setup-collections.js (`PB_ADMIN_EMAIL`, `PB_ADMIN_PASSWORD` fallback values)

For security, change these values in production and prefer environment variables.

