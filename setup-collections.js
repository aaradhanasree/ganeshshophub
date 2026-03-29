import PocketBase from 'pocketbase';

const pb = new PocketBase('http://127.0.0.1:8090');

// Admin credentials
const adminEmail = process.env.PB_ADMIN_EMAIL || 'admin@example.com';
const adminPassword = process.env.PB_ADMIN_PASSWORD || 'SecureAdmin@123';

async function setupAdmin() {
  try {
    console.log('Setting up PocketBase admin account...\n');
    
    // Try to authenticate first
    try {
      await pb.admins.authWithPassword(adminEmail, adminPassword);
      console.log('✓ Admin already exists - authenticated successfully\n');
      return true;
    } catch (authError) {
      // Admin doesn't exist or password is wrong, try to create one
      if (authError.status === 401 || authError.message?.includes('invalid')) {
        console.log('Creating new admin account...');
        try {
          const admin = await pb.admins.create({
            email: adminEmail,
            password: adminPassword,
            passwordConfirm: adminPassword,
          });
          console.log(`✓ Admin account created: ${admin.email}`);
          
          // Authenticate with the new account
          await pb.admins.authWithPassword(adminEmail, adminPassword);
          console.log('✓ Admin authenticated successfully\n');
          return true;
        } catch (createError) {
          console.log('✓ Admin account already exists (different password)');
          // Try default credentials
          try {
            await pb.admins.authWithPassword(adminEmail, 'admin123456');
            console.log('✓ Authenticated with default password\n');
            return true;
          } catch {
            console.log('⚠ Could not authenticate - proceeding without admin rights\n');
            return false;
          }
        }
      }
      throw authError;
    }
  } catch (error) {
    console.log(`⚠ Admin setup warning: ${error.message}\n`);
    return false;
  }
}

