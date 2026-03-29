#!/usr/bin/env node

const baseUrl = 'http://127.0.0.1:8090/api';

const adminEmail = process.env.PB_ADMIN_EMAIL || 'admin@example.com';
const adminPassword = process.env.PB_ADMIN_PASSWORD || 'SecureAdmin@123';

let adminToken = null;

async function apiCall(method, endpoint, body = null, token = null) {
  const url = `${baseUrl}${endpoint}`;
  const options = {
    method,
    headers: {
      'Content-Type': 'application/json',
    },
  };

  if (token) {
    options.headers['Authorization'] = `Bearer ${token}`;
  }

  if (body) {
    options.body = JSON.stringify(body);
  }

  try {
    const response = await fetch(url, options);
    const data = await response.json();

    if (!response.ok) {
      return { ok: false, status: response.status, error: data };
    }

    return { ok: true, status: response.status, data };
  } catch (error) {
    return { ok: false, error: error.message };
  }
}

async function setupAdmin() {
  console.log('Setting up PocketBase admin account...\n');

  // Try to create admin account
  console.log('Creating admin account...');
  const createResult = await apiCall('POST', '/admins', {
    email: adminEmail,
    password: adminPassword,
    passwordConfirm: adminPassword,
  });

  if (createResult.ok) {
    console.log(`✓ Admin account created: ${adminEmail}`);
  } else if (createResult.error?.data?.email) {
    console.log(`✓ Admin email already exists, authenticating...`);
  } else {
    console.log(`Note: ${createResult.error?.message || 'Admin creation note'}`);
  }

  // Authenticate
  console.log('Authenticating admin...');
  const authResult = await apiCall('POST', '/admins/auth-with-password', {
    identity: adminEmail,
    password: adminPassword,
  });

  if (authResult.ok) {
    adminToken = authResult.data.token;
    console.log(`✓ Admin authenticated successfully\n`);
    return true;
  } else {
    console.error(`✗ Authentication failed: ${authResult.error?.message}`);
    return false;
  }
}

async function createCollection(name, schema) {
  const result = await apiCall('POST', '/collections', schema, adminToken);

  if (result.ok) {
    console.log(`✓ ${name} collection created`);
    return true;
  } else if (result.error?.message?.includes('already exists')) {
    console.log(`✓ ${name} collection already exists`);
    return true;
  } else {
    console.log(`✗ Error creating ${name}: ${result.error?.message}`);
    return false;
  }
}

