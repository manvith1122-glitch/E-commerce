const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const User = require('./models/User');
const Product = require('./models/Product');
const Order = require('./models/Order');

const PRODUCTS = [
  { name: 'iPhone 15 Pro Max', category: 'Electronics', price: 134900, originalPrice: 149900, stock: 25, brand: 'Apple', featured: true, description: 'The most powerful iPhone ever. Titanium design, A17 Pro chip, 48MP camera system with 5x optical zoom.', thumbnail: 'https://picsum.photos/seed/iphone/400/400', tags: ['smartphone', 'apple', '5g'] },
  { name: 'Samsung Galaxy S24 Ultra', category: 'Electronics', price: 124999, originalPrice: 134999, stock: 18, brand: 'Samsung', featured: true, description: 'Ultimate Android flagship with built-in S Pen, 200MP camera, and AI-powered features.', thumbnail: 'https://picsum.photos/seed/samsung/400/400', tags: ['smartphone', 'android'] },
  { name: 'Sony WH-1000XM5 Headphones', category: 'Electronics', price: 26990, originalPrice: 34990, stock: 40, brand: 'Sony', featured: false, description: 'Industry-leading noise cancellation, 30-hour battery, and crystal-clear hands-free calling.', thumbnail: 'https://picsum.photos/seed/sony/400/400', tags: ['audio', 'headphones'] },
  { name: 'MacBook Air M3', category: 'Electronics', price: 114900, originalPrice: 119900, stock: 12, brand: 'Apple', featured: true, description: '18-hour battery life, 13.6-inch Liquid Retina display, M3 chip with 8-core CPU.', thumbnail: 'https://picsum.photos/seed/macbook/400/400', tags: ['laptop', 'apple'] },
  { name: 'Nike Air Max 270', category: 'Clothing', price: 10795, originalPrice: 12995, stock: 60, brand: 'Nike', featured: false, description: "Nike's biggest heel Air unit yet for an incredibly light, comfortable ride.", thumbnail: 'https://picsum.photos/seed/nike/400/400', tags: ['shoes', 'sports'] },
  { name: 'Levi\'s 501 Original Jeans', category: 'Clothing', price: 3499, originalPrice: 4999, stock: 80, brand: "Levi's", featured: false, description: "The original jean since 1873. The 501 Original features a straight leg, button fly and sits at the waist.", thumbnail: 'https://picsum.photos/seed/levis/400/400', tags: ['jeans', 'denim'] },
  { name: 'Atomic Habits by James Clear', category: 'Books', price: 399, originalPrice: 799, stock: 120, brand: 'Penguin', featured: false, description: 'Tiny Changes, Remarkable Results. The #1 New York Times bestseller about building good habits.', thumbnail: 'https://picsum.photos/seed/book1/400/400', tags: ['self-help', 'productivity'] },
  { name: 'The Psychology of Money', category: 'Books', price: 349, originalPrice: 599, stock: 95, brand: 'Harriman House', featured: false, description: 'Timeless lessons on wealth, greed, and happiness by Morgan Housel.', thumbnail: 'https://picsum.photos/seed/book2/400/400', tags: ['finance', 'investing'] },
  { name: 'Instant Pot Duo 7-in-1', category: 'Home & Garden', price: 8999, originalPrice: 11999, stock: 35, brand: 'Instant Pot', featured: true, description: '7-in-1 multi-use programmable pressure cooker — replaces 7 kitchen appliances.', thumbnail: 'https://picsum.photos/seed/instantpot/400/400', tags: ['kitchen', 'cooking'] },
  { name: 'Yoga Mat Premium', category: 'Sports', price: 1299, originalPrice: 1999, stock: 70, brand: 'Decathlon', featured: false, description: 'Non-slip, eco-friendly, 6mm thick yoga mat with alignment lines. Perfect for home or studio.', thumbnail: 'https://picsum.photos/seed/yoga/400/400', tags: ['yoga', 'fitness'] },
  { name: 'L\'Oreal Revitalift Serum', category: 'Beauty', price: 799, originalPrice: 1099, stock: 55, brand: "L'Oreal", featured: false, description: 'Pure Vitamin C brightening serum reduces dark spots and wrinkles in 4 weeks.', thumbnail: 'https://picsum.photos/seed/loreal/400/400', tags: ['skincare', 'vitamin-c'] },
  { name: 'LEGO Technic Bugatti', category: 'Toys', price: 14999, originalPrice: 16999, stock: 15, brand: 'LEGO', featured: true, description: '3599-piece set replicating the iconic Bugatti Chiron. Working gearbox, W16 engine.', thumbnail: 'https://picsum.photos/seed/lego/400/400', tags: ['lego', 'collectible'] },
  { name: 'boAt Airdopes 141', category: 'Electronics', price: 1299, originalPrice: 2990, stock: 100, brand: 'boAt', featured: false, description: 'True wireless earbuds with 42H total playback, IWS, and IPX4 sweat resistance.', thumbnail: 'https://picsum.photos/seed/boat/400/400', tags: ['earbuds', 'tws'] },
  { name: 'Adidas Ultraboost 23', category: 'Clothing', price: 17999, originalPrice: 20999, stock: 45, brand: 'Adidas', featured: false, description: "Energy returning Boost midsole, Primeknit+ upper. adidas' most popular running shoe.", thumbnail: 'https://picsum.photos/seed/adidas/400/400', tags: ['running', 'shoes'] },
  { name: 'Whey Protein Gold Standard', category: 'Sports', price: 3499, originalPrice: 4799, stock: 88, brand: 'Optimum Nutrition', featured: false, description: '24g of whey protein per serving, 5.5g BCAAs. The world\'s best-selling whey protein.', thumbnail: 'https://picsum.photos/seed/protein/400/400', tags: ['protein', 'supplement'] },
  { name: 'Smart LED TV 55"', category: 'Electronics', price: 45990, originalPrice: 59990, stock: 8, brand: 'LG', featured: true, description: '4K UHD OLED, Dolby Vision IQ, AI ThinQ, webOS Smart TV with 120Hz refresh rate.', thumbnail: 'https://picsum.photos/seed/tv/400/400', tags: ['tv', 'oled', '4k'] },
];

