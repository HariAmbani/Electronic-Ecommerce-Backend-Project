// routes/cartProducts.js
const express = require('express');
const router = express.Router();
const Cart = require('../models/cartModel');
const Product = require('../models/ProductsModel');

// Create a cart entry using username and product name
router.post('/create', async (req, res) => {
  const { username, productId } = req.body;

  try {
    const parsedProductId = Number(productId);
    if (isNaN(parsedProductId)) {
      return res.status(400).json({ message: 'Invalid productId.' });
    }

    // Find product by productId (number)
    const product = await Product.findOne({ productId: parsedProductId });
    if (!product) {
      return res.status(404).json({ message: 'Product not found.' });
    }

    // Check if already in cart
    const existing = await Cart.findOne({ username, productId: parsedProductId });
    if (existing) {
      return res.status(400).json({ message: 'Product already in cart.' });
    }

    // Generate a unique cartId (e.g., random 6-digit)
    let cartId;
    let isUnique = false;
    while (!isUnique) {
      cartId = Math.floor(100000 + Math.random() * 900000); // 6-digit random number
      const exists = await Cart.findOne({ cartId });
      if (!exists) isUnique = true;
    }

    const newCartItem = new Cart({
      cartId,
      username,
      productId: parsedProductId,
    });


    await newCartItem.save();
    res.status(201).json({ message: 'Product added to cart.', cart: newCartItem });

  } catch (err) {
    console.error("Cart create error:", err);
    res.status(500).json({ message: 'Failed to add product to cart.', error: err.message });
  }
});

// Delete a cart item using username and product name
router.delete('/delete', async (req, res) => {
  const { username, productId } = req.body;

  try {
    const deleted = await Cart.findOneAndDelete({ username, productId: Number(productId) });

    if (!deleted) {
      return res.status(404).json({ message: 'Cart item not found.' });
    }

    res.json({ message: 'Cart item deleted successfully.', deleted });
  } catch (err) {
    console.error("Cart delete error:", err);
    res.status(500).json({ message: 'Failed to delete cart item.', error: err.message });
  }
});


// Get all cart items for a user and populate full product details
// routes/cartProducts.js
router.get('/usercart/:username', async (req, res) => {
  const { username } = req.params;

  try {
    const userCart = await Cart.find({ username });

    console.log("Raw cart items:", userCart);

    const enrichedCart = await Promise.all(
      userCart.map(async (item) => {
        const product = await Product.findOne({ productId: item.productId });
        console.log(`Finding product with ID ${item.productId}:`, product);
        return {
          username: item.username,
          productId: item.productId,
          product,
          createdAt: item.createdAt
        };
      })
    );

    res.json(enrichedCart);
  } catch (err) {
    console.error("Error fetching user cart:", err);
    res.status(500).json({ message: "Failed to retrieve user cart", error: err.message });
  }
});

module.exports = router;
