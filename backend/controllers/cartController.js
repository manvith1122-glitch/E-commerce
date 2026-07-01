const Product = require('../models/Product');

// In-memory cart (use Redis or DB for production)
// Here we store cart in user's profile via a Cart model or session
// For simplicity, cart is managed on the frontend with localStorage
// This controller provides cart validation endpoints

// @desc  Validate cart items (check stock)
// @route POST /api/cart/validate
exports.validateCart = async (req, res) => {
  try {
    const { items } = req.body;
    const issues = [];
    const validatedItems = [];

    for (const item of items) {
      const product = await Product.findById(item.product);
      if (!product || !product.isActive) {
        issues.push({ product: item.product, message: 'Product not available' });
        continue;
      }
      if (product.stock < item.quantity) {
        issues.push({ product: item.product, message: `Only ${product.stock} left in stock`, available: product.stock });
      }
      validatedItems.push({
        product: product._id,
        name: product.name,
        price: product.price,
        thumbnail: product.thumbnail,
        stock: product.stock,
        quantity: item.quantity
      });
    }

    res.json({ success: true, validatedItems, issues });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};