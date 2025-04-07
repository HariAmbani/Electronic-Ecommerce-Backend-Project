 const mongoose = require('mongoose');
const Schema = mongoose.Schema
const product = new Schema({
    productId: { type:String, require: true},

    productName: { type:String, require: true},
    productFeatures: { type:String, required:true },
    productPrice: { type:String, require: true},

})

const Product = mongoose.model('Product', product);
module.exports = Product;

//productId: { type: String, required: true, unique: true }, //to make productId as unique
//productImage