const seed = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    // Clear existing
    await User.deleteMany({});
    await Product.deleteMany({});
    await Order.deleteMany({});
    console.log('🗑️  Cleared existing data');

    // Create admin user
    const admin = await User.create({
      name: 'Admin User',
      email: 'admin@shop.com',
      password: 'admin123',
      role: 'admin',
    });

    // Create regular user
    const user = await User.create({
      name: 'John Doe',
      email: 'user@shop.com',
      password: 'user123',
      role: 'user',
    });

    console.log('👥 Created users: admin@shop.com / admin123 | user@shop.com / user123');

    // Create products
    const createdProducts = await Product.insertMany(PRODUCTS);
    console.log(`📦 Created ${createdProducts.length} products`);

    // Create sample order
    const sampleOrder = await Order.create({
      user: user._id,
      orderItems: [
        {
          product: createdProducts[0]._id,
          name: createdProducts[0].name,
          image: createdProducts[0].thumbnail,
          price: createdProducts[0].price,
          quantity: 1,
        },
        {
          product: createdProducts[2]._id,
          name: createdProducts[2].name,
          image: createdProducts[2].thumbnail,
          price: createdProducts[2].price,
          quantity: 2,
        },
      ],
      shippingAddress: {
        fullName: 'John Doe',
        address: '123 MG Road',
        city: 'Bangalore',
        state: 'Karnataka',
        postalCode: '560001',
        country: 'India',
        phone: '9876543210',
      },
      paymentMethod: 'Cash on Delivery',
      itemsPrice: createdProducts[0].price + createdProducts[2].price * 2,
      shippingPrice: 0,
      taxPrice: parseFloat(((createdProducts[0].price + createdProducts[2].price * 2) * 0.18).toFixed(2)),
      totalPrice: parseFloat(((createdProducts[0].price + createdProducts[2].price * 2) * 1.18).toFixed(2)),
      orderStatus: 'Processing',
      statusHistory: [
        { status: 'Pending', note: 'Order placed successfully' },
        { status: 'Processing', note: 'Payment confirmed, preparing your order' },
      ],
    });

    console.log(`🛒 Created sample order: #${sampleOrder._id.toString().slice(-8).toUpperCase()}`);
    console.log('\n🎉 Seed completed successfully!');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('   Admin:  admin@shop.com / admin123');
    console.log('   User:   user@shop.com  / user123');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    process.exit(0);
  } catch (err) {
    console.error('❌ Seed failed:', err.message);
    process.exit(1);
  }
};

seed();