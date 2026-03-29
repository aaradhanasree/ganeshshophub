const baseUrl = 'http://127.0.0.1:8090/api';

async function createCollection(schema) {
  try {
    const response = await fetch(`${baseUrl}/collections`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(schema)
    });
    
    if (response.ok) {
      console.log(`✓ Created collection: ${schema.name}`);
    } else {
      const error = await response.json();
      if (error.message?.includes('already exists')) {
        console.log(`✓ Collection already exists: ${schema.name}`);
      } else {
        console.log(`✗ Error creating ${schema.name}: ${error.message || response.statusText}`);
      }
    }
  } catch (error) {
    console.log(`✗ ${schema.name}: ${error.message}`);
  }
}

async function setup() {
  console.log('Setting up PocketBase collections...\n');

  // 1. Users
  await createCollection({
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
      { id: 'avatar', name: 'avatar', type: 'file', options: { maxSelect: 1 } }
    ]
  });

  // 2. Products
  await createCollection({
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
      { id: 'image', name: 'image', type: 'file', options: { maxSelect: 1 } }
    ]
  });

  // 3. Orders
  await createCollection({
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
      { id: 'shippingAddress', name: 'shippingAddress', type: 'text', required: true }
    ]
  });

  // 4. Cart
  await createCollection({
    name: 'cart',
    type: 'base',
    listRule: '@request.auth.id != ""',
    viewRule: '@request.auth.id != ""',
    createRule: '@request.auth.id != ""',
    updateRule: '@request.auth.id != ""',
    deleteRule: '@request.auth.id != ""',
    schema: [
      { id: 'userId', name: 'userId', type: 'relation', required: true, options: { collectionRelation: 'users', cascadeDelete: true } },
      { id: 'items', name: 'items', type: 'json', required: true }
    ]
  });

  // 5. Reviews
  await createCollection({
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
      { id: 'comment', name: 'comment', type: 'text' }
    ]
  });

  // 6. Coupons
  await createCollection({
    name: 'coupons',
    type: 'base',
    schema: [
      { id: 'code', name: 'code', type: 'text', required: true, unique: true },
      { id: 'discountPercentage', name: 'discountPercentage', type: 'number', required: true },
      { id: 'isActive', name: 'isActive', type: 'bool', required: true }
    ]
  });

  // 7. Wishlist
  await createCollection({
    name: 'wishlist',
    type: 'base',
    listRule: '@request.auth.id != ""',
    viewRule: '@request.auth.id != ""',
    createRule: '@request.auth.id != ""',
    deleteRule: '@request.auth.id != ""',
    schema: [
      { id: 'userId', name: 'userId', type: 'relation', required: true, options: { collectionRelation: 'users', cascadeDelete: true } },
      { id: 'productId', name: 'productId', type: 'relation', required: true, options: { collectionRelation: 'products', cascadeDelete: true } }
    ]
  });

  console.log('\n✓ Setup completed!');
  console.log('Access PocketBase admin at: http://127.0.0.1:8090/_/');
}

setup().catch(console.error);