async function createCollections() {
  try {
    // Setup admin first
    const isAdmin = await setupAdmin();
    
    console.log('Connecting to PocketBase...');
    const collections = await pb.collections.getFullList();
    console.log(`Found ${collections.length} existing collections\n`);

    // 1. Users Collection
    console.log('\nCreating users collection...');
    try {
      await pb.collections.create({
        name: 'users',
        type: 'auth',
        createRule: '',
        updateRule: 'id = @request.auth.id',
        deleteRule: 'id = @request.auth.id',
        listRule: '@request.auth.id != ""',
        viewRule: 'id = @request.auth.id',
        fields: [
          {
            name: 'email',
            type: 'email',
            required: true,
            unique: true,
          },
          {
            name: 'firstName',
            type: 'text',
          },
          {
            name: 'lastName',
            type: 'text',
          },
          {
            name: 'role',
            type: 'select',
            options: {
              values: ['customer', 'admin'],
            },
          },
          {
            name: 'avatar',
            type: 'file',
            options: {
              maxSelect: 1,
              mimeTypes: ['image/jpeg', 'image/png', 'image/webp'],
            },
          },
        ],
      });
      console.log('✓ Users collection created');
    } catch (e) {
      if (e.message.includes('already exists')) {
        console.log('✓ Users collection already exists');
      } else {
        console.error('✗ Error creating users collection:', e.message);
      }
    }

    // 2. Products Collection
    console.log('\nCreating products collection...');
    try {
      await pb.collections.create({
        name: 'products',
        type: 'base',
        listRule: '',
        viewRule: '',
        fields: [
          {
            name: 'name',
            type: 'text',
            required: true,
          },
          {
            name: 'description',
            type: 'text',
          },
          {
            name: 'price',
            type: 'number',
            required: true,
          },
          {
            name: 'stock',
            type: 'number',
            required: true,
          },
          {
            name: 'category',
            type: 'text',
          },
          {
            name: 'rating',
            type: 'number',
          },
          {
            name: 'image',
            type: 'file',
            options: {
              maxSelect: 1,
              mimeTypes: ['image/jpeg', 'image/png', 'image/webp'],
            },
          },
        ],
      });
      console.log('✓ Products collection created');
    } catch (e) {
      if (e.message.includes('already exists')) {
        console.log('✓ Products collection already exists');
      } else {
        console.error('✗ Error creating products collection:', e.message);
      }
    }

    // 3. Orders Collection
    console.log('\nCreating orders collection...');
    try {
      await pb.collections.create({
        name: 'orders',
        type: 'base',
        listRule: '@request.auth.id != ""',
        viewRule: '@request.auth.id != ""',
        createRule: '@request.auth.id != ""',
        fields: [
          {
            name: 'userId',
            type: 'relation',
            required: true,
            options: {
              collectionId: (await pb.collections.getOne('users')).id,
              cascadeDelete: false,
            },
          },
          {
            name: 'items',
            type: 'json',
            required: true,
          },
          {
            name: 'totalAmount',
            type: 'number',
            required: true,
          },
          {
            name: 'status',
            type: 'select',
            required: true,
            options: {
              values: ['pending', 'confirmed', 'shipped', 'delivered', 'cancelled'],
            },
          },
          {
            name: 'shippingAddress',
            type: 'text',
            required: true,
          },
          {
            name: 'paymentMethod',
            type: 'text',
          },
          {
            name: 'stripeSessionId',
            type: 'text',
          },
        ],
      });
      console.log('✓ Orders collection created');
    } catch (e) {
      if (e.message.includes('already exists')) {
        console.log('✓ Orders collection already exists');
      } else {
        console.error('✗ Error creating orders collection:', e.message);
      }
    }

    // 4. Cart Collection
    console.log('\nCreating cart collection...');
    try {
      await pb.collections.create({
        name: 'cart',
        type: 'base',
        listRule: '@request.auth.id != ""',
        viewRule: '@request.auth.id != ""',
        createRule: '@request.auth.id != ""',
        updateRule: '@request.auth.id != ""',
        deleteRule: '@request.auth.id != ""',
        fields: [
          {
            name: 'userId',
            type: 'relation',
            required: true,
            options: {
              collectionId: (await pb.collections.getOne('users')).id,
              cascadeDelete: true,
            },
          },
          {
            name: 'items',
            type: 'json',
            required: true,
          },
        ],
      });
      console.log('✓ Cart collection created');
    } catch (e) {
      if (e.message.includes('already exists')) {
        console.log('✓ Cart collection already exists');
      } else {
        console.error('✗ Error creating cart collection:', e.message);
      }
    }

    // 5. Reviews Collection
    console.log('\nCreating reviews collection...');
    try {
      await pb.collections.create({
        name: 'reviews',
        type: 'base',
        listRule: '',
        viewRule: '',
        createRule: '@request.auth.id != ""',
        updateRule: 'userId = @request.auth.id',
        deleteRule: 'userId = @request.auth.id',
        fields: [
          {
            name: 'productId',
            type: 'relation',
            required: true,
            options: {
              collectionId: (await pb.collections.getOne('products')).id,
              cascadeDelete: true,
            },
          },
          {
            name: 'userId',
            type: 'relation',
            required: true,
            options: {
              collectionId: (await pb.collections.getOne('users')).id,
              cascadeDelete: true,
            },
          },
          {
            name: 'rating',
            type: 'number',
            required: true,
          },
          {
            name: 'comment',
            type: 'text',
          },
          {
            name: 'helpful',
            type: 'number',
          },
          {
            name: 'unhelpful',
            type: 'number',
          },
          {
            name: 'status',
            type: 'select',
            options: {
              values: ['pending', 'approved', 'rejected'],
            },
          },
        ],
      });
      console.log('✓ Reviews collection created');
    } catch (e) {
      if (e.message.includes('already exists')) {
        console.log('✓ Reviews collection already exists');
      } else {
        console.error('✗ Error creating reviews collection:', e.message);
      }
    }

    // 6. Coupons Collection
    console.log('\nCreating coupons collection...');
    try {
      await pb.collections.create({
        name: 'coupons',
        type: 'base',
        listRule: '',
        viewRule: '',
        createRule: 'role = "admin"',
        updateRule: 'role = "admin"',
        deleteRule: 'role = "admin"',
        fields: [
          {
            name: 'code',
            type: 'text',
            required: true,
            unique: true,
          },
          {
            name: 'discountPercentage',
            type: 'number',
            required: true,
          },
          {
            name: 'expiryDate',
            type: 'date',
          },
          {
            name: 'isActive',
            type: 'bool',
            required: true,
          },
          {
            name: 'maxUses',
            type: 'number',
          },
          {
            name: 'timesUsed',
            type: 'number',
          },
        ],
      });
      console.log('✓ Coupons collection created');
    } catch (e) {
      if (e.message.includes('already exists')) {
        console.log('✓ Coupons collection already exists');
      } else {
        console.error('✗ Error creating coupons collection:', e.message);
      }
    }

    // 7. Wishlist Collection
    console.log('\nCreating wishlist collection...');
    try {
      await pb.collections.create({
        name: 'wishlist',
        type: 'base',
        listRule: '@request.auth.id != ""',
        viewRule: '@request.auth.id != ""',
        createRule: '@request.auth.id != ""',
        deleteRule: '@request.auth.id != ""',
        fields: [
          {
            name: 'userId',
            type: 'relation',
            required: true,
            options: {
              collectionId: (await pb.collections.getOne('users')).id,
              cascadeDelete: true,
            },
          },
          {
            name: 'productId',
            type: 'relation',
            required: true,
            options: {
              collectionId: (await pb.collections.getOne('products')).id,
              cascadeDelete: true,
            },
          },
        ],
      });
      console.log('✓ Wishlist collection created');
    } catch (e) {
      if (e.message.includes('already exists')) {
        console.log('✓ Wishlist collection already exists');
      } else {
        console.error('✗ Error creating wishlist collection:', e.message);
      }
    }

    console.log('\n✓ Collection setup completed successfully!');
    console.log('\n' + '='.repeat(50));
    console.log('PocketBase Setup Complete');
    console.log('='.repeat(50));
    console.log(`\nAdmin Panel URL: http://127.0.0.1:8090/_/`);
    console.log(`Admin Email: ${adminEmail}`);
    console.log(`Admin Password: ${adminPassword}`);
    console.log('\nCollections created:');
    console.log('  ✓ users (auth)');
    console.log('  ✓ products');
    console.log('  ✓ orders');
    console.log('  ✓ cart');
    console.log('  ✓ reviews');
    console.log('  ✓ coupons');
    console.log('  ✓ wishlist');
    console.log('='.repeat(50) + '\n');
  } catch (error) {
    console.error('Fatal error:', error.message);
    process.exit(1);
  }
}

createCollections();