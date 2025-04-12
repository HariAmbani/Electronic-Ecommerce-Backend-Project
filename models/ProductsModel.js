const mongoose = require('mongoose');
const Schema = mongoose.Schema
const product = new Schema({
    productId: { type:String },
    productName: { type:String },
    productFeatures: { type:String },
    productPrice: { type:String },
    ProductImage: { type: String },
})

const Product = mongoose.model('Product', product);
module.exports = Product;

