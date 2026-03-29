\# Database Schema Documentation



\## Overview



The E-Commerce Platform uses PocketBase as its backend database and authentication service. PocketBase provides a SQLite database with a REST API, making it ideal for rapid development and deployment.



This document describes all 7 collections, their purposes, access rules, and field definitions.



\## Collections Overview



| Collection | Purpose | Records |

|-----------|---------|---------|

| \*\*users\*\* | User accounts and authentication | Customers and admins |

| \*\*products\*\* | Product catalog | All products for sale |

| \*\*orders\*\* | Customer orders | Purchase history |

| \*\*cart\*\* | Shopping carts | One per user |

| \*\*reviews\*\* | Product reviews | Customer feedback |

| \*\*coupons\*\* | Discount codes | Promotional codes |

| \*\*wishlist\*\* | Saved products | User favorites |



---



\## 1. USERS Collection



\*\*Purpose:\*\* Store user accounts, authentication credentials, and profile information.



\*\*Access Rules:\*\*

\- `listRule`: `@request.auth.id != ""` (Authenticated users can list)

\- `viewRule`: `id = @request.auth.id` (Users can only view their own profile)

\- `createRule`: `` (Public signup allowed)

\- `updateRule`: `id = @request.auth.id` (Users can only update their own profile)

\- `deleteRule`: `id = @request.auth.id` (Users can only delete their own account)



\*\*Fields:\*\*



| Field | Type | Required | Constraints | Description |

|-------|------|----------|-------------|-------------|

| id | text | Yes | Primary key, 15 chars | Unique user identifier |

| email | email | Yes | Unique | User email address |

| password | password | Yes | Min 8 chars | Hashed password |

| firstName | text | No | Max 255 chars | User's first name |

| lastName | text | No | Max 255 chars | User's last name |

| name | text | No | Max 255 chars | Full name |

| avatar | file | No | Image only | Profile picture |

| role | select | No | customer/admin | User role |

| created | autodate | Yes | Auto-generated | Account creation date |

| updated | autodate | Yes | Auto-updated | Last update date |



\*\*Sample Data:\*\*

