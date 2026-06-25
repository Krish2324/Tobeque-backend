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

    console.log('Collections cleared. Seeding Girls Fashion dummy data...');

    // ─────────────────────────────────────────────
    // 1. SEED Ax`DMINS
    // ─────────────────────────────────────────────
    console.log('Seeding Admins...');
    const adminUser = await Admin.create({
      name: 'Super Admin',
      email: 'admin@tobeque.com',
      password: 'admin123',
      role: 'superadmin',
      status: true
    });

    await Admin.create({
      name: 'Priya Manager',
      email: 'manager@tobeque.com',
      password: 'admin123',
      role: 'manager',
      status: true
    });

    // ─────────────────────────────────────────────
    // 2. SEED USERS (Customers)
    // ─────────────────────────────────────────────
    console.log('Seeding Users...');
    const customers = await User.create([
      { firstName: 'Aisha', lastName: 'Sharma', email: 'aisha@gmail.com', password: 'customer123', phone: '+91 98765 43210', status: 'active' },
      { firstName: 'Priya', lastName: 'Patel', email: 'priya@gmail.com', password: 'customer123', phone: '+91 87654 32109', status: 'active' },
      { firstName: 'Neha', lastName: 'Kapoor', email: 'neha@gmail.com', password: 'customer123', phone: '+91 76543 21098', status: 'active' },
      { firstName: 'Riya', lastName: 'Joshi', email: 'riya@gmail.com', password: 'customer123', phone: '+91 65432 10987', status: 'active' },
      { firstName: 'Simran', lastName: 'Mehta', email: 'simran@gmail.com', password: 'customer123', phone: '+91 54321 09876', status: 'blocked' }
    ]);

    // ─────────────────────────────────────────────
    // 3. SEED CATEGORIES & SUBCATEGORIES
    // ─────────────────────────────────────────────
    console.log('Seeding Girls Fashion Categories...');

    // ── Parent: Girls Fashion ──
    const girlsFashion = await Category.create({
      name: "Girls' Fashion",
      slug: 'girls-fashion',
      description: 'All types of dresses, ethnic wear, western wear and accessories for girls',
      image: '/src/assets/images/seed-img-0.jpg',
      banner: '/src/assets/images/seed-img-1.jpg',
      seoTitle: "Girls' Fashion - Dresses, Ethnic & Western Wear | Tobeque",
      seoDescription: 'Explore the latest trends in girls fashion. Shop ethnic dresses, western outfits, party wear and more.'
    });

    // ── Sub: Ethnic & Traditional Wear ──
    const ethnicWear = await Category.create({
      name: 'Ethnic & Traditional Wear',
      slug: 'ethnic-traditional-wear',
      description: 'Kurtas, Lehengas, Salwar Suits, Sarees and more',
      image: '/src/assets/images/seed-img-2.jpg',
      parentId: girlsFashion.id,
      seoTitle: 'Ethnic Wear for Girls - Lehengas, Kurtas & Sarees',
      seoDescription: 'Shop beautiful ethnic wear for girls - Lehenga Choli, Salwar Suits, Anarkali and more.'
    });

    const lehenga = await Category.create({
      name: 'Lehenga Choli',
      slug: 'lehenga-choli',
      description: 'Bridal, party and casual lehenga sets',
      parentId: ethnicWear.id
    });

    const salwarSuits = await Category.create({
      name: 'Salwar Suits',
      slug: 'salwar-suits',
      description: 'Anarkali, Straight Cut, Palazzo suits',
      parentId: ethnicWear.id
    });

    const kurtas = await Category.create({
      name: 'Kurtas & Kurtis',
      slug: 'kurtas-kurtis',
      description: 'Casual and festive kurtas and kurtis',
      parentId: ethnicWear.id
    });

    const sarees = await Category.create({
      name: 'Sarees',
      slug: 'sarees',
      description: 'Silk, chiffon, georgette and printed sarees',
      parentId: ethnicWear.id
    });

    // ── Sub: Western Wear ──
    const westernWear = await Category.create({
      name: 'Western Wear',
      slug: 'western-wear',
      description: 'Dresses, Tops, Jeans, Co-ords and Skirts',
      image: '/src/assets/images/seed-img-3.jpg',
      parentId: girlsFashion.id,
      seoTitle: 'Western Wear for Girls - Dresses, Tops & Skirts',
      seoDescription: 'Shop trendy western wear for girls - dresses, crop tops, skirts, jeans, co-ords and more.'
    });

    const casualDresses = await Category.create({
      name: 'Dresses',
      slug: 'dresses',
      description: 'Everyday casual dresses and sundresses',
      parentId: westernWear.id
    });

    const partyDresses = await Category.create({
      name: 'Party Wear Dresses',
      slug: 'party-wear-dresses',
      description: 'Cocktail, sequin and evening party dresses',
      parentId: westernWear.id
    });

    const maxi = await Category.create({
      name: 'Maxi & Midi Dresses',
      slug: 'maxi-midi-dresses',
      description: 'Flowy maxi and elegant midi length dresses',
      parentId: westernWear.id
    });

    const coOrdSets = await Category.create({
      name: 'Co-ord Sets',
      slug: 'co-ord-sets',
      description: 'Matching top and bottom sets',
      parentId: westernWear.id
    });

    const topsAndBlouses = await Category.create({
      name: 'Tops',
      slug: 'tops',
      description: 'Crop tops, tube tops, shirts and blouses',
      parentId: westernWear.id
    });

    const skirts = await Category.create({
      name: 'Skirts and Shorts',
      slug: 'skirts-and-shorts',
      description: 'Mini, midi, maxi and pleated skirts and shorts',
      parentId: westernWear.id
    });

    const shirtsAndBlouses = await Category.create({
      name: 'Shirts and Blouses',
      slug: 'shirts-and-blouses',
      parentId: westernWear.id
    });

    const tshirtsAndVests = await Category.create({
      name: 'T-Shirts and Vests',
      slug: 't-shirts-and-vests',
      parentId: westernWear.id
    });

    const jeansAndPants = await Category.create({
      name: 'Jeans and Pants',
      slug: 'jeans-and-pants',
      parentId: westernWear.id
    });

    const newIn = await Category.create({ name: 'New In', slug: 'new-in' });
    const summer26 = await Category.create({ name: 'Summer-26', slug: 'summer-26' });
    const customisable = await Category.create({ name: 'Customisable', slug: 'customisable' });
    const collaboration = await Category.create({ name: 'Collaboration', slug: 'collaboration' });
    const styleJournal = await Category.create({ name: 'Style Journal', slug: 'style-journal' });
    const stealTheStyle = await Category.create({ name: 'Steal The Style', slug: 'steal-the-style' });

    // ── Sub: Party & Occasion Wear ──
    const partyWear = await Category.create({
      name: 'Party & Occasion Wear',
      slug: 'party-occasion-wear',
      description: 'Gowns, cocktail dresses and occasion outfits',
      image: '/src/assets/images/seed-img-4.jpg',
      parentId: girlsFashion.id,
      seoTitle: 'Party Wear & Occasion Dresses for Girls',
      seoDescription: 'Make every occasion special with our stunning party wear collection for girls.'
    });

    const gowns = await Category.create({
      name: 'Gowns & Ball Gowns',
      slug: 'gowns-ball-gowns',
      description: 'Floor-length gowns for weddings and galas',
      parentId: partyWear.id
    });

    const cocktailDresses = await Category.create({
      name: 'Cocktail Dresses',
      slug: 'cocktail-dresses',
      description: 'Sleek cocktail and evening dresses',
      parentId: partyWear.id
    });

    // ── Sub: Activewear & Loungewear ──
    const activewear = await Category.create({
      name: 'Activewear & Loungewear',
      slug: 'activewear-loungewear',
      description: 'Gym wear, yoga pants, sports bras and loungewear sets',
      image: '/src/assets/images/seed-img-5.jpg',
      parentId: girlsFashion.id,
      seoTitle: 'Activewear & Loungewear for Girls',
      seoDescription: 'Stay active and comfortable with our premium activewear and loungewear collection.'
    });

    const gymWear = await Category.create({
      name: 'Gym & Yoga Wear',
      slug: 'gym-yoga-wear',
      description: 'Leggings, sports bras and workout sets',
      parentId: activewear.id
    });

    const loungewear = await Category.create({
      name: 'Loungewear Sets',
      slug: 'loungewear-sets',
      description: 'Comfortable lounge and sleepwear sets',
      parentId: activewear.id
    });

    // ── Sub: Winterwear ──
    const winterWear = await Category.create({
      name: 'Winter Wear',
      slug: 'winter-wear',
      description: 'Sweaters, cardigans, coats and jackets',
      image: '/src/assets/images/seed-img-6.jpg',
      parentId: girlsFashion.id,
      seoTitle: 'Winter Wear for Girls - Sweaters, Coats & Jackets',
      seoDescription: 'Stay warm in style with our winter collection for girls.'
    });

    // ─────────────────────────────────────────────
    // 4. SEED BRANDS
    // ─────────────────────────────────────────────
    console.log('Seeding Fashion Brands...');
    const zara = await Brand.create({ name: 'Zara', slug: 'zara', description: 'Global leader in fast fashion and modern trends' });
    const hm = await Brand.create({ name: 'H&M', slug: 'hm', description: 'Affordable everyday fashion and seasonal trends' });
    const fabIndia = await Brand.create({ name: 'FabIndia', slug: 'fabindia', description: 'Premium Indian ethnic wear and handcrafted fashion' });
    const biba = await Brand.create({ name: 'BIBA', slug: 'biba', description: 'India\'s leading ethnic wear brand for women and girls' });
    const forever21 = await Brand.create({ name: 'Forever 21', slug: 'forever21', description: 'Trendy and affordable western fashion for young women' });
    const mango = await Brand.create({ name: 'Mango', slug: 'mango', description: 'Mediterranean-inspired modern fashion and sophistication' });
    const anita = await Brand.create({ name: 'Anita Dongre', slug: 'anita-dongre', description: 'Luxury Indian ethnic and bridal wear couture' });
    const puma = await Brand.create({ name: 'Puma', slug: 'puma', description: 'High-performance sportswear and active fashion' });

    // ─────────────────────────────────────────────
    // 5. SEED PRODUCTS
    // ─────────────────────────────────────────────
    console.log('Seeding Products...');

    // ── ETHNIC WEAR ──────────────────────────────

    const p1 = await Product.create({
      name: 'Royal Velvet Bridal Lehenga',
      slug: 'royal-velvet-bridal-lehenga',
      sku: 'LHG-RVB-001',
      barcode: '100000000001',
      shortDescription: 'Opulent heavy velvet bridal lehenga with gold zari embroidery.',
      fullDescription: 'This breathtaking bridal lehenga is crafted from rich velvet fabric adorned with intricate gold zari and mirror embroidery. It comes with a matching blouse and dupatta, making it the perfect choice for weddings, engagements, and festive celebrations. The flared skirt features a heavy hand-embroidered hem border.',
      category: lehenga.id,
      brand: anita.id,
      price: 24999.00,
      discountPrice: 19999.00,
      taxRate: 5.00,
      stockQuantity: 25,
      weight: 2.5,
      dimensions: 'Free Size, Customizable',
      status: 'published',
      isFeatured: true,
      thumbnail: '/src/assets/images/seed-img-2.jpg',
      variants: [
        { color: 'Maroon', size: 'S', stock: 5, sku: 'LHG-RVB-001-MAR-S' },
        { color: 'Maroon', size: 'M', stock: 7, sku: 'LHG-RVB-001-MAR-M' },
        { color: 'Maroon', size: 'L', stock: 5, sku: 'LHG-RVB-001-MAR-L' },
        { color: 'Deep Red', size: 'S', stock: 4, sku: 'LHG-RVB-001-RED-S' },
        { color: 'Deep Red', size: 'M', stock: 4, sku: 'LHG-RVB-001-RED-M' }
      ],
      seoTitle: 'Royal Velvet Bridal Lehenga - Tobeque',
      seoDescription: 'Buy premium royal velvet bridal lehenga with gold zari embroidery. Free shipping above ₹999.'
    });

    const p2 = await Product.create({
      name: 'Floral Anarkali Suit',
      slug: 'floral-anarkali-suit',
      sku: 'ANK-FLO-002',
      barcode: '100000000002',
      shortDescription: 'Elegant floral printed georgette Anarkali suit with palazzo pants.',
      fullDescription: 'This stunning Anarkali suit is made from lightweight georgette fabric featuring a vibrant floral print. The flowing silhouette is perfect for festive occasions and family gatherings. Paired with matching palazzo pants and a chiffon dupatta for a complete ensemble.',
      category: salwarSuits.id,
      brand: biba.id,
      price: 3499.00,
      discountPrice: 2799.00,
      taxRate: 5.00,
      stockQuantity: 60,
      weight: 0.6,
      status: 'published',
      isFeatured: true,
      thumbnail: '/src/assets/images/seed-img-7.jpg',
      variants: [
        { color: 'Pink Floral', size: 'XS', stock: 10, sku: 'ANK-FLO-002-PNK-XS' },
        { color: 'Pink Floral', size: 'S', stock: 15, sku: 'ANK-FLO-002-PNK-S' },
        { color: 'Pink Floral', size: 'M', stock: 15, sku: 'ANK-FLO-002-PNK-M' },
        { color: 'Pink Floral', size: 'L', stock: 10, sku: 'ANK-FLO-002-PNK-L' },
        { color: 'Blue Floral', size: 'S', stock: 5, sku: 'ANK-FLO-002-BLU-S' },
        { color: 'Blue Floral', size: 'M', stock: 5, sku: 'ANK-FLO-002-BLU-M' }
      ],
      seoTitle: 'Floral Anarkali Suit | BIBA Collection - Tobeque',
      seoDescription: 'Shop georgette floral Anarkali suit with palazzo pants. Trendy ethnic wear at best price.'
    });

    const p3 = await Product.create({
      name: 'Block Print Cotton Kurti',
      slug: 'block-print-cotton-kurti',
      sku: 'KRT-BLK-003',
      barcode: '100000000003',
      shortDescription: 'Handcrafted Rajasthani block print straight-cut kurti.',
      fullDescription: 'Inspired by traditional Rajasthani artistry, this hand block-printed cotton kurti brings a touch of heritage to your everyday wardrobe. Perfect for casual outings, college wear, and work-from-home comfort. Pairs beautifully with jeans or palazzos.',
      category: kurtas.id,
      brand: fabIndia.id,
      price: 1299.00,
      discountPrice: 999.00,
      taxRate: 5.00,
      stockQuantity: 120,
      weight: 0.3,
      status: 'published',
      isFeatured: false,
      thumbnail: '/src/assets/images/seed-img-8.jpg',
      variants: [
        { color: 'Indigo Blue', size: 'XS', stock: 20, sku: 'KRT-BLK-003-IND-XS' },
        { color: 'Indigo Blue', size: 'S', stock: 25, sku: 'KRT-BLK-003-IND-S' },
        { color: 'Indigo Blue', size: 'M', stock: 25, sku: 'KRT-BLK-003-IND-M' },
        { color: 'Indigo Blue', size: 'L', stock: 20, sku: 'KRT-BLK-003-IND-L' },
        { color: 'Mustard', size: 'S', stock: 15, sku: 'KRT-BLK-003-MUS-S' },
        { color: 'Mustard', size: 'M', stock: 15, sku: 'KRT-BLK-003-MUS-M' }
      ]
    });

    const p4 = await Product.create({
      name: 'Banarasi Silk Saree',
      slug: 'banarasi-silk-saree',
      sku: 'SAR-BAN-004',
      barcode: '100000000004',
      shortDescription: 'Authentic Banarasi silk saree with golden zari border.',
      fullDescription: 'Drape yourself in the timeless elegance of an authentic Banarasi silk saree. This exquisite piece features a rich silk weave with intricate golden zari border and pallu work, showcasing the legendary craftsmanship of Varanasi weavers. Ideal for weddings, pujas, and festive occasions.',
      category: sarees.id,
      brand: fabIndia.id,
      price: 8999.00,
      discountPrice: 7499.00,
      taxRate: 5.00,
      stockQuantity: 30,
      weight: 0.9,
      status: 'published',
      isFeatured: true,
      thumbnail: '/src/assets/images/seed-img-9.jpg',
      variants: [
        { color: 'Royal Blue & Gold', size: 'Standard (6.3m)', stock: 10, sku: 'SAR-BAN-004-BLU' },
        { color: 'Wine & Gold', size: 'Standard (6.3m)', stock: 10, sku: 'SAR-BAN-004-WIN' },
        { color: 'Emerald & Gold', size: 'Standard (6.3m)', stock: 10, sku: 'SAR-BAN-004-EMR' }
      ],
      seoTitle: 'Banarasi Silk Saree - Buy Authentic Handwoven Silk Sarees',
      seoDescription: 'Shop authentic Banarasi silk sarees with golden zari. Premium weave, fast shipping.'
    });

    // ── WESTERN WEAR ─────────────────────────────

    const p5 = await Product.create({
      name: 'Floral Wrap Midi Dress',
      slug: 'floral-wrap-midi-dress',
      sku: 'DRS-FWM-005',
      barcode: '100000000005',
      shortDescription: 'Boho chic floral print wrap midi dress with tie waist.',
      fullDescription: 'Step into the season with this effortlessly chic floral wrap midi dress. Crafted from breathable viscose fabric, the wrap silhouette cinches at the waist for a flattering fit. Perfect for brunch dates, garden parties, or casual Friday office looks. Features a V-neckline, flared skirt, and adjustable tie waist.',
      category: maxi.id,
      brand: zara.id,
      price: 2999.00,
      discountPrice: 2299.00,
      taxRate: 5.00,
      stockQuantity: 80,
      weight: 0.4,
      status: 'published',
      isFeatured: true,
      thumbnail: '/src/assets/images/seed-img-10.jpg',
      variants: [
        { color: 'Yellow Floral', size: 'XS', stock: 15, sku: 'DRS-FWM-005-YEL-XS' },
        { color: 'Yellow Floral', size: 'S', stock: 20, sku: 'DRS-FWM-005-YEL-S' },
        { color: 'Yellow Floral', size: 'M', stock: 20, sku: 'DRS-FWM-005-YEL-M' },
        { color: 'Yellow Floral', size: 'L', stock: 15, sku: 'DRS-FWM-005-YEL-L' },
        { color: 'Pink Floral', size: 'S', stock: 5, sku: 'DRS-FWM-005-PNK-S' },
        { color: 'Pink Floral', size: 'M', stock: 5, sku: 'DRS-FWM-005-PNK-M' }
      ],
      seoTitle: 'Floral Wrap Midi Dress - Zara Collection | Tobeque',
      seoDescription: 'Buy Zara floral wrap midi dress online. Perfect for summer and spring occasions.'
    });

    const p6 = await Product.create({
      name: 'Sequin Mini Party Dress',
      slug: 'sequin-mini-party-dress',
      sku: 'DRS-SEQ-006',
      barcode: '100000000006',
      shortDescription: 'Glittering all-over sequin mini dress for nights out.',
      fullDescription: 'Make a dazzling entrance in this head-turning all-over sequin mini dress. Featuring a bodycon silhouette, thin shoulder straps, and a deep V back, this dress is designed for those who want to own the night. The high-quality stretch mesh backing ensures ultimate comfort while you dance the night away.',
      category: partyDresses.id,
      brand: forever21.id,
      price: 3499.00,
      discountPrice: 2799.00,
      taxRate: 5.00,
      stockQuantity: 45,
      weight: 0.35,
      status: 'published',
      isFeatured: true,
      thumbnail: '/src/assets/images/seed-img-4.jpg',
      variants: [
        { color: 'Gold', size: 'XS', stock: 8, sku: 'DRS-SEQ-006-GLD-XS' },
        { color: 'Gold', size: 'S', stock: 12, sku: 'DRS-SEQ-006-GLD-S' },
        { color: 'Gold', size: 'M', stock: 10, sku: 'DRS-SEQ-006-GLD-M' },
        { color: 'Silver', size: 'XS', stock: 5, sku: 'DRS-SEQ-006-SLV-XS' },
        { color: 'Silver', size: 'S', stock: 5, sku: 'DRS-SEQ-006-SLV-S' },
        { color: 'Black', size: 'S', stock: 5, sku: 'DRS-SEQ-006-BLK-S' }
      ]
    });

    const p7 = await Product.create({
      name: 'Linen Flared Co-ord Set',
      slug: 'linen-flared-coord-set',
      sku: 'CRD-LIN-007',
      barcode: '100000000007',
      shortDescription: 'Breezy linen co-ord set with crop top and flared pants.',
      fullDescription: 'Beat the heat in this relaxed and stylish linen co-ord set. The set features a sleeveless crop top with button detailing and a high-waist flared palazzo pant in matching fabric. Perfect for summer vacations, beach walks, and casual lunches. The natural linen material keeps you cool and breathable all day.',
      category: coOrdSets.id,
      brand: hm.id,
      price: 2499.00,
      discountPrice: 1999.00,
      taxRate: 5.00,
      stockQuantity: 70,
      weight: 0.5,
      status: 'published',
      isFeatured: false,
      thumbnail: '/src/assets/images/seed-img-11.jpg',
      variants: [
        { color: 'Sage Green', size: 'XS', stock: 12, sku: 'CRD-LIN-007-SAG-XS' },
        { color: 'Sage Green', size: 'S', stock: 15, sku: 'CRD-LIN-007-SAG-S' },
        { color: 'Sage Green', size: 'M', stock: 15, sku: 'CRD-LIN-007-SAG-M' },
        { color: 'Sage Green', size: 'L', stock: 10, sku: 'CRD-LIN-007-SAG-L' },
        { color: 'Beige', size: 'S', stock: 10, sku: 'CRD-LIN-007-BEI-S' },
        { color: 'Beige', size: 'M', stock: 8, sku: 'CRD-LIN-007-BEI-M' }
      ]
    });

    const p8 = await Product.create({
      name: 'Striped Tiered Maxi Dress',
      slug: 'striped-tiered-maxi-dress',
      sku: 'DRS-STR-008',
      barcode: '100000000008',
      shortDescription: 'Casual striped tiered maxi dress with spaghetti straps.',
      fullDescription: 'This effortlessly cool striped tiered maxi dress is your go-to for summer festivals, beach trips, and casual hangouts. The tiered hem adds playful movement, while the adjustable spaghetti straps ensure a perfect fit. Made from soft and breathable cotton-blend fabric that feels amazing against your skin.',
      category: maxi.id,
      brand: hm.id,
      price: 1999.00,
      discountPrice: 1599.00,
      taxRate: 5.00,
      stockQuantity: 90,
      weight: 0.45,
      status: 'published',
      isFeatured: false,
      thumbnail: '/src/assets/images/seed-img-3.jpg',
      variants: [
        { color: 'Blue & White', size: 'XS', stock: 15, sku: 'DRS-STR-008-BLU-XS' },
        { color: 'Blue & White', size: 'S', stock: 20, sku: 'DRS-STR-008-BLU-S' },
        { color: 'Blue & White', size: 'M', stock: 20, sku: 'DRS-STR-008-BLU-M' },
        { color: 'Blue & White', size: 'L', stock: 15, sku: 'DRS-STR-008-BLU-L' },
        { color: 'Pink & White', size: 'S', stock: 10, sku: 'DRS-STR-008-PNK-S' },
        { color: 'Pink & White', size: 'M', stock: 10, sku: 'DRS-STR-008-PNK-M' }
      ]
    });

    const p9 = await Product.create({
      name: 'Ruffle Hem Mini Skirt',
      slug: 'ruffle-hem-mini-skirt',
      sku: 'SKT-RUF-009',
      barcode: '100000000009',
      shortDescription: 'Flirty ruffle hem mini skirt in solid satin fabric.',
      fullDescription: 'Add a playful edge to your wardrobe with this ruffle hem mini skirt. The smooth satin fabric drapes beautifully, and the ruffle hem at the bottom adds a feminine flair. Features a comfortable elastic waistband. Pair with a tucked-in blouse or crop top for a complete chic look.',
      category: skirts.id,
      brand: zara.id,
      price: 1499.00,
      discountPrice: 1199.00,
      taxRate: 5.00,
      stockQuantity: 55,
      weight: 0.25,
      status: 'published',
      isFeatured: false,
      thumbnail: '/src/assets/images/seed-img-12.jpg',
      variants: [
        { color: 'Black', size: 'XS', stock: 10, sku: 'SKT-RUF-009-BLK-XS' },
        { color: 'Black', size: 'S', stock: 12, sku: 'SKT-RUF-009-BLK-S' },
        { color: 'Black', size: 'M', stock: 12, sku: 'SKT-RUF-009-BLK-M' },
        { color: 'Dusty Pink', size: 'XS', stock: 8, sku: 'SKT-RUF-009-PNK-XS' },
        { color: 'Dusty Pink', size: 'S', stock: 8, sku: 'SKT-RUF-009-PNK-S' },
        { color: 'Dusty Pink', size: 'M', stock: 5, sku: 'SKT-RUF-009-PNK-M' }
      ]
    });

    const p10 = await Product.create({
      name: 'Embroidered Boho Crop Top',
      slug: 'embroidered-boho-crop-top',
      sku: 'TOP-BHO-010',
      barcode: '100000000010',
      shortDescription: 'Boho-inspired cotton crop top with thread embroidery.',
      fullDescription: 'Elevate your casual look with this charming boho embroidered crop top. Features intricate multi-colour thread embroidery on breathable white cotton, a square neckline, and balloon sleeves for a romantic silhouette. Pairs effortlessly with high-waist jeans, skirts, or co-ord palazzos.',
      category: topsAndBlouses.id,
      brand: fabIndia.id,
      price: 899.00,
      discountPrice: 699.00,
      taxRate: 5.00,
      stockQuantity: 100,
      weight: 0.2,
      status: 'published',
      isFeatured: false,
      thumbnail: '/src/assets/images/seed-img-13.jpg',
      variants: [
        { color: 'White', size: 'XS', stock: 20, sku: 'TOP-BHO-010-WHT-XS' },
        { color: 'White', size: 'S', stock: 25, sku: 'TOP-BHO-010-WHT-S' },
        { color: 'White', size: 'M', stock: 25, sku: 'TOP-BHO-010-WHT-M' },
        { color: 'White', size: 'L', stock: 15, sku: 'TOP-BHO-010-WHT-L' },
        { color: 'Cream', size: 'S', stock: 10, sku: 'TOP-BHO-010-CRM-S' },
        { color: 'Cream', size: 'M', stock: 5, sku: 'TOP-BHO-010-CRM-M' }
      ]
    });

    // ── PARTY & OCCASION WEAR ────────────────────

    const p11 = await Product.create({
      name: 'Enchanted Tulle Ball Gown',
      slug: 'enchanted-tulle-ball-gown',
      sku: 'GWN-TUL-011',
      barcode: '100000000011',
      shortDescription: 'Dreamy princess-cut ball gown in layered tulle.',
      fullDescription: 'Be the most enchanting person in the room with this dreamy princess-cut ball gown. Featuring a fitted sweetheart bodice with intricate lace appliqué and a voluminous layered tulle skirt that flows gracefully to the floor. Available in powdery pastels and timeless white, this gown is perfect for formals, proms, and fairytale weddings.',
      category: gowns.id,
      brand: anita.id,
      price: 18999.00,
      discountPrice: 15999.00,
      taxRate: 5.00,
      stockQuantity: 20,
      weight: 3.0,
      status: 'published',
      isFeatured: true,
      thumbnail: '/src/assets/images/seed-img-14.jpg',
      variants: [
        { color: 'Powder Blue', size: 'XS', stock: 4, sku: 'GWN-TUL-011-BLU-XS' },
        { color: 'Powder Blue', size: 'S', stock: 5, sku: 'GWN-TUL-011-BLU-S' },
        { color: 'Powder Blue', size: 'M', stock: 5, sku: 'GWN-TUL-011-BLU-M' },
        { color: 'Ivory White', size: 'S', stock: 3, sku: 'GWN-TUL-011-IVY-S' },
        { color: 'Ivory White', size: 'M', stock: 3, sku: 'GWN-TUL-011-IVY-M' }
      ],
      seoTitle: 'Enchanted Tulle Ball Gown - Premium Party Wear',
      seoDescription: 'Shop princess-cut tulle ball gown for proms and formals. Free shipping on orders above ₹999.'
    });

    const p12 = await Product.create({
      name: 'Velvet Off-Shoulder Cocktail Dress',
      slug: 'velvet-off-shoulder-cocktail-dress',
      sku: 'DRS-VLV-012',
      barcode: '100000000012',
      shortDescription: 'Luxurious velvet off-shoulder cocktail dress with bodycon fit.',
      fullDescription: 'This sleek velvet off-shoulder cocktail dress is designed to turn heads at any event. The rich, high-quality velvet fabric gives the dress an ultra-luxe feel, while the bodycon silhouette accentuates curves beautifully. The off-shoulder neckline adds a touch of elegance. Available in jewel tones perfect for evening events.',
      category: cocktailDresses.id,
      brand: mango.id,
      price: 5999.00,
      discountPrice: 4799.00,
      taxRate: 5.00,
      stockQuantity: 35,
      weight: 0.55,
      status: 'published',
      isFeatured: true,
      thumbnail: '/src/assets/images/seed-img-15.jpg',
      variants: [
        { color: 'Deep Emerald', size: 'XS', stock: 6, sku: 'DRS-VLV-012-EMR-XS' },
        { color: 'Deep Emerald', size: 'S', stock: 8, sku: 'DRS-VLV-012-EMR-S' },
        { color: 'Deep Emerald', size: 'M', stock: 8, sku: 'DRS-VLV-012-EMR-M' },
        { color: 'Burgundy', size: 'S', stock: 7, sku: 'DRS-VLV-012-BUR-S' },
        { color: 'Burgundy', size: 'M', stock: 6, sku: 'DRS-VLV-012-BUR-M' }
      ]
    });

    // ── ACTIVEWEAR ───────────────────────────────

    const p13 = await Product.create({
      name: 'High-Waist Yoga Leggings',
      slug: 'high-waist-yoga-leggings',
      sku: 'YGA-HWL-013',
      barcode: '100000000013',
      shortDescription: 'Ultra-stretch 4-way flex high-waist yoga leggings.',
      fullDescription: 'Achieve peak performance in these ultra-comfortable high-waist yoga leggings. Made from a moisture-wicking, 4-way stretch fabric blend, these leggings move with you through every pose, squat and sprint. Features a hidden waistband pocket, flatlock seams to prevent chafing, and a squat-proof design.',
      category: gymWear.id,
      brand: puma.id,
      price: 1799.00,
      discountPrice: 1499.00,
      taxRate: 5.00,
      stockQuantity: 150,
      weight: 0.3,
      status: 'published',
      isFeatured: false,
      thumbnail: '/src/assets/images/seed-img-5.jpg',
      variants: [
        { color: 'Black', size: 'XS', stock: 30, sku: 'YGA-HWL-013-BLK-XS' },
        { color: 'Black', size: 'S', stock: 35, sku: 'YGA-HWL-013-BLK-S' },
        { color: 'Black', size: 'M', stock: 35, sku: 'YGA-HWL-013-BLK-M' },
        { color: 'Black', size: 'L', stock: 20, sku: 'YGA-HWL-013-BLK-L' },
        { color: 'Navy Blue', size: 'S', stock: 15, sku: 'YGA-HWL-013-NAV-S' },
        { color: 'Navy Blue', size: 'M', stock: 15, sku: 'YGA-HWL-013-NAV-M' }
      ]
    });

    const p14 = await Product.create({
      name: 'Ribbed Sports Bra',
      slug: 'ribbed-sports-bra',
      sku: 'SPT-RBD-014',
      barcode: '100000000014',
      shortDescription: 'Medium-support ribbed seamless sports bra for yoga and pilates.',
      fullDescription: 'This sleek ribbed sports bra offers medium support for yoga, pilates, and low-impact workouts. The seamless construction provides a smooth, second-skin feel, while the wide underband and adjustable straps deliver a secure and comfortable fit. Moisture-wicking fabric keeps you dry and confident.',
      category: gymWear.id,
      brand: puma.id,
      price: 999.00,
      discountPrice: 799.00,
      taxRate: 5.00,
      stockQuantity: 200,
      weight: 0.15,
      status: 'published',
      isFeatured: false,
      thumbnail: '/src/assets/images/seed-img-16.jpg',
      variants: [
        { color: 'Lavender', size: 'XS', stock: 40, sku: 'SPT-RBD-014-LAV-XS' },
        { color: 'Lavender', size: 'S', stock: 50, sku: 'SPT-RBD-014-LAV-S' },
        { color: 'Lavender', size: 'M', stock: 50, sku: 'SPT-RBD-014-LAV-M' },
        { color: 'Lavender', size: 'L', stock: 30, sku: 'SPT-RBD-014-LAV-L' },
        { color: 'Coral', size: 'S', stock: 15, sku: 'SPT-RBD-014-COR-S' },
        { color: 'Coral', size: 'M', stock: 15, sku: 'SPT-RBD-014-COR-M' }
      ]
    });

    const p15 = await Product.create({
      name: 'Cozy Fleece Loungewear Set',
      slug: 'cozy-fleece-loungewear-set',
      sku: 'LNG-FLS-015',
      barcode: '100000000015',
      shortDescription: 'Ultra-soft fleece pullover and jogger set for lazy days.',
      fullDescription: 'Wrap yourself in absolute comfort with this cozy fleece loungewear set. The oversized pullover hoodie and relaxed-fit jogger pants are made from ultra-soft micro-fleece fabric that feels like a warm hug. Perfect for weekends at home, movie nights, and cool morning walks. Available in an array of soothing pastel shades.',
      category: loungewear.id,
      brand: hm.id,
      price: 2299.00,
      discountPrice: 1899.00,
      taxRate: 5.00,
      stockQuantity: 80,
      weight: 0.7,
      status: 'published',
      isFeatured: false,
      thumbnail: '/src/assets/images/seed-img-6.jpg',
      variants: [
        { color: 'Blush Pink', size: 'XS', stock: 15, sku: 'LNG-FLS-015-PNK-XS' },
        { color: 'Blush Pink', size: 'S', stock: 20, sku: 'LNG-FLS-015-PNK-S' },
        { color: 'Blush Pink', size: 'M', stock: 20, sku: 'LNG-FLS-015-PNK-M' },
        { color: 'Blush Pink', size: 'L', stock: 10, sku: 'LNG-FLS-015-PNK-L' },
        { color: 'Grey', size: 'S', stock: 8, sku: 'LNG-FLS-015-GRY-S' },
        { color: 'Grey', size: 'M', stock: 7, sku: 'LNG-FLS-015-GRY-M' }
      ]
    });

    // ── WINTER WEAR ──────────────────────────────

    const p16 = await Product.create({
      name: 'Oversized Knit Sweater',
      slug: 'oversized-knit-sweater',
      sku: 'SWT-OVR-016',
      barcode: '100000000016',
      shortDescription: 'Chunky cable-knit oversized sweater in neutral tones.',
      fullDescription: 'Stay cozy and stylish this winter with this luxuriously warm oversized cable-knit sweater. The relaxed silhouette and extra length make it easy to style as a dress with knee-high boots, or tuck it into high-waist trousers. Made from premium acrylic-wool blend for warmth without the weight.',
      category: winterWear.id,
      brand: zara.id,
      price: 2799.00,
      discountPrice: 2199.00,
      taxRate: 5.00,
      stockQuantity: 60,
      weight: 0.9,
      status: 'published',
      isFeatured: false,
      thumbnail: '/src/assets/images/seed-img-17.jpg',
      variants: [
        { color: 'Camel', size: 'S', stock: 15, sku: 'SWT-OVR-016-CAM-S' },
        { color: 'Camel', size: 'M', stock: 15, sku: 'SWT-OVR-016-CAM-M' },
        { color: 'Camel', size: 'L', stock: 10, sku: 'SWT-OVR-016-CAM-L' },
        { color: 'Ivory', size: 'S', stock: 10, sku: 'SWT-OVR-016-IVY-S' },
        { color: 'Ivory', size: 'M', stock: 10, sku: 'SWT-OVR-016-IVY-M' }
      ]
    });

    const p17 = await Product.create({
      name: 'Belted Wool Blend Trench Coat',
      slug: 'belted-wool-blend-trench-coat',
      sku: 'COT-WBT-017',
      barcode: '100000000017',
      shortDescription: 'Classic belted trench coat in premium wool blend fabric.',
      fullDescription: 'A wardrobe essential for every girl, this classic belted trench coat is cut from a premium wool blend that keeps you warm and elegant. Features a double-breasted button closure, oversized lapels, waist belt, and a mid-length silhouette that works with everything from jeans to formal dresses. A true investment piece that transcends seasons.',
      category: winterWear.id,
      brand: mango.id,
      price: 6999.00,
      discountPrice: 5499.00,
      taxRate: 5.00,
      stockQuantity: 40,
      weight: 1.5,
      status: 'published',
      isFeatured: true,
      thumbnail: '/src/assets/images/seed-img-18.jpg',
      variants: [
        { color: 'Camel Brown', size: 'XS', stock: 8, sku: 'COT-WBT-017-CAM-XS' },
        { color: 'Camel Brown', size: 'S', stock: 10, sku: 'COT-WBT-017-CAM-S' },
        { color: 'Camel Brown', size: 'M', stock: 10, sku: 'COT-WBT-017-CAM-M' },
        { color: 'Black', size: 'S', stock: 6, sku: 'COT-WBT-017-BLK-S' },
        { color: 'Black', size: 'M', stock: 6, sku: 'COT-WBT-017-BLK-M' }
      ]
    });

    // ── MORE WESTERN WEAR ────────────────────────

    const p18 = await Product.create({
      name: 'Denim Button-Down Shirt Dress',
      slug: 'denim-button-down-shirt-dress',
      sku: 'DRS-DNM-018',
      barcode: '100000000018',
      shortDescription: 'Relaxed denim shirt dress with roll-up sleeves.',
      fullDescription: 'A wardrobe classic reimagined - this denim shirt dress is effortlessly versatile. Wear it buttoned up as a dress with sneakers for casual days, or half-open as a layer over leggings. Features a relaxed fit, chest pockets, roll-up sleeve tabs, and a tie waist belt for a polished look.',
      category: casualDresses.id,
      brand: hm.id,
      price: 2199.00,
      discountPrice: 1699.00,
      taxRate: 5.00,
      stockQuantity: 75,
      weight: 0.55,
      status: 'published',
      isFeatured: false,
      thumbnail: '/src/assets/images/seed-img-19.jpg',
      variants: [
        { color: 'Light Blue Denim', size: 'XS', stock: 15, sku: 'DRS-DNM-018-LBL-XS' },
        { color: 'Light Blue Denim', size: 'S', stock: 20, sku: 'DRS-DNM-018-LBL-S' },
        { color: 'Light Blue Denim', size: 'M', stock: 20, sku: 'DRS-DNM-018-LBL-M' },
        { color: 'Light Blue Denim', size: 'L', stock: 12, sku: 'DRS-DNM-018-LBL-L' },
        { color: 'Dark Denim', size: 'S', stock: 5, sku: 'DRS-DNM-018-DBL-S' },
        { color: 'Dark Denim', size: 'M', stock: 3, sku: 'DRS-DNM-018-DBL-M' }
      ]
    });

    const p19 = await Product.create({
      name: 'Satin Slip Midi Dress',
      slug: 'satin-slip-midi-dress',
      sku: 'DRS-SAT-019',
      barcode: '100000000019',
      shortDescription: 'Elegant satin slip midi dress with adjustable straps.',
      fullDescription: 'This ultra-sleek satin slip dress is the definition of effortless glamour. The fluid satin fabric cascades beautifully, creating a stunning drape effect. Features an adjustable thin-strap design, a delicate lace trim at the hem, and a relaxed yet sophisticated fit. Style it alone for evening events or layer it over a white tee for an edgy street-fashion look.',
      category: partyDresses.id,
      brand: zara.id,
      price: 3299.00,
      discountPrice: 2599.00,
      taxRate: 5.00,
      stockQuantity: 50,
      weight: 0.4,
      status: 'published',
      isFeatured: true,
      thumbnail: '/src/assets/images/seed-img-20.jpg',
      variants: [
        { color: 'Champagne', size: 'XS', stock: 10, sku: 'DRS-SAT-019-CHM-XS' },
        { color: 'Champagne', size: 'S', stock: 12, sku: 'DRS-SAT-019-CHM-S' },
        { color: 'Champagne', size: 'M', stock: 12, sku: 'DRS-SAT-019-CHM-M' },
        { color: 'Black', size: 'XS', stock: 6, sku: 'DRS-SAT-019-BLK-XS' },
        { color: 'Black', size: 'S', stock: 5, sku: 'DRS-SAT-019-BLK-S' },
        { color: 'Black', size: 'M', stock: 5, sku: 'DRS-SAT-019-BLK-M' }
      ]
    });

    const p20 = await Product.create({
      name: 'Printed Peasant Dress',
      slug: 'printed-peasant-dress',
      sku: 'DRS-PSN-020',
      barcode: '100000000020',
      shortDescription: 'Boho printed smocked bodice peasant dress with puff sleeves.',
      fullDescription: 'Embrace bohemian style with this charming printed peasant dress. The smocked bodice ensures a perfect fit, while the puff sleeves and tiered skirt give it an airy, free-spirited look. Made from lightweight cotton, this dress is a summer wardrobe must-have. Works beautifully for vacations, brunch dates, and casual outings.',
      category: casualDresses.id,
      brand: forever21.id,
      price: 1799.00,
      discountPrice: 1399.00,
      taxRate: 5.00,
      stockQuantity: 95,
      weight: 0.45,
      status: 'published',
      isFeatured: false,
      thumbnail: '/src/assets/images/seed-img-21.jpg',
      variants: [
        { color: 'Terra Cotta Print', size: 'XS', stock: 20, sku: 'DRS-PSN-020-TER-XS' },
        { color: 'Terra Cotta Print', size: 'S', stock: 25, sku: 'DRS-PSN-020-TER-S' },
        { color: 'Terra Cotta Print', size: 'M', stock: 25, sku: 'DRS-PSN-020-TER-M' },
        { color: 'Terra Cotta Print', size: 'L', stock: 15, sku: 'DRS-PSN-020-TER-L' },
        { color: 'Sage Green Print', size: 'S', stock: 5, sku: 'DRS-PSN-020-SAG-S' },
        { color: 'Sage Green Print', size: 'M', stock: 5, sku: 'DRS-PSN-020-SAG-M' }
      ]
    });

    const p26 = await Product.create({
      name: 'Casual White Shirt',
      slug: 'casual-white-shirt',
      sku: 'SHR-001',
      price: 1599.00,
      stockQuantity: 100,
      status: 'published',
      category: shirtsAndBlouses.id,
      brand: hm.id,
      thumbnail: '/src/assets/images/seed-img-22.jpg'
    });

    const p27 = await Product.create({
      name: 'Graphic T-Shirt',
      slug: 'graphic-t-shirt',
      sku: 'TSH-001',
      price: 799.00,
      stockQuantity: 100,
      status: 'published',
      category: tshirtsAndVests.id,
      brand: hm.id,
      thumbnail: '/src/assets/images/seed-img-23.jpg'
    });

    const p28 = await Product.create({
      name: 'High Waist Denim Jeans',
      slug: 'high-waist-denim-jeans',
      sku: 'JEA-001',
      price: 2499.00,
      stockQuantity: 100,
      status: 'published',
      category: jeansAndPants.id,
      brand: zara.id,
      thumbnail: '/src/assets/images/seed-img-24.jpg'
    });

    const p29 = await Product.create({
      name: 'Summer Trend Dress',
      slug: 'summer-trend-dress',
      sku: 'NEW-001',
      price: 2999.00,
      stockQuantity: 100,
      status: 'published',
      category: newIn.id,
      brand: zara.id,
      thumbnail: '/src/assets/images/seed-img-19.jpg'
    });

    const p30 = await Product.create({
      name: 'Summer 26 Collection Top',
      slug: 'summer-26-top',
      sku: 'SUM-001',
      price: 1999.00,
      stockQuantity: 100,
      status: 'published',
      category: summer26.id,
      brand: zara.id,
      thumbnail: '/src/assets/images/seed-img-25.jpg'
    });

    const p31 = await Product.create({
      name: 'Customisable Dress',
      slug: 'customisable-dress',
      sku: 'CUS-001',
      price: 3999.00,
      stockQuantity: 100,
      status: 'published',
      category: customisable.id,
      brand: zara.id,
      thumbnail: '/src/assets/images/seed-img-26.jpg'
    });

    const p32 = await Product.create({
      name: 'Designer Collaboration Top',
      slug: 'collab-top',
      sku: 'COL-001',
      price: 4999.00,
      stockQuantity: 100,
      status: 'published',
      category: collaboration.id,
      brand: mango.id,
      thumbnail: '/src/assets/images/seed-img-27.jpg'
    });

    const p33 = await Product.create({
      name: 'Style Journal Editor Pick',
      slug: 'style-journal-pick',
      sku: 'STY-001',
      price: 5999.00,
      stockQuantity: 100,
      status: 'published',
      category: styleJournal.id,
      brand: zara.id,
      thumbnail: '/src/assets/images/seed-img-28.jpg'
    });

    const p34 = await Product.create({
      name: 'Steal The Style Outfit',
      slug: 'steal-the-style',
      sku: 'STL-001',
      price: 3499.00,
      stockQuantity: 100,
      status: 'published',
      category: stealTheStyle.id,
      brand: mango.id,
      thumbnail: '/src/assets/images/seed-img-29.jpg'
    });

    // ─────────────────────────────────────────────
    // 6. SEED PRODUCT IMAGES (Gallery)
    // ─────────────────────────────────────────────
    console.log('Seeding Product Images...');
    await ProductImage.create([
      // Royal Velvet Bridal Lehenga (p1)
      { product: p1.id, imageUrl: '/src/assets/images/seed-img-30.jpg' },
      { product: p1.id, imageUrl: '/src/assets/images/seed-img-31.jpg' },
      { product: p1.id, imageUrl: '/src/assets/images/seed-img-32.jpg' },

      // Floral Anarkali Suit (p2)
      { product: p2.id, imageUrl: '/src/assets/images/seed-img-33.jpg' },
      { product: p2.id, imageUrl: '/src/assets/images/seed-img-31.jpg' },

      // Block Print Kurti (p3)
      { product: p3.id, imageUrl: '/src/assets/images/seed-img-34.jpg' },

      // Banarasi Saree (p4)
      { product: p4.id, imageUrl: '/src/assets/images/seed-img-32.jpg' },
      { product: p4.id, imageUrl: '/src/assets/images/seed-img-30.jpg' },

      // Floral Wrap Midi Dress (p5)
      { product: p5.id, imageUrl: '/src/assets/images/seed-img-35.jpg' },
      { product: p5.id, imageUrl: '/src/assets/images/seed-img-36.jpg' },

      // Sequin Party Dress (p6)
      { product: p6.id, imageUrl: '/src/assets/images/seed-img-37.jpg' },
      { product: p6.id, imageUrl: '/src/assets/images/seed-img-38.jpg' },

      // Co-ord Set (p7)
      { product: p7.id, imageUrl: '/src/assets/images/seed-img-39.jpg' },

      // Striped Maxi Dress (p8)
      { product: p8.id, imageUrl: '/src/assets/images/seed-img-40.jpg' },

      // Tulle Ball Gown (p11)
      { product: p11.id, imageUrl: '/src/assets/images/seed-img-41.jpg' },
      { product: p11.id, imageUrl: '/src/assets/images/seed-img-42.jpg' },

      // Cocktail Dress (p12)
      { product: p12.id, imageUrl: '/src/assets/images/seed-img-38.jpg' },

      // Satin Slip Dress (p19)
      { product: p19.id, imageUrl: '/src/assets/images/seed-img-36.jpg' },
      { product: p19.id, imageUrl: '/src/assets/images/seed-img-42.jpg' },

      // Trench Coat (p17)
      { product: p17.id, imageUrl: '/src/assets/images/seed-img-43.jpg' }
    ]);

    // ─────────────────────────────────────────────
    // 7. SEED COUPONS
    // ─────────────────────────────────────────────
    console.log('Seeding Coupons...');
    await Coupon.create([
      {
        code: 'GIRL10',
        type: 'percentage',
        discountValue: 10.00,
        minOrderAmount: 500.00,
        usageLimit: 1000,
        usedCount: 234,
        startDate: '2026-01-01',
        expiryDate: '2026-12-31',
        status: true
      },
      {
        code: 'ETHNIC20',
        type: 'percentage',
        discountValue: 20.00,
        minOrderAmount: 2000.00,
        usageLimit: 500,
        usedCount: 78,
        startDate: '2026-01-01',
        expiryDate: '2026-12-31',
        status: true
      },
      {
        code: 'FLAT500',
        type: 'flat',
        discountValue: 500.00,
        minOrderAmount: 3000.00,
        usageLimit: 300,
        usedCount: 45,
        startDate: '2026-01-01',
        expiryDate: '2026-09-30',
        status: true
      },
      {
        code: 'SUMMER25',
        type: 'percentage',
        discountValue: 25.00,
        minOrderAmount: 1000.00,
        usageLimit: 700,
        usedCount: 0,
        startDate: '2026-06-01',
        expiryDate: '2026-09-30',
        status: true
      },
      {
        code: 'NEWLOOK',
        type: 'flat',
        discountValue: 250.00,
        minOrderAmount: 1500.00,
        usageLimit: 200,
        usedCount: 12,
        startDate: '2026-06-01',
        expiryDate: '2026-08-31',
        status: true
      }
    ]);

    // ─────────────────────────────────────────────
    // 8. SEED ORDERS
    // ─────────────────────────────────────────────
    console.log('Seeding Orders...');
    const now = new Date();
    const makeDate = (monthsAgo, dayOffset = 5) => {
      const d = new Date(now);
      d.setMonth(d.getMonth() - monthsAgo);
      d.setDate(d.getDate() - dayOffset);
      return d;
    };

    const ordersData = [
      // 5 Months Ago
      { user: customers[0].id, orderNumber: 'ORD-2001', subtotal: 19999.00, taxAmount: 1000.00, shippingCost: 0.00, discountAmount: 1999.90, totalAmount: 18999.10, orderStatus: 'delivered', paymentStatus: 'paid', paymentMethod: 'stripe', shippingStatus: 'delivered', createdAt: makeDate(5, 12) },
      { user: customers[1].id, orderNumber: 'ORD-2002', subtotal: 2799.00, taxAmount: 139.95, shippingCost: 99.00, discountAmount: 0.00, totalAmount: 3037.95, orderStatus: 'delivered', paymentStatus: 'paid', paymentMethod: 'paypal', shippingStatus: 'delivered', createdAt: makeDate(5, 4) },

      // 4 Months Ago
      { user: customers[2].id, orderNumber: 'ORD-2003', subtotal: 999.00, taxAmount: 49.95, shippingCost: 49.00, discountAmount: 99.90, totalAmount: 998.05, orderStatus: 'delivered', paymentStatus: 'paid', paymentMethod: 'cod', shippingStatus: 'delivered', createdAt: makeDate(4, 25) },
      { user: customers[3].id, orderNumber: 'ORD-2004', subtotal: 7499.00, taxAmount: 374.95, shippingCost: 0.00, discountAmount: 500.00, totalAmount: 7373.95, orderStatus: 'delivered', paymentStatus: 'paid', paymentMethod: 'stripe', shippingStatus: 'delivered', createdAt: makeDate(4, 10) },

      // 3 Months Ago
      { user: customers[0].id, orderNumber: 'ORD-2005', subtotal: 2299.00, taxAmount: 114.95, shippingCost: 99.00, discountAmount: 229.90, totalAmount: 2283.05, orderStatus: 'delivered', paymentStatus: 'paid', paymentMethod: 'stripe', shippingStatus: 'delivered', createdAt: makeDate(3, 20) },
      { user: customers[1].id, orderNumber: 'ORD-2006', subtotal: 4799.00, taxAmount: 239.95, shippingCost: 0.00, discountAmount: 0.00, totalAmount: 5038.95, orderStatus: 'delivered', paymentStatus: 'paid', paymentMethod: 'paypal', shippingStatus: 'delivered', createdAt: makeDate(3, 8) },

      // 2 Months Ago
      { user: customers[2].id, orderNumber: 'ORD-2007', subtotal: 39998.00, taxAmount: 1999.90, shippingCost: 0.00, discountAmount: 500.00, totalAmount: 41497.90, orderStatus: 'delivered', paymentStatus: 'paid', paymentMethod: 'stripe', shippingStatus: 'delivered', createdAt: makeDate(2, 14) },
      { user: customers[3].id, orderNumber: 'ORD-2008', subtotal: 1499.00, taxAmount: 74.95, shippingCost: 49.00, discountAmount: 0.00, totalAmount: 1622.95, orderStatus: 'cancelled', paymentStatus: 'pending', paymentMethod: 'cod', shippingStatus: 'pending', createdAt: makeDate(2, 2) },

      // 1 Month Ago
      { user: customers[0].id, orderNumber: 'ORD-2009', subtotal: 15999.00, taxAmount: 799.95, shippingCost: 0.00, discountAmount: 1599.90, totalAmount: 15199.05, orderStatus: 'delivered', paymentStatus: 'paid', paymentMethod: 'stripe', shippingStatus: 'delivered', createdAt: makeDate(1, 28) },
      { user: customers[1].id, orderNumber: 'ORD-2010', subtotal: 5998.00, taxAmount: 299.90, shippingCost: 99.00, discountAmount: 500.00, totalAmount: 5896.90, orderStatus: 'returned', paymentStatus: 'refunded', paymentMethod: 'paypal', shippingStatus: 'delivered', createdAt: makeDate(1, 15) },
      { user: customers[2].id, orderNumber: 'ORD-2011', subtotal: 1799.00, taxAmount: 89.95, shippingCost: 49.00, discountAmount: 179.90, totalAmount: 1759.05, orderStatus: 'delivered', paymentStatus: 'paid', paymentMethod: 'cod', shippingStatus: 'delivered', createdAt: makeDate(1, 5) },

      // Current Month
      { user: customers[0].id, orderNumber: 'ORD-2012', subtotal: 2799.00, taxAmount: 139.95, shippingCost: 0.00, discountAmount: 250.00, totalAmount: 2688.95, orderStatus: 'processing', paymentStatus: 'paid', paymentMethod: 'stripe', shippingStatus: 'pending', shippingAddress: '42 Shyam Nagar, Jaipur, Rajasthan 302019', createdAt: makeDate(0, 4) },
      { user: customers[1].id, orderNumber: 'ORD-2013', subtotal: 999.00, taxAmount: 49.95, shippingCost: 49.00, discountAmount: 0.00, totalAmount: 1097.95, orderStatus: 'pending', paymentStatus: 'pending', paymentMethod: 'cod', shippingStatus: 'pending', shippingAddress: '15 MG Road, Bengaluru, Karnataka 560001', createdAt: makeDate(0, 2) },
      { user: customers[3].id, orderNumber: 'ORD-2014', subtotal: 5499.00, taxAmount: 274.95, shippingCost: 0.00, discountAmount: 500.00, totalAmount: 5273.95, orderStatus: 'shipped', paymentStatus: 'paid', paymentMethod: 'stripe', shippingStatus: 'shipped', trackingNumber: 'TBQ928139281', shippingAddress: '8 Park Street, Kolkata, West Bengal 700016', createdAt: makeDate(0, 1) }
    ];

    for (let o of ordersData) {
      const order = await Order.create({
        ...o,
        shippingAddress: o.shippingAddress || '102 Fashion Avenue, Mumbai, Maharashtra 400001',
        billingAddress: o.billingAddress || '102 Fashion Avenue, Mumbai, Maharashtra 400001'
      });

      // Add realistic order items
      if (o.subtotal === 19999.00) {
        await OrderItem.create({ order: order.id, product: p1.id, productName: p1.name, sku: p1.sku, price: 19999.00, quantity: 1, variantDetails: { color: 'Maroon', size: 'M' } });
      } else if (o.subtotal === 2799.00) {
        await OrderItem.create({ order: order.id, product: p2.id, productName: p2.name, sku: p2.sku, price: 2799.00, quantity: 1, variantDetails: { color: 'Pink Floral', size: 'S' } });
      } else if (o.subtotal === 999.00) {
        await OrderItem.create({ order: order.id, product: p3.id, productName: p3.name, sku: p3.sku, price: 999.00, quantity: 1, variantDetails: { color: 'Indigo Blue', size: 'M' } });
      } else if (o.subtotal === 7499.00) {
        await OrderItem.create({ order: order.id, product: p4.id, productName: p4.name, sku: p4.sku, price: 7499.00, quantity: 1, variantDetails: { color: 'Royal Blue & Gold', size: 'Standard (6.3m)' } });
      } else if (o.subtotal === 2299.00) {
        await OrderItem.create({ order: order.id, product: p5.id, productName: p5.name, sku: p5.sku, price: 2299.00, quantity: 1, variantDetails: { color: 'Yellow Floral', size: 'M' } });
      } else if (o.subtotal === 4799.00) {
        await OrderItem.create({ order: order.id, product: p12.id, productName: p12.name, sku: p12.sku, price: 4799.00, quantity: 1, variantDetails: { color: 'Deep Emerald', size: 'S' } });
      } else if (o.subtotal === 39998.00) {
        await OrderItem.create({ order: order.id, product: p1.id, productName: p1.name, sku: p1.sku, price: 19999.00, quantity: 2, variantDetails: { color: 'Maroon', size: 'S' } });
      } else if (o.subtotal === 1499.00) {
        await OrderItem.create({ order: order.id, product: p9.id, productName: p9.name, sku: p9.sku, price: 1199.00, quantity: 1, variantDetails: { color: 'Black', size: 'S' } });
      } else if (o.subtotal === 15999.00) {
        await OrderItem.create({ order: order.id, product: p11.id, productName: p11.name, sku: p11.sku, price: 15999.00, quantity: 1, variantDetails: { color: 'Powder Blue', size: 'S' } });
      } else if (o.subtotal === 5998.00) {
        await OrderItem.create({ order: order.id, product: p12.id, productName: p12.name, sku: p12.sku, price: 4799.00, quantity: 1, variantDetails: { color: 'Burgundy', size: 'M' } });
      } else if (o.subtotal === 1799.00) {
        await OrderItem.create({ order: order.id, product: p13.id, productName: p13.name, sku: p13.sku, price: 1499.00, quantity: 1, variantDetails: { color: 'Black', size: 'S' } });
      } else if (o.subtotal === 5499.00) {
        await OrderItem.create({ order: order.id, product: p17.id, productName: p17.name, sku: p17.sku, price: 5499.00, quantity: 1, variantDetails: { color: 'Camel Brown', size: 'M' } });
      }

      // Payment records
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

    // ─────────────────────────────────────────────
    // 9. SEED REVIEWS
    // ─────────────────────────────────────────────
    console.log('Seeding Reviews...');
    await Review.create([
      { user: customers[0].id, product: p1.id, rating: 5, comment: 'Absolutely stunning lehenga! Got so many compliments at the wedding. The embroidery is even more beautiful in person.', isApproved: true },
      { user: customers[1].id, product: p1.id, rating: 4, comment: 'Gorgeous lehenga, the fabric quality is premium. Delivery was quick too!', isApproved: true },
      { user: customers[2].id, product: p2.id, rating: 5, comment: 'The Anarkali suit is so flowy and elegant. Wore it to Diwali and everyone loved it!', isApproved: true },
      { user: customers[3].id, product: p2.id, rating: 4, comment: 'Beautiful print and great fit. The dupatta could be a bit longer but overall very happy!', isApproved: true },
      { user: customers[0].id, product: p3.id, rating: 5, comment: 'Love this block print kurti! Very FabIndia quality. Perfect for college wear.', isApproved: true },
      { user: customers[1].id, product: p4.id, rating: 5, comment: 'Authentic Banarasi silk - this saree is heirloom quality. Worth every rupee!', isApproved: true },
      { user: customers[2].id, product: p5.id, rating: 4, comment: 'Such a cute floral dress! Fits perfectly and the fabric is so comfortable.', isApproved: true },
      { user: customers[3].id, product: p6.id, rating: 5, comment: 'This sequin dress is absolutely fire! I wore it to a party and everyone kept asking where I got it!', isApproved: true },
      { user: customers[0].id, product: p11.id, rating: 5, comment: 'Wore this to my prom and felt like a princess! The tulle layers are so full and dreamy.', isApproved: true },
      { user: customers[1].id, product: p12.id, rating: 4, comment: 'Very sophisticated cocktail dress. The velvet feels luxurious and the fit is perfect.', isApproved: true },
      { user: customers[2].id, product: p13.id, rating: 5, comment: 'These leggings are squat-proof and super comfortable. Best yoga leggings I\'ve owned!', isApproved: true },
      { user: customers[3].id, product: p17.id, rating: 3, comment: 'The coat is beautiful but the sizing runs a bit small. I had to exchange for a larger size.', isApproved: false }
    ]);

    // ─────────────────────────────────────────────
    // 10. SEED BANNERS
    // ─────────────────────────────────────────────
    console.log('Seeding Banners...');
    await Banner.create([
      {
        title: 'Summer Fashion Festival',
        subtitle: 'Up to 30% off on all Western Wear',
        imageUrl: '/src/assets/images/seed-img-44.jpg',
        linkUrl: '/products?category=western-wear',
        position: 'home_slider',
        sortOrder: 1,
        status: true
      },
      {
        title: 'Festive Ethnic Collection',
        subtitle: 'Celebrate every occasion in style',
        imageUrl: '/src/assets/images/seed-img-45.jpg',
        linkUrl: '/products?category=ethnic-traditional-wear',
        position: 'home_slider',
        sortOrder: 2,
        status: true
      },
      {
        title: 'Prom & Party Season',
        subtitle: 'Gowns and cocktail dresses for every event',
        imageUrl: '/src/assets/images/seed-img-46.jpg',
        linkUrl: '/products?category=party-occasion-wear',
        position: 'home_slider',
        sortOrder: 3,
        status: true
      },
      {
        title: 'New Arrivals - Co-ord Sets',
        subtitle: 'Fresh looks. Fresh season.',
        imageUrl: '/src/assets/images/seed-img-47.jpg',
        linkUrl: '/products?category=co-ord-sets',
        position: 'promo_banner',
        sortOrder: 1,
        status: true
      },
      {
        title: 'Use Code ETHNIC20',
        subtitle: '20% off on ethnic wear above ₹2000',
        imageUrl: '/src/assets/images/seed-img-48.jpg',
        linkUrl: '/coupons',
        position: 'promo_banner',
        sortOrder: 2,
        status: true
      }
    ]);

    // ─────────────────────────────────────────────
    // 11. SEED SETTINGS
    // ─────────────────────────────────────────────
    console.log('Seeding System Settings...');
    await Setting.create([
      { key: 'site_name', value: 'Tobeque Fashion' },
      { key: 'site_logo', value: '' },
      { key: 'support_email', value: 'support@tobeque.com' },
      { key: 'currency', value: 'INR' },
      { key: 'tax_percentage', value: '5' },
      { key: 'smtp_host', value: 'smtp.mailtrap.io' },
      { key: 'smtp_port', value: '2525' },
      { key: 'free_shipping_above', value: '999' }
    ]);

    // ─────────────────────────────────────────────
    // 12. SEED INVENTORY LOGS
    // ─────────────────────────────────────────────
    console.log('Seeding Inventory Logs...');
    await InventoryLog.create([
      { productId: p1.id, stockChanged: 30, actionType: 'restock', reference: 'Initial stock load - Bridal Collection', adminId: adminUser.id },
      { productId: p1.id, stockChanged: -5, actionType: 'sale', reference: 'Sales deductor' },
      { productId: p2.id, stockChanged: 70, actionType: 'restock', reference: 'Initial stock load - Ethnic Collection', adminId: adminUser.id },
      { productId: p2.id, stockChanged: -10, actionType: 'sale', reference: 'Sales deductor' },
      { productId: p5.id, stockChanged: 90, actionType: 'restock', reference: 'Initial stock load - Western Collection', adminId: adminUser.id },
      { productId: p5.id, stockChanged: -10, actionType: 'sale', reference: 'Sales deductor' },
      { productId: p6.id, stockChanged: 50, actionType: 'restock', reference: 'Initial stock load - Party Wear', adminId: adminUser.id },
      { productId: p6.id, stockChanged: -5, actionType: 'sale', reference: 'Sales deductor' },
      { productId: p11.id, stockChanged: 25, actionType: 'restock', reference: 'Initial stock load - Gown Collection', adminId: adminUser.id },
      { productId: p11.id, stockChanged: -5, actionType: 'sale', reference: 'Sales deductor' }
    ]);

    // ─────────────────────────────────────────────
    // 13. SEED ADMIN LOG
    // ─────────────────────────────────────────────
    await AdminLog.create({
      adminId: adminUser.id,
      action: 'Seeded Girls Fashion data - categories, brands, products, orders and collections',
      entityType: 'settings',
      ipAddress: '127.0.0.1'
    });

    console.log('\n✅ Girls Fashion database seeded successfully!');
    console.log('──────────────────────────────────────────────────');
    console.log('  Admin Login:   admin@tobeque.com / admin123');
    console.log('  Manager Login: manager@tobeque.com / admin123');
    console.log('──────────────────────────────────────────────────');
    console.log('  Categories:  20 (Girls Fashion tree)');
    console.log('  Brands:       8 (Zara, H&M, BIBA, FabIndia...)');
    console.log('  Products:    20 (Ethnic, Western, Party, Active)');
    console.log('  Orders:      14');
    console.log('  Reviews:     12');
    console.log('  Banners:      5');
    console.log('  Coupons:      5');
    console.log('──────────────────────────────────────────────────\n');
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
