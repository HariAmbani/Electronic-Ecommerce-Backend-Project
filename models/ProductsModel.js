const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const productSchema = new Schema({
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
  timestamps: true // adds createdAt and updatedAt fields
});

const Product = mongoose.model('Product', productSchema);
module.exports = Product;
