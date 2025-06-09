const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const CartSchema = new Schema({
  cartId: {
    type: Number,
    unique: true,
    required: true,
  },
  username: {
    type: String,
    required: true,
  },
  productId: {
    type: Number,
    required: true,
  },
}, {
  timestamps: true
});


const Cart = mongoose.model('Cart', CartSchema, 'cart');
module.exports = Cart;