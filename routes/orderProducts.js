const express = require('express');
const router = express.Router();
const Order = require('../models/orderModel');
const Product = require('../models/ProductsModel');

// Create an order (e.g., from Buy Now or Cart)
router.post('/create', async (req, res) => {
  console.log("Received order creation request:", req.body);
  const { username, productId } = req.body;

  try {
    const parsedProductId = Number(productId);
    if (isNaN(parsedProductId)) {
      return res.status(400).json({ message: 'Invalid productId.' });
    }

    // Check if product exists
    const product = await Product.findOne({ productId: parsedProductId });
    if (!product) {
      return res.status(404).json({ message: 'Product not found.' });
    }

    // Generate unique orderId
    let orderId;
    let isUnique = false;
    while (!isUnique) {
      orderId = Math.floor(100000 + Math.random() * 900000); // 6-digit random number
      const exists = await Order.findOne({ orderId });
      if (!exists) isUnique = true;
    }

    const newOrder = new Order({
      orderId,
      username,
      productId: parsedProductId,
    });

    await newOrder.save();
    res.status(201).json({ message: 'Order placed successfully.', order: newOrder });

  } catch (err) {
    console.error("Order create error:", err);
    res.status(500).json({ message: 'Failed to create order.', error: err.message });
  }
});

// Delete an order (optional - for admin or user cancel)
// Delete an order using orderId instead of productId
// Replace router.delete with router.post
router.post('/delete', async (req, res) => {
  const { username, orderId } = req.body;

  try {
    const deleted = await Order.findOneAndDelete({ username, orderId });

    if (!deleted) {
      return res.status(404).json({ message: 'Order not found.' });
    }

    res.json({ message: 'Order deleted successfully.', deleted });
  } catch (err) {
    console.error("Order delete error:", err);
    res.status(500).json({ message: 'Failed to delete order.', error: err.message });
  }
});



// Get all orders for a user with full product details
router.get('/userorders/:username', async (req, res) => {
  const { username } = req.params;

  try {
    const userOrders = await Order.find({ username });

    const enrichedOrders = await Promise.all(
      userOrders.map(async (item) => {
        const product = await Product.findOne({ productId: item.productId });
        return {
          orderId: item.orderId,
          username: item.username,
          productId: item.productId,
          product,
          status: item.status,
          createdAt: item.createdAt
        };
      })
    );

    res.json(enrichedOrders);
  } catch (err) {
    console.error("Error fetching user orders:", err);
    res.status(500).json({ message: "Failed to retrieve user orders", error: err.message });
  }
});

module.exports = router;