async function setupCollections() {
  console.log('Creating collections...\n');

  // 1. Users Collection
  await createCollection('users', {
    name: 'users',
    type: 'auth',
    createRule: '',
    updateRule: 'id = @request.auth.id',
    deleteRule: 'id = @request.auth.id',
    listRule: '@request.auth.id != ""',
    viewRule: 'id = @request.auth.id',
    schema: [
      { id: 'firstName', name: 'firstName', type: 'text' },
      { id: 'lastName', name: 'lastName', type: 'text' },
      { id: 'role', name: 'role', type: 'select', options: { values: ['customer', 'admin'] } },
      { id: 'avatar', name: 'avatar', type: 'file', options: { maxSelect: 1 } },
    ],
  });

  // 2. Products Collection
  await createCollection('products', {
    name: 'products',
    type: 'base',
    listRule: '',
    viewRule: '',
    schema: [
      { id: 'name', name: 'name', type: 'text', required: true },
      { id: 'description', name: 'description', type: 'text' },
      { id: 'price', name: 'price', type: 'number', required: true },
      { id: 'stock', name: 'stock', type: 'number', required: true },
      { id: 'category', name: 'category', type: 'text' },
      { id: 'rating', name: 'rating', type: 'number' },
      { id: 'image', name: 'image', type: 'file', options: { maxSelect: 1 } },
    ],
  });

  // 3. Orders Collection
  await createCollection('orders', {
    name: 'orders',
    type: 'base',
    listRule: '@request.auth.id != ""',
    viewRule: '@request.auth.id != ""',
    createRule: '@request.auth.id != ""',
    schema: [
      { id: 'userId', name: 'userId', type: 'relation', required: true, options: { collectionRelation: 'users', cascadeDelete: false } },
      { id: 'items', name: 'items', type: 'json', required: true },
      { id: 'totalAmount', name: 'totalAmount', type: 'number', required: true },
      { id: 'status', name: 'status', type: 'select', required: true, options: { values: ['pending', 'confirmed', 'shipped', 'delivered', 'cancelled'] } },
      { id: 'shippingAddress', name: 'shippingAddress', type: 'text', required: true },
    ],
  });

  // 4. Cart Collection
  await createCollection('cart', {
    name: 'cart',
    type: 'base',
    listRule: '@request.auth.id != ""',
    viewRule: '@request.auth.id != ""',
    createRule: '@request.auth.id != ""',
    updateRule: '@request.auth.id != ""',
    deleteRule: '@request.auth.id != ""',
    schema: [
      { id: 'userId', name: 'userId', type: 'relation', required: true, options: { collectionRelation: 'users', cascadeDelete: true } },
      { id: 'items', name: 'items', type: 'json', required: true },
    ],
  });

  // 5. Reviews Collection
  await createCollection('reviews', {
    name: 'reviews',
    type: 'base',
    listRule: '',
    viewRule: '',
    createRule: '@request.auth.id != ""',
    updateRule: 'userId = @request.auth.id',
    deleteRule: 'userId = @request.auth.id',
    schema: [
      { id: 'productId', name: 'productId', type: 'relation', required: true, options: { collectionRelation: 'products', cascadeDelete: true } },
      { id: 'userId', name: 'userId', type: 'relation', required: true, options: { collectionRelation: 'users', cascadeDelete: true } },
      { id: 'rating', name: 'rating', type: 'number', required: true },
      { id: 'comment', name: 'comment', type: 'text' },
    ],
  });

  // 6. Coupons Collection
  await createCollection('coupons', {
    name: 'coupons',
    type: 'base',
    schema: [
      { id: 'code', name: 'code', type: 'text', required: true, unique: true },
      { id: 'discountPercentage', name: 'discountPercentage', type: 'number', required: true },
      { id: 'isActive', name: 'isActive', type: 'bool', required: true },
    ],
  });

  // 7. Wishlist Collection
  await createCollection('wishlist', {
    name: 'wishlist',
    type: 'base',
    listRule: '@request.auth.id != ""',
    viewRule: '@request.auth.id != ""',
    createRule: '@request.auth.id != ""',
    deleteRule: '@request.auth.id != ""',
    schema: [
      { id: 'userId', name: 'userId', type: 'relation', required: true, options: { collectionRelation: 'users', cascadeDelete: true } },
      { id: 'productId', name: 'productId', type: 'relation', required: true, options: { collectionRelation: 'products', cascadeDelete: true } },
    ],
  });
}

async function main() {
  try {
    const adminSetup = await setupAdmin();
    if (!adminSetup) {
      console.error('Failed to set up admin');
      process.exit(1);
    }

    await setupCollections();

    console.log('\n' + '='.repeat(60));
    console.log('✓ PocketBase Setup Complete');
    console.log('='.repeat(60));
    console.log(`\nAdmin Panel:        http://127.0.0.1:8090/_/`);
    console.log(`Admin Email:        ${adminEmail}`);
    console.log(`Admin Password:     ${adminPassword}`);
    console.log(`\nAPI Endpoint:       http://127.0.0.1:8090/api`);
    console.log(`\nWeb App:            http://localhost:3002`);
    console.log(`API Server:         http://localhost:3001`);
    console.log('\nCollections created:');
    console.log('  ✓ users (auth)');
    console.log('  ✓ products');
    console.log('  ✓ orders');
    console.log('  ✓ cart');
    console.log('  ✓ reviews');
    console.log('  ✓ coupons');
    console.log('  ✓ wishlist');
    console.log('='.repeat(60) + '\n');
  } catch (error) {
    console.error('Setup failed:', error.message);
    process.exit(1);
  }
}

main();