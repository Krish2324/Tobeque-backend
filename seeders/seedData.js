const {
  sequelize,
  Admin,
  User,
  Category,
  Brand,
  Product,
  ProductImage,
  Coupon,
  Order,
  OrderItem,
  Payment,
  Review,
  Banner,
  Setting,
  InventoryLog,
  AdminLog
} = require('../models');
const { testConnection } = require('../config/db');

const runSeeder = async () => {
  try {
    console.log('Connecting and clearing existing MongoDB collections...');
    
    // Clear all collections
    await Admin.deleteMany({});
    await User.deleteMany({});
    await Category.deleteMany({});
    await Brand.deleteMany({});
    await Product.deleteMany({});
    await ProductImage.deleteMany({});
    await Coupon.deleteMany({});
    await Order.deleteMany({});
    await OrderItem.deleteMany({});
    await Payment.deleteMany({});
    await Review.deleteMany({});
    await Banner.deleteMany({});
    await Setting.deleteMany({});
    await InventoryLog.deleteMany({});
    await AdminLog.deleteMany({});
    
    console.log('Collections cleared. Seeding dummy data...');

    // 1. Seed Admins
    console.log('Seeding Admins...');
    const superAdminPassword = 'admin123';
    const adminUser = await Admin.create({
      name: 'Super Admin',
      email: 'admin@tobeque.com',
      password: superAdminPassword,
      role: 'superadmin',
      status: true
    });
    
    await Admin.create({
      name: 'Jane Manager',
      email: 'manager@tobeque.com',
      password: superAdminPassword,
      role: 'manager',
      status: true
    });

    // 2. Seed Users (Customers)
    console.log('Seeding Users...');
    const userPassword = 'customer123';
    const customers = await User.create([
      { firstName: 'John', lastName: 'Doe', email: 'john@gmail.com', password: userPassword, phone: '+1234567890', status: 'active' },
      { firstName: 'Jane', lastName: 'Smith', email: 'jane@gmail.com', password: userPassword, phone: '+1987654321', status: 'active' },
      { firstName: 'Robert', lastName: 'Johnson', email: 'robert@gmail.com', password: userPassword, phone: '+1122334455', status: 'active' },
      { firstName: 'Emily', lastName: 'Davis', email: 'emily@gmail.com', password: userPassword, phone: '+1555666777', status: 'active' },
      { firstName: 'Michael', lastName: 'Wilson', email: 'michael@gmail.com', password: userPassword, phone: '+1888999000', status: 'blocked' }
    ]);

    // 3. Seed Categories & Subcategories
    console.log('Seeding Categories...');
    const electronics = await Category.create({
      name: 'Electronics',
      slug: 'electronics',
      description: 'Gadgets, smartphones, tablets and accessories',
      seoTitle: 'Premium Electronics Online',
      seoDescription: 'Buy latest smart devices at best rates.'
    });

    const smartPhones = await Category.create({
      name: 'Smartphones',
      slug: 'smartphones',
      description: 'iOS and Android devices',
      parentId: electronics.id,
      seoTitle: 'Smartphones & Tablets',
      seoDescription: 'Buy flagship smartphones online.'
    });

    const laptops = await Category.create({
      name: 'Laptops',
      slug: 'laptops',
      description: 'Laptops and Workstations',
      parentId: electronics.id
    });

    const apparel = await Category.create({
      name: 'Apparel & Fashion',
      slug: 'apparel-fashion',
      description: 'Clothing, activewear and footwear'
    });

    const mensFashion = await Category.create({
      name: 'Mens Fashion',
      slug: 'mens-fashion',
      description: 'Gents shirts, trousers and shoes',
      parentId: apparel.id
    });

    const homeKitchen = await Category.create({
      name: 'Home & Kitchen',
      slug: 'home-kitchen',
      description: 'Decorations, furniture and kitchenware'
    });

    // 4. Seed Brands
    console.log('Seeding Brands...');
    const apple = await Brand.create({ name: 'Apple', slug: 'apple', description: 'Innovative high-end consumer electronics' });
    const samsung = await Brand.create({ name: 'Samsung', slug: 'samsung', description: 'Leading technology and screen manufacturers' });
    const nike = await Brand.create({ name: 'Nike', slug: 'nike', description: 'Premium sports and athletic items' });
    const sony = await Brand.create({ name: 'Sony', slug: 'sony', description: 'Industry standards in audio and gaming tech' });

    // 5. Seed Products
    console.log('Seeding Products...');
    const p1 = await Product.create({
      name: 'iPhone 15 Pro Max',
      slug: 'iphone-15-pro-max',
      sku: 'APP-IP15PM-256',
      barcode: '190199123456',
      shortDescription: 'Flagship Apple smartphone with Titanium design.',
      fullDescription: 'The iPhone 15 Pro Max features a strong and lightweight aerospace-grade titanium design. Powered by the groundbreaking A17 Pro chip for next-level gaming and computational photography.',
      category: smartPhones.id,
      brand: apple.id,
      price: 1199.00,
      discountPrice: 1149.00,
      taxRate: 8.50,
      stockQuantity: 45,
      weight: 0.22,
      dimensions: '15.9 x 7.6 x 0.8 cm',
      status: 'published',
      isFeatured: true,
      thumbnail: 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=500',
      variants: [
        { color: 'Natural Titanium', size: '256GB', stock: 20, sku: 'APP-IP15PM-256-NAT' },
        { color: 'Blue Titanium', size: '256GB', stock: 15, sku: 'APP-IP15PM-256-BLU' },
        { color: 'Black Titanium', size: '512GB', stock: 10, sku: 'APP-IP15PM-512-BLK' }
      ],
      seoTitle: 'Buy iPhone 15 Pro Max - Tobeque',
      seoDescription: 'Shop the newest Apple titanium flagship. Next day shipping available.'
    });

    const p2 = await Product.create({
      name: 'Galaxy S24 Ultra',
      slug: 'galaxy-s24-ultra',
      sku: 'SAM-S24U-256',
      barcode: '880609123456',
      shortDescription: 'Premium Samsung smartphone with AI features.',
      fullDescription: 'Galaxy S24 Ultra comes with a durable titanium shell, integrated S Pen stylus, and the Snapdragon 8 Gen 3 processor for top-tier artificial intelligence and gaming enhancements.',
      category: smartPhones.id,
      brand: samsung.id,
      price: 1299.00,
      discountPrice: 1249.00,
      taxRate: 8.50,
      stockQuantity: 5, // Low stock for dashboard warnings!
      weight: 0.23,
      dimensions: '16.2 x 7.9 x 0.8 cm',
      status: 'published',
      isFeatured: true,
      thumbnail: 'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=500',
      variants: [
        { color: 'Titanium Gray', size: '256GB', stock: 2, sku: 'SAM-S24U-256-GRY' },
        { color: 'Titanium Yellow', size: '256GB', stock: 3, sku: 'SAM-S24U-256-YEL' }
      ]
    });

    const p3 = await Product.create({
      name: 'Sony WH-1000XM5',
      slug: 'sony-wh-1000xm5',
      sku: 'SON-XM5-BLK',
      barcode: '454873613098',
      shortDescription: 'Industry leading active noise cancelling headphones.',
      fullDescription: 'The WH-1000XM5 headphones rewrite the rules for distraction-free listening. Dynamic NC optimizer adjusts automatically, powered by dual sound processors and high-quality microphones.',
      category: electronics.id,
      brand: sony.id,
      price: 399.00,
      discountPrice: 349.00,
      taxRate: 5.00,
      stockQuantity: 12,
      weight: 0.25,
      dimensions: '22.0 x 18.0 x 6.0 cm',
      status: 'published',
      isFeatured: false,
      thumbnail: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500'
    });

    const p4 = await Product.create({
      name: 'Nike Air Max Alpha',
      slug: 'nike-air-max-alpha',
      sku: 'NKE-AMX-10',
      barcode: '195243123456',
      shortDescription: 'Comfortable cross-training gym sneakers.',
      fullDescription: 'Finish your last rep with power and back it up with a roar in the Nike Air Max Alpha Trainer. Max Air cushioning offers comfortable stability for lifting and cardio training.',
      category: mensFashion.id,
      brand: nike.id,
      price: 85.00,
      discountPrice: 79.99,
      taxRate: 0.00,
      stockQuantity: 80,
      weight: 0.60,
      dimensions: '33.0 x 20.0 x 12.0 cm',
      status: 'published',
      isFeatured: true,
      thumbnail: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500',
      variants: [
        { color: 'Red/Black', size: '10', stock: 40, sku: 'NKE-AMX-10-RED' },
        { color: 'Red/Black', size: '11', stock: 40, sku: 'NKE-AMX-11-RED' }
      ]
    });

    const p5 = await Product.create({
      name: 'MacBook Pro 16" M3 Max',
      slug: 'macbook-pro-16-m3-max',
      sku: 'APP-MBP16-M3M-01',
      barcode: '190199789012',
      shortDescription: 'Ultimate developer laptop with M3 Max silicon.',
      fullDescription: 'Designed for professionals. Built with the Apple M3 Max chip, featuring up to a 16-core CPU, up to a 40-core GPU, and up to 128GB Unified Memory for high performance compile speeds.',
      category: laptops.id,
      brand: apple.id,
      price: 3499.00,
      discountPrice: null,
      taxRate: 8.50,
      stockQuantity: 18,
      weight: 2.16,
      dimensions: '35.6 x 24.8 x 1.6 cm',
      status: 'draft', // Draft status for dashboard validation
      isFeatured: false,
      thumbnail: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=500'
    });

    // Seed Product Images (Gallery)
    await ProductImage.create([
      { product: p1.id, imageUrl: 'https://images.unsplash.com/photo-1510557880182-3d4d3cba35a5?w=500' },
      { product: p1.id, imageUrl: 'https://images.unsplash.com/photo-1592899677977-9c10ca588bbd?w=500' },
      { product: p2.id, imageUrl: 'https://images.unsplash.com/photo-1610945415295-d9bff067e59c?w=500' }
    ]);

    // 6. Seed Coupons
    console.log('Seeding Coupons...');
    await Coupon.create([
      { code: 'WELCOME10', type: 'percentage', discountValue: 10.00, minOrderAmount: 50.00, usageLimit: 1000, usedCount: 145, startDate: '2026-01-01', expiryDate: '2026-12-31', status: true },
      { code: 'FLAT50', type: 'flat', discountValue: 50.00, minOrderAmount: 300.00, usageLimit: 200, usedCount: 42, startDate: '2026-01-01', expiryDate: '2026-08-31', status: true },
      { code: 'SUMMER20', type: 'percentage', discountValue: 20.00, minOrderAmount: 100.00, usageLimit: 500, usedCount: 0, startDate: '2026-06-01', expiryDate: '2026-09-30', status: true }
    ]);

    // 7. Seed Orders with rich temporal distribution (over the last 6 months!)
    console.log('Seeding Orders...');
    const now = new Date();
    const makeDate = (monthsAgo, dayOffset = 5) => {
      const d = new Date(now);
      d.setMonth(d.getMonth() - monthsAgo);
      d.setDate(d.getDate() - dayOffset);
      return d;
    };

    const ordersData = [
      // 5 Months Ago (Dec)
      { user: customers[0].id, orderNumber: 'ORD-1001', subtotal: 1199.00, taxAmount: 101.92, shippingCost: 15.00, discountAmount: 119.90, totalAmount: 1196.02, orderStatus: 'delivered', paymentStatus: 'paid', paymentMethod: 'stripe', shippingStatus: 'delivered', createdAt: makeDate(5, 12) },
      { user: customers[1].id, orderNumber: 'ORD-1002', subtotal: 399.00, taxAmount: 19.95, shippingCost: 10.00, discountAmount: 0.00, totalAmount: 428.95, orderStatus: 'delivered', paymentStatus: 'paid', paymentMethod: 'paypal', shippingStatus: 'delivered', createdAt: makeDate(5, 4) },
      
      // 4 Months Ago (Jan)
      { user: customers[2].id, orderNumber: 'ORD-1003', subtotal: 85.00, taxAmount: 0.00, shippingCost: 5.00, discountAmount: 8.50, totalAmount: 81.50, orderStatus: 'delivered', paymentStatus: 'paid', paymentMethod: 'cod', shippingStatus: 'delivered', createdAt: makeDate(4, 25) },
      { user: customers[3].id, orderNumber: 'ORD-1004', subtotal: 1299.00, taxAmount: 110.42, shippingCost: 20.00, discountAmount: 50.00, totalAmount: 1379.42, orderStatus: 'delivered', paymentStatus: 'paid', paymentMethod: 'stripe', shippingStatus: 'delivered', createdAt: makeDate(4, 10) },

      // 3 Months Ago (Feb)
      { user: customers[0].id, orderNumber: 'ORD-1005', subtotal: 399.00, taxAmount: 19.95, shippingCost: 10.00, discountAmount: 39.90, totalAmount: 389.05, orderStatus: 'delivered', paymentStatus: 'paid', paymentMethod: 'stripe', shippingStatus: 'delivered', createdAt: makeDate(3, 20) },
      { user: customers[1].id, orderNumber: 'ORD-1006', subtotal: 1199.00, taxAmount: 101.92, shippingCost: 15.00, discountAmount: 0.00, totalAmount: 1315.92, orderStatus: 'delivered', paymentStatus: 'paid', paymentMethod: 'paypal', shippingStatus: 'delivered', createdAt: makeDate(3, 8) },

      // 2 Months Ago (Mar)
      { user: customers[2].id, orderNumber: 'ORD-1007', subtotal: 2398.00, taxAmount: 203.83, shippingCost: 30.00, discountAmount: 50.00, totalAmount: 2581.83, orderStatus: 'delivered', paymentStatus: 'paid', paymentMethod: 'stripe', shippingStatus: 'delivered', createdAt: makeDate(2, 14) },
      { user: customers[3].id, orderNumber: 'ORD-1008', subtotal: 85.00, taxAmount: 0.00, shippingCost: 5.00, discountAmount: 0.00, totalAmount: 90.00, orderStatus: 'cancelled', paymentStatus: 'pending', paymentMethod: 'cod', shippingStatus: 'pending', createdAt: makeDate(2, 2) },

      // 1 Month Ago (Apr)
      { user: customers[0].id, orderNumber: 'ORD-1009', subtotal: 1299.00, taxAmount: 110.42, shippingCost: 20.00, discountAmount: 129.90, totalAmount: 1299.52, orderStatus: 'delivered', paymentStatus: 'paid', paymentMethod: 'stripe', shippingStatus: 'delivered', createdAt: makeDate(1, 28) },
      { user: customers[1].id, orderNumber: 'ORD-1010', subtotal: 798.00, taxAmount: 39.90, shippingCost: 15.00, discountAmount: 50.00, totalAmount: 802.90, orderStatus: 'returned', paymentStatus: 'refunded', paymentMethod: 'paypal', shippingStatus: 'delivered', createdAt: makeDate(1, 15) },
      { user: customers[2].id, orderNumber: 'ORD-1011', subtotal: 170.00, taxAmount: 0.00, shippingCost: 10.00, discountAmount: 17.00, totalAmount: 163.00, orderStatus: 'delivered', paymentStatus: 'paid', paymentMethod: 'cod', shippingStatus: 'delivered', createdAt: makeDate(1, 5) },

      // Current Month (May)
      { user: customers[0].id, orderNumber: 'ORD-1012', subtotal: 1199.00, taxAmount: 101.92, shippingCost: 15.00, discountAmount: 50.00, totalAmount: 1265.92, orderStatus: 'processing', paymentStatus: 'paid', paymentMethod: 'stripe', shippingStatus: 'pending', shippingAddress: '123 Main St, New York NY 10001', createdAt: makeDate(0, 4) },
      { user: customers[1].id, orderNumber: 'ORD-1013', subtotal: 85.00, taxAmount: 0.00, shippingCost: 5.00, discountAmount: 0.00, totalAmount: 90.00, orderStatus: 'pending', paymentStatus: 'pending', paymentMethod: 'cod', shippingStatus: 'pending', shippingAddress: '456 Elm St, Los Angeles CA 90001', createdAt: makeDate(0, 2) },
      { user: customers[3].id, orderNumber: 'ORD-1014', subtotal: 1299.00, taxAmount: 110.42, shippingCost: 20.00, discountAmount: 0.00, totalAmount: 1429.42, orderStatus: 'shipped', paymentStatus: 'paid', paymentMethod: 'stripe', shippingStatus: 'shipped', trackingNumber: 'TRK928139281', shippingAddress: '789 Oak Ave, Chicago IL 60601', createdAt: makeDate(0, 1) }
    ];

    for (let o of ordersData) {
      const order = await Order.create({
        ...o,
        shippingAddress: o.shippingAddress || '102 Flat Road, Beverly Hills, CA 90210',
        billingAddress: o.billingAddress || '102 Flat Road, Beverly Hills, CA 90210'
      });

      // Add order items based on order cost
      if (o.subtotal === 1199.00) {
        await OrderItem.create({ order: order.id, product: p1.id, productName: p1.name, sku: p1.sku, price: 1199.00, quantity: 1, variantDetails: { color: 'Natural Titanium', size: '256GB' } });
      } else if (o.subtotal === 399.00) {
        await OrderItem.create({ order: order.id, product: p3.id, productName: p3.name, sku: p3.sku, price: 399.00, quantity: 1 });
      } else if (o.subtotal === 85.00) {
        await OrderItem.create({ order: order.id, product: p4.id, productName: p4.name, sku: p4.sku, price: 85.00, quantity: 1, variantDetails: { color: 'Red/Black', size: '10' } });
      } else if (o.subtotal === 1299.00) {
        await OrderItem.create({ order: order.id, product: p2.id, productName: p2.name, sku: p2.sku, price: 1299.00, quantity: 1, variantDetails: { color: 'Titanium Gray', size: '256GB' } });
      } else if (o.subtotal === 2398.00) {
        await OrderItem.create({ order: order.id, product: p1.id, productName: p1.name, sku: p1.sku, price: 1199.00, quantity: 2 });
      } else if (o.subtotal === 798.00) {
        await OrderItem.create({ order: order.id, product: p3.id, productName: p3.name, sku: p3.sku, price: 399.00, quantity: 2 });
      } else if (o.subtotal === 170.00) {
        await OrderItem.create({ order: order.id, product: p4.id, productName: p4.name, sku: p4.sku, price: 85.00, quantity: 2 });
      }

      // Add payment transaction records
      if (o.paymentStatus !== 'pending') {
        await Payment.create({
          order: order.id,
          transactionId: `TXN-${order.orderNumber}-${Math.floor(Math.random() * 89999 + 10000)}`,
          gateway: o.paymentMethod,
          amount: o.totalAmount,
          status: o.paymentStatus === 'paid' ? 'succeeded' : 'refunded',
          gatewayResponse: { status: 'OK', code: 200 }
        });
      }
    }

    // 8. Seed Reviews
    console.log('Seeding Reviews...');
    await Review.create([
      { user: customers[0].id, product: p1.id, rating: 5, comment: 'Phenomenal device! Titanium is super light.', isApproved: true },
      { user: customers[1].id, product: p1.id, rating: 4, comment: 'Great phone, but expensive.', isApproved: true },
      { user: customers[2].id, product: p3.id, rating: 5, comment: 'Noise cancellation is like entering a vacuum. Highly recommend!', isApproved: true },
      { user: customers[3].id, product: p2.id, rating: 3, comment: 'Battery is excellent, but UI is slightly laggy.', isApproved: false }
    ]);

    // 9. Seed Banners
    console.log('Seeding Banners...');
    await Banner.create([
      { title: 'The Ultimate Smartphones', subtitle: 'Get up to 20% off flagship devices', imageUrl: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=1200', linkUrl: '/products?category=smartphones', position: 'home_slider', sortOrder: 1, status: true },
      { title: 'Premium Activewear', subtitle: 'Step up your fitness goals', imageUrl: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=1200', linkUrl: '/products?category=mens-fashion', position: 'home_slider', sortOrder: 2, status: true },
      { title: 'Summer Clearance Sale', subtitle: 'Flat discount on luxury home decors', imageUrl: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800', linkUrl: '/coupons', position: 'promo_banner', sortOrder: 1, status: true }
    ]);

    // 10. Seed Settings
    console.log('Seeding System Settings...');
    await Setting.create([
      { key: 'site_name', value: 'Tobeque Admin Core' },
      { key: 'site_logo', value: '' },
      { key: 'support_email', value: 'support@tobeque.com' },
      { key: 'currency', value: 'USD' },
      { key: 'tax_percentage', value: '8.5' },
      { key: 'smtp_host', value: 'smtp.mailtrap.io' },
      { key: 'smtp_port', value: '2525' }
    ]);

    // 11. Seed Logs
    console.log('Seeding Initial Logs...');
    await InventoryLog.create([
      { productId: p1.id, stockChanged: 50, actionType: 'restock', reference: 'Initial stock load', adminId: adminUser.id },
      { productId: p1.id, stockChanged: -5, actionType: 'sale', reference: 'Sales deductor' },
      { productId: p2.id, stockChanged: 10, actionType: 'restock', reference: 'Initial stock load', adminId: adminUser.id },
      { productId: p2.id, stockChanged: -5, actionType: 'sale', reference: 'Sales deductor' }
    ]);

    await AdminLog.create({
      adminId: adminUser.id,
      action: 'Synchronized database and populated standard seeder logs',
      entityType: 'settings',
      ipAddress: '127.0.0.1'
    });

    console.log('Database seeded successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

const start = async () => {
  try {
    await testConnection();
    await runSeeder();
  } catch (err) {
    console.error('Seeder initialization error:', err);
    process.exit(1);
  }
};

start();
