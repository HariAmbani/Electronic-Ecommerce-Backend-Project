const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const productSchema = new Schema({
  productId: {
    type: Number,
    required: true,
    unique: true 
  },
  name: {
    type: String,
    required: true,
  },
  features: {
    type: [String],
    required: true
  },
  price: {
    type: Number,
    required: true,
    min: 0,
  },
  filename: {
    type: String,
    required: true
  }
}, {
  timestamps: true
});

// ✅ Create and export model after the static method
const Product = mongoose.model('Product', productSchema);
module.exports = Product;
